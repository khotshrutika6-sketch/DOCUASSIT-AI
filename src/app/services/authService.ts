import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth, googleProvider } from './firebaseConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userObj = {
        id: user.uid,
        name: name || user.displayName || 'User',
        email: user.email || email,
        avatar: user.photoURL || undefined
      };
      
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));

      return { success: true, token, user: userObj };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userObj = {
        id: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || email,
        avatar: user.photoURL || undefined
      };
      
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));

      return { success: true, token, user: userObj };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  },

  async googleLogin(): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userObj = {
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        avatar: user.photoURL || undefined
      };
      
      const jwtToken = await user.getIdToken();
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userObj));

      return { success: true, token: jwtToken, user: userObj };
    } catch (error: any) {
      return { success: false, error: error.message || 'Google login failed' };
    }
  },

  logout() {
    signOut(auth).catch(console.error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};
