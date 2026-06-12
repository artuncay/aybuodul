// ATOSIS - Client Side Application Logic (SPA Router, Calculator & Admin Controllers)

// State management
let currentUser = null;
let currentToken = null;
let allCategories = {};
let currentEditingApp = null; // Holds app object when editing
let applicationActivities = []; // Temp holder for active calculator rows
let activeStep = 1;
let adminApplications = []; // Admin submissions data cache
let adminUsers = []; // System admin user management cache
let adminUsersSummary = null;
let editingAdminUserId = null;
let resettingAdminUserId = null;
let currentUserApplications = [];

// API Helpers
async function apiCall(endpoint, method = 'GET', body = null, isMultipart = false) {
  const headers = {};
  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }
  if (!isMultipart && method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers
  };

  if (body) {
    config.body = isMultipart ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(endpoint, config);
    const contentType = res.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      if (text.trim().startsWith('<')) {
        throw new Error('API yanıtı alınamadı. Sunucuyu yeniden başlatıp tekrar deneyin.');
      }
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Sunucudan beklenmeyen yanıt alındı.');
      }
    }

    if (!res.ok) {
      throw new Error(data.message || 'API Hatası oluştu.');
    }
    return data;
  } catch (err) {
    showToast(err.message, 'error');
    throw err;
  }
}

// Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  
  let icon = '<i class="fa-solid fa-circle-check toast-icon" aria-hidden="true"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark toast-icon" aria-hidden="true"></i>';
  if (type === 'warning') icon = '<i class="fa-solid fa-circle-exclamation toast-icon" aria-hidden="true"></i>';
  
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
    <button type="button" class="toast-close" aria-label="Bildirimi kapat">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Close button binding
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });
  
  // Auto remove after 5s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.5s ease';
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

// SPA Router
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.add('hidden');
    view.classList.remove('active');
  });
  
  const targetView = document.getElementById(viewId);
  targetView.classList.remove('hidden');
  targetView.classList.add('active');
  document.body.classList.toggle('login-screen-active', viewId === 'login-view' || viewId === 'register-view');

  // Header display logic
  const header = document.getElementById('main-header');
  if (viewId === 'login-view' || viewId === 'register-view') {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
    // Update user badge
    if (currentUser) {
      document.getElementById('nav-user-info').innerHTML = `
        <i class="fa-solid fa-user"></i> ${getNavUserLabel(currentUser)}
      `;
    }
  }

  // Load specific view data
  if (viewId === 'academic-view') {
    loadAcademicianDashboard();
  } else if (viewId === 'admin-view') {
    loadAdminDashboard();
  }
}

// Check stored session
function checkAuth() {
  const token = localStorage.getItem('atosis_token');
  const userStr = localStorage.getItem('atosis_user');
  
  if (token && userStr) {
    currentToken = token;
    currentUser = JSON.parse(userStr);

    apiCall('/api/auth/me')
      .then(({ user }) => {
        currentUser = user;
        localStorage.setItem('atosis_user', JSON.stringify(user));
        routeAuthenticatedUser();
      })
      .catch(() => {
        localStorage.removeItem('atosis_token');
        localStorage.removeItem('atosis_user');
        currentToken = null;
        currentUser = null;
        showView('login-view');
      });
  } else {
    showView('login-view');
  }
}

function routeAuthenticatedUser() {
  if (currentUser.role === 'admin') {
    showView('admin-view');
  } else {
    showView('academic-view');
  }
}

// Load configurations from backend
async function fetchConfig() {
  try {
    allCategories = await apiCall('/api/config/categories');
  } catch (err) {
    console.error('Configuration load failed, fallback to defaults:', err);
  }
}

// ----------------------------------------------------
// AUTH CONTROLLERS
// ----------------------------------------------------
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const login = document.getElementById('login-id').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const isEmailLogin = login.includes('@');

  if (!login) {
    showToast('E-posta adresi veya yönetici kullanıcı adı girin.', 'error');
    return;
  }
  if (isEmailLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
    showToast('Geçerli bir e-posta adresi girin.', 'error');
    return;
  }
  if (!password) {
    showToast('Şifre girin.', 'error');
    return;
  }
  
  try {
    const data = await apiCall('/api/auth/login', 'POST', { login, email: login, username: login, password });
    localStorage.setItem('atosis_token', data.token);
    localStorage.setItem('atosis_user', JSON.stringify(data.user));
    
    currentToken = data.token;
    currentUser = data.user;
    
    showToast(`Hoş geldiniz, ${getDisplayTitle(currentUser)} ${currentUser.name}!`, 'success');
    
    if (currentUser.role === 'admin') {
      showView('admin-view');
    } else {
      showView('academic-view');
    }
  } catch (err) {
    // Error handled inside apiCall
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value.trim();
  const title = document.getElementById('reg-title').value;
  const password = document.getElementById('reg-password').value;
  const faculty = document.getElementById('reg-faculty').value;
  const department = document.getElementById('reg-dept').value;

  if (!/^[^\s@]+@aybu\.edu\.tr$/i.test(email)) {
    showToast('Kayıt yalnızca @aybu.edu.tr uzantılı e-posta adresleri ile yapılabilir.', 'error');
    return;
  }

  if (!faculty || !department) {
    showToast('Lütfen fakülte ve bölümünüzü listeden seçin.', 'error');
    return;
  }

  const validDepartments = getDepartmentsForFaculty(faculty);
  if (!validDepartments.includes(department)) {
    showToast('Seçilen bölüm, fakülte ile eşleşmiyor. Lütfen tekrar seçin.', 'error');
    return;
  }

  try {
    await apiCall('/api/auth/register', 'POST', { name, email, title, password, faculty, department });
    showToast('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
    showView('login-view');
    
    // Clear form
    document.getElementById('register-form').reset();
    populateDepartmentSelect(document.getElementById('reg-dept'), '');
  } catch (err) {}
});

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('atosis_token');
  localStorage.removeItem('atosis_user');
  currentToken = null;
  currentUser = null;
  currentEditingApp = null;
  showToast('Oturum kapatıldı.', 'warning');
  showView('login-view');
});

function openPasswordModal() {
  document.getElementById('password-form').reset();
  document.getElementById('password-view').classList.remove('hidden');
}

function closePasswordModal() {
  document.getElementById('password-view').classList.add('hidden');
}

document.getElementById('btn-change-password').addEventListener('click', openPasswordModal);
document.getElementById('btn-close-password-modal').addEventListener('click', closePasswordModal);
document.getElementById('btn-cancel-password').addEventListener('click', closePasswordModal);

document.getElementById('password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    showToast('Yeni şifreler eşleşmiyor.', 'error');
    return;
  }

  try {
    const res = await apiCall('/api/auth/change-password', 'POST', { currentPassword, newPassword });
    showToast(res.message, 'success');
    closePasswordModal();
  } catch (err) {}
});

// View switching links
document.getElementById('link-go-register').addEventListener('click', (e) => {
  e.preventDefault();
  showView('register-view');
});
document.getElementById('link-go-login').addEventListener('click', (e) => {
  e.preventDefault();
  showView('login-view');
});

document.getElementById('login-password-toggle').addEventListener('click', () => {
  const passwordInput = document.getElementById('login-password');
  const toggleIcon = document.querySelector('#login-password-toggle i');
  const isPassword = passwordInput.type === 'password';

  passwordInput.type = isPassword ? 'text' : 'password';
  toggleIcon.classList.toggle('fa-eye', !isPassword);
  toggleIcon.classList.toggle('fa-eye-slash', isPassword);
});

