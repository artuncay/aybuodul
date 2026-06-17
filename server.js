require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { sendVerificationEmail } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'atosis_dev_only_secret_change_in_production';

function isAllowedAybuEmail(email) {
  return /^[^\s@]+@aybu\.edu\.tr$/.test(email.toLowerCase().trim());
}

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ACADEMIC_UNITS_FILE = path.join(DATA_DIR, 'academic-units.json');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'faculty-admin-credentials.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

const academicUnits = JSON.parse(fs.readFileSync(ACADEMIC_UNITS_FILE, 'utf8'));

function isValidFacultyDepartment(faculty, department) {
  const departments = academicUnits[faculty];
  return Array.isArray(departments) && departments.includes(department);
}

function getAdminScope(user) {
  if (!user || user.role !== 'admin') return null;
  if (user.adminScope) return user.adminScope;
  return user.faculty === 'Rektörlük' ? 'system' : 'faculty';
}

function getApplicationFaculty(app, db) {
  if (app.personalInfo && app.personalInfo.faculty) {
    return app.personalInfo.faculty;
  }
  const applicant = db.users.find(u => u.id === app.userId);
  return applicant ? applicant.faculty : null;
}

function canAdminAccessApplication(adminUser, app, db) {
  if (getAdminScope(adminUser) === 'system') return true;
  return getApplicationFaculty(app, db) === adminUser.faculty;
}

function findUserById(db, userId) {
  return db.users.find(u => u.id === userId);
}

function findUserApplication(db, userId, excludeApplicationId = null) {
  return db.applications.find(app => {
    if (app.userId !== userId) return false;
    if (excludeApplicationId && app.id === excludeApplicationId) return false;
    return true;
  });
}

function findUserByLogin(db, login) {
  const normalized = login.toLowerCase().trim();
  return db.users.find(u =>
    (u.username && u.username.toLowerCase() === normalized) ||
    (u.email && u.email.toLowerCase() === normalized)
  );
}

function isAcademicLogin(login) {
  return isAllowedAybuEmail(login) || login.includes('@');
}

function getLoginErrorMessage(db, login, user, passwordValid) {
  if (!user) {
    if (isAcademicLogin(login)) {
      return 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı. Lütfen kayıt olun.';
    }
    return 'Yönetici hesabı bulunamadı. Hesap tanımlaması için lütfen artuncay@aybu.edu.tr adresine mail atın.';
  }

  if (!passwordValid) {
    if (user.role === 'admin') {
      return 'Şifre hatalı. Lütfen artuncay@aybu.edu.tr adresine mail atın.';
    }
    return 'Hatalı şifre. Kayıtlı değilseniz lütfen kayıt olun.';
  }

  return null;
}

function sanitizeUser(user, db) {
  const { password, ...safeUser } = user;
  const applicationCount = db
    ? db.applications.filter(app => app.userId === user.id).length
    : 0;
  return {
    ...safeUser,
    loginId: user.username || user.email,
    applicationCount
  };
}

function isLoginTaken(db, loginId, excludeUserId = null) {
  const normalized = loginId.toLowerCase().trim();
  return db.users.some(u => {
    if (excludeUserId && u.id === excludeUserId) return false;
    return (u.username && u.username.toLowerCase() === normalized) ||
      (u.email && u.email.toLowerCase() === normalized);
  });
}

