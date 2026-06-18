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
let activeModal = null;
let lastFocusedElement = null;

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
    <span class="toast-message">${message}</span>
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

function getFocusableElements(container) {
  if (!container) return [];
  return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.classList.contains('hidden') && el.offsetParent !== null);
}

function focusViewHeading(viewId) {
  const targetView = document.getElementById(viewId);
  if (!targetView) return;

  const focusTarget = targetView.querySelector('input, select, textarea, button, a[href], h1, h2, h3');
  if (focusTarget) {
    if (!focusTarget.hasAttribute('tabindex') && /^H[1-6]$/.test(focusTarget.tagName)) {
      focusTarget.setAttribute('tabindex', '-1');
    }
    focusTarget.focus();
    return;
  }

  document.getElementById('main-content')?.focus();
}

function syncResponsiveTableLabels(root = document) {
  root.querySelectorAll('table.table-mobile-stack').forEach(table => {
    const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
    if (!headers.length) return;

    table.querySelectorAll('tbody tr').forEach(row => {
      [...row.children].forEach((cell, index) => {
        if (!(cell instanceof HTMLElement)) return;
        cell.setAttribute('data-label', headers[index] || headers[0] || '');
      });
    });
  });
}

function handleModalKeydown(event) {
  if (!activeModal) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal(activeModal.id);
    return;
  }

  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements(activeModal);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openModal(modalId, focusSelector = 'input, select, textarea, button') {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  activeModal = modal;
  document.addEventListener('keydown', handleModalKeydown);

  const focusTarget = modal.querySelector(focusSelector) || getFocusableElements(modal)[0];
  if (focusTarget) {
    focusTarget.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');

  if (activeModal?.id === modalId) {
    activeModal = null;
    document.removeEventListener('keydown', handleModalKeydown);
  }

  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
}

// SPA Router
function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.add('hidden');
    view.classList.remove('active');
    view.setAttribute('aria-hidden', 'true');
  });
  
  const targetView = document.getElementById(viewId);
  targetView.classList.remove('hidden');
  targetView.classList.add('active');
  targetView.setAttribute('aria-hidden', 'false');
  const isAuthView = viewId === 'login-view' || viewId === 'register-view' || viewId === 'verify-view';
  document.body.classList.toggle('login-screen-active', isAuthView);
  if (isAuthView) stopIdleWatcher();

  // Header display logic
  const header = document.getElementById('main-header');
  if (viewId === 'login-view' || viewId === 'register-view' || viewId === 'verify-view') {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
    // Update user badge
    if (currentUser) {
      document.getElementById('nav-user-info').innerHTML = `
        <i class="fa-solid fa-user" aria-hidden="true"></i> ${getNavUserLabel(currentUser)}
      `;
    }
  }

  // Load specific view data
  if (viewId === 'academic-view') {
    if (typeof showDashboardPanel === 'function') showDashboardPanel('info');
    loadAcademicianDashboard();
  } else if (viewId === 'admin-view') {
    loadAdminDashboard();
  } else if (viewId === 'register-view') {
    // Ensure faculty/department selects are populated and enabled when register view is shown
    try {
      const f = document.getElementById('reg-faculty');
      const d = document.getElementById('reg-dept');
      if (typeof populateFacultySelect === 'function' && f) populateFacultySelect(f);
      if (typeof populateDepartmentSelect === 'function' && d) populateDepartmentSelect(d, '', 'Seçiniz', true);
    } catch (err) {
      console.warn('Could not repopulate faculty/department selects on register view show', err);
    }
  }

  requestAnimationFrame(() => {
    syncResponsiveTableLabels(targetView);
    focusViewHeading(viewId);
  });
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
  startIdleWatcher();
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
  const login = document.getElementById('login-id').value.trim().toLocaleLowerCase('tr-TR');
  const password = document.getElementById('login-password').value;
  const isEmailLogin = login.includes('@');

  if (!login) {
    showToast(t('error_email_required'), 'error');
    return;
  }
  if (isEmailLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
    showToast(t('error_invalid_email'), 'error');
    return;
  }
  if (!password) {
    showToast(t('error_password_required'), 'error');
    return;
  }

  try {
    const data = await apiCall('/api/auth/login', 'POST', { login, email: login, username: login, password });
    localStorage.setItem('atosis_token', data.token);
    localStorage.setItem('atosis_user', JSON.stringify(data.user));

    currentToken = data.token;
    currentUser = data.user;

    showToast(t('toast_welcome', { title: getDisplayTitle(currentUser), name: currentUser.name }), 'success');

    // Refresh full user profile from server to ensure role/adminScope/faculty are populated
    try {
      const me = await apiCall('/api/auth/me');
      if (me && me.user) {
        currentUser = me.user;
        localStorage.setItem('atosis_user', JSON.stringify(currentUser));
      }
    } catch (err) {
      // If refresh fails, continue with provided user object
    }

    // Route based on refreshed user
    routeAuthenticatedUser();
  } catch (err) {
    // Error handled inside apiCall
  }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = document.getElementById('register-form');
  const firstName = document.getElementById('reg-firstname') ? document.getElementById('reg-firstname').value.trim() : '';
  const lastName = document.getElementById('reg-lastname') ? document.getElementById('reg-lastname').value.trim() : '';
  const name = `${firstName} ${lastName}`.trim();
  const email = document.getElementById('reg-email').value.trim();
  const title = document.getElementById('reg-title').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-password-confirm') ? document.getElementById('reg-password-confirm').value : '';
  const faculty = document.getElementById('reg-faculty').value;
  const department = document.getElementById('reg-dept').value;

  if (!form.checkValidity()) {
    showToast(t('error_form_invalid'), 'error');
    return;
  }

  if (password.length < 6) {
    showToast(t('error_password_too_short'), 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast(t('error_passwords_mismatch'), 'error');
    return;
  }

  if (!/^[^\s@]+@aybu\.edu\.tr$/i.test(email)) {
    showToast(t('error_email_domain'), 'error');
    return;
  }

  if (!faculty || !department) {
    showToast(t('error_faculty_dept_required'), 'error');
    return;
  }

  const validDepartments = getDepartmentsForFaculty(faculty);
  if (!validDepartments.includes(department)) {
    showToast(t('error_dept_mismatch'), 'error');
    return;
  }

  try {
    const res = await apiCall('/api/auth/register', 'POST', { name, email, title, password, faculty, department });
    if (res.verificationRequired === false) {
      showToast(res.message || t('toast_reg_success'), 'success');
      setTimeout(() => showView('login-view'), 1500);
      return;
    }
    pendingVerificationEmail = email;
    showToast(t('toast_verification_sent'), 'success');
    showView('verify-view');
  } catch (err) {}
});

let pendingVerificationEmail = '';

document.getElementById('verify-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const code = document.getElementById('verify-code').value.trim();

  if (!pendingVerificationEmail) {
    showToast(t('error_verify_no_email'), 'error');
    showView('register-view');
    return;
  }

  try {
    await apiCall('/api/auth/register/verify', 'POST', { email: pendingVerificationEmail, code });
    showToast(t('toast_reg_success'), 'success');
    pendingVerificationEmail = '';
    setTimeout(() => showView('login-view'), 1500);
  } catch (err) {}
});

