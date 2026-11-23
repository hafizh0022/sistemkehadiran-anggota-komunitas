/* =====================
   STATE
===================== */
let currentUser = null;
let anggotaList = [];
let absensiList = [];
let anggotaPage = 1;
let riwayatPage = 1;
const PAGE_SIZE = 5;
let deleteTargetId = null;

/* =====================
   INITIAL DATA
===================== */
const initialAnggota = [
  { id: 1, nama: 'Aisyah Putri',   noAnggota: 'NB001', email: 'aisyah@gmail.com',  status: 'Aktif' },
  { id: 2, nama: 'Budi Santoso',   noAnggota: 'NB002', email: 'budi@gmail.com',    status: 'Aktif' },
  { id: 3, nama: 'Citra Lestari',  noAnggota: 'NB003', email: 'citra@gmail.com',   status: 'Aktif' },
  { id: 4, nama: 'Dika Pratama',   noAnggota: 'NB004', email: 'dika@gmail.com',    status: 'Aktif' },
  { id: 5, nama: 'Eka Rahma',      noAnggota: 'NB005', email: 'eka@gmail.com',     status: 'Aktif' },
  { id: 6, nama: 'Fajar Nugroho',  noAnggota: 'NB006', email: 'fajar@gmail.com',   status: 'Aktif' },
  { id: 7, nama: 'Gita Sari',      noAnggota: 'NB007', email: 'gita@gmail.com',    status: 'Aktif' },
  { id: 8, nama: 'Hendra Wijaya',  noAnggota: 'NB008', email: 'hendra@gmail.com',  status: 'Aktif' },
  { id: 9, nama: 'Intan Permata',  noAnggota: 'NB009', email: 'intan@gmail.com',   status: 'Aktif' },
  { id: 10, nama: 'Joko Susilo',   noAnggota: 'NB010', email: 'joko@gmail.com',    status: 'Aktif' },
  { id: 11, nama: 'Kartika Dewi',  noAnggota: 'NB011', email: 'kartika@gmail.com', status: 'Aktif' },
  { id: 12, nama: 'Lukman Hakim',  noAnggota: 'NB012', email: 'lukman@gmail.com',  status: 'Aktif' },
  { id: 13, nama: 'Maya Anggraini',noAnggota: 'NB013', email: 'maya@gmail.com',    status: 'Aktif' },
  { id: 14, nama: 'Nanda Putra',   noAnggota: 'NB014', email: 'nanda@gmail.com',   status: 'Tidak Aktif' },
  { id: 15, nama: 'Okta Fitriani', noAnggota: 'NB015', email: 'okta@gmail.com',    status: 'Aktif' },
];

const initialAbsensi = [
  { id: 1,  anggotaId: 1,  tanggal: '2026-09-24', pertemuan: 'Pertemuan 1', status: 'Hadir',       keterangan: '' },
  { id: 2,  anggotaId: 2,  tanggal: '2026-09-24', pertemuan: 'Pertemuan 1', status: 'Izin',        keterangan: 'Ada keperluan' },
  { id: 3,  anggotaId: 3,  tanggal: '2026-09-24', pertemuan: 'Pertemuan 1', status: 'Hadir',       keterangan: '' },
  { id: 4,  anggotaId: 4,  tanggal: '2026-09-23', pertemuan: 'Pertemuan 1', status: 'Sakit',       keterangan: 'Demam' },
  { id: 5,  anggotaId: 5,  tanggal: '2026-09-23', pertemuan: 'Pertemuan 1', status: 'Hadir',       keterangan: '' },
  { id: 6,  anggotaId: 6,  tanggal: '2026-09-22', pertemuan: 'Pertemuan 2', status: 'Hadir',       keterangan: '' },
  { id: 7,  anggotaId: 7,  tanggal: '2026-09-22', pertemuan: 'Pertemuan 2', status: 'Tidak Hadir', keterangan: '' },
  { id: 8,  anggotaId: 8,  tanggal: '2026-09-22', pertemuan: 'Pertemuan 2', status: 'Hadir',       keterangan: '' },
  { id: 9,  anggotaId: 9,  tanggal: '2026-09-21', pertemuan: 'Pertemuan 2', status: 'Izin',        keterangan: '' },
  { id: 10, anggotaId: 10, tanggal: '2026-09-21', pertemuan: 'Pertemuan 2', status: 'Hadir',       keterangan: '' },
  { id: 11, anggotaId: 11, tanggal: '2026-09-20', pertemuan: 'Pertemuan 3', status: 'Hadir',       keterangan: '' },
  { id: 12, anggotaId: 12, tanggal: '2026-09-20', pertemuan: 'Pertemuan 3', status: 'Hadir',       keterangan: '' },
  { id: 13, anggotaId: 13, tanggal: '2026-09-20', pertemuan: 'Pertemuan 3', status: 'Sakit',       keterangan: '' },
  { id: 14, anggotaId: 14, tanggal: '2026-09-19', pertemuan: 'Pertemuan 3', status: 'Tidak Hadir', keterangan: '' },
  { id: 15, anggotaId: 15, tanggal: '2026-09-19', pertemuan: 'Pertemuan 3', status: 'Hadir',       keterangan: '' },
];

