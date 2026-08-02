import React from 'react';
import { Download } from 'lucide-react';

export default function DownloadProject() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="/project-export.zip"
        download="iglesia-rios-de-agua-viva.zip"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      >
        <Download size={20} />
        <span className="font-semibold">Download Full Website</span>
      </a>
    </div>
  );
}
