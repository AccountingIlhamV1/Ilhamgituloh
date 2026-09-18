/* ============================================================
   ILHAM ERP — MANUFAKTUR
   Global Helper JS
   ============================================================ */

// ===== KONFIGURASI =====
const APP = {
  name: 'Ilham ERP Manufaktur',
  prefix: 'ilham_mfg_', // prefix localStorage biar tidak bentrok
};

/* ------------------------------------------------------------
   LOCALSTORAGE HELPER
   ------------------------------------------------------------ */
const Store = {
  /** Simpan data ke localStorage */
  set(key, value) {
    try {
      localStorage.setItem(APP.prefix + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Store.set error:', e);
      return false;
    }
  },

  /** Ambil data dari localStorage (default: null) */
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(APP.prefix + key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.error('Store.get error:', e);
      return defaultValue;
    }
  },

  /** Hapus satu key */
  remove(key) {
    localStorage.removeItem(APP.prefix + key);
  },

  /** Hapus SEMUA data aplikasi */
  clearAll() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(APP.prefix))
      .forEach(k => localStorage.removeItem(k));
  }
};

/* ------------------------------------------------------------
   FORMAT HELPER
   ------------------------------------------------------------ */
const Fmt = {
  /** Format angka jadi Rupiah: 15000 → "Rp 15.000" */
  rupiah(num, withSymbol = true) {
    const n = Number(num) || 0;
    const formatted = n.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    return withSymbol ? `Rp ${formatted}` : formatted;
  },

  /** Format angka biasa dengan pemisah ribuan: 15000 → "15.000" */
  angka(num) {
    return (Number(num) || 0).toLocaleString('id-ID');
  },

  /** Format tanggal: "2025-01-15" → "15 Jan 2025" */
  tanggal(str) {
    if (!str) return '-';
    const d = new Date(str);
    if (isNaN(d)) return str;
    return d.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  },

  /** Tanggal hari ini format YYYY-MM-DD (untuk input date) */
  today() {
    return new Date().toISOString().split('T')[0];
  }
};

/* ------------------------------------------------------------
   ID GENERATOR
   ------------------------------------------------------------ */
const IDGen = {
  /** Generate ID unik: "AKN-1731234567890" */
  generate(prefix = 'ID') {
    return `${prefix}-${Date.now()}`;
  },

  /** Nomor urut berformat: prefix + 4 digit → "BB-0001" */
  sequence(prefix, list, field = 'kode', pad = 4) {
    if (!Array.isArray(list) || list.length === 0) {
      return `${prefix}-${String(1).padStart(pad, '0')}`;
    }
    const numbers = list
      .map(item => {
        const match = String(item[field] || '').match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => !isNaN(n));
    const max = numbers.length ? Math.max(...numbers) : 0;
    return `${prefix}-${String(max + 1).padStart(pad, '0')}`;
  }
};

/* ------------------------------------------------------------
   NOTIFIKASI SEDERHANA
   ------------------------------------------------------------ */
function notify(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.style.position = 'fixed';
  alert.style.top = '80px';
  alert.style.right = '20px';
  alert.style.zIndex = '9999';
  alert.style.minWidth = '220px';
  alert.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.style.transition = 'opacity 0.3s';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 300);
  }, 2500);
}

/* ------------------------------------------------------------
   ESCAPE HTML (biar aman dari XSS / karakter aneh)
   ------------------------------------------------------------ */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ------------------------------------------------------------
   AMBIL PARAMETER URL: ?id=123 → "123"
   ------------------------------------------------------------ */
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

/* ------------------------------------------------------------
   INISIALISASI UMUM
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  console.log(`✅ ${APP.name} siap`);
});
