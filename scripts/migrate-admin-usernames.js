const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const CREDENTIALS_FILE = path.join(__dirname, '..', 'data', 'faculty-admin-credentials.json');

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf8'));

const credByFaculty = Object.fromEntries(credentials.map(c => [c.faculty, c]));

db.users = db.users.filter(u => u.email !== 'academic@aybu.edu.tr');

db.users.forEach(user => {
  if (user.email === 'admin@aybu.edu.tr') {
    user.adminScope = 'system';
    user.password = bcrypt.hashSync('aLi.19051994', bcrypt.genSaltSync(10));
    return;
  }

  if (user.role !== 'admin' || user.adminScope !== 'faculty') {
    return;
  }

  const cred = credByFaculty[user.faculty];
  const username = cred
    ? cred.email.replace(/@aybu\.edu\.tr$/i, '')
    : user.email.replace(/@aybu\.edu\.tr$/i, '');

  user.username = username;
  delete user.email;
});

const updatedCredentials = credentials.map(c => ({
  faculty: c.faculty,
  username: c.email.replace(/@aybu\.edu\.tr$/i, ''),
  password: c.password,
  name: c.name
}));

fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(updatedCredentials, null, 2), 'utf8');

console.log('Migration complete.');
console.log(`Faculty admins: ${db.users.filter(u => u.role === 'admin' && u.adminScope === 'faculty').length}`);
console.log(`Removed academic@aybu.edu.tr, updated admin@aybu.edu.tr password.`);