/* =====================
   INIT
===================== */
document.addEventListener('DOMContentLoaded', () => {
  // Load from localStorage or use initial
  anggotaList = loadJSON('nb_anggota', () => [...initialAnggota]);
  absensiList = loadJSON('nb_absensi', seedAbsensi);

  // Set today's date on absensi form
  const today = todayStr();
  document.getElementById('absensi-tanggal').value = today;
  bindUi();
  if (sessionStorage.getItem('nb_session')) enterApp();
});

function saveData() {
  localStorage.setItem('nb_anggota', JSON.stringify(anggotaList));
  localStorage.setItem('nb_absensi', JSON.stringify(absensiList));
}

/* =====================
   LOGIN
===================== */
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  // Demo credentials
  if ((username === 'admin' || username === 'admin@nihongo.com') && password === 'admin123') {
    errEl.textContent = '';
    sessionStorage.setItem('nb_session', '1');
    enterApp();
  } else {
    errEl.textContent = 'Username atau password salah. Coba: admin / admin123';
  }
}

function handleLogout() {
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').textContent = '';
  currentUser = null;
  sessionStorage.removeItem('nb_session');
}

/* =====================
   NAVIGATION
===================== */
function navigateTo(section, el) {
  // Update nav active
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');

  // Hide all sections
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

  const target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');

  // Update topbar title
  const titles = {
    dashboard: 'Dashboard',
    anggota: 'Data Anggota',
    absensi: 'Absensi',
    riwayat: 'Riwayat Absensi',
    laporan: 'Laporan'
  };
  document.getElementById('topbar-title').textContent = titles[section] || '';

  // Section-specific refresh
  if (section === 'dashboard') updateDashboardStats();
  if (section === 'anggota') renderAnggotaTable();
  if (section === 'absensi') populateAnggotaDropdowns();
  if (section === 'riwayat') { populateRiwayatDropdown(); renderRiwayat(); }
  if (section === 'laporan') { populateLaporanDropdown(); renderLaporan(); }
}

/* =====================
   DASHBOARD
===================== */
function updateDashboardStats() {
  const today = todayStr();
  const todayAbsensi = absensiList.filter(a => a.tanggal === today);
  const hadirToday = todayAbsensi.filter(a => a.status === 'Hadir').length;
  const tidakHadirToday = todayAbsensi.filter(a => a.status === 'Tidak Hadir').length;
  const pertemuanSet = new Set(absensiList.map(a => a.pertemuan));

  document.getElementById('stat-total').textContent = anggotaList.length;
  document.getElementById('stat-hadir').textContent = hadirToday;
  document.getElementById('stat-tidak-hadir').textContent = tidakHadirToday;
  document.getElementById('stat-pertemuan').textContent = pertemuanSet.size;
}