document.getElementById('link-resend-code').addEventListener('click', async (e) => {
  e.preventDefault();
  if (!pendingVerificationEmail) {
    showToast(t('error_verify_no_email'), 'error');
    showView('register-view');
    return;
  }
  try {
    await apiCall('/api/auth/register/resend', 'POST', { email: pendingVerificationEmail });
    showToast(t('toast_verification_resent'), 'success');
  } catch (err) {}
});

document.getElementById('link-back-to-register').addEventListener('click', (e) => {
  e.preventDefault();
  showView('register-view');
});



document.getElementById('btn-logout').addEventListener('click', () => {
  performLogout(t('toast_logout'));
});

// ── Idle Session Timeout ──────────────────────────────────────────────────────
const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 dakika hareketsizlik
const IDLE_WARNING_MS = 60;             // uyarı süresi (saniye)

let idleTimer = null;
let countdownTimer = null;
let idleWarningActive = false;

function performLogout(message) {
  if (!message) message = t('toast_logout');
  clearIdleTimers();
  localStorage.removeItem('atosis_token');
  localStorage.removeItem('atosis_user');
  currentToken = null;
  currentUser = null;
  currentEditingApp = null;
  hideIdleModal();
  showToast(message, 'success');
  showView('login-view');
}

function clearIdleTimers() {
  clearTimeout(idleTimer);
  clearInterval(countdownTimer);
  idleTimer = null;
  countdownTimer = null;
}

function resetIdleTimer() {
  if (!currentToken) return; // oturum yoksa çalışma
  if (idleWarningActive) return; // uyarı açıkken sıfırlama
  clearTimeout(idleTimer);
  idleTimer = setTimeout(showIdleWarning, IDLE_TIMEOUT_MS);
}

function showIdleWarning() {
  if (!currentToken) return;
  idleWarningActive = true;

  let remaining = IDLE_WARNING_MS;
  const labelEl = document.getElementById('idle-countdown-label');
  if (labelEl) labelEl.textContent = t('idle_countdown_label', { n: remaining });

  const modal = document.getElementById('idle-timeout-modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  // Geri sayım başlat
  countdownTimer = setInterval(() => {
    remaining -= 1;
    const el = document.getElementById('idle-countdown-label');
    if (el) el.textContent = t('idle_countdown_label', { n: remaining });

    if (remaining <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      performLogout(t('toast_idle_logout'));
    }
  }, 1000);

  // Odağı "Devam Et" butonuna ver
  setTimeout(() => document.getElementById('btn-idle-stay')?.focus(), 50);
}

function hideIdleModal() {
  idleWarningActive = false;
  const modal = document.getElementById('idle-timeout-modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

// "Devam Et" → uyarıyı kapat ve zamanlayıcıyı sıfırla
document.getElementById('btn-idle-stay').addEventListener('click', () => {
  clearInterval(countdownTimer);
  countdownTimer = null;
  hideIdleModal();
  resetIdleTimer();
});

// "Oturumu Kapat" → hemen çıkış
document.getElementById('btn-idle-logout').addEventListener('click', () => {
  clearInterval(countdownTimer);
  countdownTimer = null;
  performLogout(t('toast_logout'));
});

// Kullanıcı aktivite olaylarını dinle
['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
  document.addEventListener(evt, resetIdleTimer, { passive: true });
});

// Odak halkası: yalnızca klavye navigasyonunda göster, mouse tıklamasında gizle
document.addEventListener('mousedown', () => document.body.classList.add('using-mouse'));
document.addEventListener('touchstart', () => document.body.classList.add('using-mouse'), { passive: true });
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.remove('using-mouse'); });

// Oturum başlayınca zamanlayıcıyı başlat; kapanınca durdur
function startIdleWatcher() {
  idleWarningActive = false;
  clearIdleTimers();
  resetIdleTimer();
}

function stopIdleWatcher() {
  clearIdleTimers();
  idleWarningActive = false;
  hideIdleModal();
}
// ─────────────────────────────────────────────────────────────────────────────

function openPasswordModal() {
  document.getElementById('password-form').reset();
  openModal('password-view', '#current-password');
}

function closePasswordModal() {
  closeModal('password-view');
}

document.getElementById('btn-katki-orani-help').addEventListener('click', () => openModal('katki-orani-modal', '#btn-close-katki-modal'));
document.getElementById('btn-close-katki-modal').addEventListener('click', () => closeModal('katki-orani-modal'));

document.getElementById('btn-close-arastirma-ay-modal').addEventListener('click', () => closeModal('arastirma-ay-modal'));

// Multi-month +/- buttons — tek seferlik delegasyon (loadCalculatorGrid içinde tekrar eklenmez)
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-add-month')) {
    const container = e.target.closest('.multimonth-container');
    if (!container) return;
    const tr = e.target.closest('tr');
    const act = applicationActivities.find(a => a.activityId === tr?.dataset?.itemId);
    const entry = document.createElement('div');
    entry.className = 'multimonth-entry';
    entry.innerHTML = `<input type="number" class="input-month" min="0" step="1" value="0" aria-label="${t('aria_research_months_input')}">
      <button type="button" class="btn-remove-month" title="${t('btn_remove_month_title')}" aria-label="${t('btn_remove_month_aria')}">&times;</button>`;
    entry.querySelector('.input-month').addEventListener('input', calculateTotalScore);
    container.appendChild(entry);
    entry.querySelector('.input-month').focus();
  } else if (e.target.classList.contains('btn-remove-month')) {
    const entry = e.target.closest('.multimonth-entry');
    if (!entry) return;
    entry.remove();
    calculateTotalScore();
  }
});

// Delegation for dynamically rendered help buttons in calculator rows
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.btn-row-help');
  if (!btn) return;
  const modalId = btn.dataset.modal;
  if (modalId) openModal(modalId, `#btn-close-${modalId.replace('-modal', '')}-modal`);
});

document.getElementById('btn-change-password').addEventListener('click', openPasswordModal);
document.getElementById('btn-close-password-modal').addEventListener('click', closePasswordModal);
document.getElementById('btn-cancel-password').addEventListener('click', closePasswordModal);

document.getElementById('password-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    showToast(t('error_new_passwords_mismatch'), 'error');
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
  const toggleButton = document.getElementById('login-password-toggle');
  const toggleIcon = toggleButton.querySelector('i');
  const isPassword = passwordInput.type === 'password';

  passwordInput.type = isPassword ? 'text' : 'password';
  toggleIcon.classList.toggle('fa-eye', !isPassword);
  toggleIcon.classList.toggle('fa-eye-slash', isPassword);
  toggleButton.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
  toggleButton.setAttribute('aria-label', isPassword ? t('btn_password_hide') : t('btn_password_show'));
});

