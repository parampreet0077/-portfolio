import { UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

export function FileUpload({ label, accept, onFileSelect, previewUrl, onClear, helperText }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept ? { [accept]: [] } : undefined,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    }
  });

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      
      {previewUrl ? (
        <div className="relative rounded-xl border border-gray-200 overflow-hidden group">
          {previewUrl.endsWith('.pdf') ? (
            <div className="bg-gray-50 p-6 flex items-center justify-center">
               <span className="text-gray-500 font-medium">PDF Document Selected</span>
            </div>
          ) : (
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={onClear} className="bg-white text-red-500 rounded-full p-2 hover:bg-red-50">
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
          }`}
        >
          <input {...getInputProps()} id={`file-upload-${label}`} />
          <UploadCloud className="mx-auto text-gray-400 mb-3" size={32} />
          <p className="text-sm text-gray-600 mb-1">Drag and drop file here, or click to browse</p>
          {helperText && <p className="text-xs text-gray-400 mb-4">{helperText}</p>}
          <span className="inline-block bg-white border border-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50">
            Browse Files
          </span>
        </div>
      )}
    </div>
  );
}
