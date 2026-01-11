// components/TableNode.tsx
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// ไอคอนสวยๆ (ถ้าไม่ได้ลง lucide-react ไว้ ให้ลบออกหรือใช้ text แทนได้)
import { Key, Table2, Fingerprint } from 'lucide-react'; 

export default memo(({ data }: any) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-md shadow-sm min-w-[250px] overflow-hidden text-sm font-sans">
      {/* 1. Header: Table Name */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Table2 className="w-4 h-4 text-slate-500" />
          <span>{data.label}</span>
        </div>
      </div>

      {/* 2. Columns Body */}
      <div className="p-0">
        {data.columns.map((col: any) => (
          <div 
            key={col.name} 
            className="relative flex justify-between items-center px-3 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 group"
          >
            {/* จุดเชื่อมต่อด้านซ้าย (Target) สำหรับรับเส้น FK */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${col.name}-target`} // ID สำคัญมาก ต้องตรงกับ Edge
              style={{ background: '#94a3b8', width: 8, height: 8, left: -4 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity" 
            />

            {/* ชื่อ Column และ Icon PK */}
            <div className="flex items-center gap-2">
              {col.isPk ? (
                <Key className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              ) : (
                 // ถ้าเป็น FK หรืออื่นๆ อาจจะใส่ icon อื่น
                 <div className="w-3 h-3" /> 
              )}
              <span className={col.isPk ? "font-semibold text-slate-800" : "text-slate-600"}>
                {col.name}
              </span>
            </div>

            {/* Type ของ Column */}
            <span className="text-xs text-slate-400 font-mono ml-4">{col.type}</span>

            {/* จุดเชื่อมต่อด้านขวา (Source) สำหรับลากไปตารางอื่น */}
            <Handle
              type="source"
              position={Position.Right}
              id={`${col.name}-source`} 
              style={{ background: '#cbd5e1', width: 8, height: 8, right: -4 }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
});