// ----------------------------------------------------
// ACADEMICIAN CONTROLLERS
// ----------------------------------------------------
async function loadAcademicianDashboard() {
  // Populate Sidebar
  document.getElementById('user-profile-name').textContent = `${currentUser.title || ''} ${currentUser.name || ''}`.trim();
  document.getElementById('user-profile-title-dept').textContent = currentUser.department || '';
  document.getElementById('user-profile-faculty').textContent = currentUser.faculty;

  try {
    const apps = await apiCall('/api/applications/my');
    currentUserApplications = apps;
    const tbody = document.getElementById('my-applications-list');
    const newApplicationButton = document.getElementById('btn-sidebar-new-app');
    tbody.innerHTML = '';

    if (apps.length > 0) {
      newApplicationButton.dataset.blocked = 'true';
      newApplicationButton.title = 'Farklı kategoriden başvurmak için önce mevcut başvurunuzu silin.';
    } else {
      newApplicationButton.dataset.blocked = 'false';
      newApplicationButton.title = '';
    }

    if (apps.length === 0) {
      document.getElementById('my-applications-table').classList.add('hidden');
      document.getElementById('no-applications-msg').classList.remove('hidden');
      return;
    }

    document.getElementById('my-applications-table').classList.remove('hidden');
    document.getElementById('no-applications-msg').classList.add('hidden');

    apps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    apps.forEach(app => {
      const tr = document.createElement('tr');
      
      let badgeClass = 'badge-draft';
      let statusText = 'Taslak';
      if (app.status === 'submitted') { badgeClass = 'badge-info'; statusText = 'Gönderildi'; }
      if (app.status === 'in_review') { badgeClass = 'badge-warning'; statusText = 'İnceleniyor'; }
      if (app.status === 'approved') { badgeClass = 'badge-success'; statusText = 'Onaylandı'; }
      if (app.status === 'rejected') { badgeClass = 'badge-danger'; statusText = 'Reddedildi'; }
      if (app.status === 'revision_requested') { badgeClass = 'badge-warning'; statusText = 'Revizyon Gerekli'; }

      const total = app.summary.totalScore ? app.summary.totalScore.toFixed(2) : '0.00';
      const approved = app.summary.approvedScore ? app.summary.approvedScore.toFixed(2) : '—';
      const catName = allCategories[app.category] ? allCategories[app.category].name.split(':')[0] : app.category;
      
      let actionButtons = '';
      if (app.status === 'draft' || app.status === 'revision_requested') {
        actionButtons = `
          <button class="btn btn-primary btn-sm btn-edit-app" data-id="${app.id}">
            <i class="fa-solid fa-pen-to-square"></i> Düzenle
          </button>
        `;
      } else {
        actionButtons = `
          <button class="btn btn-secondary btn-sm btn-view-app" data-id="${app.id}">
            <i class="fa-solid fa-eye"></i> Görüntüle
          </button>
        `;
      }

      if (app.status === 'rejected' && !app.appeal) {
        actionButtons += `
          <button class="btn btn-warning btn-sm btn-appeal-app" data-id="${app.id}">
            <i class="fa-solid fa-circle-exclamation"></i> İtiraz Et
          </button>
        `;
      }

      actionButtons += `
        <button class="btn btn-danger btn-sm btn-delete-app" data-id="${app.id}">
          <i class="fa-solid fa-trash"></i> Sil
        </button>
      `;

      tr.innerHTML = `
        <td><strong>${app.year}</strong></td>
        <td>${catName}</td>
        <td><span class="text-primary font-weight-bold">${total}</span></td>
        <td><span class="text-success font-weight-bold">${approved}</span></td>
        <td>${new Date(app.updatedAt).toLocaleDateString('tr-TR')}</td>
        <td><span class="badge ${badgeClass}">${statusText}</span></td>
        <td class="action-cell"><div class="action-buttons-row">${actionButtons}</div></td>
      `;
      tbody.appendChild(tr);
    });

    // Bind action events
    document.querySelectorAll('.btn-edit-app').forEach(btn => {
      btn.addEventListener('click', () => initApplicationForm(btn.dataset.id));
    });
    document.querySelectorAll('.btn-view-app').forEach(btn => {
      btn.addEventListener('click', () => viewApplicationDetails(btn.dataset.id));
    });
    document.querySelectorAll('.btn-appeal-app').forEach(btn => {
      btn.addEventListener('click', () => openAppealModal(btn.dataset.id));
    });
    document.querySelectorAll('.btn-delete-app').forEach(btn => {
      btn.addEventListener('click', () => deleteOwnApplication(btn.dataset.id));
    });

  } catch (err) {}
}

document.getElementById('btn-sidebar-dashboard').addEventListener('click', () => {
  showView('academic-view');
});

document.getElementById('btn-sidebar-new-app').addEventListener('click', () => {
  if (currentUserApplications.length > 0) {
    showToast('Farklı kategoriden başvuru yapamazsınız. Eski başvurunuzu silip yeniden yapın.', 'warning');
    return;
  }
  initApplicationForm();
});

document.getElementById('btn-back-to-dashboard').addEventListener('click', () => {
  showView('academic-view');
});

// ----------------------------------------------------
// APPLICATION FORM & CALCULATOR ENGINE
// ----------------------------------------------------
function initApplicationForm(appId = null) {
  currentEditingApp = null;
  activeStep = 1;
  updateStepIndicator();
  
  document.getElementById('app-form-title').textContent = appId ? 'Başvuruyu Düzenle' : 'Yeni Akademik Teşvik Başvurusu';
  document.getElementById('app-category-select').disabled = false;
  document.getElementById('app-year').disabled = false;

  if (appId) {
    // Load existing application
    apiCall(`/api/applications/my/${appId}`).then(app => {
      currentEditingApp = app;
      document.getElementById('app-year').value = app.year;
      document.getElementById('app-category-select').value = app.category;
      document.getElementById('app-category-select').disabled = true;
      document.getElementById('app-year').disabled = true;

      goToStep(1);
      showView('application-form-view');
    });
  } else {
    document.getElementById('app-category-select').value = '';
    document.getElementById('app-year').value = '2025';
    goToStep(1);
    showView('application-form-view');
  }
}

async function deleteOwnApplication(appId) {
  const confirmed = window.confirm('Bu başvuruyu silmek istediğinize emin misiniz? Sildikten sonra farklı kategoriden yeniden başvuru yapabilirsiniz.');
  if (!confirmed) return;

  try {
    const res = await apiCall(`/api/applications/${appId}`, 'DELETE');
    showToast(res.message, 'success');
    if (currentEditingApp && currentEditingApp.id === appId) {
      currentEditingApp = null;
      applicationActivities = [];
    }
    await loadAcademicianDashboard();
  } catch (err) {}
}

function updateStepIndicator() {
  document.querySelectorAll('.progress-steps .step').forEach(step => {
    const stepNum = parseInt(step.dataset.step);
    step.classList.remove('active', 'completed');
    step.removeAttribute('aria-current');
    if (stepNum === activeStep) {
      step.classList.add('active');
      step.setAttribute('aria-current', 'step');
    } else if (stepNum < activeStep) {
      step.classList.add('completed');
    }
  });
}

function goToStep(stepNum) {
  activeStep = stepNum;
  updateStepIndicator();

  document.querySelectorAll('.step-content').forEach(content => {
    content.classList.add('hidden');
  });
  document.getElementById(`step-${stepNum}-content`).classList.remove('hidden');

  if (stepNum === 2) {
    loadCalculatorGrid();
  } else if (stepNum === 3) {
    loadEvidenceUploaders();
  }
}

