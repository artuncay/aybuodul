const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ACADEMIC_UNITS_FILE = path.join(DATA_DIR, 'academic-units.json');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'faculty-admin-credentials.json');

function generateSecurePassword(length = 16) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  const bytes = crypto.randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i += 1) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

function facultyEmailSlug(faculty) {
  return faculty
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

const academicUnits = JSON.parse(fs.readFileSync(ACADEMIC_UNITS_FILE, 'utf8'));
const db = readDb();
const credentials = [];

const legacyAdmin = db.users.find(u => u.email === 'admin@aybu.edu.tr');
if (legacyAdmin) {
  legacyAdmin.adminScope = 'system';
}

Object.keys(academicUnits).forEach(faculty => {
  const existingAdmin = db.users.find(
    u => u.role === 'admin' && u.faculty === faculty && u.adminScope === 'faculty'
  );

  if (existingAdmin) {
    credentials.push({
      faculty,
      username: existingAdmin.username || existingAdmin.email?.replace(/@aybu\.edu\.tr$/i, ''),
      password: '(mevcut hesap - şifre daha önce oluşturuldu)',
      name: existingAdmin.name,
      note: 'Bu fakülte için yönetici hesabı zaten vardı.'
    });
    return;
  }

  const slug = facultyEmailSlug(faculty);
  let username = `odulkomisyon.${slug}`;
  let suffix = 2;
  while (db.users.some(u => u.username === username)) {
    username = `odulkomisyon.${slug}-${suffix}`;
    suffix += 1;
  }

  const plainPassword = generateSecurePassword(16);
  const hashedPassword = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));

  const adminUser = {
    id: `admin_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    username,
    password: hashedPassword,
    name: `${faculty} Ödül Komisyonu`,
    faculty,
    department: 'Ödül Değerlendirme Komisyonu',
    title: 'Komisyon',
    role: 'admin',
    adminScope: 'faculty'
  };

  db.users.push(adminUser);
  credentials.push({
    faculty,
    username: adminUser.username,
    password: plainPassword,
    name: adminUser.name
  });
});

writeDb(db);
fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2), 'utf8');

console.log(`Toplam ${credentials.length} fakülte yönetici kaydı işlendi.`);
console.log(`Kimlik bilgileri: ${CREDENTIALS_FILE}`);