function buildAuthPayload(user) {
  return {
    id: user.id,
    email: user.email || null,
    username: user.username || null,
    loginId: user.username || user.email,
    name: user.name,
    role: user.role,
    faculty: user.faculty,
    department: user.department,
    title: user.title,
    adminScope: getAdminScope(user)
  };
}

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// Default items configuration
const defaultCategories = {
  kat1: {
    id: 'kat1',
    name: 'Kategori 1: Araştırma, Yayın, Etkinlik ve Yenilikçi Tasarım',
    items: [
      { id: 'kat1_row1', label: 'Araştırma: Yurt Dışı / Research Abroad (Taban Puan * Ay)', baseScore: 10.0, maxScore: 120.0, requiresRatio: true, hasFormulaCap: false, isMultiMonth: true, unit: 'ay' },
      { id: 'kat1_row2', label: 'Araştırma: Yurt İçi / Research Domestic (Taban Puan * Ay)', baseScore: 5.0, maxScore: 60.0, requiresRatio: true, hasFormulaCap: false, isMultiMonth: true, unit: 'ay' },
      { id: 'kat1_row3', label: 'Makale: Q1 dergiler (SCI, SCI-E, SSCI, AHCI) / Q1 Journals', baseScore: 100.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row4', label: 'Makale: WoS Q2 dergiler (SCI, SCI-E, SSCI, AHCI) / Q2 Journals', baseScore: 80.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row5', label: 'Makale: WoS Q3 dergiler (SCI, SCI-E, SSCI, AHCI) / Q3 Journals', baseScore: 60.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row6', label: 'Makale: WoS Q4 dergiler (SCI, SCI-E, SSCI, AHCI) / Q4 Journals', baseScore: 40.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row7', label: 'Makale: Scopus, SPORT Discus, ESCI Dergileri / Scopus, SPORT Discus, ESCI-Index Journals', baseScore: 30.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row8', label: 'Makale: TR-Dizin Dergileri / TR-Index Journals', baseScore: 20.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row9', label: 'Makale: Diğer Uluslararası/Ulusal Hakemli Dergiler / Other Peer-Reviewed Journals', baseScore: 5.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row10', label: 'Uluslararası Bilimsel Kitap (BKCI) / Intl. Scientific Book (BKCI)', baseScore: 100.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row11', label: 'Uluslararası Bilimsel Kitap Bölümü (BKCI) / Intl. Book Chapter (BKCI)', baseScore: 50.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row12', label: 'Diğer Ulusl./Ulusal Bilimsel Kitap / Other Scientific Book', baseScore: 20.0, maxScore: 40.0, requiresRatio: true, hasFormulaCap: true, unit: 'adet' },
      { id: 'kat1_row13', label: 'Diğer Ulusl./Ulusal Bilimsel Kitap Bölümü / Other Book Chapter', baseScore: 10.0, maxScore: 20.0, requiresRatio: true, hasFormulaCap: true, unit: 'adet' },
      { id: 'kat1_row14', label: 'Özgün Eğitim Modeli, Yenilikçi İş Akışı, Kurumsal Yazılım / Original Education Model, Innovative Workflow, Institutional Software', baseScore: 75.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row15', label: 'Uluslararası Kişisel Sergi, Özgün Tasarım, Birincilik Ödülü / Intl. Solo Exhibition, Original Design, First Place Award', baseScore: 100.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row16', label: 'Ulusal Kişisel Sergi, Özgün Tasarım, Birincilik Ödülü / National Solo Exhibition, Original Design, First Place Award', baseScore: 75.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row17', label: 'Uluslararası Karma Sergi, Bienal vb. Katılım / Intl. Group Exhibition, Biennial, etc. Participation', baseScore: 50.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat1_row18', label: 'Ulusal Karma Sergi, Alanlara Özgü Grup Etkinliği / National Group Exhibition or Discipline-Specific Group Event', baseScore: 30.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' }
    ]
  },
  kat2: {
    id: 'kat2',
    name: 'Kategori 2: Proje (Tamamlanmış)',
    items: [
      { id: 'kat2_row1', label: 'Projede Yürütücü / Project Principal Investigator', baseScore: 100.0, maxScore: 0.0, requiresRatio: false, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat2_row2', label: 'Projede Araştırmacı / Co-Investigator', baseScore: 70.0, maxScore: 0.0, requiresRatio: false, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat2_row3', label: 'Projede Danışman / Consultant', baseScore: 50.0, maxScore: 0.0, requiresRatio: false, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat2_row4', label: 'Projede Bursiyer / Project Scholar', baseScore: 20.0, maxScore: 0.0, requiresRatio: false, hasFormulaCap: false, unit: 'adet' }
    ]
  },
  kat3: {
    id: 'kat3',
    name: 'Kategori 3: Patent ve Faydalı Model',
    items: [
      { id: 'kat3_row1', label: 'Uluslararası Tescillenmiş Patent / International Registered Patent', baseScore: 100.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat3_row2', label: 'Ulusal Tescillenmiş Patent / National Registered Patent', baseScore: 75.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat3_row3', label: 'Uluslararası Faydalı Model / International Utility Model', baseScore: 75.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat3_row4', label: 'Ulusal Faydalı Model / National Utility Model', baseScore: 50.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' }
    ]
  },
  kat4: {
    id: 'kat4',
    name: 'Kategori 4: Akademik Danışmanlık, Eğitim ve Kurumsal Katkı',
    items: [
      { id: 'kat4_row1', label: 'Mezun Edilen Doktora Öğrencisi / Graduated PhD Student', baseScore: 50.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat4_row2', label: 'Mezun Edilen Y. Lisans Öğrencisi / Graduated MA/MS Student', baseScore: 25.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat4_row3', label: 'Öğrenci Yarışma Derecesi/Proje Danışmanlığı / Student Competition Award/Project Advising', baseScore: 20.0, maxScore: 40.0, requiresRatio: true, hasFormulaCap: false, unit: 'adet' },
      { id: 'kat4_row4', label: 'Mesleki Gelişim (Eğitim Veren Rolü) / Professional Development (Instructor Role)', baseScore: 20.0, maxScore: 40.0, requiresRatio: true, hasFormulaCap: true, unit: 'adet' },
      { id: 'kat4_row5', label: 'Mesleki Gelişim (Eğitim Alan Rolü) / Professional Development (Learner Role)', baseScore: 10.0, maxScore: 20.0, requiresRatio: true, hasFormulaCap: true, unit: 'adet' },
      { id: 'kat4_row6', label: 'Ders Yükü (Taban Puan * Yıllık Toplam Ders Saati) / Course Load (Base Score * Total Annual Course Hours)', baseScore: 1.0, maxScore: 0.0, requiresRatio: true, hasFormulaCap: false, unit: 'saat' },
      { id: 'kat4_row7', label: 'Öğrenci OBS Değerlendirme Formları (Taban Puan * Anket Ort Puan) / Student OBS Evaluation Forms (Base Score * Survey Avr Score)', baseScore: 20.0, maxScore: 100.0, requiresRatio: true, hasFormulaCap: true, unit: 'puan' },
      { id: 'kat4_row8', label: 'Kurumsal Koordinatörlük-Komite Görevi / Institutional Coord.-Committee Roles', baseScore: 30.0, maxScore: 60.0, requiresRatio: true, hasFormulaCap: true, unit: 'adet' }
    ]
  }
};

// Database utility functions
let dbCache = null;

function readDb() {
  if (dbCache) {
    return dbCache;
  }

  if (!fs.existsSync(DB_FILE)) {
    // Generate default admin and seed configurations
    const saltAdmin = bcrypt.genSaltSync(10);
    const hashAdmin = bcrypt.hashSync('admin', saltAdmin);

    const initialDb = {
      users: [
        {
          id: 'u1',
          email: 'admin@aybu.edu.tr',
          username: 'artuncay',
          password: hashAdmin,
          name: 'Komisyon Yöneticisi',
          faculty: 'Rektörlük',
          department: 'Akademik Değerlendirme Komisyonu',
          title: 'Sistem Yöneticisi',
          role: 'admin'
        }
      ],
      applications: [],
      categories: defaultCategories,
      pendingRegistrations: []
    };

    dbCache = initialDb;
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb), 'utf-8');
    return dbCache;
  }

  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(data);
    if (!dbCache.pendingRegistrations) dbCache.pendingRegistrations = [];
    return dbCache;
  } catch (err) {
    console.error('Error reading database file, returning empty:', err);
    dbCache = { users: [], applications: [], categories: defaultCategories, pendingRegistrations: [] };
    return dbCache;
  }
}

