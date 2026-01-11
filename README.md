🚀 SQL to ER Diagram Generator (Privacy-First)

Web-based tool สำหรับแปลงโค้ด SQL (DDL) ให้เป็น ER Diagram สวยงาม ใช้งานง่าย และทำงานบน Browser 100% (ไม่มีการส่งข้อมูลขึ้น Server)

โปรเจกต์นี้สร้างขึ้นเพื่อช่วย Developer, DBA และ System Analyst ในการ Visualize โครงสร้าง Database อย่างรวดเร็ว รองรับ Syntax ยอดนิยมอย่าง PostgreSQL, MySQL และ Supabase

![alt text](https://i.postimg.cc/XJF7ZMZG/image.png)


✨ ฟีเจอร์หลัก (Key Features)

🔒 Privacy First: ประมวลผล SQL ทั้งหมดบนฝั่ง Client (Browser) ข้อมูล Database ของคุณจะไม่มีวันถูกส่งออกไปยัง Server ภายนอก

⚡ Real-time Rendering: สร้าง Diagram ทันทีที่กดปุ่ม Generate รองรับตารางจำนวนมาก

🎨 Interactive Canvas:

ใช้ React Flow ทำให้ลากย้ายตำแหน่งตาราง (Nodes) ได้อิสระ

ซูมเข้า-ออก (Zoom & Pan) ได้ลื่นไหล

Auto Layout: มีระบบจัดเรียงตารางอัตโนมัติ (Left-to-Right) ไม่ต้องมานั่งเรียงเอง

🛠️ SQL Syntax Support: รองรับ SQL Dialect ที่หลากหลาย (รายละเอียดด้านล่าง)

📐 Resizable UI: ปรับขนาดพื้นที่เขียน Code และพื้นที่แสดง Diagram ได้ตามต้องการ

💾 High-Quality Export: ส่งออก Diagram เป็นไฟล์ภาพความละเอียดสูง:

PNG (พื้นหลังโปร่ง/ขาว)

JPG (ไฟล์เล็ก)

SVG (Vector สำหรับนำไปแก้ไขต่อ)

📋 Syntax SQL ที่รองรับ (Supported Syntax)

Engine ของเราถูกออกแบบมาให้รองรับ CREATE TABLE statement เป็นหลัก โดยครอบคลุมรูปแบบดังนี้:

1. Dialects

✅ PostgreSQL / Supabase: รองรับ public.table_name, double quotes ", และ data types เช่น uuid, timestamp with time zone, jsonb

✅ MySQL / MariaDB: รองรับ backticks \`` และAUTO_INCREMENT`

2. Constraints & Relationships

ระบบจะตรวจจับความสัมพันธ์ (Foreign Key) เพื่อสร้างเส้นเชื่อมโยง (Edge) โดยรองรับการเขียน 3 รูปแบบ:

Inline Reference:

code
SQL
download
content_copy
expand_less
user_id uuid REFERENCES users(id)

Constraint Block (End of table):

code
SQL
download
content_copy
expand_less
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)

Separate Line Constraint:

code
SQL
download
content_copy
expand_less
-- แบบที่ PostgreSQL/Supabase ชอบ Generate มา
CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
3. Primary Keys

รองรับทั้งแบบ PRIMARY KEY ท้าย Column และแบบ CONSTRAINT pk_name PRIMARY KEY (id) ท้ายตาราง

🛠️ Tech Stack

โปรเจกต์นี้พัฒนาด้วยเทคโนโลยี Modern Web Stack ล่าสุด:

Runtime: Bun (เร็วแรงกว่า Node.js)

Framework: Next.js 14 (App Router)

UI Library:

React Flow (Core Diagram Engine)

Tailwind CSS (Styling)

Lucide React (Icons)

Logic:

dagre: สำหรับคำนวณ Auto Layout (Graph algorithm)

html-to-image: สำหรับ Export canvas เป็นรูปภาพ

💻 วิธีติดตั้งและรันโปรเจกต์ (Installation)

เนื่องจากโปรเจกต์นี้ใช้ Bun กรุณาติดตั้ง Bun ก่อนเริ่มใช้งาน

Clone Repo:

code
Bash
download
content_copy
expand_less
git clone https://github.com/your-username/sql-diagram-tool.git
cd sql-diagram-tool

Install Dependencies:

code
Bash
download
content_copy
expand_less
bun install

Run Development Server:

code
Bash
download
content_copy
expand_less
bun dev

ใช้งาน:
เปิด Browser ไปที่ http://localhost:3000

🗺️ Roadmap & Future Plans

สิ่งที่กำลังพัฒนาและจะมาในเวอร์ชันถัดไป:

Support ALTER TABLE: รองรับการเพิ่ม Foreign Key จากภายนอกคำสั่ง Create Table

Dark Mode: รองรับธีมสีเข้ม

DB Import/Export: ปุ่มสำหรับ Save โปรเจกต์เป็นไฟล์ .json หรือ .db เพื่อนำกลับมาแก้ไขภายหลัง (ปัจจุบันปุ่มนี้มี UI แล้วแต่ยังไม่ทำงาน)

Type Filtering: ตัวเลือกสำหรับซ่อน/แสดง Column Type เพื่อความสะอาดตา

🤝 Contributing

ยินดีต้อนรับนักพัฒนาทุกท่าน! หากต้องการช่วยพัฒนา:

Fork repository นี้

สร้าง Feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push ไปยัง branch (git push origin feature/AmazingFeature)

เปิด Pull Request มาได้เลยครับ

📄 License

Distributed under the MIT License. See LICENSE for more information.