/* =====================
   DATA ANGGOTA
===================== */
function renderAnggotaTable() {
  const tbody = document.getElementById('tbody-anggota');
  const total = anggotaList.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (anggotaPage > totalPages) anggotaPage = totalPages || 1;

  const start = (anggotaPage - 1) * PAGE_SIZE;
  const slice = anggotaList.slice(start, start + PAGE_SIZE);

  tbody.innerHTML = slice.map((a, idx) => `
    <tr>
      <td>${start + idx + 1}</td>
      <td>${escHtml(a.nama)}</td>
      <td>${escHtml(a.noAnggota)}</td>
      <td>${escHtml(a.email)}</td>
      <td><span class="badge ${a.status === 'Aktif' ? 'badge-aktif' : 'badge-tidak-aktif'}">${a.status}</span></td>
      <td>
        <button class="btn-edit" title="Edit" aria-label="Edit ${escHtml(a.nama)}" onclick="editAnggota(${a.id})"><i class="fa fa-pencil-alt"></i></button>
        <button class="btn-hapus" title="Hapus" aria-label="Hapus ${escHtml(a.nama)}" onclick="hapusAnggota(${a.id})"><i class="fa fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  document.getElementById('anggota-info').textContent =
    `Menampilkan ${total ? start + 1 : 0} – ${Math.min(start + PAGE_SIZE, total)} dari ${total} data`;

  if (!total) tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Belum ada anggota</td></tr>';
  renderPagination('pagination-anggota', anggotaPage, totalPages, p => {
    anggotaPage = p; renderAnggotaTable();
  });
}

function resetFormAnggota() {
  document.getElementById('edit-anggota-id').value = '';
  document.getElementById('input-nama').value = '';
  document.getElementById('input-no-anggota').value = '';
  document.getElementById('input-email').value = '';
  document.getElementById('input-status').value = 'Aktif';
  document.getElementById('modal-anggota-title').textContent = 'Tambah Anggota';
}

function editAnggota(id) {
  const a = anggotaList.find(x => x.id === id);
  if (!a) return;
  document.getElementById('edit-anggota-id').value = a.id;
  document.getElementById('input-nama').value = a.nama;
  document.getElementById('input-no-anggota').value = a.noAnggota;
  document.getElementById('input-email').value = a.email;
  document.getElementById('input-status').value = a.status;
  document.getElementById('modal-anggota-title').textContent = 'Edit Anggota';
  openModal('modal-tambah-anggota');
}

function hapusAnggota(id) {
  deleteTargetId = id;
  openModal('modal-hapus');
}

function konfirmasiHapus() {
  anggotaList = anggotaList.filter(a => a.id !== deleteTargetId);
  absensiList = absensiList.filter(r => r.anggotaId !== deleteTargetId);
  saveData();
  closeModal('modal-hapus');
  renderAnggotaTable();
  populateAnggotaDropdowns();
  updateDashboardStats();
  showToast('Anggota berhasil dihapus', 'success');
}

function simpanAnggota(e) {
  e.preventDefault();
  const id = document.getElementById('edit-anggota-id').value;
  const nama = document.getElementById('input-nama').value.trim();
  const noAnggota = document.getElementById('input-no-anggota').value.trim();
  const email = document.getElementById('input-email').value.trim();
  const status = document.getElementById('input-status').value;

  const dup = anggotaList.some(a => a.noAnggota.toLowerCase() === noAnggota.toLowerCase() && String(a.id) !== id);
  if (dup) { showToast('No. Anggota sudah digunakan', 'error'); return; }

  if (id) {
    // Edit
    const idx = anggotaList.findIndex(a => a.id === parseInt(id));
    if (idx !== -1) {
      anggotaList[idx] = { id: parseInt(id), nama, noAnggota, email, status };
    }
    showToast('Data anggota berhasil diperbarui', 'success');
  } else {
    // Add
    const newId = anggotaList.length > 0 ? Math.max(...anggotaList.map(a => a.id)) + 1 : 1;
    anggotaList.push({ id: newId, nama, noAnggota, email, status });
    showToast('Anggota berhasil ditambahkan', 'success');
  }

  saveData();
  closeModal('modal-tambah-anggota');
  renderAnggotaTable();
  populateAnggotaDropdowns();
  updateDashboardStats();
}

/* =====================
   ABSENSI
===================== */
function populateAnggotaDropdowns() {
  const opts = anggotaList.map(a =>
    `<option value="${a.id}">${escHtml(a.nama)}</option>`
  ).join('');

  const absensiSel = document.getElementById('absensi-anggota');
  absensiSel.innerHTML = '<option value="">Pilih Anggota</option>' + opts;
}

function simpanAbsensi(e) {
  e.preventDefault();
  const anggotaId = parseInt(document.getElementById('absensi-anggota').value);
  const tanggal = document.getElementById('absensi-tanggal').value;
  const pertemuan = document.getElementById('absensi-pertemuan').value;
  const status = document.querySelector('input[name="absensi-status"]:checked').value;
  const keterangan = document.getElementById('absensi-keterangan').value.trim();

  if (!anggotaId) { showToast('Pilih anggota terlebih dahulu', 'error'); return; }
  if (!tanggal) { showToast('Pilih tanggal terlebih dahulu', 'error'); return; }

  // Check if already recorded for this anggota + pertemuan
  const existing = absensiList.findIndex(
    a => a.anggotaId === anggotaId && a.pertemuan === pertemuan
  );

  if (existing !== -1) {
    absensiList[existing] = { ...absensiList[existing], tanggal, status, keterangan };
    showToast('Absensi berhasil diperbarui', 'success');
  } else {
    const newId = absensiList.length > 0 ? Math.max(...absensiList.map(a => a.id)) + 1 : 1;
    absensiList.push({ id: newId, anggotaId, tanggal, pertemuan, status, keterangan });
    showToast('Absensi berhasil disimpan', 'success');
  }

  saveData();
  updateDashboardStats();

  // Reset form
  document.getElementById('absensi-anggota').value = '';
  document.getElementById('absensi-keterangan').value = '';
  document.querySelector('input[name="absensi-status"][value="Hadir"]').checked = true;
}

/* =====================
   RIWAYAT ABSENSI
===================== */
function populateRiwayatDropdown() {
  const sel = document.getElementById('filter-anggota-riwayat');
  sel.innerHTML = '<option value="">Semua Anggota</option>' +
    anggotaList.map(a => `<option value="${a.id}">${escHtml(a.nama)}</option>`).join('');
}

function renderRiwayat() {
  const filterAnggotaId = document.getElementById('filter-anggota-riwayat').value;

  let data = [...absensiList].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);

  if (filterAnggotaId) {
    data = data.filter(d => d.anggotaId === parseInt(filterAnggotaId));
  }

  const [dari, sampai] = getRange('filter');
  data = data.filter(d => inRange(d.tanggal, dari, sampai));

  const total = data.length;
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  if (riwayatPage > totalPages) riwayatPage = 1;

  const start = (riwayatPage - 1) * PAGE_SIZE;
  const slice = data.slice(start, start + PAGE_SIZE);

  const tbody = document.getElementById('tbody-riwayat');
  tbody.innerHTML = slice.map((d, idx) => {
    const anggota = anggotaList.find(a => a.id === d.anggotaId);
    return `
      <tr>
        <td>${start + idx + 1}</td>
        <td>${anggota ? escHtml(anggota.nama) : '-'}</td>
        <td>${formatDate(d.tanggal)}</td>
        <td>${escHtml(d.pertemuan)}</td>
        <td><span class="badge ${statusBadgeClass(d.status)}">${d.status}</span></td>
        <td>${escHtml(d.keterangan) || '-'}</td>
      </tr>
    `;
  }).join('');

  if (slice.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:24px">Tidak ada data</td></tr>';
  }

  document.getElementById('riwayat-info').textContent =
    `Menampilkan ${total > 0 ? start + 1 : 0} – ${Math.min(start + PAGE_SIZE, total)} dari ${total} data`;

  renderPagination('pagination-riwayat', riwayatPage, totalPages, p => {
    riwayatPage = p; renderRiwayat();
  });
}

/* =====================
   LAPORAN
===================== */
function populateLaporanDropdown() {
  const sel = document.getElementById('laporan-anggota');
  sel.innerHTML = '<option value="">Semua Anggota</option>' +
    anggotaList.map(a => `<option value="${a.id}">${escHtml(a.nama)}</option>`).join('');
}

function renderLaporan() {
  const filterAnggotaId = document.getElementById('laporan-anggota').value;
  const [dari, sampai] = getRange('laporan');
  const scoped = absensiList.filter(a => inRange(a.tanggal, dari, sampai));
  let targetAnggota = anggotaList;
  if (filterAnggotaId) {
    targetAnggota = anggotaList.filter(a => a.id === parseInt(filterAnggotaId));
  }

  // Rekap total
  let totalHadir = 0, totalIzin = 0, totalSakit = 0, totalTidakHadir = 0;
  scoped.forEach(a => {
    if (filterAnggotaId && a.anggotaId !== parseInt(filterAnggotaId)) return;
    if (a.status === 'Hadir') totalHadir++;
    else if (a.status === 'Izin') totalIzin++;
    else if (a.status === 'Sakit') totalSakit++;
    else if (a.status === 'Tidak Hadir') totalTidakHadir++;
  });
  const totalAll = totalHadir + totalIzin + totalSakit + totalTidakHadir;
  const pct = v => totalAll > 0 ? Math.round(v / totalAll * 100) : 0;

  document.getElementById('rekap-grid').innerHTML = `
    <div class="rekap-card hadir">
      <div class="rekap-icon"><i class="fa fa-check"></i></div>
      <div>
        <div class="rekap-label">Hadir</div>
        <div class="rekap-value">${totalHadir}</div>
        <div class="rekap-pct">(${pct(totalHadir)}%)</div>
      </div>
    </div>
    <div class="rekap-card izin">
      <div class="rekap-icon"><i class="fa fa-calendar-minus"></i></div>
      <div>
        <div class="rekap-label">Izin</div>
        <div class="rekap-value">${totalIzin}</div>
        <div class="rekap-pct">(${pct(totalIzin)}%)</div>
      </div>
    </div>
    <div class="rekap-card sakit">
      <div class="rekap-icon"><i class="fa fa-heartbeat"></i></div>
      <div>
        <div class="rekap-label">Sakit</div>
        <div class="rekap-value">${totalSakit}</div>
        <div class="rekap-pct">(${pct(totalSakit)}%)</div>
      </div>
    </div>
    <div class="rekap-card tidak-hadir">
      <div class="rekap-icon"><i class="fa fa-times"></i></div>
      <div>
        <div class="rekap-label">Tidak Hadir</div>
        <div class="rekap-value">${totalTidakHadir}</div>
        <div class="rekap-pct">(${pct(totalTidakHadir)}%)</div>
      </div>
    </div>
  `;

  // Detail per anggota
  const tbody = document.getElementById('tbody-laporan');
  const totalPertemuan = new Set(scoped.map(a => a.pertemuan)).size;

  tbody.innerHTML = targetAnggota.map((a, idx) => {
    const records = scoped.filter(r => r.anggotaId === a.id);
    const hadir = records.filter(r => r.status === 'Hadir').length;
    const izin = records.filter(r => r.status === 'Izin').length;
    const sakit = records.filter(r => r.status === 'Sakit').length;
    const tidakHadir = records.filter(r => r.status === 'Tidak Hadir').length;
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${escHtml(a.nama)}</td>
        <td>${hadir}</td>
        <td>${izin}</td>
        <td>${sakit}</td>
        <td>${tidakHadir}</td>
        <td>${totalPertemuan}</td>
      </tr>
    `;
  }).join('');

  if (targetAnggota.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#aaa;padding:24px">Tidak ada data</td></tr>';
  }
}