function writeDb(data) {
  try {
    dbCache = data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

function seedFacultyAdminsFromCredentials() {
  if (!fs.existsSync(CREDENTIALS_FILE)) {
    return;
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
    if (!Array.isArray(credentials) || credentials.length === 0) {
      return;
    }

    const db = readDb();
    let hasChanges = false;

    credentials.forEach(entry => {
      if (!entry || !entry.faculty || !entry.username || !entry.password) {
        return;
      }

      const existingAdmin = db.users.find(user =>
        user.role === 'admin' &&
        (
          user.username === entry.username ||
          (user.faculty === entry.faculty && getAdminScope(user) === 'faculty')
        )
      );

      if (existingAdmin) {
        if (!existingAdmin.adminScope) {
          existingAdmin.adminScope = 'faculty';
          hasChanges = true;
        }
        return;
      }

      db.users.push({
        id: `admin_${crypto.randomUUID()}`,
        username: entry.username,
        password: bcrypt.hashSync(entry.password, bcrypt.genSaltSync(10)),
        name: entry.name || `${entry.faculty} Ödül Komisyonu`,
        faculty: entry.faculty,
        department: 'Ödül Değerlendirme Komisyonu',
        title: 'Komisyon',
        role: 'admin',
        adminScope: 'faculty'
      });

      hasChanges = true;
    });

    if (hasChanges) {
      writeDb(db);
      console.log('Fakülte admin hesapları credential dosyasından senkronlandı.');
    }
  } catch (err) {
    console.error('Fakülte admin hesapları senkronlanamadı:', err);
  }
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Run credential seeding after DB utilities are available
seedFacultyAdminsFromCredentials();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Yetkisiz erişim: Token bulunamadı.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için yönetici yetkisi gereklidir.' });
  }
  next();
}

function requireSystemAdmin(req, res, next) {
  if (req.user.role !== 'admin' || getAdminScope(req.user) !== 'system') {
    return res.status(403).json({ message: 'Bu işlem için sistem yöneticisi yetkisi gereklidir.' });
  }
  next();
}

// API Routes

// 1. Auth API
const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

// E-posta doğrulaması: SMTP yapılandırılmamışsa veya EMAIL_VERIFICATION=off ise devre dışı kalır.
// Devre dışıyken kayıt, kod adımı olmadan doğrudan tamamlanır (demo/SMTP'siz ortamlar için).
const EMAIL_VERIFICATION_ENABLED =
  process.env.EMAIL_VERIFICATION !== 'off' && !!process.env.SMTP_USER;

function generateVerificationCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, faculty, department, title } = req.body;
  if (!email || !password || !name || !faculty || !department || !title) {
    return res.status(400).json({ message: 'Tüm alanları doldurmak zorunludur.' });
  }

  const db = readDb();
  const lowerEmail = email.toLowerCase().trim();

  if (!isAllowedAybuEmail(lowerEmail)) {
    return res.status(400).json({ message: 'Kayıt yalnızca @aybu.edu.tr uzantılı e-posta adresleri ile yapılabilir.' });
  }

  if (!isValidFacultyDepartment(faculty, department)) {
    return res.status(400).json({ message: 'Geçersiz fakülte veya bölüm seçimi. Lütfen listeden seçim yapın.' });
  }

  if (db.users.find(u => u.email === lowerEmail)) {
    return res.status(400).json({ message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.' });
  }

  if (req.body.role && req.body.role !== 'user') {
    return res.status(403).json({ message: 'Yönetici hesapları yalnızca sistem yöneticisi tarafından tanımlanabilir.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // E-posta doğrulaması kapalıysa kullanıcıyı doğrudan oluştur.
  if (!EMAIL_VERIFICATION_ENABLED) {
    db.users.push({
      id: 'u_' + Date.now(),
      email: lowerEmail,
      password: hashedPassword,
      name,
      faculty,
      department,
      title,
      role: 'user'
    });
    writeDb(db);
    return res.status(201).json({
      message: 'Kayıt işlemi başarıyla tamamlandı. Lütfen giriş yapın.',
      verificationRequired: false
    });
  }

  const code = generateVerificationCode();

  db.pendingRegistrations = db.pendingRegistrations.filter(p => p.email !== lowerEmail);
  db.pendingRegistrations.push({
    email: lowerEmail,
    password: hashedPassword,
    name,
    faculty,
    department,
    title,
    code,
    expiresAt: Date.now() + VERIFICATION_CODE_TTL_MS
  });
  writeDb(db);

  try {
    await sendVerificationEmail(lowerEmail, code);
  } catch (err) {
    console.error('Doğrulama e-postası gönderilemedi:', err);
    return res.status(500).json({ message: 'Doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
  }

  res.status(200).json({
    message: 'Doğrulama kodu e-posta adresinize gönderildi.',
    email: lowerEmail,
    verificationRequired: true
  });
});

app.post('/api/auth/register/verify', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ message: 'E-posta ve doğrulama kodu gereklidir.' });
  }

  const db = readDb();
  const lowerEmail = email.toLowerCase().trim();
  const pendingIndex = db.pendingRegistrations.findIndex(p => p.email === lowerEmail);

  if (pendingIndex === -1) {
    return res.status(400).json({ message: 'Bekleyen bir kayıt bulunamadı. Lütfen kayıt formunu yeniden doldurun.' });
  }

  const pending = db.pendingRegistrations[pendingIndex];

  if (Date.now() > pending.expiresAt) {
    db.pendingRegistrations.splice(pendingIndex, 1);
    writeDb(db);
    return res.status(400).json({ message: 'Doğrulama kodunun süresi doldu. Lütfen kayıt formunu yeniden doldurun.' });
  }

  if (pending.code !== String(code).trim()) {
    return res.status(400).json({ message: 'Doğrulama kodu hatalı.' });
  }

  if (db.users.find(u => u.email === lowerEmail)) {
    db.pendingRegistrations.splice(pendingIndex, 1);
    writeDb(db);
    return res.status(400).json({ message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.' });
  }

  const newUser = {
    id: 'u_' + Date.now(),
    email: pending.email,
    password: pending.password,
    name: pending.name,
    faculty: pending.faculty,
    department: pending.department,
    title: pending.title,
    role: 'user'
  };

  db.users.push(newUser);
  db.pendingRegistrations.splice(pendingIndex, 1);
  writeDb(db);

  res.status(201).json({ message: 'E-posta doğrulandı, kayıt işlemi başarıyla tamamlandı.' });
});

app.post('/api/auth/register/resend', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'E-posta gereklidir.' });
  }

  const db = readDb();
  const lowerEmail = email.toLowerCase().trim();
  const pending = db.pendingRegistrations.find(p => p.email === lowerEmail);

  if (!pending) {
    return res.status(400).json({ message: 'Bekleyen bir kayıt bulunamadı. Lütfen kayıt formunu yeniden doldurun.' });
  }

  pending.code = generateVerificationCode();
  pending.expiresAt = Date.now() + VERIFICATION_CODE_TTL_MS;
  writeDb(db);

  try {
    await sendVerificationEmail(lowerEmail, pending.code);
  } catch (err) {
    console.error('Doğrulama e-postası gönderilemedi:', err);
    return res.status(500).json({ message: 'Doğrulama e-postası gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
  }

  res.json({ message: 'Doğrulama kodu yeniden gönderildi.' });
});

app.post('/api/auth/login', (req, res) => {
  const login = (req.body.login || req.body.email || req.body.username || '').trim();
  const password = req.body.password || '';
  if (!login || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre girin.' });
  }

  const db = readDb();
  const user = findUserByLogin(db, login);
  const passwordValid = user ? bcrypt.compareSync(password, user.password) : false;
  const loginError = getLoginErrorMessage(db, login.toLowerCase().trim(), user, passwordValid);

  if (loginError) {
    return res.status(400).json({ message: loginError });
  }

  const token = jwt.sign(buildAuthPayload(user), JWT_SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: buildAuthPayload(user)
  });
});

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Mevcut şifre ve yeni şifre gereklidir.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
  }

  const db = readDb();
  const user = findUserById(db, req.user.id);

  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ message: 'Mevcut şifreniz hatalı.' });
  }

  user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  writeDb(db);

  res.json({ message: 'Şifreniz başarıyla güncellendi.' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readDb();
  const user = findUserById(db, req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
  }
  res.json({ user: buildAuthPayload(user) });
});

