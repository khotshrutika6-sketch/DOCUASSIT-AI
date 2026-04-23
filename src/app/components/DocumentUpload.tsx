import { Upload, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

interface DocumentUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export function DocumentUpload({ onFileSelect, selectedFile, isProcessing }: DocumentUploadProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`group relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-[2.5rem] cursor-pointer transition-all duration-500 overflow-hidden ${
          selectedFile 
            ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.2)]' 
            : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]'
        } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
      >
        {/* Decorative corner sparkles */}
        <div className="absolute top-6 left-6 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
           <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-700">
           <Sparkles className="w-5 h-5 text-primary" />
        </div>

        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 text-center relative z-10">
          <div className={`mb-6 p-6 rounded-3xl transition-all duration-500 scale-100 group-hover:scale-110 ${
            selectedFile ? 'bg-primary/20 rotate-0' : 'bg-white/5 -rotate-3 group-hover:rotate-0'
          }`}>
            {selectedFile ? (
              <FileText className="w-16 h-16 text-primary" />
            ) : (
              <Upload className="w-16 h-16 text-textSecondary" />
            )}
          </div>
          
          {selectedFile ? (
            <div className="space-y-2">
              <p className="text-xl font-bold text-textMain tracking-tight">{selectedFile.name}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold uppercase tracking-wider">
                   <ImageIcon className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xl font-bold text-textMain tracking-tight mb-2">
                   Scan or Upload Document
                </p>
                <p className="text-textSecondary text-sm max-w-xs mx-auto leading-relaxed">
                  Drop your file here or click to browse. Our AI agents support Aadhaar, PAN, Passports & more.
                </p>
              </div>
              <div className="flex justify-center gap-6 pt-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-textMuted">PNG</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-textMuted">JPG</span>
                <span className="text-[10px] uppercase font-black tracking-widest text-textMuted">WEBP</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
}