function cetakLaporan() {
  window.print();
}

/* =====================
   PAGINATION
===================== */
function renderPagination(containerId, currentPage, totalPages, onPageClick) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const btn = (label, page, { disabled = false, active = false, cls = '' } = {}) =>
    `<button type="button" class="page-btn ${cls} ${active ? 'active' : ''}" data-page="${page}" ${disabled ? 'disabled' : ''} ${active ? 'aria-current="page"' : ''}>${label}</button>`;
  let html = btn('&laquo;', currentPage - 1, { disabled: currentPage <= 1, cls: 'nav-page' });
  for (let i = 1; i <= totalPages; i++) html += btn(i, i, { active: i === currentPage });
  html += btn('&raquo;', currentPage + 1, { disabled: currentPage >= totalPages, cls: 'nav-page' });
  container.innerHTML = html;
  container.onclick = e => {
    const b = e.target.closest('.page-btn');
    if (b && !b.disabled) onPageClick(Number(b.dataset.page));
  };
}

/* =====================
   MODAL
===================== */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.classList.add('active');
    const f = m.querySelector('input:not([type=hidden]), select, button');
    if (f) setTimeout(() => f.focus(), 50);
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('active');
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

/* =====================
   TOAST
===================== */
let toastTimer = null;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.className = 'toast';
  }, 3000);
}

