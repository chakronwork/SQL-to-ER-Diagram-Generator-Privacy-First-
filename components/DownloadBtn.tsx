// components/DownloadBtn.tsx
import React from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { Download, ImageIcon, FileJson, Database } from 'lucide-react'; // ใช้ Icon สวยๆ

function downloadImage(dataUrl: string, ext: string) {
  const a = document.createElement('a');
  a.setAttribute('download', `sql-diagram.${ext}`);
  a.setAttribute('href', dataUrl);
  a.click();
}

export default function DownloadBtn() {
  const { getNodes } = useReactFlow();

  const handleDownload = (format: 'png' | 'jpeg' | 'svg') => {
    // 1. หาขนาดของ Diagram ทั้งหมด (รวมส่วนที่ตกขอบจอด้วย)
    const nodesBounds = getRectOfNodes(getNodes());
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;

    if (!viewport) return;

    const transform = getTransformForBounds(
      nodesBounds,
      nodesBounds.width,
      nodesBounds.height,
      0.5, // min zoom
      2,   // max zoom
    );

    // Config สำหรับการ Export
    const options = {
      backgroundColor: '#ffffff', // พื้นหลังขาว
      width: nodesBounds.width,
      height: nodesBounds.height,
      style: {
        width: `${nodesBounds.width}px`,
        height: `${nodesBounds.height}px`,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
      pixelRatio: 2, // ภาพชัดขึ้น 2 เท่า (Retina support)
    };

    // เลือกฟังก์ชันตาม format
    const exporter = format === 'png' ? toPng : format === 'jpeg' ? toJpeg : toSvg;

    exporter(viewport, options).then((dataUrl) => {
      downloadImage(dataUrl, format);
    });
  };

  return (
    <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-md border border-gray-200 flex gap-2">
      {/* PNG */}
      <button 
        onClick={() => handleDownload('png')} 
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
        title="Download as PNG"
      >
        <ImageIcon className="w-4 h-4" /> PNG
      </button>

      {/* JPG */}
      <button 
        onClick={() => handleDownload('jpeg')}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
        title="Download as JPG"
      >
        <ImageIcon className="w-4 h-4" /> JPG
      </button>

      {/* SVG */}
      <button 
        onClick={() => handleDownload('svg')}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
        title="Download as SVG"
      >
        <FileJson className="w-4 h-4" /> SVG
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* DB File (Mock Button) */}
      <button 
        onClick={() => alert('🚧 Feature นี้กำลังพัฒนาครับ (Coming Soon!)')}
        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded cursor-not-allowed"
      >
        <Database className="w-4 h-4" /> SQL/DB
      </button>
    </Panel>
  );
}