// Next/Prev binds
document.getElementById('btn-step1-next').addEventListener('click', () => {
  const cat = document.getElementById('app-category-select').value;
  if (!cat) {
    showToast('Lütfen başvuru yapacağınız kategoriyi seçiniz.', 'warning');
    return;
  }
  goToStep(2);
});

document.getElementById('btn-step2-prev').addEventListener('click', () => goToStep(1));
document.getElementById('btn-step2-next').addEventListener('click', () => goToStep(3));
document.getElementById('btn-step3-prev').addEventListener('click', () => goToStep(2));

// Load Grid
function loadCalculatorGrid() {
  const catId = document.getElementById('app-category-select').value;
  const category = allCategories[catId];
  const existingActivities = Array.isArray(applicationActivities) ? [...applicationActivities] : [];
  
  document.getElementById('selected-category-title-display').textContent = category.name;
  
  const thRatio = document.getElementById('th-ratio-header');
  const hasRatio = category.items.some(i => i.requiresRatio);
  
  if (hasRatio) {
    thRatio.classList.remove('hidden');
  } else {
    thRatio.classList.add('hidden');
  }

  const tbody = document.getElementById('calculator-table-body');
  tbody.innerHTML = '';

  applicationActivities = [];

  category.items.forEach(item => {
    const savedAct = existingActivities.find(a => a.activityId === item.id) ||
      (currentEditingApp ? currentEditingApp.activities.find(a => a.activityId === item.id) : null);
    const initialCount = savedAct ? savedAct.count : 0;
    const initialRatio = savedAct ? savedAct.ratio : 1.0;
    const initialEvidence = savedAct ? savedAct.evidenceFile : null;

    applicationActivities.push({
      activityId: item.id,
      label: item.label,
      baseScore: item.baseScore,
      maxScore: item.maxScore,
      requiresRatio: item.requiresRatio,
      hasFormulaCap: item.hasFormulaCap,
      count: initialCount,
      ratio: initialRatio,
      evidenceFile: initialEvidence
    });

    const tr = document.createElement('tr');
    tr.dataset.itemId = item.id;
    
    const maxText = item.maxScore > 0 ? item.maxScore.toFixed(1) : 'Limit Yok';
    const ratioCellHtml = item.requiresRatio 
      ? `<td class="td-input"><input type="number" class="input-ratio" step="0.01" min="0.01" max="1.00" value="${initialRatio.toFixed(2)}" aria-label="${item.label} katkı oranı, 0.01 ile 1.00 arasında"></td>`
      : `<td class="hidden"></td>`;

    tr.innerHTML = `
      <td>${item.label}</td>
      <td class="text-center font-weight-bold">${item.baseScore.toFixed(1)}</td>
      <td class="text-center text-muted">${maxText}</td>
      <td class="td-input"><input type="number" class="input-count" min="0" step="1" value="${initialCount}" aria-label="${item.label} adet, ay veya saat değeri"></td>
      ${ratioCellHtml}
      <td class="td-calculated live-row-score" aria-live="polite">0.00</td>
    `;
    
    tbody.appendChild(tr);
  });

  // Add Grand Total Row
  const totalTr = document.createElement('tr');
  totalTr.className = 'tr-total';
  
  const colSpanCount = hasRatio ? 5 : 4;
  totalTr.innerHTML = `
    <td colspan="${colSpanCount}" class="text-right">KATEGORİ TOPLAM PUANI:</td>
    <td class="text-right" id="calculator-grand-total">0.00</td>
  `;
  tbody.appendChild(totalTr);

  // Bind change calculations
  tbody.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateTotalScore);
  });

  // Run initial calculation
  calculateTotalScore();
}

function calculateTotalScore() {
  const tbody = document.getElementById('calculator-table-body');
  let grandTotal = 0;

  applicationActivities.forEach(act => {
    const tr = tbody.querySelector(`tr[data-item-id="${act.activityId}"]`);
    if (!tr) return;

    const countInput = tr.querySelector('.input-count');
    const ratioInput = tr.querySelector('.input-ratio');

    const count = Math.max(0, parseFloat(countInput.value) || 0);
    const ratio = act.requiresRatio ? Math.min(1.0, Math.max(0.01, parseFloat(ratioInput.value) || 0)) : 1.0;

    act.count = count;
    act.ratio = ratio;

    let score = act.baseScore * count * ratio;
    
    // Apply max cap only if explicitly defined in the Excel formula (hasFormulaCap)
    if (act.hasFormulaCap && act.maxScore > 0 && score > act.maxScore) {
      score = act.maxScore;
    }

    act.calculatedScore = score;
    grandTotal += score;

    // Update row cell
    tr.querySelector('.live-row-score').textContent = score.toFixed(2);
  });

  document.getElementById('calculator-grand-total').textContent = grandTotal.toFixed(2);
  document.getElementById('live-total-score').textContent = grandTotal.toFixed(2);
}

// ----------------------------------------------------
// EVIDENCE UPLOADS & FORMS MANAGEMENT
// ----------------------------------------------------
function loadEvidenceUploaders() {
  const container = document.getElementById('dynamic-evidence-uploaders');
  container.innerHTML = '';

  const activeActs = applicationActivities.filter(act => act.count > 0);

  if (activeActs.length === 0) {
    container.innerHTML = '<div class="alert alert-warning"><i class="fa-solid fa-circle-exclamation"></i> Herhangi bir faaliyet verisi girmediniz. Lütfen geri dönüp puan alacağınız faaliyetleri doldurunuz.</div>';
    return;
  }

  activeActs.forEach(act => {
    const div = document.createElement('div');
    div.className = 'evidence-row-uploader';
    div.dataset.itemId = act.activityId;

    let uploadStateHtml = '';
    if (act.evidenceFile) {
      uploadStateHtml = `
        <div class="uploaded-file-info" style="padding: 0.25rem 0.75rem;">
          <span class="filename" style="font-size: 0.8rem;">${act.evidenceFile.name}</span>
          <button type="button" class="btn-remove-evidence btn-remove-file"><i class="fa-solid fa-times"></i></button>
        </div>
      `;
    } else {
      uploadStateHtml = `
        <button type="button" class="btn btn-secondary btn-sm btn-trigger-upload-evidence" aria-label="${act.label} için kanıt dosyası yükle"><i class="fa-solid fa-upload" aria-hidden="true"></i> Dosya Yükle</button>
        <span class="text-muted upload-status-text">Dosya yüklenmedi (PDF/Görsel)</span>
      `;
    }

    div.innerHTML = `
      <span class="activity-label">${act.label} (Adet: ${act.count})</span>
      <div class="upload-actions">
        ${uploadStateHtml}
        <input type="file" class="visually-hidden input-evidence-file-field" accept=".pdf,image/*" aria-label="${act.label} kanıt belgesi seçin">
      </div>
    `;

    container.appendChild(div);

    // Bind file upload trigger
    const fileInput = div.querySelector('.input-evidence-file-field');
    const triggerBtn = div.querySelector('.btn-trigger-upload-evidence');
    const removeBtn = div.querySelector('.btn-remove-evidence');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => uploadEvidenceFile(e, act.activityId));
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        act.evidenceFile = null;
        loadEvidenceUploaders(); // refresh UI
      });
    }
  });
}

async function uploadEvidenceFile(e, activityId) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await apiCall('/api/upload', 'POST', formData, true);
    const act = applicationActivities.find(a => a.activityId === activityId);
    if (act) {
      act.evidenceFile = {
        name: file.name,
        url: data.fileUrl
      };
    }
    showToast('Kanıt dosyası başarıyla yüklendi.', 'success');
    loadEvidenceUploaders(); // refresh UI
  } catch (err) {}
}