// 2. Configurations API (to fetch current categories and base/max scores)
app.get('/api/config/categories', (req, res) => {
  const db = readDb();
  res.json(db.categories || defaultCategories);
});

app.put('/api/config/categories', authenticateToken, requireSystemAdmin, (req, res) => {
  const { categories } = req.body;
  if (!categories) {
    return res.status(400).json({ message: 'Kategori yapılandırması eksik.' });
  }

  const db = readDb();
  db.categories = categories;
  writeDb(db);
  res.json({ message: 'Kategori yapılandırması başarıyla güncellendi.', categories: db.categories });
});

// 3. File Upload Middleware for Evidence Documents and Forms
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Dosya yüklenemedi.' });
  }
  // Return relative path for client consumption
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl, originalName: req.file.originalname });
});

// 4. Applications API (Academician Panel)
app.get('/api/applications/my', authenticateToken, (req, res) => {
  const db = readDb();
  const myApps = db.applications.filter(app => app.userId === req.user.id);
  res.json(myApps);
});

app.get('/api/applications/my/:id', authenticateToken, (req, res) => {
  const db = readDb();
  const application = db.applications.find(app => app.id === req.params.id && app.userId === req.user.id);
  if (!application) {
    return res.status(404).json({ message: 'Başvuru bulunamadı veya bu başvuruya erişim yetkiniz yok.' });
  }
  res.json(application);
});

