/* =========================================================
   KlikKost — LAPISAN ANTARMUKA
   React 18 + Hooks. Data diambil dari window.KK (data.js).

   Catatan ikon: set ikon di bawah mengikuti gaya & API Lucide
   (viewBox 24, stroke currentColor). Saat dipindah ke proyek
   dengan bundler, cukup ganti <Icon name="wifi" /> menjadi
   `import { Wifi } from "lucide-react"` — propsnya identik.
========================================================= */
const { useState, useMemo, useEffect, useCallback, useRef, memo } = React;
const { FASILITAS_KAMAR, FASILITAS_BERSAMA, KOST, FILTER_AWAL, BATAS_HARGA, FASILITAS_FILTER } = window.KK;

/* Kamus gabungan: dipakai saat kunci fasilitas bisa datang dari dua kelompok */
const FASILITAS = Object.assign({}, FASILITAS_BERSAMA, FASILITAS_KAMAR);

/* =========================================================
   1. IKON
========================================================= */
const PATHS = {
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  shieldCheck: <><path d="M20 13c0 5-3.5 7.4-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.4 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>,
  mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  wifi: <><path d="M12 20h.01" /><path d="M2 8.8a15 15 0 0 1 20 0" /><path d="M5 12.9a10 10 0 0 1 14 0" /><path d="M8.5 16.4a5 5 0 0 1 7 0" /></>,
  snow: <><path d="M12 2v20" /><path d="M2 12h20" /><path d="m4.9 4.9 14.2 14.2" /><path d="M19.1 4.9 4.9 19.1" /></>,
  droplet: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C10 11.1 5 13 5 15a7 7 0 0 0 7 7z" />,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></>,
  bed: <><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></>,
  desk: <><rect x="3" y="7" width="18" height="3.5" rx="1" /><path d="M5 10.5V20M19 10.5V20" /><rect x="8" y="13" width="7" height="4" rx="1" /></>,
  wardrobe: <><rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M12 2.5v19" /><path d="M10 11h.2M13.8 11h.2" /></>,
  window: <><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M12 3.5v17M3.5 12h17" /></>,
  klosetDuduk: <><path d="M7 3h4.5v6H7z" /><path d="M4.5 9h15v1.5a6.5 6.5 0 0 1-6.5 6.5h-2A6.5 6.5 0 0 1 4.5 10.5z" /><path d="M9 17v4h6v-4" /><path d="M7 21h10" /></>,
  klosetJongkok: <><ellipse cx="12" cy="12.5" rx="7.5" ry="4.5" /><ellipse cx="12" cy="12.5" rx="3" ry="1.6" /><path d="M4 19.5h16" /></>,
  fridge: <><rect x="6" y="2.5" width="12" height="19" rx="2" /><path d="M6 10h12" /><path d="M9 6v2M9 13v2" /></>,
  hanger: <><path d="M3 7c6 3.2 12 3.2 18 0" /><path d="M7 8.4V13M12 9.2V14M17 8.4V13" /><path d="M2 5h20" /></>,
  book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v4H6.5A2.5 2.5 0 0 1 4 19.5z" /></>,
  camera: <><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" /><circle cx="12" cy="13" r="3" /></>,
  sliders: <><path d="M21 4h-7" /><path d="M10 4H3" /><path d="M21 12h-9" /><path d="M8 12H3" /><path d="M21 20h-5" /><path d="M12 20H3" /><path d="M10 2v4" /><path d="M8 10v4" /><path d="M16 18v4" /></>,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m18 15-6-6-6 6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  play: <path d="M6 3.5 20 12 6 20.5z" />,
  video: <><path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2.5" /></>,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  sparkle: <path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" />,
  zap: <path d="M13 2 4.1 13.1a1 1 0 0 0 .8 1.6H11l-1 7.3 8.9-11.1a1 1 0 0 0-.8-1.6H12z" />,
  rotate: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  door: <><path d="M13 4h3a2 2 0 0 1 2 2v14" /><path d="M2 20h3" /><path d="M13 20h9" /><path d="M10 12v.01" /><path d="M13 4.8v14.4a.6.6 0 0 1-.7.6l-5-1a.6.6 0 0 1-.3-.6V5.8a.6.6 0 0 1 .3-.6l5-1a.6.6 0 0 1 .7.6Z" /></>,
  key: <><path d="m15.5 7.5 3 3L22 7l-3-3" /><path d="m18 11-1.5-1.5" /><circle cx="7.5" cy="15.5" r="5.5" /><path d="m11.5 11.5 6-6" /></>,
  flame: <path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1.5-.5-2.5-1-3 2 1 5 3.5 5 7a7 7 0 1 1-14 0C5 9 12 8 12 2z" />,
  utensils: <><path d="M4 2v7a3 3 0 0 0 6 0V2" /><path d="M7 2v20" /><path d="M17 2v20" /><path d="M21 8c0 3-2 5-4 5V2c2 0 4 3 4 6z" /></>,
  bike: <><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /><path d="M12 17.5V14l-3-3 4-3 2 3h2" /></>,
  shirt: <path d="M20.4 6.6 16 4a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.4 1.3l1.6 3.2a1 1 0 0 0 1.3.4L8 10.5V20a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9.5l1.9 1a1 1 0 0 0 1.3-.4l1.6-3.2a1 1 0 0 0-.4-1.3z" />,
  bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
  scale: <><path d="m17 16 2.5-7 2.5 7a4.4 4.4 0 0 1-5 0Z" /><path d="m2 16 2.5-7L7 16a4.4 4.4 0 0 1-5 0Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M4.5 9h4C10 9 11 8.4 12 7.5c1 .9 2 1.5 3.5 1.5h4" /></>,
  receipt: <><path d="M4 2.5 6 4l2-1.5L10 4l2-1.5L14 4l2-1.5L18 4l2-1.5v19L18 20l-2 1.5L14 20l-2 1.5L10 20l-2 1.5L6 20l-2 1.5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  alert: <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>,
  wallet: <><path d="M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6" /><path d="M17.5 13h.01" /></>,
  ruler: <><rect x="2" y="7" width="20" height="10" rx="2" /><path d="M7 7v3M12 7v4M17 7v3" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
};

function Icon({ name, size = 20, className = "", strokeWidth = 1.9, fill = "none", style }) {
  const node = PATHS[name];
  if (!node) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} style={style} aria-hidden="true" focusable="false">
      {node}
    </svg>
  );
}

/* Logo WhatsApp (brand glyph, solid) */
function WhatsAppGlyph({ size = 20, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.18-.3-.02-.46.13-.6.14-.14.3-.35.44-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.7.3 1.26.48 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.28.18-1.41-.08-.12-.28-.2-.57-.34M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.41z" />
    </svg>
  );
}

/* =========================================================
   2. UTILITAS HARGA & LOKASI
========================================================= */
const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
const rupiahRingkas = (n) =>
  n >= 1000000
    ? (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1).replace(".", ",") + " jt"
    : Math.round(n / 1000) + "rb";

/* Iuran yang angkanya pasti (per bulan). Token listrik sengaja tidak dihitung. */
const iuranPasti = (k) => k.iuran_tambahan.reduce((t, i) => t + (typeof i.nominal === "number" ? i.nominal : 0), 0);
const adaBiayaTakPasti = (k) => k.iuran_tambahan.some((i) => i.nominal === null);
const totalBayar = (k, bayar) =>
  bayar === "tahun" ? k.harga.tahun + iuranPasti(k) * 12 : k.harga.bulan + iuranPasti(k);
const perBulanSetara = (k) => k.harga.tahun / 12 + iuranPasti(k);
const bucketJarak = (km) => (km < 1 ? "dekat" : km <= 3 ? "sedang" : "jauh");
const labelBayar = (bayar) => (bayar === "tahun" ? "/tahun" : "/bulan");

/* Ilustrasi ruangan — pengganti foto pada prototipe.
   Digambar datar dan apa adanya: proporsi tidak dilebarkan. */