// Save & Submit Core Actions
document.getElementById('btn-save-draft').addEventListener('click', () => saveApplication(true));
document.getElementById('btn-submit-application').addEventListener('click', () => saveApplication(false));

async function saveApplication(isDraft = true) {
  const year = document.getElementById('app-year').value;
  const category = document.getElementById('app-category-select').value;

  if (!isDraft) {
    // Validations for Submit
    // Check if evidence files are uploaded for all filled activities
    const missingEvidence = applicationActivities.some(act => act.count > 0 && !act.evidenceFile);
    if (missingEvidence) {
      showToast('Girdiğiniz tüm akademik faaliyetlerin kanıt belgesini yüklemeniz zorunludur.', 'error');
      return;
    }
  }

  const payload = {
    year,
    category,
    isDraft,
    personalInfo: {
      name: currentUser.name,
      title: currentUser.title,
      faculty: currentUser.faculty,
      department: currentUser.department,
      year
    },
    activities: applicationActivities,
    summary: {
      totalScore: parseFloat(document.getElementById('live-total-score').textContent) || 0
    }
  };

  try {
    let result;
    if (currentEditingApp) {
      // Update
      result = await apiCall(`/api/applications/${currentEditingApp.id}`, 'PUT', payload);
    } else {
      // Create new
      result = await apiCall('/api/applications', 'POST', payload);
    }
    
    showToast(result.message, 'success');
    showView('academic-view');
  } catch (err) {}
}