/* =====================
   HELPERS
===================== */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [y, m, dd] = dateStr.split('-').map(Number);
  const d = new Date(y, m - 1, dd);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function statusBadgeClass(status) {
  const map = {
    'Hadir': 'badge-hadir',
    'Izin': 'badge-izin',
    'Sakit': 'badge-sakit',
    'Tidak Hadir': 'badge-tidak-hadir'
  };
  return map[status] || '';
}

/* =====================
   EXTRA HELPERS
===================== */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const val = raw ? JSON.parse(raw) : null;
    if (Array.isArray(val)) return val;
  } catch (e) { /* data rusak -> pakai data awal */ }
  return fallback();
}

function toYMD(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function todayStr() { return toYMD(new Date()); }

// Data demo digeser agar tanggalnya selalu relatif terhadap hari ini
function seedAbsensi() {
  const base = new Date(2026, 8, 24);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const off = Math.round((t - base) / 864e5);
  return initialAbsensi.map(a => {
    const [y, m, d] = a.tanggal.split('-').map(Number);
    return { ...a, tanggal: toYMD(new Date(y, m - 1, d + off)) };
  });
}

function getRange(prefix) {
  return [document.getElementById(prefix + '-dari').value, document.getElementById(prefix + '-sampai').value];
}
function inRange(tgl, dari, sampai) {
  return (!dari || tgl >= dari) && (!sampai || tgl <= sampai);
}

function enterApp() {
  currentUser = currentUser || 'admin';
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.add('active');
  document.getElementById('topbar-username').textContent = 'Admin';
  populateAnggotaDropdowns();
  navigateTo('dashboard', document.querySelector('.nav-item'));
}

function bindUi() {
  ['filter-dari', 'filter-sampai', 'filter-anggota-riwayat'].forEach(id =>
    document.getElementById(id).addEventListener('change', () => { riwayatPage = 1; renderRiwayat(); }));
  ['laporan-dari', 'laporan-sampai', 'laporan-anggota'].forEach(id =>
    document.getElementById(id).addEventListener('change', renderLaporan));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
  });
  const pw = document.getElementById('login-password'), tg = document.getElementById('toggle-pw');
  tg.addEventListener('click', () => {
    const show = pw.type === 'password';
    pw.type = show ? 'text' : 'password';
    tg.firstElementChild.className = show ? 'fa fa-eye-slash' : 'fa fa-eye';
  });
}