app.post('/api/applications', authenticateToken, (req, res) => {
  const { year, category, personalInfo, activities, summary, yoksisForm, beyanForm, isDraft } = req.body;
  
  if (!year || !category || !personalInfo) {
    return res.status(400).json({ message: 'Eksik başvuru bilgileri.' });
  }

  const db = readDb();

  const existingApplication = findUserApplication(db, req.user.id);
  if (existingApplication) {
    return res.status(400).json({
      message: 'Sistemde kayıtlı bir başvurunuz zaten bulunuyor. Farklı kategoriden başvurmak için önce mevcut başvurunuzu silin.'
    });
  }

  const status = isDraft ? 'draft' : 'submitted';

  const newApp = {
    id: 'app_' + Date.now(),
    userId: req.user.id,
    status,
    year: parseInt(year),
    category,
    personalInfo,
    activities: activities || [],
    summary: summary || { totalScore: 0 },
    yoksisForm: yoksisForm || null,
    beyanForm: beyanForm || null,
    adminNotes: '',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.applications.push(newApp);
  writeDb(db);

  res.status(201).json({ message: isDraft ? 'Başvuru taslak olarak kaydedildi.' : 'Başvuru başarıyla gönderildi.', application: newApp });
});

app.put('/api/applications/:id', authenticateToken, (req, res) => {
  const db = readDb();
  const appIndex = db.applications.findIndex(a => a.id === req.params.id && a.userId === req.user.id);

  if (appIndex === -1) {
    return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  }

  const currentApp = db.applications[appIndex];
  
  // Can only edit draft or revision_requested applications
  if (currentApp.status !== 'draft' && currentApp.status !== 'revision_requested') {
    return res.status(400).json({ message: 'Gönderilmiş ve inceleme aşamasındaki başvurular düzenlenemez.' });
  }

  const { year, category, personalInfo, activities, summary, yoksisForm, beyanForm, isDraft } = req.body;

  const anotherApplication = findUserApplication(db, req.user.id, currentApp.id);
  if (anotherApplication) {
    return res.status(400).json({
      message: 'Aynı kullanıcı için birden fazla başvuru bulunamaz. Devam etmek için diğer başvurunuzu silin.'
    });
  }

  if (category && category !== currentApp.category) {
    return res.status(400).json({
      message: 'Başvuru kategorisi değiştirilemez. Farklı kategori seçmek için mevcut başvuruyu silip yeniden başvurun.'
    });
  }

  if (year && parseInt(year) !== currentApp.year) {
    return res.status(400).json({
      message: 'Başvuru yılı değiştirilemez. Farklı başvuru oluşturmak için mevcut başvuruyu silin.'
    });
  }

  const status = isDraft ? 'draft' : 'submitted';

  db.applications[appIndex] = {
    ...currentApp,
    year: year ? parseInt(year) : currentApp.year,
    category: category || currentApp.category,
    personalInfo: personalInfo || currentApp.personalInfo,
    activities: activities || currentApp.activities,
    summary: summary || currentApp.summary,
    yoksisForm: yoksisForm !== undefined ? yoksisForm : currentApp.yoksisForm,
    beyanForm: beyanForm !== undefined ? beyanForm : currentApp.beyanForm,
    status,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);

  res.json({ message: isDraft ? 'Taslak güncellendi.' : 'Başvuru başarıyla gönderildi.', application: db.applications[appIndex] });
});

app.delete('/api/applications/:id', authenticateToken, (req, res) => {
  const db = readDb();
  const appIndex = db.applications.findIndex(a => a.id === req.params.id && a.userId === req.user.id);

  if (appIndex === -1) {
    return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  }

  db.applications.splice(appIndex, 1);
  writeDb(db);
  res.json({ message: 'Başvurunuz silindi. Artık farklı kategoriden yeniden başvuru yapabilirsiniz.' });
});

// Appeal application
app.post('/api/applications/:id/appeal', authenticateToken, (req, res) => {
  const { reasoning } = req.body;
  if (!reasoning) {
    return res.status(400).json({ message: 'İtiraz gerekçesi yazılmalıdır.' });
  }

  const db = readDb();
  const appIndex = db.applications.findIndex(a => a.id === req.params.id && a.userId === req.user.id);
  if (appIndex === -1) {
    return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  }

  const currentApp = db.applications[appIndex];
  if (currentApp.status !== 'rejected') {
    return res.status(400).json({ message: 'Sadece reddedilmiş başvurulara itiraz edilebilir.' });
  }

  db.applications[appIndex] = {
    ...currentApp,
    status: 'in_review', // returns to review under appeal
    appeal: {
      reasoning,
      submittedAt: new Date().toISOString(),
      adminResponse: ''
    },
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json({ message: 'İtiraz başvurusu başarıyla yapıldı.', application: db.applications[appIndex] });
});

// 5. Admin API (Admin Panel)
app.get('/api/admin/applications', authenticateToken, requireAdmin, (req, res) => {
  const db = readDb();
  const adminUser = findUserById(db, req.user.id);
  if (!adminUser) {
    return res.status(404).json({ message: 'Yönetici hesabı bulunamadı.' });
  }

  const extendedApps = db.applications
    .filter(app => canAdminAccessApplication(adminUser, app, db))
    .map(app => {
      const user = findUserById(db, app.userId);
      const personalInfo = app.personalInfo || {};
      return {
        ...app,
        applicant: user ? {
          name: user.name,
          email: user.email || null,
          title: user.title,
          faculty: user.faculty,
          department: user.department
        } : (personalInfo.name ? {
          name: personalInfo.name,
          email: personalInfo.email || null,
          title: personalInfo.title || '',
          faculty: personalInfo.faculty || '',
          department: personalInfo.department || ''
        } : null)
      };
    });

  res.json(extendedApps);
});

app.delete('/api/admin/applications/:id', authenticateToken, requireSystemAdmin, (req, res) => {
  const db = readDb();
  const appIndex = db.applications.findIndex(a => a.id === req.params.id);
  if (appIndex === -1) {
    return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  }

  db.applications.splice(appIndex, 1);
  writeDb(db);
  res.json({ message: 'Başvuru başarıyla silindi.' });
});

app.get('/api/admin/users', authenticateToken, requireSystemAdmin, (req, res) => {
  const db = readDb();
  res.json(db.users.map(u => sanitizeUser(u, db)));
});

// 6. System Admin - User Management
app.get('/api/admin/system/users', authenticateToken, requireSystemAdmin, (req, res) => {
  const db = readDb();
  const users = db.users.map(u => sanitizeUser(u, db));
  res.json({
    summary: {
      totalUsers: users.length,
      academicUsers: users.filter(u => u.role === 'user').length,
      facultyAdmins: users.filter(u => u.role === 'admin' && u.adminScope === 'faculty').length,
      totalApplications: db.applications.length
    },
    users
  });
});

app.post('/api/admin/system/users', authenticateToken, requireSystemAdmin, (req, res) => {
  const {
    role,
    email,
    username,
    password,
    name,
    title,
    faculty,
    department
  } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
  }

  if (role === 'system') {
    return res.status(403).json({ message: 'Sistem yöneticisi hesabı bu panelden oluşturulamaz.' });
  }

  const db = readDb();

  if (role === 'admin') {
    if (!username || !faculty) {
      return res.status(400).json({ message: 'Komisyon hesabı için kullanıcı adı ve fakülte gereklidir.' });
    }
    const normalizedUsername = username.toLowerCase().trim();
    if (isLoginTaken(db, normalizedUsername)) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
    }
    if (!academicUnits[faculty]) {
      return res.status(400).json({ message: 'Geçersiz fakülte seçimi.' });
    }
    if (db.users.some(u => u.role === 'admin' && u.adminScope === 'faculty' && u.faculty === faculty)) {
      return res.status(400).json({ message: 'Bu fakülte için zaten bir komisyon hesabı tanımlı.' });
    }

    const newAdmin = {
      id: `admin_${Date.now()}`,
      username: normalizedUsername,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      name: name || `${faculty} Ödül Komisyonu`,
      faculty,
      department: department || 'Ödül Değerlendirme Komisyonu',
      title: title || 'Komisyon',
      role: 'admin',
      adminScope: 'faculty'
    };
    db.users.push(newAdmin);
    writeDb(db);
    return res.status(201).json({
      message: 'Komisyon yönetici hesabı oluşturuldu.',
      user: sanitizeUser(newAdmin, db)
    });
  }

  if (!email || !name || !title || !faculty || !department) {
    return res.status(400).json({ message: 'Akademisyen için tüm alanlar gereklidir.' });
  }

  const lowerEmail = email.toLowerCase().trim();
  if (!isAllowedAybuEmail(lowerEmail)) {
    return res.status(400).json({ message: 'E-posta @aybu.edu.tr uzantılı olmalıdır.' });
  }
  if (!isValidFacultyDepartment(faculty, department)) {
    return res.status(400).json({ message: 'Geçersiz fakülte veya bölüm seçimi.' });
  }
  if (isLoginTaken(db, lowerEmail)) {
    return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
  }

  const newUser = {
    id: `u_${Date.now()}`,
    email: lowerEmail,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    name,
    faculty,
    department,
    title,
    role: 'user'
  };
  db.users.push(newUser);
  writeDb(db);
  res.status(201).json({
    message: 'Akademisyen hesabı oluşturuldu.',
    user: sanitizeUser(newUser, db)
  });
});