function RoomArt({ hue = 262, variant = 0, className = "" }) {
  const wall = `hsl(${hue} 46% 92%)`;
  const wall2 = `hsl(${hue} 40% 86%)`;
  const floor = `hsl(${hue + 18} 34% 78%)`;
  const obj = `hsl(${hue} 52% 62%)`;
  const obj2 = `hsl(${hue + 30} 60% 70%)`;
  const line = `hsl(${hue} 30% 46%)`;
  return (
    <svg viewBox="0 0 400 300" className={className} role="img"
      aria-label="Ilustrasi ruangan hasil survei" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill={wall} />
      <rect y="200" width="400" height="100" fill={floor} />
      {variant === 0 && (
        <g>
          <rect x="36" y="46" width="104" height="86" rx="8" fill={wall2} stroke={line} strokeWidth="3" />
          <path d="M88 46v86M36 89h104" stroke={line} strokeWidth="3" />
          <rect x="196" y="126" width="168" height="74" rx="10" fill={obj} />
          <rect x="196" y="106" width="60" height="30" rx="8" fill="#fff" opacity=".85" />
          <rect x="176" y="196" width="208" height="14" rx="6" fill={line} opacity=".35" />
          <rect x="52" y="160" width="74" height="46" rx="8" fill={obj2} />
          <circle cx="89" cy="150" r="12" fill={obj2} />
          <path d="M89 150v10" stroke={line} strokeWidth="3" />
        </g>
      )}
      {variant === 1 && (
        <g>
          <rect x="40" y="96" width="120" height="110" rx="10" fill="#fff" opacity=".8" stroke={line} strokeWidth="3" />
          <circle cx="100" cy="150" r="24" fill={obj2} opacity=".55" />
          <rect x="230" y="60" width="26" height="70" rx="12" fill={obj} />
          <path d="M243 130v22" stroke={line} strokeWidth="5" />
          <path d="M226 152h34" stroke={line} strokeWidth="6" strokeLinecap="round" />
          <rect x="214" y="170" width="58" height="36" rx="8" fill={obj2} />
          <path d="M0 200h400" stroke={line} strokeWidth="3" opacity=".4" />
        </g>
      )}
      {variant === 2 && (
        <g>
          <rect x="0" y="0" width="400" height="200" fill={wall2} />
          <rect x="120" y="70" width="160" height="130" rx="6" fill={obj} />
          <circle cx="258" cy="140" r="7" fill="#fff" />
          <rect x="60" y="120" width="44" height="80" rx="6" fill={obj2} />
          <rect x="300" y="110" width="52" height="90" rx="6" fill={obj2} opacity=".8" />
          <path d="M0 200h400" stroke={line} strokeWidth="4" opacity=".45" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================
   3. KOMPONEN KECIL
========================================================= */
function VerifiedBadge({ compact = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${compact ? "px-2.5 py-1 t-micro" : "px-3 py-1.5 t-small"}`}
      style={{ background: "var(--mint)", color: "var(--mint-ink)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.45)" }}
      title="Kost ini sudah didatangi surveyor KlikKost">
      <Icon name="shieldCheck" size={compact ? 13 : 15} strokeWidth={2.3} />
      KlikKost Verified
    </span>
  );
}

function BelumSurveiBadge({ compact = true }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${compact ? "px-2.5 py-1 t-micro" : "px-3 py-1.5 t-small"}`}
      style={{ background: "var(--peach)", color: "var(--peach-ink)" }}
      title="Data dari pemilik, belum dikunjungi surveyor">
      <Icon name="clock" size={compact ? 13 : 15} strokeWidth={2.3} />
      Menunggu survei
    </span>
  );
}

function StatusPill({ status, sisa }) {
  const penuh = status === "Penuh";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 t-micro font-bold"
      style={{ background: penuh ? "var(--warn-soft)" : "var(--ok-soft)", color: penuh ? "var(--warn)" : "var(--ok)" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
      {penuh ? "Penuh" : `${sisa} kamar tersisa`}
    </span>
  );
}

function Chip({ active, onClick, children, icon, ariaLabel, title }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} aria-label={ariaLabel} title={title}
      className="chip rounded-2xl px-3.5 py-2 t-small font-semibold inline-flex items-center gap-1.5">
      {icon && <Icon name={icon} size={15} strokeWidth={2.1} />}
      {children}
    </button>
  );
}

/* Tag statis (bukan tombol) untuk daftar fasilitas */
function Tag({ icon, children, tone }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 t-micro font-semibold"
      style={{ background: tone === "kamar" ? "var(--lilac)" : "var(--surface-2)", color: tone === "kamar" ? "var(--brand-deep)" : "var(--ink-2)" }}>
      {icon && <Icon name={icon} size={13} strokeWidth={2.2} />}
      {children}
    </li>
  );
}

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="t-small font-bold mb-2.5" style={{ color: "var(--ink)" }}>{title}</legend>
      {children}
    </fieldset>
  );
}

function ScoreBar({ value, max = 5, tone = "var(--brand)" }) {
  const pct = Math.max(0, Math.min(100, ((value || 0) / max) * 100));
  return (
    <div className="h-2.5 rounded-full bar-track w-full" role="presentation">
      <div className="h-full rounded-full" style={{ width: pct + "%", background: tone, boxShadow: "inset 0 1px 0 rgba(255,255,255,.4)" }} />
    </div>
  );
}