// ----------------------------------------------------
// ACADEMICIAN CONTROLLERS
// ----------------------------------------------------
async function loadAcademicianDashboard() {
  // Populate Sidebar
  document.getElementById('user-profile-title').textContent = currentUser.title || '';
  document.getElementById('user-profile-name').textContent = currentUser.name || '';
  // For system administrators, do not show faculty/department (they are not attached to a unit)
  document.getElementById('user-profile-title-dept').textContent = isSystemAdminUser(currentUser) ? '' : (currentUser.department || '');
  document.getElementById('user-profile-faculty').textContent = isSystemAdminUser(currentUser) ? '' : (currentUser.faculty || '');

  try {
    const apps = await apiCall('/api/applications/my');
    currentUserApplications = apps;
    const tbody = document.getElementById('my-applications-list');
    const newApplicationButton = document.getElementById('btn-sidebar-new-app');
    tbody.innerHTML = '';

    if (apps.length > 0) {
      newApplicationButton.dataset.blocked = 'true';
      newApplicationButton.title = t('new_app_blocked_title');
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

    const rowsHtml = apps.map(app => {
      const badgeClass = app.status === 'submitted' ? 'badge-info'
        : app.status === 'in_review' ? 'badge-warning'
        : app.status === 'approved' ? 'badge-success'
        : app.status === 'rejected' ? 'badge-danger'
        : app.status === 'revision_requested' ? 'badge-warning'
        : 'badge-draft';

      const statusText = app.status === 'submitted' ? t('status_submitted')
        : app.status === 'in_review' ? t('status_in_review')
        : app.status === 'approved' ? t('status_approved')
        : app.status === 'rejected' ? t('status_rejected')
        : app.status === 'revision_requested' ? t('status_revision_required')
        : t('status_draft');

      const total = app.summary.totalScore ? app.summary.totalScore.toFixed(2) : '0.00';
      const approved = app.summary.approvedScore ? app.summary.approvedScore.toFixed(2) : '—';
      const catName = allCategories[app.category] ? allCategories[app.category].name.split(':')[0] : app.category;

      let actionButtons = '';
      if (app.status === 'draft' || app.status === 'revision_requested') {
        actionButtons = `
          <button type="button" class="btn btn-primary btn-sm btn-edit-app" data-id="${app.id}">
            <i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Düzenle
          </button>
        `;
      } else {
        actionButtons = `
          <button type="button" class="btn btn-secondary btn-sm btn-view-app" data-id="${app.id}">
            <i class="fa-solid fa-eye" aria-hidden="true"></i> Görüntüle
          </button>
        `;
      }

      if (app.status === 'rejected' && !app.appeal) {
        actionButtons += `
          <button type="button" class="btn btn-warning btn-sm btn-appeal-app" data-id="${app.id}">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${t('btn_appeal_app')}
          </button>
        `;
      }

      actionButtons += `
        <button type="button" class="btn btn-danger btn-sm btn-delete-app" data-id="${app.id}">
          <i class="fa-solid fa-trash" aria-hidden="true"></i> ${t('btn_delete_app')}
        </button>
      `;

      return `
        <tr>
          <th scope="row"><strong>${app.year}</strong></th>
          <td>${catName}</td>
          <td><span class="text-primary font-weight-bold">${total}</span></td>
          <td><span class="text-success font-weight-bold">${approved}</span></td>
          <td>${new Date(app.updatedAt).toLocaleDateString('tr-TR')}</td>
          <td><span class="badge ${badgeClass}">${statusText}</span></td>
          <td class="action-cell"><div class="action-buttons-row">${actionButtons}</div></td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rowsHtml;
    syncResponsiveTableLabels(document.getElementById('academic-view'));
  } catch (err) {}
}

document.getElementById('my-applications-list')?.addEventListener('click', handleMyApplicationsTableClick);

function handleMyApplicationsTableClick(event) {
  const button = event.target.closest('button');
  if (!button || !button.dataset.id) return;

  if (button.classList.contains('btn-edit-app')) {
    initApplicationForm(button.dataset.id);
  } else if (button.classList.contains('btn-view-app')) {
    viewApplicationDetails(button.dataset.id);
  } else if (button.classList.contains('btn-appeal-app')) {
    openAppealModal(button.dataset.id);
  } else if (button.classList.contains('btn-delete-app')) {
    deleteOwnApplication(button.dataset.id);
  }
}

// Switches between the "Genel Bakış" (info guide) panel and the "Başvurularım" (applications) panel
function showDashboardPanel(panel) {
  document.getElementById('dashboard-info-guide').classList.toggle('hidden', panel !== 'info');
  document.getElementById('dashboard-applications-section').classList.toggle('hidden', panel !== 'applications');
  document.getElementById('btn-sidebar-dashboard').classList.toggle('active', panel === 'info');
  document.getElementById('btn-sidebar-my-apps').classList.toggle('active', panel === 'applications');
}

document.getElementById('btn-sidebar-dashboard').addEventListener('click', () => {
  showView('academic-view');
  showDashboardPanel('info');
});

document.getElementById('btn-back-to-info-from-apps').addEventListener('click', () => {
  showDashboardPanel('info');
});

document.getElementById('btn-sidebar-new-app').addEventListener('click', () => {
  if (currentUserApplications.length > 0) {
    showToast(t('toast_blocked_new_app'), 'warning');
    return;
  }
  initApplicationForm();
});

// Show user's applications in a dedicated panel and focus the applications table
document.getElementById('btn-sidebar-my-apps').addEventListener('click', () => {
  // If not on academic view, show it first (which will load applications)
  if (!document.getElementById('academic-view').classList.contains('active')) {
    showView('academic-view');
  }
  showDashboardPanel('applications');

  loadAcademicianDashboard().then(() => {
    const table = document.getElementById('my-applications-table');
    if (table) {
      table.classList.remove('hidden');
      document.getElementById('no-applications-msg')?.classList.add('hidden');
      table.focus();
      table.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }).catch(() => {
    showToast(t('error_apps_load_failed'), 'error');
  });
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
  toggleApplicationRevisionNote();
  
  document.getElementById('app-form-title').textContent = appId ? t('app_form_title_edit') : t('app_form_title_new');
  document.getElementById('app-category-select').disabled = false;
  document.getElementById('app-year').disabled = false;

  if (appId) {
    // Load existing application
    apiCall(`/api/applications/my/${appId}`).then(app => {
      currentEditingApp = app;
      toggleApplicationRevisionNote(app);
      document.getElementById('app-year').value = app.year;
      document.getElementById('app-category-select').value = app.category;
      document.getElementById('app-category-select').disabled = true;
      document.getElementById('app-year').disabled = true;
      document.getElementById('app-category-select').dispatchEvent(new Event('change'));

      // Mevcut başvuru düzenlenirken onay kutuları önceden kabul edilmiştir
      categoryInfoAckCheckbox.checked = true;
      avesisAckCheckbox.checked = true;
      updateStep1NextState();

      goToStep(1);
      showView('application-form-view');
    });
  } else {
    toggleApplicationRevisionNote();
    document.getElementById('app-category-select').value = '';
    document.getElementById('app-year').value = '2025';
    document.getElementById('app-category-select').dispatchEvent(new Event('change'));
    goToStep(1);
    showView('application-form-view');
  }
}

function toggleApplicationRevisionNote(app = null) {
  const revisionNoteBox = document.getElementById('application-revision-note');
  const revisionNoteText = document.getElementById('application-revision-note-text');

  if (app && app.status === 'revision_requested') {
    revisionNoteText.textContent = app.adminNotes || t('revision_note_default');
    revisionNoteBox.classList.remove('hidden');
    return;
  }

  revisionNoteText.textContent = '';
  revisionNoteBox.classList.add('hidden');
}

async function deleteOwnApplication(appId) {
  const confirmed = window.confirm(t('confirm_delete_own_app'));
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

  // Show inline back button only on step 1 and hide header back button there
  const inlineBack = document.getElementById('btn-back-to-dashboard-inline');
  const headerBack = document.getElementById('btn-back-to-dashboard');
  if (inlineBack && headerBack) {
    if (stepNum === 1) {
      inlineBack.classList.remove('hidden');
      headerBack.classList.add('hidden');
    } else {
      inlineBack.classList.add('hidden');
      headerBack.classList.remove('hidden');
    }
  }

  if (stepNum === 2) {
    loadCalculatorGrid();
  } else if (stepNum === 3) {
    initTeşvikQuestion();
  }

  requestAnimationFrame(() => {
    syncResponsiveTableLabels(document.getElementById(`step-${stepNum}-content`));
    focusViewHeading(`step-${stepNum}-content`);
  });
}

// Next/Prev binds
const btnStep1Next = document.getElementById('btn-step1-next');
const categorySelect = document.getElementById('app-category-select');

// Disable next button by default until category is selected and info is acknowledged
btnStep1Next.disabled = true;

// Maps application category select values to the matching row id in the info guide table
const CATEGORY_INFO_ROW_IDS = {
  kat1: 'info-row-kat1',
  kat2: 'info-row-kat2',
  kat3: 'info-row-kat3',
  kat4: 'info-row-kat4'
};

const categoryInfoInline = document.getElementById('category-info-inline');
const categoryInfoAckCheckbox = document.getElementById('category-info-ack-checkbox');
const avesisAckCheckbox = document.getElementById('avesis-ack-checkbox');

function updateStep1NextState() {
  const allChecked = categorySelect.value && categoryInfoAckCheckbox.checked && avesisAckCheckbox.checked;
  btnStep1Next.disabled = !allChecked;
  btnStep1Next.title = !categorySelect.value
    ? t('tooltip_select_category')
    : (!categoryInfoAckCheckbox.checked ? t('tooltip_ack_category_info')
    : (!avesisAckCheckbox.checked ? t('tooltip_ack_avesis') : t('tooltip_next_step')));
}

// Show category info inline and require acknowledgement before allowing the next step
categorySelect.addEventListener('change', () => {
  const catId = categorySelect.value;
  const rowId = CATEGORY_INFO_ROW_IDS[catId];
  const sourceRow = rowId ? document.getElementById(rowId) : null;
  const container = document.getElementById('category-info-inline-content');

  categoryInfoAckCheckbox.checked = false;
  avesisAckCheckbox.checked = false;

  if (sourceRow) {
    const clonedRow = sourceRow.cloneNode(true);
    clonedRow.removeAttribute('id');
    container.innerHTML = '<table class="table"><tbody></tbody></table>';
    container.querySelector('tbody').appendChild(clonedRow);
    categoryInfoInline.classList.remove('hidden');
    requestAnimationFrame(() => {
      categoryInfoInline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    categoryInfoInline.classList.add('hidden');
  }

  updateStep1NextState();
});

categoryInfoAckCheckbox.addEventListener('change', updateStep1NextState);
avesisAckCheckbox.addEventListener('change', updateStep1NextState);

btnStep1Next.addEventListener('click', () => {
  const cat = categorySelect.value;
  if (!cat) {
    showToast(t('error_category_required'), 'warning');
    return;
  }
  if (!categoryInfoAckCheckbox.checked) {
    showToast(t('error_category_ack_required'), 'warning');
    return;
  }
  goToStep(2);
});

// Inline back button in step 1 shares behavior with header back button
document.getElementById('btn-back-to-dashboard-inline')?.addEventListener('click', () => {
  showView('academic-view');
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
    // backward compat: evidenceFile (single) → evidenceFiles (array)
    let initialEvidenceFiles = savedAct ? (savedAct.evidenceFiles || (savedAct.evidenceFile ? [savedAct.evidenceFile] : [])) : [];
    const initialMonths = savedAct ? (savedAct.months || (initialCount > 0 && item.isMultiMonth ? [initialCount] : [])) : [];

    applicationActivities.push({
      activityId: item.id,
      label: item.label,
      baseScore: item.baseScore,
      maxScore: item.maxScore,
      requiresRatio: item.requiresRatio,
      hasFormulaCap: item.hasFormulaCap,
      isMultiMonth: !!item.isMultiMonth,
      unit: item.unit || t('unit_item'),
      count: initialCount,
      months: initialMonths,
      ratio: initialRatio,
      evidenceFiles: initialEvidenceFiles
    });

    const tr = document.createElement('tr');
    tr.dataset.itemId = item.id;

    const maxText = item.maxScore > 0 ? item.maxScore.toFixed(1) : t('max_text_no_limit');
    const ratioCellHtml = item.requiresRatio
      ? `<td class="td-input"><input type="number" class="input-ratio" step="0.01" min="0.01" max="1.00" value="${initialRatio.toFixed(2)}" aria-label="${t('aria_ratio_input', { label: item.label })}"></td>`
      : `<td class="hidden"></td>`;

    let countCellHtml;
    const unit = item.unit || t('unit_item');
    if (item.isMultiMonth) {
      countCellHtml = `<td class="td-input td-multimonth">
        <div class="multimonth-container">
          <div class="multimonth-entry">
            <input type="number" class="input-month" min="0" step="1" value="${initialCount}" aria-label="${t('aria_month_input', { label: item.label })}">
            <button type="button" class="btn-add-month" title="${t('btn_add_month_title')}" aria-label="${t('btn_add_month_aria')}">+</button>
          </div>
        </div>
      </td>`;
    } else {
      countCellHtml = `<td class="td-input"><input type="number" class="input-count" min="0" step="1" value="${initialCount}" aria-label="${t('aria_count_input', { label: item.label, unit })}"></td>`;
    }

    const helpBtn = item.isMultiMonth
      ? ` <button type="button" class="btn-row-help" data-modal="arastirma-ay-modal" aria-label="${t('th_ratio_help_aria')}" title="${t('th_ratio_help_title')}"><i class="fa-solid fa-circle-question" aria-hidden="true"></i></button>`
      : '';

    tr.innerHTML = `
      <th scope="row">${item.label}${helpBtn}</th>
      <td class="text-center font-weight-bold">${item.baseScore.toFixed(1)}</td>
      <td class="text-center text-muted">${maxText}</td>
      ${countCellHtml}
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
    <td colspan="${colSpanCount}" class="text-right">${t('calc_grand_total_label')}</td>
    <td class="text-right" id="calculator-grand-total">0.00</td>
  `;
  tbody.appendChild(totalTr);

  // Bind change calculations
  tbody.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateTotalScore);
  });

  // Run initial calculation
  calculateTotalScore();
  syncResponsiveTableLabels(document.getElementById('step-2-content'));
}

function calculateTotalScore() {
  const tbody = document.getElementById('calculator-table-body');
  let grandTotal = 0;

  applicationActivities.forEach(act => {
    const tr = tbody.querySelector(`tr[data-item-id="${act.activityId}"]`);
    if (!tr) return;

    const ratioInput = tr.querySelector('.input-ratio');

    let count;
    if (act.isMultiMonth) {
      const monthInputs = tr.querySelectorAll('.input-month');
      const monthVals = [...monthInputs].map(inp => Math.max(0, parseFloat(inp.value) || 0));
      act.months = monthVals;
      count = monthVals.reduce((sum, v) => sum + v, 0);
    } else {
      const countInput = tr.querySelector('.input-count');
      count = Math.max(0, parseFloat(countInput.value) || 0);
    }
    const ratio = act.requiresRatio ? Math.min(1.0, Math.max(0.01, parseFloat(ratioInput.value) || 0)) : 1.0;

    act.count = count;
    act.ratio = ratio;

    let score = act.baseScore * count * ratio;

    // Always cap at the defined max score for this entry type (Maks Puan column), regardless of count entered
    if (act.maxScore > 0 && score > act.maxScore) {
      score = act.maxScore;
    }

    act.calculatedScore = score;
    grandTotal += score;

    // Update row cell
    tr.querySelector('.live-row-score').textContent = score.toFixed(2);
  });

  document.getElementById('calculator-grand-total').textContent = grandTotal.toFixed(2);
  document.getElementById('live-total-score').textContent = grandTotal.toFixed(2);
  updateSubmitButtonState();
}

function updateSubmitButtonState() {
  const submitBtn = document.getElementById('btn-submit-application');
  if (!submitBtn) return;

  const answered = document.querySelector('input[name="teşvik-applied"]:checked');
  if (!answered) {
    submitBtn.disabled = true;
    submitBtn.title = t('btn_submit_title_no_tesvik');
    return;
  }

  // Kanıt zorunlu olan faaliyetler: missingTeşvikProofIds içindekiler
  const missingEvidence = applicationActivities.some(act => {
    if (!missingTeşvikProofIds.has(act.activityId)) return false;
    const files = act.evidenceFiles || [];
    const slotCount = act.isMultiMonth
      ? (act.months ? act.months.filter(m => m > 0).length : 1)
      : Math.max(1, Math.floor(act.count));
    for (let i = 0; i < slotCount; i++) {
      if (!files[i]) return true;
    }
    return false;
  });

  if (missingEvidence) {
    submitBtn.disabled = true;
    submitBtn.title = t('btn_submit_title_missing_evidence');
  } else {
    submitBtn.disabled = false;
    submitBtn.title = t('btn_submit_title_ready');
  }
}

// ----------------------------------------------------
// EVIDENCE UPLOADS & FORMS MANAGEMENT
// ----------------------------------------------------

// IDs of activities the user says they didn't submit proof for in Akademik Teşvik
let missingTeşvikProofIds = new Set();

function initTeşvikQuestion() {
  const yesRadio = document.getElementById('teşvik-yes');
  const noRadio  = document.getElementById('teşvik-no');
  // Reset state
  yesRadio.checked = false;
  noRadio.checked  = false;
  missingTeşvikProofIds = new Set();
  document.getElementById('evidence-upload-section').classList.add('hidden');
  document.getElementById('teşvik-activity-checklist').classList.add('hidden');
  document.getElementById('dynamic-evidence-uploaders').innerHTML = '';

  [yesRadio, noRadio].forEach(r => r.addEventListener('change', onTeşvikAnswerChange));
}

function onTeşvikAnswerChange() {
  const val = document.querySelector('input[name="teşvik-applied"]:checked')?.value;
  const uploadSection   = document.getElementById('evidence-upload-section');
  const checklist       = document.getElementById('teşvik-activity-checklist');
  const helpText        = document.getElementById('evidence-help-text');
  const activeActs      = applicationActivities.filter(a => a.count > 0);

  uploadSection.classList.remove('hidden');
  missingTeşvikProofIds = new Set();

  if (val === 'no') {
    // Tüm faaliyetler için kanıt zorunlu
    helpText.textContent = t('evidence_help_text_no');
    checklist.classList.add('hidden');
    activeActs.forEach(a => missingTeşvikProofIds.add(a.activityId));
    loadEvidenceUploaders();
  } else {
    // Hangi faaliyetler için kanıt ibraz edilmedi?
    helpText.textContent = t('evidence_help_text_yes');
    checklist.classList.remove('hidden');

    const listDiv = document.getElementById('teşvik-checklist-items');
    listDiv.innerHTML = '';
    if (activeActs.length === 0) {
      listDiv.innerHTML = '<p class="text-muted">Girilmiş faaliyet bulunamadı.</p>';
      return;
    }
    activeActs.forEach(act => {
      const label = document.createElement('label');
      label.style.cssText = 'display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem; cursor:pointer;';
      const dispCount = act.isMultiMonth
        ? `${(act.months || []).filter(m => m > 0).length} araştırma`
        : `${Math.floor(act.count)} ${act.unit || 'adet'}`;
      label.innerHTML = `<input type="checkbox" data-act-id="${act.activityId}" style="width:16px;height:16px;"> ${act.label} (${dispCount})`;
      listDiv.appendChild(label);

      label.querySelector('input').addEventListener('change', e => {
        if (e.target.checked) missingTeşvikProofIds.add(act.activityId);
        else missingTeşvikProofIds.delete(act.activityId);
        loadEvidenceUploaders();
      });
    });
    loadEvidenceUploaders(); // başta boş göster
  }
}

function loadEvidenceUploaders() {
  const container = document.getElementById('dynamic-evidence-uploaders');
  container.innerHTML = '';

  const val = document.querySelector('input[name="teşvik-applied"]:checked')?.value;
  const activeActs = applicationActivities.filter(act => act.count > 0);

  if (activeActs.length === 0) {
    container.innerHTML = `<div class="alert alert-warning"><i class="fa-solid fa-circle-exclamation"></i> ${t('evidence_no_activities_msg')}</div>`;
    updateSubmitButtonState();
    return;
  }

  // Hangi faaliyetler için yükleyici gösterilecek
  const uploaderActs = val === 'no'
    ? activeActs
    : activeActs.filter(a => missingTeşvikProofIds.has(a.activityId));

  if (val === 'yes' && uploaderActs.length === 0) {
    container.innerHTML = `<div class="alert alert-info"><i class="fa-solid fa-circle-check"></i> ${t('evidence_all_covered_msg')}</div>`;
    updateSubmitButtonState();
    return;
  }

  uploaderActs.forEach(act => {
    const slotCount = act.isMultiMonth
      ? (act.months ? act.months.filter(m => m > 0).length : 1)
      : Math.max(1, Math.floor(act.count));

    // ensure evidenceFiles array is correct length
    if (!Array.isArray(act.evidenceFiles)) act.evidenceFiles = [];
    while (act.evidenceFiles.length < slotCount) act.evidenceFiles.push(null);

    const unitLabel = act.isMultiMonth ? t('unit_research') : (act.unit || t('unit_item'));
    const countLabel = act.isMultiMonth
      ? `${slotCount} ${unitLabel}`
      : `${slotCount} ${unitLabel}`;

    const actBlock = document.createElement('div');
    actBlock.className = 'evidence-activity-block';
    actBlock.innerHTML = `<div class="activity-label">${act.label} <span class="evidence-count-badge">(${countLabel})</span></div>`;

    for (let i = 0; i < slotCount; i++) {
      const slotLabel = slotCount > 1
        ? (act.isMultiMonth ? `${t('unit_research')} ${i + 1}${act.months[i] > 0 ? ' (' + act.months[i] + ' ay)' : ''}` : `${i + 1}. ${unitLabel}`)
        : '';

      const div = document.createElement('div');
      div.className = 'evidence-row-uploader';
      div.dataset.itemId = act.activityId;
      div.dataset.slotIndex = i;

      const file = act.evidenceFiles[i];
      let uploadStateHtml = '';
      if (file) {
        uploadStateHtml = `
          <div class="uploaded-file-info">
            <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
            <span class="filename">${file.name}</span>
            <button type="button" class="btn-remove-evidence btn-remove-file" aria-label="Dosyayı kaldır">
              <i class="fa-solid fa-times" aria-hidden="true"></i>
            </button>
          </div>`;
      } else {
        uploadStateHtml = `
          <button type="button" class="btn btn-secondary btn-sm btn-trigger-upload-evidence" aria-label="${act.label} kanıt yükle">
            <i class="fa-solid fa-upload" aria-hidden="true"></i> Dosya Yükle
          </button>
          <span class="text-muted upload-status-text">Yüklenmedi (PDF/Görsel)</span>`;
      }

      div.innerHTML = `
        ${slotLabel ? `<span class="evidence-slot-label">${slotLabel}</span>` : ''}
        <div class="upload-actions">
          ${uploadStateHtml}
          <input type="file" class="visually-hidden input-evidence-file-field" accept=".pdf,image/*">
        </div>
      `;

      actBlock.appendChild(div);

      const fileInput = div.querySelector('.input-evidence-file-field');
      const triggerBtn = div.querySelector('.btn-trigger-upload-evidence');
      const removeBtn = div.querySelector('.btn-remove-evidence');

      if (triggerBtn) triggerBtn.addEventListener('click', () => fileInput.click());
      if (fileInput) fileInput.addEventListener('change', (e) => uploadEvidenceFile(e, act.activityId, i));
      if (removeBtn) removeBtn.addEventListener('click', () => {
        act.evidenceFiles[i] = null;
        loadEvidenceUploaders();
      });
    }

    container.appendChild(actBlock);
  });

  syncResponsiveTableLabels(document.getElementById('step-3-content'));
  updateSubmitButtonState();
}

async function uploadEvidenceFile(e, activityId, slotIndex) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const data = await apiCall('/api/upload', 'POST', formData, true);
    const act = applicationActivities.find(a => a.activityId === activityId);
    if (act) {
      if (!Array.isArray(act.evidenceFiles)) act.evidenceFiles = [];
      act.evidenceFiles[slotIndex] = { name: file.name, url: data.fileUrl };
    }
    showToast(t('toast_evidence_uploaded'), 'success');
    loadEvidenceUploaders();
    updateSubmitButtonState();
  } catch (err) {}
}

// Save & Submit Core Actions
document.getElementById('btn-save-draft').addEventListener('click', () => saveApplication(true));
document.getElementById('btn-submit-application').addEventListener('click', () => saveApplication(false));

async function saveApplication(isDraft = true) {
  const year = document.getElementById('app-year').value;
  const category = document.getElementById('app-category-select').value;

  // Always validate category is selected
  if (!category) {
    showToast(t('error_category_required'), 'error');
    return;
  }

  // Validate that at least one activity has data entered
  const hasAnyActivityData = applicationActivities.some(act => act.count > 0);
  if (!hasAnyActivityData) {
    showToast(t('error_no_activity_data'), 'error');
    return;
  }

  if (!isDraft) {
    const answered = document.querySelector('input[name="teşvik-applied"]:checked');
    if (!answered) {
      showToast(t('error_tesvik_question'), 'error');
      return;
    }
    const missingEvidence = applicationActivities.some(act => {
      if (!missingTeşvikProofIds.has(act.activityId)) return false;
      const files = act.evidenceFiles || [];
      const slotCount = act.isMultiMonth
        ? (act.months ? act.months.filter(m => m > 0).length : 1)
        : Math.max(1, Math.floor(act.count));
      for (let i = 0; i < slotCount; i++) { if (!files[i]) return true; }
      return false;
    });
    if (missingEvidence) {
      showToast(t('error_missing_evidence'), 'error');
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

// Bir başvurunun kanıt belgelerini verilen konteynere render eder.
// Yeni çoklu dosya yapısını (evidenceFiles) ve eski tekil yapıyı (evidenceFile) birlikte destekler.
function renderEvidenceDocuments(app, container) {
  app.activities.filter(a => a.count > 0).forEach(act => {
    const files = Array.isArray(act.evidenceFiles)
      ? act.evidenceFiles.filter(Boolean)
      : (act.evidenceFile ? [act.evidenceFile] : []);
    if (files.length === 0) return;

    files.forEach((file, idx) => {
      const slotLabel = files.length > 1 ? ` (${idx + 1}. belge)` : '';
      const itemDiv = document.createElement('div');
      itemDiv.className = 'doc-item mt-1';
      itemDiv.innerHTML = `
        <div class="doc-icon"><i class="fa-regular fa-file-image"></i></div>
        <div class="doc-details">
          <strong>${t('evidence_doc_singular')}${slotLabel}</strong>
          <p style="color: var(--secondary-color); font-weight: 500;">${act.label}</p>
        </div>
        <a href="${file.url}" target="_blank" class="btn btn-secondary btn-sm"><i class="fa-solid fa-eye"></i> ${t('btn_view_document')}</a>
      `;
      container.appendChild(itemDiv);
    });
  });
}

// View details (Read-only view)
async function viewApplicationDetails(appId) {
  try {
    const app = await apiCall(`/api/applications/my/${appId}`);
    
    document.getElementById('admin-detail-badge').className = 'badge badge-info';
    
    let statusTxt = t('status_submitted');
    if (app.status === 'in_review') statusTxt = t('status_in_review');
    if (app.status === 'approved') { statusTxt = t('status_approved'); document.getElementById('admin-detail-badge').className = 'badge badge-success'; }
    if (app.status === 'rejected') { statusTxt = t('status_rejected'); document.getElementById('admin-detail-badge').className = 'badge badge-danger'; }
    
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
      const maxVal = act.maxScore > 0 ? act.maxScore.toFixed(1) : t('max_text_no_limit');
      tr.innerHTML = `
        <th scope="row">${act.label}</th>
        <td class="text-center">${act.baseScore}</td>
        <td class="text-center">${maxVal}</td>
        <td class="text-center font-weight-bold">${act.count}</td>
        <td class="text-center">${act.requiresRatio ? act.ratio.toFixed(2) : '—'}</td>
        <td class="text-right font-weight-bold text-primary">${act.calculatedScore.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Kanıt belgeleri
    const evidenceDiv = document.getElementById('detail-evidence-list');
    evidenceDiv.innerHTML = '';
    renderEvidenceDocuments(app, evidenceDiv);

    // Score summaries - hide from applicant view
    const scoreDiv = document.querySelector('.score-summary-box');
    if (scoreDiv) scoreDiv.classList.add('hidden');
    
    // Show approved score but disable for applicant
    const approvedScoreGroup = document.querySelector('.form-group:has(#detail-score-approved)');
    if (approvedScoreGroup) approvedScoreGroup.classList.remove('hidden');

    // Notes - show only to applicant
    document.getElementById('admin-eval-notes').value = app.adminNotes || '';
    document.getElementById('admin-eval-notes').disabled = true; // Readonly
    document.getElementById('admin-eval-notes').setAttribute('readonly', 'readonly');

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
    overrideBackBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${t('btn_back_override')}`;
    overrideBackBtn.onclick = () => {
      showView('academic-view');
      overrideBackBtn.remove();
      document.getElementById('btn-back-to-admin-dashboard').classList.remove('hidden');
    };
    document.getElementById('admin-detail-view').querySelector('.app-form-header').insertBefore(overrideBackBtn, document.getElementById('admin-detail-badge'));

    showView('admin-detail-view');
    syncResponsiveTableLabels(document.getElementById('admin-detail-view'));

  } catch (err) {}
}

// ----------------------------------------------------
// APPEAL MODAL & ACTION
// ----------------------------------------------------
let activeAppealAppId = null;

function openAppealModal(appId) {
  activeAppealAppId = appId;
  apiCall(`/api/applications/my/${appId}`).then(app => {
    document.getElementById('appeal-modal-admin-notes').textContent = app.adminNotes || t('no_reason_provided');
    document.getElementById('appeal-reasoning').value = '';
    openModal('appeal-view', '#appeal-reasoning');
  });
}

document.getElementById('btn-close-appeal-modal').addEventListener('click', () => closeModal('appeal-view'));
document.getElementById('btn-cancel-appeal').addEventListener('click', () => closeModal('appeal-view'));

// Appeal file attachment
let appealAttachedFile = null;

document.getElementById('appeal-file-area').addEventListener('click', () => {
  document.getElementById('appeal-file-input').click();
});

document.getElementById('appeal-file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  appealAttachedFile = file;
  document.getElementById('appeal-no-file').classList.add('hidden');
  document.getElementById('appeal-file-name').textContent = file.name;
  document.getElementById('appeal-file-info').classList.remove('hidden');
});

document.getElementById('btn-remove-appeal-file').addEventListener('click', (e) => {
  e.stopPropagation();
  appealAttachedFile = null;
  document.getElementById('appeal-file-input').value = '';
  document.getElementById('appeal-file-info').classList.add('hidden');
  document.getElementById('appeal-no-file').classList.remove('hidden');
});

document.getElementById('appeal-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const reasoning = document.getElementById('appeal-reasoning').value;

  try {
    let attachmentUrl = null;
    if (appealAttachedFile) {
      const fd = new FormData();
      fd.append('file', appealAttachedFile);
      const uploaded = await apiCall('/api/upload', 'POST', fd, true);
      attachmentUrl = uploaded.fileUrl;
    }
    const res = await apiCall(`/api/applications/${activeAppealAppId}/appeal`, 'POST', { reasoning, attachmentUrl });
    showToast(res.message, 'success');
    closeModal('appeal-view');
    appealAttachedFile = null;
    document.getElementById('appeal-file-input').value = '';
    document.getElementById('appeal-file-info').classList.add('hidden');
    document.getElementById('appeal-no-file').classList.remove('hidden');
    loadAcademicianDashboard();
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
  return parts.join(' ').toLocaleLowerCase('tr-TR');
}

function isSystemAdminUser(user) {
  if (!user || user.role !== 'admin') return false;
  if (user.adminScope === 'system') return true;
  return !user.adminScope && user.faculty === 'Rektörlük';
}

function getDisplayTitle(user) {
  if (isSystemAdminUser(user)) return t('role_system_admin');
  if (user.role === 'admin' && user.adminScope === 'faculty') return t('role_commission_label');
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
  switchAdminTab('submissions');
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
      facultyBannerText.textContent = t('faculty_admin_banner', { faculty: currentUser.faculty });
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

  const query = document.getElementById('admin-search').value.toLocaleLowerCase('tr-TR');
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
    tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted">${t('no_results_msg')}</td></tr>`;
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
    let statusText = t('status_draft');
    if (app.status === 'submitted') { badgeClass = 'badge-info'; statusText = t('status_submitted'); }
    if (app.status === 'in_review') { badgeClass = 'badge-warning'; statusText = t('status_in_review'); }
    if (app.status === 'approved') { badgeClass = 'badge-success'; statusText = t('status_approved'); }
    if (app.status === 'rejected') { badgeClass = 'badge-danger'; statusText = t('status_rejected'); }
    if (app.status === 'revision_requested') { badgeClass = 'badge-warning'; statusText = t('status_revision_requested'); }

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
      <button type="button" class="btn btn-primary btn-sm btn-admin-evaluate" data-id="${app.id}">
        <i class="fa-solid fa-gavel" aria-hidden="true"></i> ${t('btn_evaluate_app')}
      </button>
    `;

    if (app.status === 'draft') {
      actionBtn = `
        <button type="button" class="btn btn-secondary btn-sm btn-admin-evaluate" data-id="${app.id}">
          <i class="fa-solid fa-eye" aria-hidden="true"></i> ${t('btn_view_app')}
        </button>
      `;
    }

    if (isSystemAdminUser(currentUser)) {
      actionBtn += `
        <button type="button" class="btn btn-danger btn-sm btn-admin-delete-app" data-id="${app.id}">
          <i class="fa-solid fa-trash" aria-hidden="true"></i> ${t('btn_delete_app')}
        </button>
      `;
    }

    actionBtn = `<div class="admin-app-actions action-buttons-row">${actionBtn}</div>`;

    // Appeal marker
    const appealMarker = app.appeal ? `<span class="badge badge-danger ml-2" style="font-size:0.65rem;">${t('appeal_badge')}</span>` : '';

    tr.innerHTML = `
      <th scope="row"><strong>${applicantName}</strong> ${rankBadge}${appealMarker}</th>
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

  syncResponsiveTableLabels(document.getElementById('admin-view'));

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
  const confirmed = window.confirm(t('confirm_delete_admin_app', { name: applicantName }));
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
    let statusTxt = t('status_evaluating');
    if (app.status === 'approved') { statusTxt = t('status_approved'); document.getElementById('admin-detail-badge').className = 'badge badge-success'; }
    if (app.status === 'rejected') { statusTxt = t('status_rejected'); document.getElementById('admin-detail-badge').className = 'badge badge-danger'; }
    if (app.status === 'revision_requested') { statusTxt = t('status_revision_requested'); document.getElementById('admin-detail-badge').className = 'badge badge-warning'; }
    
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
      const maxVal = act.maxScore > 0 ? act.maxScore.toFixed(1) : t('max_text_no_limit');
      tr.innerHTML = `
        <th scope="row">${act.label}</th>
        <td class="text-center">${act.baseScore}</td>
        <td class="text-center">${maxVal}</td>
        <td class="text-center font-weight-bold">${act.count}</td>
        <td class="text-center">${act.requiresRatio ? act.ratio.toFixed(2) : '—'}</td>
        <td class="text-right font-weight-bold text-primary">${act.calculatedScore.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Kanıt belgeleri
    const evidenceDiv = document.getElementById('detail-evidence-list');
    evidenceDiv.innerHTML = '';
    renderEvidenceDocuments(app, evidenceDiv);

    // Score calculations
    document.getElementById('detail-score-calculated').textContent = app.summary.totalScore.toFixed(2);
    document.getElementById('detail-score-approved').value = app.summary.approvedScore ? app.summary.approvedScore.toFixed(2) : app.summary.totalScore.toFixed(2);
    document.getElementById('detail-score-approved').disabled = false; // Admin can modify

    // Notes
    document.getElementById('admin-eval-notes').value = app.adminNotes || '';
    document.getElementById('admin-eval-notes').disabled = false; // Admin can edit
    document.getElementById('admin-eval-notes').removeAttribute('readonly');
    document.getElementById('admin-eval-notes').setAttribute('placeholder', t('placeholder_eval_notes'));

    // Show scores (admin view)
    const scoreDiv = document.querySelector('.score-summary-box');
    if (scoreDiv) scoreDiv.classList.remove('hidden');
    
    const approvedScoreGroup = document.querySelector('.form-group:has(#detail-score-approved)');
    if (approvedScoreGroup) approvedScoreGroup.classList.remove('hidden');

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
    syncResponsiveTableLabels(document.getElementById('admin-detail-view'));

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
    showToast(t('error_revision_required'), 'warning');
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
    panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    btn.setAttribute('tabindex', isActive ? '0' : '-1');
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
document.querySelectorAll('.tab-btn').forEach((btn, index, allTabs) => {
  btn.addEventListener('keydown', (event) => {
    const key = event.key;
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (key === 'Home') nextIndex = 0;
    if (key === 'End') nextIndex = allTabs.length - 1;
    if (key === 'ArrowRight' || key === 'ArrowDown') nextIndex = (index + 1) % allTabs.length;
    if (key === 'ArrowLeft' || key === 'ArrowUp') nextIndex = (index - 1 + allTabs.length) % allTabs.length;

    const nextTab = allTabs[nextIndex];
    if (nextTab.classList.contains('hidden')) return;
    nextTab.click();
    nextTab.focus();
  });
});

function getUserRoleLabel(user) {
  if (user.role === 'admin' && user.adminScope === 'system') return t('role_system_admin');
  if (user.role === 'admin' && user.adminScope === 'faculty') return t('role_faculty_admin');
  return t('role_academic');
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

  const query = document.getElementById('users-search').value.toLocaleLowerCase('tr-TR');
  const filterRole = document.getElementById('users-filter-role').value;
  const filterFaculty = document.getElementById('users-filter-faculty').value;

  const filtered = adminUsers.filter(user => {
    const roleKey = getUserRoleKey(user);
    const loginId = (user.loginId || user.email || user.username || '').toLocaleLowerCase('tr-TR');
    const name = (user.name || '').toLocaleLowerCase('tr-TR');
    const faculty = (user.faculty || '').toLocaleLowerCase('tr-TR');

    const matchesSearch = !query || name.includes(query) || loginId.includes(query) || faculty.includes(query);
    const matchesRole = filterRole === 'all' || roleKey === filterRole;
    const matchesFaculty = filterFaculty === 'all' || user.faculty === filterFaculty;

    return matchesSearch && matchesRole && matchesFaculty;
  });

    if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">${t('no_users_msg')}</td></tr>`;
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
      <button type="button" class="btn btn-secondary btn-sm btn-user-edit" data-id="${user.id}" title="${t('btn_edit_app')}">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button type="button" class="btn btn-warning btn-sm btn-user-reset-password" data-id="${user.id}" data-name="${user.name}" title="${t('btn_update_password')}">
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
      <th scope="row"><strong>${user.title ? user.title + ' ' : ''}${user.name || '—'}</strong></th>
      <td><code>${loginId}</code></td>
      <td><span class="badge badge-role badge-role-${roleKey}">${getUserRoleLabel(user)}</span></td>
      <td>${facultyInfo}</td>
      <td>${user.applicationCount || 0}</td>
      <td class="user-actions action-cell"><div class="action-buttons-row">${actions}</div></td>
    `;
    tbody.appendChild(tr);
  });

  syncResponsiveTableLabels(document.getElementById('tab-users-content'));

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

    titleEl.textContent = t('modal_edit_user_title');
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
    titleEl.textContent = t('modal_new_user_title');
    roleSelect.disabled = false;
    roleSelect.value = 'academic';
  }

  updateAdminUserFormFields();
  openModal('admin-user-modal', '#admin-user-name');
}

function closeAdminUserModal() {
  editingAdminUserId = null;
  closeModal('admin-user-modal');
  document.getElementById('admin-user-role').disabled = false;
  document.getElementById('admin-user-role-group').classList.remove('hidden');
}

function openAdminResetPasswordModal(userId, userName) {
  resettingAdminUserId = userId;
  document.getElementById('admin-reset-user-id').value = userId;
  document.getElementById('admin-reset-user-label').textContent = t('reset_password_label', { name: userName });
  document.getElementById('admin-reset-password-form').reset();
  openModal('admin-reset-password-modal', '#admin-reset-new-password');
}

function closeAdminResetPasswordModal() {
  resettingAdminUserId = null;
  closeModal('admin-reset-password-modal');
}

async function deleteAdminUser(userId, userName) {
  const confirmed = window.confirm(t('confirm_delete_user', { name: userName }));
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
    showToast(t('error_new_passwords_mismatch'), 'error');
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
      <th scope="row">${item.label}</th>
      <td><input type="number" class="config-base form-control" step="0.5" value="${item.baseScore}" aria-label="${item.label} taban puanı"></td>
      <td><input type="number" class="config-max form-control" step="1" value="${item.maxScore}" aria-label="${item.label} maksimum puan sınırı"></td>
    `;
    tbody.appendChild(tr);
  });

  syncResponsiveTableLabels(document.getElementById('tab-config-content'));
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
  document.getElementById('login-password-toggle').setAttribute('aria-pressed', 'false');
  await fetchConfig();
  syncResponsiveTableLabels();
  checkAuth();
});

// Header mobile menu toggle: show/hide nav on small screens
document.getElementById('btn-header-menu')?.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar-drawer');
  if (sidebar) {
    sidebar.classList.toggle('show');
  }
});

// Mobile icon button handlers (copy desktop button handlers)
document.getElementById('btn-change-password-mobile')?.addEventListener('click', () => {
  document.getElementById('btn-change-password').click();
});

document.getElementById('btn-logout-mobile')?.addEventListener('click', () => {
  document.getElementById('btn-logout').click();
});

document.getElementById('btn-mobile-new-app')?.addEventListener('click', () => {
  document.getElementById('btn-sidebar-new-app').click();
});

document.getElementById('btn-mobile-my-apps')?.addEventListener('click', () => {
  document.getElementById('btn-sidebar-my-apps').click();
});

// Sidebar toggle for mobile
document.getElementById('btn-sidebar-toggle')?.addEventListener('click', () => {
  const sidebar = document.getElementById('sidebar-drawer');
  if (sidebar) {
    sidebar.classList.toggle('show');
  }
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar-drawer');
  const toggleBtn = document.getElementById('btn-sidebar-toggle');
  if (sidebar && toggleBtn && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove('show');
    }
  }
});
