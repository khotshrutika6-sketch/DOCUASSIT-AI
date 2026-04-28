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
      <div className="mt-6 relative">
        {/* glow */}
        <div className="absolute inset-0 bg-green-400/10 blur-2xl rounded-2xl pointer-events-none"></div>

        {/* main box */}
        <label
          htmlFor="file-upload"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`relative flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl border border-dashed border-white/20 rounded-2xl p-10 text-center hover:border-green-400/40 transition-all duration-300 cursor-pointer block ${
            isProcessing ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-400/20 rounded-full flex items-center justify-center glow">
                 <FileText className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-xl font-bold text-white tracking-tight">{selectedFile.name}</p>
              <div className="flex justify-center flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-wider">
                   Ready
                </span>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <div className="text-4xl mb-4">⬆️</div>
              <p className="text-xl font-semibold text-white">Upload or Scan Document</p>
              <p className="text-gray-400 text-sm mt-2">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-gray-500 mt-6">
                Supports PDF, JPG, PNG
              </p>
            </div>
          )}

          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*,.pdf"
            onChange={handleFileInput}
            disabled={isProcessing}
          />
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          "AI scans document",
          "Fraud detection runs",
          "Authenticity score generated"
        ].map((step, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-gray-300 flex items-center gap-3 transition hover:bg-white/10">
             <span className="flex items-center justify-center min-w-6 w-6 h-6 rounded bg-green-400/20 text-green-400 font-bold text-xs ring-1 ring-green-400/30">
               {i + 1}
             </span>
             <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