/* =========================================================
   4. KARTU KOST
========================================================= */
const KostCard = memo(function KostCard({ kost, bayar, onOpen, dibandingkan, onToggleBanding, bandingPenuh }) {
  const total = totalBayar(kost, bayar);
  const sewa = bayar === "tahun" ? kost.harga.tahun : kost.harga.bulan;
  const iuran = bayar === "tahun" ? iuranPasti(kost) * 12 : iuranPasti(kost);
  const klosetKey = kost.kloset === "duduk" ? "kloset_duduk" : "kloset_jongkok";

  return (
    <article className="clay clay-lift rounded-3xl overflow-hidden h-full relative flex flex-col">
      <button type="button" onClick={() => onToggleBanding(kost.id)}
        aria-pressed={dibandingkan}
        disabled={bandingPenuh && !dibandingkan}
        title={bandingPenuh && !dibandingkan ? "Maksimal 2 kost dibandingkan" : "Tambahkan ke pembanding"}
        className="chip-solid absolute top-3 right-3 z-20 rounded-2xl px-2.5 py-1.5 t-micro font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
        data-on={dibandingkan ? "true" : "false"}>
        <Icon name={dibandingkan ? "check" : "scale"} size={13} strokeWidth={2.4} />
        {dibandingkan ? "Dibandingkan" : "Bandingkan"}
      </button>

      <div className="flex flex-col h-full w-full">
        <div className="relative w-full">
          {kost.foto_utama ? (
            <img src={kost.foto_utama} alt={`Foto ${kost.nama}`} loading="lazy"
              className="w-full h-64 sm:h-80 object-cover bg-gray-200" />
          ) : (
            <RoomArt hue={kost.hue} variant={kost.id.length % 3} className="w-full h-56 sm:h-72" />
          )}
          <div className="absolute top-3 left-3">
            {kost.verified ? <VerifiedBadge compact /> : <BelumSurveiBadge />}
          </div>
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 t-micro font-semibold"
            style={{ background: "rgba(255,255,255,.9)", color: "#2b3049" }}>
            <Icon name="camera" size={12} strokeWidth={2.2} /> Foto apa adanya, tanpa lensa wide
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 w-full">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="t-h3">{kost.nama}</h3>
              <p className="t-small muted mt-0.5">{kost.lokasi.area}</p>
            </div>
            {(() => {
              const gaya = {
                Putra: { bg: "var(--sky)", ink: "var(--sky-ink)", icon: "user" },
                Putri: { bg: "var(--peach)", ink: "var(--peach-ink)", icon: "user" },
                Campur: { bg: "var(--lilac)", ink: "var(--brand-deep)", icon: "users" }
              }[kost.tipe] || { bg: "var(--surface-2)", ink: "var(--ink-2)", icon: "info" };

              return (
                <span className="shrink-0 rounded-2xl px-2.5 py-1 t-micro font-bold flex items-center gap-1.5 border"
                  style={{ background: gaya.bg, color: gaya.ink, borderColor: "rgba(0,0,0,0.05)" }}>
                  <Icon name={gaya.icon} size={13} strokeWidth={2.4} />
                  {kost.tipe}
                </span>
              );
            })()}
          </header>

          <dl className="grid grid-cols-2 gap-2">
            <div className="clay-in rounded-2xl px-3 py-2.5">
              <dt className="t-micro muted">Ke {kost.lokasi.fakultas.replace(" UNNES", "")}</dt>
              <dd className="t-small font-bold mt-0.5 flex items-center gap-1.5">
                <Icon name="mapPin" size={14} strokeWidth={2.2} />{kost.lokasi.jarakKm} km
                <span className="muted font-medium">· {kost.lokasi.jalanKaki} mnt</span>
              </dd>
            </div>
            <div className="clay-in rounded-2xl px-3 py-2.5">
              <dt className="t-micro muted">WiFi terukur</dt>
              <dd className="t-small font-bold mt-0.5 flex items-center gap-1.5">
                <Icon name="wifi" size={14} strokeWidth={2.2} />
                {kost.verifikasi.wifiMbps ? `${kost.verifikasi.wifiMbps} Mbps` : "Belum diuji"}
              </dd>
            </div>
          </dl>

          <ul className="flex flex-wrap gap-1.5" aria-label="Rincian kamar">
            <Tag icon={FASILITAS_KAMAR[klosetKey].icon} tone="kamar">{FASILITAS_KAMAR[klosetKey].short}</Tag>
            <Tag icon="zap">{kost.listrik.model}</Tag>
            {kost.fasilitas_kamar.includes("ac") && <Tag icon="snow" tone="kamar">AC</Tag>}
            <Tag icon="clock">{kost.aturan.jam_malam === "Bebas" ? "Bebas 24 jam" : `Jam malam ${kost.aturan.jam_malam}`}</Tag>
          </ul>

          <div className="mt-auto pt-3 border-t" style={{ borderColor: "var(--line)" }}>
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <p>
                <span className="t-h3" style={{ color: "var(--brand)" }}>{rupiah(total)}</span>
                <span className="t-small muted">{labelBayar(bayar)}</span>
              </p>
              <StatusPill status={kost.status} sisa={kost.kamarSisa} />
            </div>
            <p className="t-micro muted mt-1">
              Sewa {rupiahRingkas(sewa)} + iuran {rupiahRingkas(iuran)}
              {adaBiayaTakPasti(kost) ? " · listrik token belum dihitung" : ""}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="t-micro muted">{kost.last_updated}</span>
            <span className="t-small font-bold inline-flex items-center gap-1.5" style={{ color: "var(--brand)" }}>
              Lihat hasil survei <Icon name="chevronRight" size={15} strokeWidth={2.4} />
            </span>
          </div>
        </div>
      </div>

      {/* Pemicu seluruh kartu — dipisah agar isi kartu tetap HTML yang sah */}
      <button type="button" onClick={() => onOpen(kost)} className="pemicu-kartu"
        aria-label={`Lihat hasil survei ${kost.nama}`} />
    </article>
  );
});