// View details (Read-only view)
async function viewApplicationDetails(appId) {
  // Let's use the admin detail view layout but disable action controls for read-only viewing
  // Wait, let's load it and see!
  try {
    const app = await apiCall(`/api/applications/my/${appId}`);
    
    document.getElementById('admin-detail-badge').className = 'badge badge-info';
    
    let statusTxt = 'Gönderildi';
    if (app.status === 'in_review') statusTxt = 'İnceleniyor';
    if (app.status === 'approved') { statusTxt = 'Onaylandı'; document.getElementById('admin-detail-badge').className = 'badge badge-success'; }
    if (app.status === 'rejected') { statusTxt = 'Reddedildi'; document.getElementById('admin-detail-badge').className = 'badge badge-danger'; }
    
    document.getElementById('admin-detail-badge').textContent = statusTxt;

    document.getElementById('detail-name').textContent = app.personalInfo.name;
    document.getElementById('detail-title').textContent = app.personalInfo.title;
    document.getElementById('detail-faculty').textContent = app.personalInfo.faculty;
    document.getElementById('detail-dept').textContent = app.personalInfo.department;
    document.getElementById('detail-year').textContent = app.year;
    
    const catName = allCategories[app.category] ? allCategories[app.category].name : app.category;
    document.getElementById('detail-category').textContent = catName;

    // Fill Activities Table
    const tbody = document.getElementById('detail-activities-list');
    tbody.innerHTML = '';
    
    app.activities.forEach(act => {
      if (act.count === 0) return;
      const tr = document.createElement('tr');
      const maxVal = act.maxScore > 0 ? act.maxScore.toFixed(1) : 'Limit Yok';
      tr.innerHTML = `
        <td>${act.label}</td>
        <td class="text-center">${act.baseScore}</td>
        <td class="text-center">${maxVal}</td>
        <td class="text-center font-weight-bold">${act.count}</td>
        <td class="text-center">${act.requiresRatio ? act.ratio.toFixed(2) : '—'}</td>
        <td class="text-right font-weight-bold text-primary">${act.calculatedScore.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Forms
    // Evidence
    const evidenceDiv = document.getElementById('detail-evidence-list');
    evidenceDiv.innerHTML = '';
    app.activities.filter(a => a.count > 0 && a.evidenceFile).forEach(act => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'doc-item mt-1';
      itemDiv.innerHTML = `
        <div class="doc-icon"><i class="fa-regular fa-file-image"></i></div>
        <div class="doc-details">
          <strong>Kanıt Belgesi</strong>
          <p style="color: var(--secondary-color); font-weight: 500;">${act.label}</p>
        </div>
        <a href="${act.evidenceFile.url}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-eye"></i> İncele</a>
      `;
      evidenceDiv.appendChild(itemDiv);
    });

    // Score summaries
    document.getElementById('detail-score-calculated').textContent = app.summary.totalScore.toFixed(2);
    document.getElementById('detail-score-approved').value = app.summary.approvedScore ? app.summary.approvedScore.toFixed(2) : app.summary.totalScore.toFixed(2);
    document.getElementById('detail-score-approved').disabled = true; // Readonly

    // Notes
    document.getElementById('admin-eval-notes').value = app.adminNotes || '';
    document.getElementById('admin-eval-notes').disabled = true; // Readonly

    // Hide evaluating buttons
    document.getElementById('admin-detail-view').querySelector('.action-buttons-vertical').classList.add('hidden');
    document.getElementById('appeal-response-group').classList.add('hidden');

    // Show appeal info if rejected/reviewed
    const appealBox = document.getElementById('detail-appeal-box');
    if (app.appeal) {
      appealBox.classList.remove('hidden');
      document.getElementById('detail-appeal-reasoning').textContent = app.appeal.reasoning;
    } else {
      appealBox.classList.add('hidden');
    }

    // Header back btn override
    document.getElementById('btn-back-to-admin-dashboard').classList.add('hidden');
    const overrideBackBtn = document.createElement('button');
    overrideBackBtn.id = 'btn-back-override-academic';
    overrideBackBtn.className = 'btn btn-secondary btn-sm';
    overrideBackBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Geri Dön';
    overrideBackBtn.onclick = () => {
      showView('academic-view');
      overrideBackBtn.remove();
      document.getElementById('btn-back-to-admin-dashboard').classList.remove('hidden');
    };
    document.getElementById('admin-detail-view').querySelector('.app-form-header').insertBefore(overrideBackBtn, document.getElementById('admin-detail-badge'));

    showView('admin-detail-view');

  } catch (err) {}
}

// ----------------------------------------------------
// APPEAL MODAL & ACTION
// ----------------------------------------------------
let activeAppealAppId = null;

function openAppealModal(appId) {
  activeAppealAppId = appId;
  apiCall(`/api/applications/my/${appId}`).then(app => {
    document.getElementById('appeal-modal-admin-notes').textContent = app.adminNotes || 'Gerekçe belirtilmemiş.';
    document.getElementById('appeal-reasoning').value = '';
    document.getElementById('appeal-view').classList.remove('hidden');
  });
}

document.getElementById('btn-close-appeal-modal').addEventListener('click', () => {
  document.getElementById('appeal-view').classList.add('hidden');
});
document.getElementById('btn-cancel-appeal').addEventListener('click', () => {
  document.getElementById('appeal-view').classList.add('hidden');
});

document.getElementById('appeal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const reasoning = document.getElementById('appeal-reasoning').value;

  try {
    const res = await apiCall(`/api/applications/${activeAppealAppId}/appeal`, 'POST', { reasoning });
    showToast(res.message, 'success');
    document.getElementById('appeal-view').classList.add('hidden');
    loadAcademicianDashboard(); // refresh
  } catch (err) {}
});

// ----------------------------------------------------
// ADMIN DASHBOARD CONTROLLERS
// ----------------------------------------------------
function getApplicationFaculty(app) {
  if (app.personalInfo && app.personalInfo.faculty) {
    return app.personalInfo.faculty;
  }
  return app.applicant ? app.applicant.faculty : null;
}

function getApplicationDepartment(app) {
  if (app.personalInfo && app.personalInfo.department) {
    return app.personalInfo.department;
  }
  return app.applicant ? app.applicant.department : null;
}

function getApplicationApplicantName(app) {
  if (app.applicant) {
    return `${app.applicant.title ? app.applicant.title + ' ' : ''}${app.applicant.name}`;
  }
  if (app.personalInfo && app.personalInfo.name) {
    return `${app.personalInfo.title ? app.personalInfo.title + ' ' : ''}${app.personalInfo.name}`;
  }
  return 'Bilinmeyen';
}

function getApplicationSearchText(app) {
  const parts = [
    app.applicant?.name,
    app.applicant?.email,
    app.personalInfo?.name,
    app.personalInfo?.faculty,
    app.personalInfo?.department,
    app.id
  ].filter(Boolean);
  return parts.join(' ').toLowerCase();
}

function isSystemAdminUser(user) {
  if (!user || user.role !== 'admin') return false;
  if (user.adminScope === 'system') return true;
  return !user.adminScope && user.faculty === 'Rektörlük';
}

function getDisplayTitle(user) {
  if (isSystemAdminUser(user)) return 'Sistem Yöneticisi';
  if (user.role === 'admin' && user.adminScope === 'faculty') return 'Komisyon';
  return user.title || '';
}

function getFacultyCommissionLabel(faculty) {
  return faculty ? `${faculty} Akademik Ödül Komisyonu` : 'Akademik Ödül Komisyonu';
}

function getNavUserLabel(user) {
  if (isSystemAdminUser(user)) {
    return `Sistem Yöneticisi · ${user.name}`;
  }
  if (user.role === 'admin' && user.adminScope === 'faculty') {
    return getFacultyCommissionLabel(user.faculty);
  }
  const title = user.title ? `${user.title} ` : '';
  return `${title}${user.name}`;
}

async function loadAdminDashboard() {
  try {
    adminApplications = await apiCall('/api/admin/applications');

    const isFacultyAdmin = currentUser.adminScope === 'faculty';
    const isSystemAdmin = isSystemAdminUser(currentUser);
    const configTab = document.getElementById('btn-tab-config');
    const usersTab = document.getElementById('btn-tab-users');
    const facultyFilterGroup = document.getElementById('admin-filter-faculty')?.closest('.filter-group');
    const facultyBanner = document.getElementById('admin-faculty-banner');
    const facultyBannerText = document.getElementById('admin-faculty-banner-text');

    if (isFacultyAdmin) {
      configTab.classList.add('hidden');
      usersTab.classList.add('hidden');
      if (facultyFilterGroup) facultyFilterGroup.classList.add('hidden');
      facultyBanner.classList.remove('hidden');
      facultyBannerText.textContent = `Yalnızca ${currentUser.faculty} başvurularını görüntülüyorsunuz.`;
    } else {
      configTab.classList.remove('hidden');
      usersTab.classList.remove('hidden');
      if (facultyFilterGroup) facultyFilterGroup.classList.remove('hidden');
      facultyBanner.classList.add('hidden');
    }

    if (isSystemAdmin) {
      await loadSystemUsers();
    }
    
    // Render Stats
    document.getElementById('stat-total-apps').textContent = adminApplications.length;
    document.getElementById('stat-pending-apps').textContent = adminApplications.filter(a => a.status === 'submitted').length;
    document.getElementById('stat-approved-apps').textContent = adminApplications.filter(a => a.status === 'approved').length;
    document.getElementById('stat-rejected-apps').textContent = adminApplications.filter(a => a.status === 'rejected').length;

    renderAdminApplicationsList();

  } catch (err) {}
}

function renderAdminApplicationsList() {
  const tbody = document.getElementById('admin-applications-list');
  tbody.innerHTML = '';

  const query = document.getElementById('admin-search').value.toLowerCase();
  const filterStatus = document.getElementById('admin-filter-status').value;
  const isFacultyAdmin = currentUser.adminScope === 'faculty';
  const filterFaculty = currentUser.adminScope === 'faculty'
    ? currentUser.faculty
    : document.getElementById('admin-filter-faculty').value;

  const filtered = adminApplications.filter(app => {
    const matchesSearch = !query || getApplicationSearchText(app).includes(query);
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesFaculty = filterFaculty === 'all' || getApplicationFaculty(app) === filterFaculty;

    return matchesSearch && matchesStatus && matchesFaculty;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Arama kriterlerine uygun başvuru bulunamadı.</td></tr>';
    return;
  }

  if (isFacultyAdmin) {
    // Fakülte komisyonu: puana göre yüksekten düşüğe sırala
    filtered.sort((a, b) => {
      const aScore = parseFloat(a?.summary?.totalScore) || 0;
      const bScore = parseFloat(b?.summary?.totalScore) || 0;
      if (bScore !== aScore) return bScore - aScore;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  } else {
    // Sistem yöneticisi: submitted başvuruları öne al, sonra güncelleme tarihine göre sırala
    filtered.sort((a, b) => {
      if (a.status === 'submitted' && b.status !== 'submitted') return -1;
      if (a.status !== 'submitted' && b.status === 'submitted') return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }

  filtered.forEach((app, index) => {
    const tr = document.createElement('tr');
    if (isFacultyAdmin && index < 10) {
      tr.classList.add('top-ranked');
    }
    
    let badgeClass = 'badge-draft';
    let statusText = 'Taslak';
    if (app.status === 'submitted') { badgeClass = 'badge-info'; statusText = 'İnceleme Bekliyor'; }
    if (app.status === 'in_review') { badgeClass = 'badge-warning'; statusText = 'İtiraz / İncelemede'; }
    if (app.status === 'approved') { badgeClass = 'badge-success'; statusText = 'Onaylandı'; }
    if (app.status === 'rejected') { badgeClass = 'badge-danger'; statusText = 'Reddedildi'; }
    if (app.status === 'revision_requested') { badgeClass = 'badge-warning'; statusText = 'Revizyon İstendi'; }

    const applicantName = getApplicationApplicantName(app);
    const facultyName = getApplicationFaculty(app);
    const departmentName = getApplicationDepartment(app) || '—';
    const rankBadge = isFacultyAdmin && index < 10
      ? `<span class="badge badge-rank">#${index + 1}</span>`
      : '';
    const catName = allCategories[app.category] ? allCategories[app.category].name.split(':')[0] : app.category;
    
    const calculated = app.summary.totalScore ? app.summary.totalScore.toFixed(2) : '0.00';
    const approved = app.summary.approvedScore ? app.summary.approvedScore.toFixed(2) : '—';

    let actionBtn = `
      <button class="btn btn-primary btn-sm btn-admin-evaluate" data-id="${app.id}">
        <i class="fa-solid fa-gavel"></i> Değerlendir
      </button>
    `;

    if (app.status === 'draft') {
      actionBtn = `
        <button class="btn btn-secondary btn-sm btn-admin-evaluate" data-id="${app.id}">
          <i class="fa-solid fa-eye"></i> Görüntüle
        </button>
      `;
    }

    if (isSystemAdminUser(currentUser)) {
      actionBtn += `
        <button type="button" class="btn btn-danger btn-sm btn-admin-delete-app" data-id="${app.id}">
          <i class="fa-solid fa-trash"></i> Sil
        </button>
      `;
    }

    actionBtn = `<div class="admin-app-actions action-buttons-row">${actionBtn}</div>`;

    // Appeal marker
    const appealMarker = app.appeal ? '<span class="badge badge-danger ml-2" style="font-size:0.65rem;">İTİRAZ</span>' : '';

    tr.innerHTML = `
      <td><strong>${applicantName}</strong> ${rankBadge}${appealMarker}</td>
      <td>${facultyName || '—'} / ${departmentName}</td>
      <td>${app.year}</td>
      <td>${catName}</td>
      <td><span class="text-primary font-weight-bold">${calculated}</span></td>
      <td><span class="text-success font-weight-bold">${approved}</span></td>
      <td><span class="badge ${badgeClass}">${statusText}</span></td>
      <td class="action-cell">${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-admin-evaluate').forEach(btn => {
    btn.addEventListener('click', () => evaluateApplicationAdmin(btn.dataset.id));
  });
  document.querySelectorAll('.btn-admin-delete-app').forEach(btn => {
    btn.addEventListener('click', () => deleteAdminApplication(btn.dataset.id));
  });
}

async function deleteAdminApplication(appId) {
  const app = adminApplications.find(a => a.id === appId);
  const applicantName = app ? getApplicationApplicantName(app) : 'Bu';
  const confirmed = window.confirm(`${applicantName} adlı başvuruyu kalıcı olarak silmek istediğinize emin misiniz?`);
  if (!confirmed) return;

  try {
    const res = await apiCall(`/api/admin/applications/${appId}`, 'DELETE');
    showToast(res.message, 'success');
    await loadAdminDashboard();
    if (isSystemAdminUser(currentUser)) {
      await loadSystemUsers();
    }
  } catch (err) {}
}

// Search and filters triggers
document.getElementById('admin-search').addEventListener('input', renderAdminApplicationsList);
document.getElementById('admin-filter-status').addEventListener('change', renderAdminApplicationsList);
document.getElementById('admin-filter-faculty').addEventListener('change', renderAdminApplicationsList);

document.getElementById('btn-back-to-admin-dashboard').addEventListener('click', () => {
  showView('admin-view');
});

// Admin Review detailed page
let activeEvaluatingAppId = null;

async function evaluateApplicationAdmin(appId) {
  activeEvaluatingAppId = appId;
  try {
    const apps = await apiCall('/api/admin/applications');
    const app = apps.find(a => a.id === appId);

    document.getElementById('admin-detail-badge').className = 'badge badge-warning';
    let statusTxt = 'Değerlendirmede';
    if (app.status === 'approved') { statusTxt = 'Onaylandı'; document.getElementById('admin-detail-badge').className = 'badge badge-success'; }
    if (app.status === 'rejected') { statusTxt = 'Reddedildi'; document.getElementById('admin-detail-badge').className = 'badge badge-danger'; }
    if (app.status === 'revision_requested') { statusTxt = 'Revizyon İstendi'; document.getElementById('admin-detail-badge').className = 'badge badge-warning'; }
    
    document.getElementById('admin-detail-badge').textContent = statusTxt;

    document.getElementById('detail-name').textContent = app.personalInfo.name;
    document.getElementById('detail-title').textContent = app.personalInfo.title;
    document.getElementById('detail-faculty').textContent = app.personalInfo.faculty;
    document.getElementById('detail-dept').textContent = app.personalInfo.department;
    document.getElementById('detail-year').textContent = app.year;
    
    const catName = allCategories[app.category] ? allCategories[app.category].name : app.category;
    document.getElementById('detail-category').textContent = catName;

    // Fill activities list
    const tbody = document.getElementById('detail-activities-list');
    tbody.innerHTML = '';
    
    app.activities.forEach(act => {
      if (act.count === 0) return;
      const tr = document.createElement('tr');
      const maxVal = act.maxScore > 0 ? act.maxScore.toFixed(1) : 'Limit Yok';
      tr.innerHTML = `
        <td>${act.label}</td>
        <td class="text-center">${act.baseScore}</td>
        <td class="text-center">${maxVal}</td>
        <td class="text-center font-weight-bold">${act.count}</td>
        <td class="text-center">${act.requiresRatio ? act.ratio.toFixed(2) : '—'}</td>
        <td class="text-right font-weight-bold text-primary">${act.calculatedScore.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Evidence documents
    const evidenceDiv = document.getElementById('detail-evidence-list');
    evidenceDiv.innerHTML = '';
    
    app.activities.filter(a => a.count > 0 && a.evidenceFile).forEach(act => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'doc-item mt-1';
      itemDiv.innerHTML = `
        <div class="doc-icon"><i class="fa-regular fa-file-image"></i></div>
        <div class="doc-details">
          <strong>Kanıt Belgesi</strong>
          <p style="color: var(--secondary-color); font-weight: 500;">${act.label}</p>
        </div>
        <a href="${act.evidenceFile.url}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-eye"></i> İncele</a>
      `;
      evidenceDiv.appendChild(itemDiv);
    });

    // Score calculations
    document.getElementById('detail-score-calculated').textContent = app.summary.totalScore.toFixed(2);
    document.getElementById('detail-score-approved').value = app.summary.approvedScore ? app.summary.approvedScore.toFixed(2) : app.summary.totalScore.toFixed(2);
    document.getElementById('detail-score-approved').disabled = false; // Admin can modify

    // Notes
    document.getElementById('admin-eval-notes').value = app.adminNotes || '';
    document.getElementById('admin-eval-notes').disabled = false; // Admin can edit

    // Show action buttons
    document.getElementById('admin-detail-view').querySelector('.action-buttons-vertical').classList.remove('hidden');

    // Appeal rendering
    const appealBox = document.getElementById('detail-appeal-box');
    const appealResponseGroup = document.getElementById('appeal-response-group');
    if (app.appeal) {
      appealBox.classList.remove('hidden');
      document.getElementById('detail-appeal-reasoning').textContent = app.appeal.reasoning;
      appealResponseGroup.style.display = 'block';
      document.getElementById('admin-appeal-response').value = app.appeal.adminResponse || '';
    } else {
      appealBox.classList.add('hidden');
      appealResponseGroup.style.display = 'none';
    }

    showView('admin-detail-view');

  } catch (err) {}
}

// Bind evaluate decision triggers
let clickedDecision = '';
document.querySelectorAll('#admin-evaluate-form button[type="submit"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    clickedDecision = btn.dataset.decision;
  });
});

