import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();

      return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ success: false, error: 'Registration failed' });
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.password) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, error: 'Login failed' });
    }
  }

  /**
   * Google Login/Register
   */
  async googleLogin(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ success: false, error: 'Google token required' });
      }

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ success: false, error: 'Invalid Google token' });
      }

      const { sub, email, name, picture } = payload;

      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          name,
          email,
          googleId: sub,
          avatar: picture
        });
        await user.save();
      } else if (!user.googleId) {
        // Link google ID if user registered with email previously
        user.googleId = sub;
        if (!user.avatar) user.avatar = picture;
        await user.save();
      }

      const jwtToken = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        success: true,
        token: jwtToken,
        user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
      });
    } catch (error) {
      console.error('Google login error:', error);
      return res.status(500).json({ success: false, error: 'Google login failed' });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: any, res: Response) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: 'Failed to fetch profile' });
    }
  }
}

export default new AuthController();
