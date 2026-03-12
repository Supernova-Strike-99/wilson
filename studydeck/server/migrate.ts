import db from './db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

console.log('Running migrations...');
db.exec(schema);
console.log('✅ Schema applied successfully.');