document.getElementById('admin-evaluate-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const approvedScore = parseFloat(document.getElementById('detail-score-approved').value) || 0;
  const adminNotes = document.getElementById('admin-eval-notes').value;
  const appealResponse = document.getElementById('admin-appeal-response').value;

  if ((clickedDecision === 'rejected' || clickedDecision === 'revision_requested') && !adminNotes.trim()) {
    showToast('Red veya Revizyon kararları için Değerlendirme Notu yazılması zorunludur.', 'warning');
    return;
  }

  const payload = {
    status: clickedDecision,
    adminNotes,
    approvedScore,
    appealResponse
  };

  try {
    const res = await apiCall(`/api/admin/applications/${activeEvaluatingAppId}/evaluate`, 'POST', payload);
    showToast(res.message, 'success');
    showView('admin-view');
  } catch (err) {}
});

// Admin panel tabs switching
function switchAdminTab(tab) {
  const submissionsBtn = document.getElementById('btn-tab-submissions');
  const configBtn = document.getElementById('btn-tab-config');
  const usersBtn = document.getElementById('btn-tab-users');
  const submissionsPanel = document.getElementById('tab-submissions-content');
  const configPanel = document.getElementById('tab-config-content');
  const usersPanel = document.getElementById('tab-users-content');

  const tabs = [
    { id: 'submissions', btn: submissionsBtn, panel: submissionsPanel },
    { id: 'config', btn: configBtn, panel: configPanel },
    { id: 'users', btn: usersBtn, panel: usersPanel }
  ];

  tabs.forEach(({ id, btn, panel }) => {
    if (!btn || !panel) return;
    const isActive = id === tab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    panel.classList.toggle('hidden', !isActive);
  });

  if (tab === 'config') {
    loadAdminConfigEditor();
  }
  if (tab === 'users') {
    loadSystemUsers();
  }
}

