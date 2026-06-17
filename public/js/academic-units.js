// AYBU akademik birimler — kaynak: aybu akademik birimler.pdf
const ACADEMIC_UNITS = {
  'Diş Hekimliği Fakültesi': ['Diş Hekimliği'],
  'Fen Bilimleri Enstitüsü': ['Fen Bilimleri Enstitüsü'],
  'Halk Sağlığı Enstitüsü': ['Halk Sağlığı Enstitüsü'],
  'Havacılık ve Uzay Bilimleri Fakültesi': ['Havacılık ve Uzay Bilimleri'],
  'Hukuk Fakültesi': ['Hukuk'],
  'İlahiyat Fakültesi': ['İlahiyat'],
  'İletişim Fakültesi': ['İletişim'],
  'İnsan ve Toplum Bilimleri Fakültesi': [
    'Bilgi ve Belge Yönetimi',
    'Bilim Tarihi',
    'Doğu Dilleri ve Edebiyatı',
    'Felsefe',
    'Mütercim ve Tercümanlık',
    'Psikoloji',
    'Sanat Tarihi',
    'Sosyoloji',
    'Tarih',
    'Türk Dili ve Edebiyatı'
  ],
  'İşletme Fakültesi': [
    'İşletme',
    'Uluslararası Ticaret ve İşletmecilik',
    'Yönetim Bilişim Sistemleri'
  ],
  'Mimarlık ve Güzel Sanatlar Fakültesi': [
    'Dijital Oyun Tasarımı',
    'Endüstriyel Tasarım',
    'Görsel İletişim Tasarımı',
    'Mimarlık'
  ],
  'Mühendislik ve Doğa Bilimleri Fakültesi': [
    'Bilgisayar Mühendisliği',
    'Elektrik Elektronik Mühendisliği',
    'Endüstri Mühendisliği',
    'Enerji Sistemleri Mühendisliği',
    'İnşaat Mühendisliği',
    'Makine Mühendisliği',
    'Matematik',
    'Metalurji ve Malzeme Mühendisliği',
    'Yazılım Mühendisliği'
  ],
  'Sağlık Bilimleri Enstitüsü': ['Sağlık Bilimleri Enstitüsü'],
  'Sağlık Bilimleri Fakültesi': [
    'Beslenme ve Diyetetik',
    'Çocuk Gelişimi',
    'Dil ve Konuşma Terapisi',
    'Fizyoterapi ve Rehabilitasyon',
    'Hemşirelik',
    'Odyoloji',
    'Sağlık Yönetimi',
    'Sosyal Hizmet'
  ],
  'Sağlık Hizmetleri Meslek Yüksekokulu': ['Sağlık Hizmetleri Meslek Yüksekokulu'],
  'Siyasal Bilgiler Fakültesi': [
    'İktisat',
    'Maliye',
    'Siyaset Bilimi ve Kamu Yönetimi',
    'Uluslararası İlişkiler'
  ],
  'Sosyal Bilimler Enstitüsü': ['Sosyal Bilimler Enstitüsü'],
  'Sosyal Bilimler Meslek Yüksekokulu': ['Sosyal Bilimler Meslek Yüksekokulu'],
  'Spor Bilimleri Fakültesi': [
    'Antrenörlük Eğitimi',
    'Egzersiz ve Spor Bilimleri',
    'Spor Yöneticiliği'
  ],
  'Şereflikoçhisar Berat Cömertoğlu Meslek Yüksekokulu': ['Şereflikoçhisar Berat Cömertoğlu Meslek Yüksekokulu'],
  'Şereflikoçhisar Uygulamalı Bilimler Fakültesi': ['Şereflikoçhisar Uygulamalı Bilimler'],
  'Teknik Bilimler Meslek Yüksekokulu': ['Teknik Bilimler Meslek Yüksekokulu'],
  'Tıp Fakültesi': ['Tıp'],
  'Türk Sanat Müziği ve Devlet Konservatuvarı': ['Türk Sanat Müziği ve Devlet Konservatuvarı'],
  'Uluslararası İlişkiler ve Stratejik Araştırmalar Enstitüsü': ['Uluslararası İlişkiler ve Stratejik Araştırmalar Enstitüsü'],
  'Yabancı Diller Yüksekokulu': ['Yabancı Diller Yüksekokulu']
};

function getFacultyList() {
  return Object.keys(ACADEMIC_UNITS).sort((a, b) => a.localeCompare(b, 'tr'));
}

function getDepartmentsForFaculty(faculty) {
  return ACADEMIC_UNITS[faculty] ? [...ACADEMIC_UNITS[faculty]] : [];
}

function getAllDepartments() {
  const all = new Set();
  Object.values(ACADEMIC_UNITS).forEach(arr => arr.forEach(d => all.add(d)));
  return [...all].sort((a, b) => a.localeCompare(b, 'tr'));
}

function populateFacultySelect(selectEl, placeholder = 'Fakülte seçin') {
  if (!selectEl) return;
  const currentValue = selectEl.value;
  selectEl.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = placeholder;
  selectEl.appendChild(defaultOption);

  getFacultyList().forEach(faculty => {
    const option = document.createElement('option');
    option.value = faculty;
    option.textContent = faculty;
    selectEl.appendChild(option);
  });

  if (currentValue && ACADEMIC_UNITS[currentValue]) {
    selectEl.value = currentValue;
  }
}

function populateDepartmentSelect(deptSelect, faculty, placeholder = 'Bölüm seçin', allowAll = true) {
  if (!deptSelect) return;

  deptSelect.innerHTML = '';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = placeholder;
  deptSelect.appendChild(defaultOption);

  let departments = [];
  if (faculty) {
    departments = getDepartmentsForFaculty(faculty);
  } else if (allowAll) {
    departments = getAllDepartments();
  }

  if (!departments.length) {
    deptSelect.disabled = true;
    return;
  }

  deptSelect.disabled = false;
  departments.forEach(department => {
    const option = document.createElement('option');
    option.value = department;
    option.textContent = department;
    deptSelect.appendChild(option);
  });
}

function initFacultyDepartmentSelectors(facultySelectId, departmentSelectId) {
  const facultySelect = document.getElementById(facultySelectId);
  const departmentSelect = document.getElementById(departmentSelectId);
  if (!facultySelect || !departmentSelect) return;

  populateFacultySelect(facultySelect);
  // Populate department with all departments by default (user requested full list)
  populateDepartmentSelect(departmentSelect, '', 'Seçiniz', true);

  facultySelect.addEventListener('change', () => {
    populateDepartmentSelect(departmentSelect, facultySelect.value, 'Bölüm seçin', true);
  });
}

function populateAdminFacultyFilter(selectEl) {
  if (!selectEl) return;

  const currentValue = selectEl.value;
  selectEl.innerHTML = '';

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'Tüm fakülteleri göster';
  selectEl.appendChild(allOption);

  getFacultyList().forEach(faculty => {
    const option = document.createElement('option');
    option.value = faculty;
    option.textContent = faculty;
    selectEl.appendChild(option);
  });

  if ([...selectEl.options].some(opt => opt.value === currentValue)) {
    selectEl.value = currentValue;
  }
}