/* =========================================================
   5. TAMPILAN PETA (dummy, tanpa API)
========================================================= */
function MapView({ daftar, bayar, onOpen }) {
  const [pin, setPin] = useState(daftar.length ? daftar[0].id : null);
  const terpilih = daftar.find((k) => k.id === pin) || null;

  useEffect(() => {
    if (!daftar.some((k) => k.id === pin)) setPin(daftar.length ? daftar[0].id : null);
  }, [daftar, pin]);

  return (
    <div className="flex flex-col gap-4">
      <div className="clay rounded-3xl p-3 sm:p-4">
        <div className="peta relative rounded-2xl overflow-hidden">
          <svg viewBox="0 0 100 70" className="w-full h-full block" role="img"
            aria-label="Peta skema kawasan Sekaran dengan titik kost">
            <rect width="100" height="70" fill="var(--peta-bg)" />
            <g fill="var(--peta-blok)">
              <rect x="6" y="6" width="22" height="16" rx="2" />
              <rect x="70" y="40" width="24" height="22" rx="2" />
              <rect x="34" y="46" width="18" height="14" rx="2" />
            </g>
            <g stroke="var(--peta-jalan)" strokeLinecap="round" fill="none">
              <path d="M0 34h100" strokeWidth="5" />
              <path d="M52 0v70" strokeWidth="4" />
              <path d="M18 34 6 58M74 34l12 20M34 0l6 34" strokeWidth="2.4" />
            </g>
            <g>
              <rect x="40" y="24" width="24" height="14" rx="3" fill="var(--peta-kampus)" />
              <text x="52" y="32.6" textAnchor="middle" fontSize="4.6" fontWeight="700" fill="var(--peta-kampus-ink)">UNNES</text>
            </g>
          </svg>

          {daftar.map((k) => {
            const on = k.id === pin;
            return (
              <button key={k.id} type="button" onClick={() => setPin(k.id)} aria-pressed={on}
                aria-label={`${k.nama}, ${rupiahRingkas(totalBayar(k, bayar))} ${bayar === "tahun" ? "per tahun" : "per bulan"}`}
                className="map-pin" data-on={on ? "true" : "false"}
                style={{ left: k.peta.x + "%", top: k.peta.y + "%" }}>
                <span className="map-pin-label">{rupiahRingkas(totalBayar(k, bayar))}</span>
              </button>
            );
          })}
        </div>
        <p className="t-micro muted mt-2.5 flex items-start gap-1.5">
          <Icon name="info" size={14} className="shrink-0 mt-0.5" />
          Peta skema untuk prototipe — posisi pin belum berskala. Integrasi peta asli menyusul.
        </p>
      </div>

      {terpilih ? (
        <article className="clay-soft rounded-3xl p-4 flex flex-col sm:flex-row gap-4 items-start">
          {terpilih.foto_utama ? (
            <img src={terpilih.foto_utama} alt={terpilih.nama} className="w-full sm:w-40 h-28 object-cover rounded-2xl shrink-0 bg-gray-200" loading="lazy" />
          ) : (
            <RoomArt hue={terpilih.hue} className="w-full sm:w-40 h-28 rounded-2xl shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {terpilih.verified ? <VerifiedBadge compact /> : <BelumSurveiBadge />}
              <StatusPill status={terpilih.status} sisa={terpilih.kamarSisa} />
            </div>
            <h3 className="t-h3 mt-2">{terpilih.nama}</h3>
            <p className="t-small muted">{terpilih.lokasi.ringkas}</p>
            <p className="mt-1.5">
              <span className="t-h3" style={{ color: "var(--brand)" }}>{rupiah(totalBayar(terpilih, bayar))}</span>
              <span className="t-small muted">{labelBayar(bayar)} termasuk iuran</span>
            </p>
          </div>
          <button type="button" onClick={() => onOpen(terpilih)}
            className="clay-btn rounded-2xl px-4 py-3 t-small inline-flex items-center gap-2 w-full sm:w-auto justify-center">
            Lihat hasil survei <Icon name="chevronRight" size={15} strokeWidth={2.5} />
          </button>
        </article>
      ) : (
        <p className="t-small muted">Tidak ada kost yang cocok untuk ditampilkan di peta.</p>
      )}
    </div>
  );
}

/* =========================================================
   6. MODAL DETAIL
========================================================= */
function DetailModal({ kost, bayar, onClose }) {
  const [foto, setFoto] = useState(0);
  const [modeBayar, setModeBayar] = useState(bayar);
  const dialogRef = useRef(null);

  const semuaFoto = [kost.foto_utama, ...(kost.galeri || [])].filter(Boolean);
  const jumlahFoto = semuaFoto.length || 1;
  const fotoAktif = semuaFoto.length ? semuaFoto[foto % semuaFoto.length] : null;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const penuh = kost.status === "Penuh";
  const waText = encodeURIComponent(
    `Halo, saya menemukan ${kost.nama} di KlikKost. Apakah kamar masih tersedia bulan ini? Saya juga ingin memastikan iuran sampah dan aturan jam malamnya.`
  );
  const sewa = modeBayar === "tahun" ? kost.harga.tahun : kost.harga.bulan;
  const iuran = modeBayar === "tahun" ? iuranPasti(kost) * 12 : iuranPasti(kost);
  const total = sewa + iuran;
  const klosetKey = kost.kloset === "duduk" ? "kloset_duduk" : "kloset_jongkok";

  return (
    <div className="fixed inset-0 z-50 scrim anim-fade flex items-end sm:items-center justify-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="modal-judul"
        className="clay anim-pop w-full sm:max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col focus:outline-none">

        <header className="flex items-start justify-between gap-4 p-4 sm:p-6 pb-3 border-b" style={{ borderColor: "var(--line)" }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {kost.verified ? <VerifiedBadge compact /> : <BelumSurveiBadge />}
              <StatusPill status={kost.status} sisa={kost.kamarSisa} />
            </div>
            <h2 id="modal-judul" className="t-h2 mt-2">{kost.nama}</h2>
            <p className="t-small muted">{kost.lokasi.area} · {kost.lokasi.ringkas}</p>
            <p className="t-micro muted mt-1">{kost.last_updated}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup detail kost"
            className="chip rounded-2xl p-2.5 shrink-0"><Icon name="x" size={18} strokeWidth={2.4} /></button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-6 pb-28 sm:pb-6 flex flex-col gap-5">

          {/* Galeri */}
          <section aria-label="Foto hasil kunjungan">
            <div className="relative rounded-3xl overflow-hidden clay-soft">
              {fotoAktif ? (
                <img src={fotoAktif} alt={`Foto ${kost.nama}`} className="w-full h-65 sm:h-80 object-contain bg-gray-200" loading="lazy" />
              ) : (
                <RoomArt hue={kost.hue} variant={foto % 3} className="w-full h-44 sm:h-40" />
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between gap-2 foto-kaki">
                <span className="inline-flex items-center gap-1.5 t-micro font-bold" style={{ color: "#2b3049" }}>
                  <Icon name="camera" size={13} strokeWidth={2.3} /> {fotoAktif ? "Tanpa lensa wide" : "Ilustrasi sementara"}
                </span>
                <span className="t-micro font-semibold" style={{ color: "#5a6080" }}>{foto + 1}/{jumlahFoto}</span>
              </div>
              {jumlahFoto > 1 && (
                <>
                  <button type="button" aria-label="Foto sebelumnya" onClick={() => setFoto((f) => (f + jumlahFoto - 1) % jumlahFoto)}
                    className="chip rounded-full p-2 absolute left-3 top-1/2 -translate-y-1/2"><Icon name="chevronLeft" size={16} strokeWidth={2.5} /></button>
                  <button type="button" aria-label="Foto berikutnya" onClick={() => setFoto((f) => (f + 1) % jumlahFoto)}
                    className="chip rounded-full p-2 absolute right-3 top-1/2 -translate-y-1/2"><Icon name="chevronRight" size={16} strokeWidth={2.5} /></button>
                </>
              )}
            </div>
            <p className="t-small muted mt-2 flex items-start gap-1.5">
              <Icon name="info" size={15} className="shrink-0 mt-0.5" />
              Semua foto yang terverifikasi diambil surveyor dengan lensa standar, tanpa penyuntingan. Ukuran kamar yang Anda lihat sama dengan aslinya.
            </p>
          </section>

          {/* Yang sering tidak disebut di iklan */}
          <section aria-labelledby="jujur-judul" className="callout rounded-3xl p-4">
            <h3 id="jujur-judul" className="t-h3 flex items-center gap-2">
              <Icon name="alert" size={17} strokeWidth={2.2} /> Yang sering tidak disebut di iklan
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li className="flex items-start gap-2.5">
                <Icon name="receipt" size={16} className="shrink-0 mt-0.5" strokeWidth={2.1} />
                <p className="t-small">
                  <strong className="font-bold">Iuran di luar sewa: </strong>
                  {kost.iuran_tambahan.map((i, n) => (
                    <span key={i.label}>
                      {n > 0 && " · "}
                      {i.label} {typeof i.nominal === "number" ? (i.nominal > 0 ? rupiahRingkas(i.nominal) + "/bln" : "termasuk") : "token mandiri"}
                    </span>
                  ))}
                </p>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="clock" size={16} className="shrink-0 mt-0.5" strokeWidth={2.1} />
                <p className="t-small"><strong className="font-bold">Jam malam: </strong>{kost.aturan.jam_malam_catatan}</p>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="wallet" size={16} className="shrink-0 mt-0.5" strokeWidth={2.1} />
                <p className="t-small">
                  <strong className="font-bold">Deposit: </strong>
                  {kost.deposit.nominal > 0 ? `${rupiah(kost.deposit.nominal)} — ${kost.deposit.catatan}` : kost.deposit.catatan}
                </p>
              </li>
            </ul>
          </section>

          {/* Hasil verifikasi kunjungan */}
          <section aria-labelledby="verif-judul" className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 id="verif-judul" className="t-h3 flex items-center gap-2">
                <Icon name="sparkle" size={18} strokeWidth={2.1} style={{ color: "var(--brand)" }} />
                Hasil verifikasi kunjungan
              </h3>
              <p className="t-micro muted">
                {kost.verified ? `Surveyor ${kost.verifikasi.surveyor} · ${kost.verifikasi.tanggal}` : "Belum dikunjungi surveyor"}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="clay-soft rounded-3xl p-4">
                <p className="t-small muted flex items-center gap-1.5"><Icon name="droplet" size={15} /> Sanitasi & kebersihan</p>
                {kost.verifikasi.sanitasi ? (
                  <>
                    <p className="mt-1.5 mb-2"><span className="t-h2">{kost.verifikasi.sanitasi.toFixed(1)}</span><span className="t-small muted"> / 5,0</span></p>
                    <ScoreBar value={kost.verifikasi.sanitasi} />
                  </>
                ) : (
                  <p className="t-body font-bold mt-1.5 mb-2">Belum dinilai</p>
                )}
                <p className="t-micro muted mt-2">{kost.verifikasi.sanitasiCatatan}</p>
              </div>

              <div className="clay-soft rounded-3xl p-4">
                <p className="t-small muted flex items-center gap-1.5"><Icon name="activity" size={15} /> Uji WiFi (speedtest)</p>
                {kost.verifikasi.wifiMbps ? (
                  <>
                    <p className="mt-1.5 mb-2"><span className="t-h2">{kost.verifikasi.wifiMbps}</span><span className="t-small muted"> Mbps</span></p>
                    <ScoreBar value={Math.min(kost.verifikasi.wifiMbps, 60)} max={60} tone="var(--ok)" />
                  </>
                ) : (
                  <p className="t-body font-bold mt-1.5 mb-2">Belum diuji</p>
                )}
                <p className="t-micro muted mt-2">{kost.verifikasi.wifiCatatan}</p>
              </div>

              <div className="clay-soft rounded-3xl p-4 flex flex-col">
                <p className="t-small muted flex items-center gap-1.5"><Icon name="video" size={15} /> Video walkthrough</p>
                <div className="clay-in rounded-2xl flex-1 min-h-[5.5rem] mt-2 grid place-items-center text-center px-3 py-4">
                  <div>
                    <span className="clay-btn inline-grid place-items-center w-11 h-11 rounded-full mb-2">
                      <Icon name="play" size={16} fill="currentColor" strokeWidth={0} />
                    </span>
                    <p className="t-micro font-bold">Rekaman 30 detik</p>
                    <p className="t-micro muted">Tayang mulai 20 September</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="clay-in rounded-2xl p-3.5 t-small">{kost.catatan_jujur}</p>
          </section>

          {/* Fasilitas dipisah: kamar vs bersama */}
          <section aria-labelledby="fasilitas-judul" className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 id="fasilitas-judul" className="t-h3 mb-2.5 flex items-center gap-2">
                <Icon name="door" size={17} strokeWidth={2.1} style={{ color: "var(--brand)" }} /> Fasilitas di dalam kamar
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {kost.fasilitas_kamar.map((f) => (
                  <Tag key={f} icon={FASILITAS_KAMAR[f].icon} tone="kamar">{FASILITAS_KAMAR[f].label}</Tag>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="t-h3 mb-2.5 flex items-center gap-2">
                <Icon name="users" size={17} strokeWidth={2.1} style={{ color: "var(--brand)" }} /> Fasilitas bersama
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {kost.fasilitas_bersama.map((f) => (
                  <Tag key={f} icon={FASILITAS_BERSAMA[f].icon}>{FASILITAS_BERSAMA[f].label}</Tag>
                ))}
              </ul>
            </div>
          </section>

          {/* Rincian biaya */}
          <section aria-labelledby="biaya-judul">
            <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
              <h3 id="biaya-judul" className="t-h3">Rincian biaya</h3>
              <div className="segmen" role="group" aria-label="Pilih skema pembayaran">
                {[["bulan", "Per bulan"], ["tahun", "Per tahun"]].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setModeBayar(v)} aria-pressed={modeBayar === v}
                    className="segmen-btn t-small font-bold">{l}</button>
                ))}
              </div>
            </div>
            <dl className="clay-in rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between gap-3 t-small">
                <dt>Sewa kamar</dt><dd className="font-semibold">{rupiah(sewa)}</dd>
              </div>
              {kost.iuran_tambahan.map((i) => (
                <div key={i.label} className="flex justify-between gap-3 t-small">
                  <dt className="muted">{i.label}{i.catatan ? <span className="block t-micro">{i.catatan}</span> : null}</dt>
                  <dd className="font-semibold shrink-0">
                    {typeof i.nominal === "number"
                      ? (i.nominal > 0 ? rupiah(i.nominal * (modeBayar === "tahun" ? 12 : 1)) : "Termasuk")
                      : "Bayar sendiri"}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 pt-2.5 mt-1 border-t" style={{ borderColor: "var(--line)" }}>
                <dt className="t-small font-bold">Total {modeBayar === "tahun" ? "per tahun" : "per bulan"}</dt>
                <dd className="t-h3" style={{ color: "var(--brand)" }}>{rupiah(total)}</dd>
              </div>
              {adaBiayaTakPasti(kost) && (
                <p className="t-micro muted">Token listrik dibayar sendiri dan belum masuk total di atas.</p>
              )}
            </dl>
          </section>

          {/* Aturan */}
          <section aria-labelledby="aturan-judul">
            <h3 id="aturan-judul" className="t-h3 mb-2.5">Aturan penghuni</h3>
            <dl className="grid sm:grid-cols-2 gap-2">
              {[
                ["clock", "Jam malam", kost.aturan.jam_malam_catatan],
                ["key", "Akses kunci", kost.aturan.akses_kunci],
                ["users", "Aturan tamu", kost.aturan.tamu],
                ["zap", "Listrik", kost.listrik.detail],
                [klosetKey === "kloset_duduk" ? "klosetDuduk" : "klosetJongkok", "Kloset", FASILITAS_KAMAR[klosetKey].label],
                ["mapPin", "Catatan lokasi", kost.lokasi.catatan],
              ].map(([ic, k, v]) => (
                <div key={k} className="clay-in rounded-2xl px-3.5 py-3">
                  <dt className="t-micro muted flex items-center gap-1.5"><Icon name={ic} size={13} strokeWidth={2.2} />{k}</dt>
                  <dd className="t-small font-semibold mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* Aksi utama — mengambang di atas konten */}
        <div className="modal-aksi p-4 sm:p-5 flex items-center gap-3">
          <p className="hidden sm:block mr-auto">
            <span className="t-h3" style={{ color: "var(--brand)" }}>{rupiah(total)}</span>
            <span className="t-small muted">{labelBayar(modeBayar)} · {kost.kamarSisa} dari {kost.totalKamar} kamar kosong</span>
          </p>
          <button type="button" className="chip rounded-2xl px-4 py-3.5 t-small font-bold inline-flex items-center justify-center gap-2 shrink-0">
            <Icon name="bookmark" size={16} strokeWidth={2.2} /> <span className="hidden xs:inline">Simpan</span>
          </button>
          <a href={penuh ? undefined : `https://wa.me/${kost.wa}?text=${waText}`}
            target="_blank" rel="noopener noreferrer" aria-disabled={penuh}
            onClick={(e) => { if (penuh) e.preventDefault(); }}
            className={`clay-btn-wa rounded-2xl px-5 py-3.5 inline-flex items-center justify-center gap-2.5 flex-1 sm:flex-none ${penuh ? "opacity-50 pointer-events-none" : ""}`}>
            <WhatsAppGlyph size={20} />
            <span className="t-body font-extrabold">{penuh ? "Kamar sedang penuh" : "Hubungi pemilik (WA)"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   7. BOTTOM SHEET PEMBANDING (maks. 2 kost, geser mendatar)
========================================================= */
const BARIS_BANDING = [
  {
    kunci: "total", label: "Total yang dibayar", icon: "wallet",
    nilai: (k, bayar) => rupiah(totalBayar(k, bayar)),
    catatan: (k, bayar) => `Sewa ${rupiahRingkas(bayar === "tahun" ? k.harga.tahun : k.harga.bulan)} + iuran ${rupiahRingkas(bayar === "tahun" ? iuranPasti(k) * 12 : iuranPasti(k))}`,
    skor: (k, bayar) => -totalBayar(k, bayar),
  },
  {
    kunci: "jarak", label: "Jarak ke kampus", icon: "mapPin",
    nilai: (k) => `${k.lokasi.jarakKm} km`,
    catatan: (k) => k.lokasi.ringkas,
    skor: (k) => -k.lokasi.jarakKm,
  },
  {
    kunci: "kloset", label: "Kloset", icon: "klosetDuduk",
    nilai: (k) => (k.kloset === "duduk" ? "Duduk" : "Jongkok"),
    catatan: (k) => (k.fasilitas_kamar.includes("km_dalam") ? "Kamar mandi dalam" : "Kamar mandi luar"),
    skor: null,
  },
  {
    kunci: "listrik", label: "Listrik", icon: "zap",
    nilai: (k) => k.listrik.model,
    catatan: (k) => k.listrik.detail,
    skor: null,
  },
  {
    kunci: "wifi", label: "WiFi terukur", icon: "wifi",
    nilai: (k) => (k.verifikasi.wifiMbps ? `${k.verifikasi.wifiMbps} Mbps` : "Belum diuji"),
    catatan: (k) => k.verifikasi.wifiCatatan,
    skor: (k) => k.verifikasi.wifiMbps || 0,
  },
  {
    kunci: "jam", label: "Jam malam", icon: "clock",
    nilai: (k) => (k.aturan.jam_malam === "Bebas" ? "Bebas 24 jam" : k.aturan.jam_malam),
    catatan: (k) => k.aturan.tamu,
    skor: null,
  },
];

function CompareSheet({ daftar, bayar, onClose, onHapus, onOpen }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const selisih = daftar.length === 2 ? Math.abs(totalBayar(daftar[0], bayar) - totalBayar(daftar[1], bayar)) : 0;
  const lebihMurah = daftar.length === 2
    ? (totalBayar(daftar[0], bayar) < totalBayar(daftar[1], bayar) ? daftar[0] : daftar[1])
    : null;

  /* Pemenang tiap baris — dipakai untuk menandai kolom, bukan mengurutkan */
  const unggul = (baris) => {
    if (!baris.skor || daftar.length < 2) return null;
    const a = baris.skor(daftar[0], bayar), b = baris.skor(daftar[1], bayar);
    if (a === b) return null;
    return a > b ? daftar[0].id : daftar[1].id;
  };

  return (
    <div className="fixed inset-0 z-[60] scrim anim-fade flex items-end justify-center"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section ref={sheetRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="banding-judul"
        className="clay anim-sheet w-full sm:max-w-3xl rounded-t-3xl max-h-[88vh] flex flex-col overflow-hidden focus:outline-none">
        <header className="p-4 sm:p-5 pb-3 flex items-start gap-3 border-b" style={{ borderColor: "var(--line)" }}>
          <span className="clay-in rounded-2xl w-10 h-10 grid place-items-center shrink-0">
            <Icon name="scale" size={18} strokeWidth={2.1} style={{ color: "var(--brand)" }} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="banding-judul" className="t-h3">Membandingkan {daftar.length} kost</h2>
            <p className="t-small muted">
              {lebihMurah
                ? `${lebihMurah.nama} lebih murah ${rupiah(selisih)} ${bayar === "tahun" ? "per tahun" : "per bulan"}.`
                : "Pilih satu kost lagi untuk melihat perbandingan berdampingan."}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup pembanding" className="chip rounded-2xl p-2.5 shrink-0">
            <Icon name="x" size={18} strokeWidth={2.4} />
          </button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-5">
          <p className="t-micro muted mb-2 flex items-center gap-1.5 sm:hidden">
            <Icon name="chevronLeft" size={13} strokeWidth={2.4} /> Geser mendatar untuk melihat kost berikutnya
          </p>
          <div className="geser-x flex gap-3 pb-2">
            {daftar.map((k) => (
              <article key={k.id} className="kolom-banding clay-soft rounded-3xl p-4 shrink-0 flex flex-col gap-3">
                <header className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="t-h3 leading-snug">{k.nama}</h3>
                    <p className="t-micro muted mt-0.5">{k.tipe} · {k.lokasi.area}</p>
                  </div>
                  <button type="button" onClick={() => onHapus(k.id)} aria-label={`Keluarkan ${k.nama} dari pembanding`}
                    className="chip rounded-xl p-2 shrink-0"><Icon name="x" size={14} strokeWidth={2.4} /></button>
                </header>

                <dl className="flex flex-col gap-2">
                  {BARIS_BANDING.map((b) => {
                    const menang = unggul(b) === k.id;
                    return (
                      <div key={b.kunci} className="clay-in rounded-2xl px-3.5 py-2.5">
                        <dt className="t-micro muted flex items-center gap-1.5">
                          <Icon name={b.icon} size={13} strokeWidth={2.2} />{b.label}
                        </dt>
                        <dd className="mt-0.5">
                          <span className="t-small font-bold">{b.nilai(k, bayar)}</span>
                          {menang && (
                            <span className="ml-1.5 rounded-full px-2 py-0.5 t-micro font-bold align-middle"
                              style={{ background: "var(--ok-soft)", color: "var(--ok)" }}>lebih unggul</span>
                          )}
                          <span className="block t-micro muted mt-0.5">{b.catatan(k, bayar)}</span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <button type="button" onClick={() => onOpen(k)}
                  className="clay-btn rounded-2xl px-4 py-3 t-small mt-auto inline-flex items-center justify-center gap-2">
                  Buka hasil survei <Icon name="chevronRight" size={15} strokeWidth={2.5} />
                </button>
              </article>
            ))}

            {daftar.length === 1 && (
              <div className="kolom-banding clay-in rounded-3xl p-5 shrink-0 grid place-items-center text-center">
                <div>
                  <Icon name="scale" size={22} className="muted" />
                  <p className="t-small font-bold mt-2">Pilih satu kost lagi</p>
                  <p className="t-micro muted mt-1">Tutup panel ini, lalu ketuk “Bandingkan” di kartu kost lain.</p>
                </div>
              </div>
            )}
          </div>

          {adaBiayaTakPasti(daftar[0]) || (daftar[1] && adaBiayaTakPasti(daftar[1])) ? (
            <p className="t-micro muted mt-2 flex items-start gap-1.5">
              <Icon name="info" size={14} className="shrink-0 mt-0.5" />
              Kost dengan listrik token: total di atas belum termasuk pembelian token bulanan.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   8. PANEL FILTER
========================================================= */
function FilterPanel({ f, set, reset, jumlah }) {
  const batas = BATAS_HARGA[f.bayar];
  const toggleFasilitas = (key) =>
    set((p) => ({ ...p, fasilitas: p.fasilitas.includes(key) ? p.fasilitas.filter((x) => x !== key) : [...p.fasilitas, key] }));

  return (
    <div className="flex flex-col gap-5">
      <FilterGroup title="Skema pembayaran">
        <div className="segmen w-full" role="group" aria-label="Skema pembayaran">
          {[["bulan", "Per bulan"], ["tahun", "Per tahun"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => set((p) => ({ ...p, bayar: v }))}
              aria-pressed={f.bayar === v} className="segmen-btn t-small font-bold flex-1">{l}</button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={`Total maksimal — ${rupiah(f.hargaMax[f.bayar])}${labelBayar(f.bayar)}`}>
        <input type="range" min={batas.min} max={batas.max} step={batas.step} value={f.hargaMax[f.bayar]}
          onChange={(e) => set((p) => ({ ...p, hargaMax: { ...p.hargaMax, [p.bayar]: Number(e.target.value) } }))}
          aria-label={`Total biaya maksimal ${f.bayar === "tahun" ? "per tahun" : "per bulan"}`} />
        <div className="flex justify-between t-micro muted -mt-1">
          <span>{rupiahRingkas(batas.min)}</span><span>{rupiahRingkas(batas.max)}</span>
        </div>
        <p className="t-micro muted mt-1">Sudah termasuk iuran sampah dan air, belum termasuk token listrik.</p>
      </FilterGroup>

      <FilterGroup title="Tipe kamar">
        <div className="flex flex-wrap gap-2">
          {[["all", "Semua", null], ["Putra", "Putra", "user"], ["Putri", "Putri", "user"], ["Campur", "Campur", "users"]].map(([v, l, ic]) => (
            <Chip key={v} active={f.tipe === v} icon={ic} onClick={() => set((p) => ({ ...p, tipe: v }))}>{l}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Tipe kloset">
        <div className="flex flex-wrap gap-2">
          {[["all", "Semua", null], ["duduk", "Duduk", "klosetDuduk"], ["jongkok", "Jongkok", "klosetJongkok"]].map(([v, l, ic]) => (
            <Chip key={v} active={f.kloset === v} icon={ic} onClick={() => set((p) => ({ ...p, kloset: v }))}>{l}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Jarak dari gerbang UNNES">
        <div className="flex flex-wrap gap-2">
          {[["all", "Semua"], ["dekat", "Di bawah 1 km"], ["sedang", "1–3 km"], ["jauh", "Lebih dari 3 km"]].map(([v, l]) => (
            <Chip key={v} active={f.jarak === v} onClick={() => set((p) => ({ ...p, jarak: v }))}>{l}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Listrik">
        <div className="flex flex-wrap gap-2">
          {[["all", "Semua"], ["Include", "Termasuk sewa"], ["Token Mandiri", "Token mandiri"]].map(([v, l]) => (
            <Chip key={v} active={f.listrik === v} icon={v === "all" ? null : "zap"} onClick={() => set((p) => ({ ...p, listrik: v }))}>{l}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Fasilitas wajib ada">
        <div className="flex flex-wrap gap-2">
          {FASILITAS_FILTER.map((k) => (
            <Chip key={k} active={f.fasilitas.includes(k)} icon={FASILITAS[k].icon} onClick={() => toggleFasilitas(k)}>
              {FASILITAS[k].short}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Ketersediaan">
        <div className="flex flex-wrap gap-2">
          {[["all", "Semua"], ["Tersedia", "Masih ada kamar"], ["Penuh", "Penuh"]].map(([v, l]) => (
            <Chip key={v} active={f.status === v} onClick={() => set((p) => ({ ...p, status: v }))}>{l}</Chip>
          ))}
        </div>
      </FilterGroup>

      <div className="flex items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
        <p className="t-small muted">{jumlah} kost cocok</p>
        <button type="button" onClick={reset} className="chip rounded-2xl px-3.5 py-2 t-small font-bold inline-flex items-center gap-1.5">
          <Icon name="rotate" size={15} strokeWidth={2.2} /> Atur ulang
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   9. APLIKASI
========================================================= */
function App() {
  const [f, setF] = useState(FILTER_AWAL);
  const [aktif, setAktif] = useState(null);
  const [banding, setBanding] = useState([]);       // maksimal 2 id
  const [sheetBuka, setSheetBuka] = useState(false);
  const [tampilan, setTampilan] = useState("list"); // list | peta
  const [filterTerbuka, setFilterTerbuka] = useState(false);
  const [tema, setTema] = useState(() => {
    try {
      const simpan = localStorage.getItem("kk-tema");
      if (simpan) return simpan;
    } catch (e) { /* mode privat: abaikan */ }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  const gantiTema = useCallback(() => {
    setTema((t) => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem("kk-tema", next); } catch (e) { /* mode privat: abaikan */ }
      return next;
    });
  }, []);

  const hasil = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const cocok = KOST.filter((k) => {
      if (q) {
        const heystack = `${k.nama} ${k.lokasi.area} ${k.lokasi.fakultas}`.toLowerCase();
        if (!heystack.includes(q)) return false;
      }
      if (totalBayar(k, f.bayar) > f.hargaMax[f.bayar]) return false;
      if (f.jarak !== "all" && bucketJarak(k.lokasi.jarakKm) !== f.jarak) return false;
      if (f.tipe !== "all" && k.tipe !== f.tipe) return false;
      if (f.kloset !== "all" && k.kloset !== f.kloset) return false;
      if (f.listrik !== "all" && k.listrik.model !== f.listrik) return false;
      if (f.status !== "all" && k.status !== f.status) return false;
      if (f.fasilitas.some((x) => !k.fasilitas_kamar.includes(x) && !k.fasilitas_bersama.includes(x))) return false;
      return true;
    });
    const urutkan = {
      jarak: (a, b) => a.lokasi.jarakKm - b.lokasi.jarakKm,
      murah: (a, b) => totalBayar(a, f.bayar) - totalBayar(b, f.bayar),
      bersih: (a, b) => (b.verifikasi.sanitasi || 0) - (a.verifikasi.sanitasi || 0),
      cepat: (a, b) => (b.verifikasi.wifiMbps || 0) - (a.verifikasi.wifiMbps || 0),
    }[f.urut];
    return [...cocok].sort(urutkan);
  }, [f]);

  const daftarBanding = useMemo(() => banding.map((id) => KOST.find((k) => k.id === id)).filter(Boolean), [banding]);

  /* Updater tetap murni; pembukaan sheet ditangani efek di bawah */
  const toggleBanding = useCallback((id) => {
    setBanding((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return prev.length >= 2 ? [prev[1], id] : [...prev, id]; // yang terlama tergeser
    });
  }, []);

  const hapusBanding = useCallback((id) => {
    setBanding((prev) => prev.filter((x) => x !== id));
  }, []);

  useEffect(() => {
    if (banding.length === 2) setSheetBuka(true);
    if (banding.length === 0) setSheetBuka(false);
  }, [banding]);

  const bukaDetail = useCallback((k) => { setSheetBuka(false); setAktif(k); }, []);
  const tutupDetail = useCallback(() => setAktif(null), []);
  const reset = useCallback(() => setF({ ...FILTER_AWAL, hargaMax: { ...FILTER_AWAL.hargaMax } }), []);

  const filterAktifCount =
    (f.hargaMax[f.bayar] !== FILTER_AWAL.hargaMax[f.bayar] ? 1 : 0) +
    (f.jarak !== "all" ? 1 : 0) + (f.tipe !== "all" ? 1 : 0) + (f.kloset !== "all" ? 1 : 0) +
    (f.listrik !== "all" ? 1 : 0) + (f.status !== "all" ? 1 : 0) + f.fasilitas.length;

  const jumlahVerified = useMemo(() => KOST.filter((k) => k.verified).length, []);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 nav-bar">
        <div className="max-w-content mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <a href="#hasil" className="flex items-center gap-2.5 mr-auto">
            <span className="clay-btn w-10 h-10 rounded-2xl grid place-items-center">
              <Icon name="door" size={19} strokeWidth={2.2} />
            </span>
            <span>
              <span className="t-h3 block leading-none">KlikKost</span>
              <span className="t-micro muted">UNNES · Gunungpati</span>
            </span>
          </a>
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 t-micro font-bold"
            style={{ background: "var(--mint)", color: "var(--mint-ink)" }}>
            <Icon name="zap" size={13} strokeWidth={2.3} /> Buka di browser, tanpa unduh aplikasi
          </span>
          <button type="button" onClick={gantiTema} className="chip rounded-2xl p-2.5"
            aria-label="Ganti mode terang atau gelap">
            <Icon name={tema === "dark" ? "sun" : "moon"} size={17} strokeWidth={2.1} />
          </button>
        </div>
      </nav>

      <main className="max-w-content mx-auto px-4 sm:px-6 pb-24">
        {/* HERO */}
        <header className="pt-6 pb-8 sm:pt-10 sm:pb-12 grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-center">
          <div>
            <p className="t-small font-bold inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
              style={{ background: "var(--brand-soft)", color: "var(--brand-deep)" }}>
              <Icon name="shieldCheck" size={15} strokeWidth={2.3} />
              {jumlahVerified} kost sudah didatangi surveyor bulan ini
            </p>
            <h1 className="t-display">Cari kost tervalidasi di sekitar UNNES</h1>
            <p className="t-body muted mt-4 prose-width">
              Setiap kost di sini kami datangi sendiri: foto diambil dengan lensa standar, WiFi diuji speedtest,
              sanitasi dinilai satu per satu, dan iuran tersembunyi ditulis apa adanya. Tidak ada aplikasi yang perlu diunduh.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <label className="clay-in rounded-2xl flex items-center gap-2.5 px-4 py-3 flex-1">
                <Icon name="search" size={18} className="muted shrink-0" />
                <span className="sr-only">Cari nama kost, gang, atau fakultas</span>
                <input value={f.q} onChange={(e) => setF((p) => ({ ...p, q: e.target.value }))}
                  placeholder="Nama kost, gang, atau fakultas…"
                  className="bg-transparent border-0 outline-none w-full t-body placeholder:opacity-60"
                  style={{ color: "var(--ink)" }} />
                {f.q && (
                  <button type="button" onClick={() => setF((p) => ({ ...p, q: "" }))} aria-label="Hapus pencarian" className="muted shrink-0">
                    <Icon name="x" size={16} strokeWidth={2.4} />
                  </button>
                )}
              </label>
              <a href="#hasil" className="clay-btn rounded-2xl px-6 py-3.5 t-body inline-flex items-center justify-center gap-2 shrink-0">
                Lihat {KOST.length} kost <Icon name="chevronDown" size={17} strokeWidth={2.5} />
              </a>
            </div>

            <ul className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg">
              {[["camera", "Foto apa adanya", "tanpa lensa wide"],
                ["activity", "WiFi diukur", "speedtest di kamar"],
                ["receipt", "Iuran dibuka", "sampah, air, token"]].map(([ic, a, b]) => (
                <li key={a} className="clay-soft rounded-2xl px-3 py-3">
                  <Icon name={ic} size={17} strokeWidth={2.1} style={{ color: "var(--brand)" }} />
                  <p className="t-small font-bold mt-1.5 leading-tight">{a}</p>
                  <p className="t-micro muted">{b}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="clay rounded-3xl p-5 sm:p-6" aria-label="Contoh lembar verifikasi">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="t-h3">Lembar verifikasi</h2>
              <VerifiedBadge compact />
            </div>
            <RoomArt hue={262} variant={1} className="w-full h-32 rounded-2xl overflow-hidden mb-4" />
            <dl className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between t-small font-semibold mb-1.5">
                  <dt>Sanitasi & kebersihan</dt><dd>4,6 / 5,0</dd>
                </div>
                <ScoreBar value={4.6} />
              </div>
              <div>
                <div className="flex justify-between t-small font-semibold mb-1.5">
                  <dt>Uji WiFi</dt><dd>24 Mbps stabil</dd>
                </div>
                <ScoreBar value={24} max={60} tone="var(--ok)" />
              </div>
              <div className="clay-in rounded-2xl px-3.5 py-3 flex items-center gap-2.5">
                <Icon name="video" size={17} style={{ color: "var(--brand)" }} />
                <div>
                  <dt className="t-small font-bold">Video walkthrough 30 detik</dt>
                  <dd className="t-micro muted">Direkam saat surveyor berkunjung</dd>
                </div>
              </div>
            </dl>
            <p className="t-micro muted mt-4">Tiap kost berlabel Verified punya lembar seperti ini, dibuka lewat kartunya.</p>
          </aside>
        </header>

        {/* FILTER + HASIL */}
        <div id="hasil" className="grid lg:grid-cols-[19rem_1fr] gap-6 scroll-mt-20">
          <aside aria-label="Filter pencarian kost">
            <div className="lg:sticky lg:top-20">
              <button type="button" onClick={() => setFilterTerbuka((v) => !v)}
                aria-expanded={filterTerbuka} aria-controls="panel-filter"
                className="clay rounded-3xl w-full px-4 py-3.5 flex items-center gap-3 lg:hidden">
                <Icon name="sliders" size={18} strokeWidth={2.1} style={{ color: "var(--brand)" }} />
                <span className="t-h3">Filter</span>
                {filterAktifCount > 0 && (
                  <span className="rounded-full px-2 py-0.5 t-micro font-bold"
                    style={{ background: "var(--brand)", color: "#fff" }}>{filterAktifCount}</span>
                )}
                <span className="ml-auto t-small muted">{hasil.length} hasil</span>
                <Icon name={filterTerbuka ? "chevronUp" : "chevronDown"} size={17} strokeWidth={2.4} />
              </button>

              <div id="panel-filter" className={`${filterTerbuka ? "block" : "hidden"} lg:block clay rounded-3xl p-5 mt-3 lg:mt-0`}>
                <div className="hidden lg:flex items-center gap-2 mb-4">
                  <Icon name="sliders" size={18} strokeWidth={2.1} style={{ color: "var(--brand)" }} />
                  <h2 className="t-h3">Filter</h2>
                  {filterAktifCount > 0 && (
                    <span className="rounded-full px-2 py-0.5 t-micro font-bold ml-auto"
                      style={{ background: "var(--brand)", color: "#fff" }}>{filterAktifCount} aktif</span>
                  )}
                </div>
                <FilterPanel f={f} set={setF} reset={reset} jumlah={hasil.length} />
              </div>
            </div>
          </aside>

          <section aria-label="Daftar kost">
            <div className="flex items-end justify-between gap-3 flex-wrap mb-4">
              <div>
                <h2 className="t-h2">Kost di sekitar kampus</h2>
                <p className="t-small muted mt-1">{hasil.length} dari {KOST.length} kost cocok dengan filter Anda.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="segmen" role="group" aria-label="Pilih tampilan">
                  {[["list", "Daftar", "list"], ["peta", "Peta", "map"]].map(([v, l, ic]) => (
                    <button key={v} type="button" onClick={() => setTampilan(v)} aria-pressed={tampilan === v}
                      className="segmen-btn t-small font-bold inline-flex items-center gap-1.5">
                      <Icon name={ic} size={15} strokeWidth={2.2} />{l}
                    </button>
                  ))}
                </div>
                <label className="clay-in rounded-2xl px-3.5 py-2.5 flex items-center gap-2 t-small font-semibold">
                  <span className="muted">Urutkan</span>
                  <select value={f.urut} onChange={(e) => setF((p) => ({ ...p, urut: e.target.value }))}
                    className="bg-transparent border-0 outline-none font-bold cursor-pointer"
                    style={{ color: "var(--ink)" }} aria-label="Urutkan hasil">
                    <option value="jarak">Terdekat</option>
                    <option value="murah">Termurah</option>
                    <option value="bersih">Paling bersih</option>
                    <option value="cepat">WiFi tercepat</option>
                  </select>
                </label>
              </div>
            </div>

            {hasil.length === 0 ? (
              <div className="clay rounded-3xl p-8 text-center">
                <span className="clay-in w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-4">
                  <Icon name="search" size={22} className="muted" />
                </span>
                <h3 className="t-h3">Belum ada kost yang cocok</h3>
                <p className="t-small muted mt-1.5 max-w-sm mx-auto">
                  Naikkan batas total biaya, lepas satu fasilitas wajib, atau perluas jarak dari kampus.
                </p>
                <button type="button" onClick={reset} className="clay-btn rounded-2xl px-5 py-3 t-small mt-5 inline-flex items-center gap-2">
                  <Icon name="rotate" size={16} strokeWidth={2.3} /> Atur ulang filter
                </button>
              </div>
            ) : tampilan === "list" ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {hasil.map((k) => (
                  <KostCard key={k.id} kost={k} bayar={f.bayar} onOpen={bukaDetail}
                    dibandingkan={banding.includes(k.id)} onToggleBanding={toggleBanding}
                    bandingPenuh={banding.length >= 2} />
                ))}
              </div>
            ) : (
              <MapView daftar={hasil} bayar={f.bayar} onOpen={bukaDetail} />
            )}

            <p className="t-small muted mt-6 flex items-start gap-2">
              <Icon name="info" size={16} className="shrink-0 mt-0.5" />
              Data pada prototipe ini masih contoh. Harga, jarak, dan hasil survei diperbarui tiap surveyor berkunjung ulang.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-content mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="t-h3">KlikKost</p>
            <p className="t-small muted">Direktori kost yang disurvei langsung di Sekaran, Gunungpati, Semarang.</p>
          </div>
          <p className="t-small muted">Prototipe antarmuka · September 2026</p>
        </div>
      </footer>

      {/* Bilah pembanding mengambang */}
      {banding.length > 0 && !sheetBuka && (
        <div className="bilah-banding clay rounded-3xl px-3 py-2.5 flex items-center gap-3">
          <span className="clay-in rounded-2xl w-9 h-9 grid place-items-center shrink-0">
            <Icon name="scale" size={16} strokeWidth={2.2} style={{ color: "var(--brand)" }} />
          </span>
          <p className="t-small font-bold leading-tight">
            {banding.length} kost dipilih
            <span className="block t-micro muted font-semibold">
              {banding.length === 1 ? "Pilih satu lagi untuk membandingkan" : "Siap dibandingkan"}
            </span>
          </p>
          <button type="button" onClick={() => setBanding([])} className="chip rounded-2xl p-2.5" aria-label="Kosongkan pembanding">
            <Icon name="x" size={15} strokeWidth={2.4} />
          </button>
          <button type="button" onClick={() => setSheetBuka(true)}
            className="clay-btn rounded-2xl px-4 py-2.5 t-small inline-flex items-center gap-2">
            Bandingkan
          </button>
        </div>
      )}

      {aktif && <DetailModal kost={aktif} bayar={f.bayar} onClose={tutupDetail} />}
      {sheetBuka && daftarBanding.length > 0 && (
        <CompareSheet daftar={daftarBanding} bayar={f.bayar} onClose={() => setSheetBuka(false)}
          onHapus={hapusBanding} onOpen={bukaDetail} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