document.getElementById('btn-tab-submissions').addEventListener('click', () => switchAdminTab('submissions'));
document.getElementById('btn-tab-config').addEventListener('click', () => switchAdminTab('config'));
document.getElementById('btn-tab-users').addEventListener('click', () => switchAdminTab('users'));

function getUserRoleLabel(user) {
  if (user.role === 'admin' && user.adminScope === 'system') return 'Sistem Yöneticisi';
  if (user.role === 'admin' && user.adminScope === 'faculty') return 'Fakülte Komisyonu';
  return 'Akademisyen';
}

function getUserRoleKey(user) {
  if (user.role === 'admin' && user.adminScope === 'system') return 'system_admin';
  if (user.role === 'admin' && user.adminScope === 'faculty') return 'faculty_admin';
  return 'academic';
}

async function loadSystemUsers() {
  if (!isSystemAdminUser(currentUser)) return;

  try {
    const data = await apiCall('/api/admin/system/users');
    adminUsers = data.users || [];
    adminUsersSummary = data.summary || null;
    renderSystemUsersSummary();
    renderSystemUsersList();
  } catch (err) {}
}

function renderSystemUsersSummary() {
  if (!adminUsersSummary) return;

  document.getElementById('stat-total-users').textContent = adminUsersSummary.totalUsers;
  document.getElementById('stat-academic-users').textContent = adminUsersSummary.academicUsers;
  document.getElementById('stat-faculty-admins').textContent = adminUsersSummary.facultyAdmins;
  document.getElementById('stat-all-applications').textContent = adminUsersSummary.totalApplications;
}

function renderSystemUsersList() {
  const tbody = document.getElementById('admin-users-list');
  if (!tbody) return;

  tbody.innerHTML = '';

  const query = document.getElementById('users-search').value.toLowerCase();
  const filterRole = document.getElementById('users-filter-role').value;
  const filterFaculty = document.getElementById('users-filter-faculty').value;

  const filtered = adminUsers.filter(user => {
    const roleKey = getUserRoleKey(user);
    const loginId = (user.loginId || user.email || user.username || '').toLowerCase();
    const name = (user.name || '').toLowerCase();
    const faculty = (user.faculty || '').toLowerCase();

    const matchesSearch = !query || name.includes(query) || loginId.includes(query) || faculty.includes(query);
    const matchesRole = filterRole === 'all' || roleKey === filterRole;
    const matchesFaculty = filterFaculty === 'all' || user.faculty === filterFaculty;

    return matchesSearch && matchesRole && matchesFaculty;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Arama kriterlerine uygun kullanıcı bulunamadı.</td></tr>';
    return;
  }

  filtered.sort((a, b) => {
    const roleOrder = { system_admin: 0, faculty_admin: 1, academic: 2 };
    const roleDiff = roleOrder[getUserRoleKey(a)] - roleOrder[getUserRoleKey(b)];
    if (roleDiff !== 0) return roleDiff;
    return (a.name || '').localeCompare(b.name || '', 'tr');
  });

  filtered.forEach(user => {
    const tr = document.createElement('tr');
    const roleKey = getUserRoleKey(user);
    const isSystemAccount = roleKey === 'system_admin';
    const isSelf = user.id === currentUser.id;
    const loginId = user.loginId || user.email || user.username || '—';
    const facultyInfo = user.faculty
      ? `${user.faculty}${user.department ? `<br><small class="text-muted">${user.department}</small>` : ''}`
      : '—';

    let actions = `
      <button type="button" class="btn btn-secondary btn-sm btn-user-edit" data-id="${user.id}" title="Düzenle">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button type="button" class="btn btn-warning btn-sm btn-user-reset-password" data-id="${user.id}" data-name="${user.name}" title="Şifre Sıfırla">
        <i class="fa-solid fa-key"></i>
      </button>
    `;

    if (!isSystemAccount && !isSelf) {
      actions += `
        <button type="button" class="btn btn-danger btn-sm btn-user-delete" data-id="${user.id}" data-name="${user.name}" title="Sil">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;
    }

    tr.innerHTML = `
      <td><strong>${user.title ? user.title + ' ' : ''}${user.name || '—'}</strong></td>
      <td><code>${loginId}</code></td>
      <td><span class="badge badge-role badge-role-${roleKey}">${getUserRoleLabel(user)}</span></td>
      <td>${facultyInfo}</td>
      <td>${user.applicationCount || 0}</td>
      <td class="user-actions action-cell"><div class="action-buttons-row">${actions}</div></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-user-edit').forEach(btn => {
    btn.addEventListener('click', () => openAdminUserModal(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-user-reset-password').forEach(btn => {
    btn.addEventListener('click', () => openAdminResetPasswordModal(btn.dataset.id, btn.dataset.name));
  });
  tbody.querySelectorAll('.btn-user-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteAdminUser(btn.dataset.id, btn.dataset.name));
  });
}

function updateAdminUserFormFields() {
  const role = document.getElementById('admin-user-role').value;
  const isEdit = Boolean(editingAdminUserId);
  const emailGroup = document.getElementById('admin-user-email-group');
  const usernameGroup = document.getElementById('admin-user-username-group');
  const titleGroup = document.getElementById('admin-user-title-group');
  const deptGroup = document.getElementById('admin-user-dept-group');
  const passwordGroup = document.getElementById('admin-user-password-group');
  const passwordInput = document.getElementById('admin-user-password');
  const emailInput = document.getElementById('admin-user-email');
  const usernameInput = document.getElementById('admin-user-username');
  const deptInput = document.getElementById('admin-user-dept');
  const nameInput = document.getElementById('admin-user-name');

  const isFacultyAdmin = role === 'faculty_admin';

  emailGroup.classList.toggle('hidden', isFacultyAdmin);
  usernameGroup.classList.toggle('hidden', !isFacultyAdmin);
  titleGroup.classList.toggle('hidden', isFacultyAdmin);
  deptGroup.classList.toggle('hidden', isFacultyAdmin);

  emailInput.required = !isFacultyAdmin;
  usernameInput.required = isFacultyAdmin;
  deptInput.required = !isFacultyAdmin;
  nameInput.required = !isFacultyAdmin;

  passwordGroup.classList.toggle('hidden', isEdit);
  passwordInput.required = !isEdit;

  if (isFacultyAdmin) {
    document.getElementById('admin-user-title').value = 'Komisyon';
    if (!isEdit || !nameInput.value.trim()) {
      const faculty = document.getElementById('admin-user-faculty').value;
      if (faculty) nameInput.value = `${faculty} Ödül Komisyonu`;
    }
  }
}

function openAdminUserModal(userId = null) {
  editingAdminUserId = userId;
  const modal = document.getElementById('admin-user-modal');
  const form = document.getElementById('admin-user-form');
  const titleEl = document.getElementById('admin-user-modal-title');
  const roleSelect = document.getElementById('admin-user-role');
  const facultySelect = document.getElementById('admin-user-faculty');
  const deptSelect = document.getElementById('admin-user-dept');

  form.reset();
  document.getElementById('admin-user-id').value = userId || '';
  populateFacultySelect(facultySelect);
  populateDepartmentSelect(deptSelect, '');
  document.getElementById('admin-user-email-group').classList.remove('hidden');
  document.getElementById('admin-user-username-group').classList.remove('hidden');
  document.getElementById('admin-user-dept-group').classList.remove('hidden');
  document.getElementById('admin-user-faculty').closest('.form-group').classList.remove('hidden');
  document.getElementById('admin-user-role-group').classList.remove('hidden');
  roleSelect.disabled = false;

  facultySelect.onchange = () => {
    populateDepartmentSelect(deptSelect, facultySelect.value);
    updateAdminUserFormFields();
  };

  if (userId) {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) return;

    titleEl.textContent = 'Kullanıcı Düzenle';
    document.getElementById('admin-user-name').value = user.name || '';

    if (user.role === 'admin' && user.adminScope === 'system') {
      document.getElementById('admin-user-role-group').classList.add('hidden');
      document.getElementById('admin-user-title').value = user.title || 'Sistem Yöneticisi';
      document.getElementById('admin-user-email-group').classList.add('hidden');
      document.getElementById('admin-user-username-group').classList.add('hidden');
      document.getElementById('admin-user-dept-group').classList.add('hidden');
      document.getElementById('admin-user-faculty').closest('.form-group').classList.add('hidden');
    } else if (user.role === 'admin' && user.adminScope === 'faculty') {
      roleSelect.value = 'faculty_admin';
      document.getElementById('admin-user-username').value = user.username || '';
    } else {
      roleSelect.value = 'academic';
      document.getElementById('admin-user-email').value = user.email || '';
      document.getElementById('admin-user-title').value = user.title || 'Doç. Dr.';
    }

    if (user.faculty && user.adminScope !== 'system') {
      facultySelect.value = user.faculty;
      populateDepartmentSelect(deptSelect, user.faculty);
      if (user.department) deptSelect.value = user.department;
    }
  } else {
    titleEl.textContent = 'Yeni Kullanıcı Ekle';
    roleSelect.disabled = false;
    roleSelect.value = 'academic';
  }

  updateAdminUserFormFields();
  modal.classList.remove('hidden');
}

function closeAdminUserModal() {
  editingAdminUserId = null;
  document.getElementById('admin-user-modal').classList.add('hidden');
  document.getElementById('admin-user-role').disabled = false;
  document.getElementById('admin-user-role-group').classList.remove('hidden');
}

function openAdminResetPasswordModal(userId, userName) {
  resettingAdminUserId = userId;
  document.getElementById('admin-reset-user-id').value = userId;
  document.getElementById('admin-reset-user-label').textContent = `${userName} hesabı için yeni şifre belirleyin.`;
  document.getElementById('admin-reset-password-form').reset();
  document.getElementById('admin-reset-password-modal').classList.remove('hidden');
}

function closeAdminResetPasswordModal() {
  resettingAdminUserId = null;
  document.getElementById('admin-reset-password-modal').classList.add('hidden');
}

async function deleteAdminUser(userId, userName) {
  const confirmed = window.confirm(`${userName} hesabını ve ilişkili tüm başvurularını silmek istediğinize emin misiniz?`);
  if (!confirmed) return;

  try {
    const res = await apiCall(`/api/admin/system/users/${userId}`, 'DELETE');
    showToast(res.message, 'success');
    await loadSystemUsers();
    adminApplications = await apiCall('/api/admin/applications');
    renderAdminApplicationsList();
    document.getElementById('stat-total-apps').textContent = adminApplications.length;
  } catch (err) {}
}

document.getElementById('btn-add-user').addEventListener('click', () => openAdminUserModal());
document.getElementById('btn-close-admin-user-modal').addEventListener('click', closeAdminUserModal);
document.getElementById('btn-cancel-admin-user').addEventListener('click', closeAdminUserModal);
document.getElementById('admin-user-role').addEventListener('change', updateAdminUserFormFields);

document.getElementById('admin-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const role = document.getElementById('admin-user-role').value;
  const payload = {
    name: document.getElementById('admin-user-name').value.trim(),
    faculty: document.getElementById('admin-user-faculty').value,
    department: document.getElementById('admin-user-dept').value,
    title: document.getElementById('admin-user-title').value
  };

  if (role === 'faculty_admin') {
    payload.role = 'admin';
    payload.username = document.getElementById('admin-user-username').value.trim();
  } else {
    payload.role = 'user';
    payload.email = document.getElementById('admin-user-email').value.trim();
  }

  const password = document.getElementById('admin-user-password').value;

  try {
    if (editingAdminUserId) {
      const res = await apiCall(`/api/admin/system/users/${editingAdminUserId}`, 'PUT', payload);
      showToast(res.message, 'success');
    } else {
      payload.password = password;
      const res = await apiCall('/api/admin/system/users', 'POST', payload);
      showToast(res.message, 'success');
    }
    closeAdminUserModal();
    await loadSystemUsers();
  } catch (err) {}
});

document.getElementById('btn-close-admin-reset-password').addEventListener('click', closeAdminResetPasswordModal);
document.getElementById('btn-cancel-admin-reset-password').addEventListener('click', closeAdminResetPasswordModal);

document.getElementById('admin-reset-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById('admin-reset-new-password').value;
  const confirmPassword = document.getElementById('admin-reset-confirm-password').value;

  if (newPassword !== confirmPassword) {
    showToast('Yeni şifreler eşleşmiyor.', 'error');
    return;
  }

  try {
    const res = await apiCall(`/api/admin/system/users/${resettingAdminUserId}/password`, 'PUT', { password: newPassword });
    showToast(res.message, 'success');
    closeAdminResetPasswordModal();
  } catch (err) {}
});

