// utils/sqlParser.ts

interface Column {
  name: string;
  type: string;
  isPk: boolean;
}

interface TableNode {
  id: string; // Table Name
  columns: Column[];
}

interface RelationEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export const parseSQL = (sql: string) => {
  const tables: TableNode[] = [];
  const edges: RelationEdge[] = [];

  // ลบ Comment (-- หรือ /* */)
  const cleanSql = sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();

  // Regex ใหม่: รองรับชื่อที่มี . เช่น public.users
  // และจับวงเล็บเปิดปิดของ Create Table ให้แม่นขึ้น
  const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_."]+)\s*\(([\s\S]*?)\);/gmi;

  let match;
  while ((match = tableRegex.exec(cleanSql)) !== null) {
    let tableName = match[1];
    const body = match[2];
    
    // Clean ชื่อตาราง: เอา " และ public. ออก เพื่อให้ดูง่ายใน Diagram
    tableName = tableName.replace(/["`]/g, "").replace(/^public\./i, "");

    const columns: Column[] = [];
    
    // แยกบรรทัดด้วย , แต่ต้องระวัง , ที่อยู่ในวงเล็บ (เช่น numeric(10,2))
    // ใช้เทคนิคพื้นฐาน: split ด้วย \n แทน หรือ regex ที่ซับซ้อนกว่า
    // เพื่อความง่ายและรองรับเคสส่วนใหญ่ เราจะ split ด้วย , ที่อยู่นอกวงเล็บ
    const lines = body.split(/,\s*(?![^(]*\))/).map(l => l.trim()).filter(l => l);

    lines.forEach(line => {
      // Clean บรรทัด
      const cleanLine = line.replace(/["`]/g, "");
      
      // 1. ตรวจจับ Constraint Foreign Key ที่เขียนแยกบรรทัด
      // ตัวอย่าง: CONSTRAINT fk FOREIGN KEY (user_id) REFERENCES public.users(id)
      const fkLineMatch = cleanLine.match(/FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s+([a-zA-Z0-9_.]+)\s*\((\w+)\)/i);
      if (fkLineMatch) {
        let targetTable = fkLineMatch[2].replace(/^public\./i, "").replace(/["`]/g, "");
        edges.push({
          source: tableName,
          target: targetTable,
          sourceHandle: fkLineMatch[1], // column ต้นทาง
          targetHandle: fkLineMatch[3]  // column ปลายทาง
        });
        return; // จบการทำงานบรรทัดนี้ (เพราะไม่ใช่ column)
      }

      // 2. ตรวจจับ Primary Key แยกบรรทัด
      if (/^CONSTRAINT.+PRIMARY\s+KEY/i.test(cleanLine)) {
        const pkMatch = cleanLine.match(/\((.+)\)/);
        if (pkMatch) {
          const pkCols = pkMatch[1].split(',').map(s => s.trim());
          // ย้อนกลับไป update column ที่เคยเพิ่มไปแล้ว
          pkCols.forEach(pkName => {
            const col = columns.find(c => c.name === pkName);
            if (col) col.isPk = true;
          });
        }
        return;
      }

      // 3. ข้ามบรรทัดที่ไม่ใช่ Column (เช่น CHECK, UNIQUE ที่ขึ้นต้นบรรทัด)
      if (/^(CONSTRAINT|PRIMARY|FOREIGN|KEY|INDEX|UNIQUE|CHECK)/i.test(cleanLine)) {
        return;
      }

      // 4. แกะชื่อ Column ปกติ
      // ตัดส่วนที่เป็น Constraint ท้ายบรรทัดทิ้งก่อน
      const parts = cleanLine.split(/\s+/);
      const colName = parts[0];
      
      // หา Type (คำที่ 2 เป็นต้นไป จนกว่าจะเจอ keyword อื่น)
      // แบบง่าย: เอาแค่คำที่ 2
      let colType = parts.slice(1).join(" ");
      // ตัดพวก NOT NULL, DEFAULT, CHECK ออกจาก Type เพื่อให้สั้น
      colType = colType.replace(/(NOT\s+NULL|NULL|DEFAULT.*|CHECK.*|PRIMARY.*|REFERENCES.*|GENERATED.*)/gi, "").trim();

      // ตรวจสอบ PK แบบ inline
      const isPk = /PRIMARY\s+KEY/i.test(cleanLine);
      
      // ตรวจสอบ FK แบบ inline (เช่น user_id uuid REFERENCES users(id))
      const inlineFkMatch = cleanLine.match(/REFERENCES\s+([a-zA-Z0-9_.]+)\s*\((\w+)\)/i);
      if (inlineFkMatch) {
        let targetTable = inlineFkMatch[1].replace(/^public\./i, "").replace(/["`]/g, "");
        edges.push({
          source: tableName,
          target: targetTable,
          sourceHandle: colName,
          targetHandle: inlineFkMatch[2]
        });
      }

      if (colName) {
        columns.push({ name: colName, type: colType, isPk });
      }
    });

    tables.push({ id: tableName, columns });
  }

  return { tables, edges };
};