app.put('/api/admin/system/users/:id', authenticateToken, requireSystemAdmin, (req, res) => {
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
  }

  const user = db.users[userIndex];
  const { name, title, faculty, department, email, username, role } = req.body;

  if (getAdminScope(user) === 'system') {
    if (role && role !== 'admin') {
      return res.status(403).json({ message: 'Sistem yöneticisi hesap türü değiştirilemez.' });
    }
    if (name) user.name = name;
    if (title) user.title = title;
    writeDb(db);
    return res.json({ message: 'Sistem yöneticisi güncellendi.', user: sanitizeUser(user, db) });
  }

  if (role === 'system') {
    return res.status(403).json({ message: 'Sistem yöneticisi hesabı bu panelden atanamaz.' });
  }

  const targetIsFacultyAdmin = role === 'admin';
  const targetIsAcademic = role === 'user';
  const roleChanging = (targetIsFacultyAdmin && user.role !== 'admin') ||
    (targetIsAcademic && user.role !== 'user');

  if (targetIsFacultyAdmin && roleChanging) {
    if (!username || !faculty) {
      return res.status(400).json({ message: 'Komisyon hesabı için kullanıcı adı ve fakülte gereklidir.' });
    }
    const normalizedUsername = username.toLowerCase().trim();
    if (isLoginTaken(db, normalizedUsername, user.id)) {
      return res.status(400).json({ message: 'Bu kullanıcı adı başka bir hesapta kullanılıyor.' });
    }
    if (!academicUnits[faculty]) {
      return res.status(400).json({ message: 'Geçersiz fakülte seçimi.' });
    }
    const duplicateFacultyAdmin = db.users.find(
      u => u.id !== user.id && u.role === 'admin' && u.adminScope === 'faculty' && u.faculty === faculty
    );
    if (duplicateFacultyAdmin) {
      return res.status(400).json({ message: 'Bu fakülte için zaten bir komisyon hesabı var.' });
    }

    user.role = 'admin';
    user.adminScope = 'faculty';
    user.username = normalizedUsername;
    user.faculty = faculty;
    user.name = name || `${faculty} Ödül Komisyonu`;
    user.department = 'Ödül Değerlendirme Komisyonu';
    user.title = 'Komisyon';
    delete user.email;
  } else if (targetIsAcademic && roleChanging) {
    if (!email || !title || !faculty || !department) {
      return res.status(400).json({ message: 'Akademisyen için e-posta, unvan, fakülte ve bölüm gereklidir.' });
    }
    const lowerEmail = email.toLowerCase().trim();
    if (!isAllowedAybuEmail(lowerEmail)) {
      return res.status(400).json({ message: 'E-posta @aybu.edu.tr uzantılı olmalıdır.' });
    }
    if (!isValidFacultyDepartment(faculty, department)) {
      return res.status(400).json({ message: 'Geçersiz fakülte veya bölüm seçimi.' });
    }
    if (isLoginTaken(db, lowerEmail, user.id)) {
      return res.status(400).json({ message: 'Bu e-posta adresi başka bir hesapta kullanılıyor.' });
    }

    user.role = 'user';
    user.email = lowerEmail;
    user.name = name;
    user.title = title;
    user.faculty = faculty;
    user.department = department;
    delete user.username;
    delete user.adminScope;
  } else {
    if (name) user.name = name;
    if (title && user.role === 'user') user.title = title;

    if (user.role === 'user') {
      if (email) {
        const lowerEmail = email.toLowerCase().trim();
        if (!isAllowedAybuEmail(lowerEmail)) {
          return res.status(400).json({ message: 'E-posta @aybu.edu.tr uzantılı olmalıdır.' });
        }
        if (isLoginTaken(db, lowerEmail, user.id)) {
          return res.status(400).json({ message: 'Bu e-posta adresi başka bir hesapta kullanılıyor.' });
        }
        user.email = lowerEmail;
      }
      if (faculty && department) {
        if (!isValidFacultyDepartment(faculty, department)) {
          return res.status(400).json({ message: 'Geçersiz fakülte veya bölüm seçimi.' });
        }
        user.faculty = faculty;
        user.department = department;
      }
    }

    if (user.role === 'admin' && user.adminScope === 'faculty') {
      if (username) {
        const normalizedUsername = username.toLowerCase().trim();
        if (isLoginTaken(db, normalizedUsername, user.id)) {
          return res.status(400).json({ message: 'Bu kullanıcı adı başka bir hesapta kullanılıyor.' });
        }
        user.username = normalizedUsername;
      }
      if (faculty) {
        if (!academicUnits[faculty]) {
          return res.status(400).json({ message: 'Geçersiz fakülte seçimi.' });
        }
        const duplicateFacultyAdmin = db.users.find(
          u => u.id !== user.id && u.role === 'admin' && u.adminScope === 'faculty' && u.faculty === faculty
        );
        if (duplicateFacultyAdmin) {
          return res.status(400).json({ message: 'Bu fakülte için zaten bir komisyon hesabı var.' });
        }
        user.faculty = faculty;
        user.name = name || `${faculty} Ödül Komisyonu`;
      }
    }
  }

  db.users[userIndex] = user;
  writeDb(db);
  res.json({ message: 'Kullanıcı güncellendi.', user: sanitizeUser(user, db) });
});