document.getElementById('users-search').addEventListener('input', renderSystemUsersList);
document.getElementById('users-filter-role').addEventListener('change', renderSystemUsersList);
document.getElementById('users-filter-faculty').addEventListener('change', renderSystemUsersList);

// System configurations editor
document.getElementById('admin-config-cat-select').addEventListener('change', loadAdminConfigEditor);

function loadAdminConfigEditor() {
  const catId = document.getElementById('admin-config-cat-select').value;
  const category = allCategories[catId];

  const tbody = document.getElementById('admin-config-items-list');
  tbody.innerHTML = '';

  category.items.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.dataset.itemId = item.id;
    tr.innerHTML = `
      <td>${item.label}</td>
      <td><input type="number" class="config-base form-control" step="0.5" value="${item.baseScore}" aria-label="${item.label} taban puanı"></td>
      <td><input type="number" class="config-max form-control" step="1" value="${item.maxScore}" aria-label="${item.label} maksimum puan sınırı"></td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById('admin-config-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const catId = document.getElementById('admin-config-cat-select').value;
  const category = allCategories[catId];

  const tbody = document.getElementById('admin-config-items-list');
  
  category.items.forEach(item => {
    const tr = tbody.querySelector(`tr[data-item-id="${item.id}"]`);
    if (!tr) return;
    
    const baseVal = parseFloat(tr.querySelector('.config-base').value) || 0;
    const maxVal = parseFloat(tr.querySelector('.config-max').value) || 0;
    
    item.baseScore = baseVal;
    item.maxScore = maxVal;
  });

  try {
    const res = await apiCall('/api/config/categories', 'PUT', { categories: allCategories });
    allCategories = res.categories;
    showToast(res.message, 'success');
  } catch (err) {}
});

// Run application on start
window.addEventListener('DOMContentLoaded', async () => {
  initFacultyDepartmentSelectors('reg-faculty', 'reg-dept');
  populateAdminFacultyFilter(document.getElementById('admin-filter-faculty'));
  populateAdminFacultyFilter(document.getElementById('users-filter-faculty'));
  await fetchConfig();
  checkAuth();
});