app.put('/api/admin/system/users/:id/password', authenticateToken, requireSystemAdmin, (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Yeni şifre en az 6 karakter olmalıdır.' });
  }

  const db = readDb();
  const user = findUserById(db, req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
  }

  user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  writeDb(db);
  res.json({ message: 'Kullanıcı şifresi güncellendi.' });
});

app.delete('/api/admin/system/users/:id', authenticateToken, requireSystemAdmin, (req, res) => {
  const db = readDb();
  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
  }

  const user = db.users[userIndex];
  if (getAdminScope(user) === 'system') {
    return res.status(403).json({ message: 'Sistem yöneticisi hesabı silinemez.' });
  }
  if (user.id === req.user.id) {
    return res.status(403).json({ message: 'Kendi hesabınızı silemezsiniz.' });
  }

  db.applications = db.applications.filter(app => app.userId !== user.id);
  db.users.splice(userIndex, 1);
  writeDb(db);
  res.json({ message: 'Kullanıcı ve ilişkili başvurular silindi.' });
});

app.post('/api/admin/applications/:id/evaluate', authenticateToken, requireAdmin, (req, res) => {
  const { status, adminNotes, approvedScore, appealResponse } = req.body;
  if (!['approved', 'rejected', 'revision_requested'].includes(status)) {
    return res.status(400).json({ message: 'Geçersiz değerlendirme durumu.' });
  }

  const db = readDb();
  const adminUser = findUserById(db, req.user.id);
  const appIndex = db.applications.findIndex(a => a.id === req.params.id);
  if (appIndex === -1) {
    return res.status(404).json({ message: 'Başvuru bulunamadı.' });
  }

  const currentApp = db.applications[appIndex];
  if (!canAdminAccessApplication(adminUser, currentApp, db)) {
    return res.status(403).json({ message: 'Bu başvuruyu değerlendirme yetkiniz bulunmamaktadır.' });
  }

  db.applications[appIndex] = {
    ...currentApp,
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : currentApp.adminNotes,
    summary: {
      ...currentApp.summary,
      approvedScore: approvedScore !== undefined ? parseFloat(approvedScore) : currentApp.summary.totalScore
    },
    updatedAt: new Date().toISOString()
  };

  // If there was an active appeal, update appeal status
  if (currentApp.appeal) {
    db.applications[appIndex].appeal = {
      ...currentApp.appeal,
      adminResponse: appealResponse || adminNotes || 'İtiraz değerlendirildi.'
    };
  }

  writeDb(db);
  res.json({ message: 'Başvuru başarıyla değerlendirildi.', application: db.applications[appIndex] });
});

// Fallback HTML router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint bulunamadı.' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`ATOSIS server is running on http://localhost:${PORT}`);
});
