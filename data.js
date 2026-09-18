/* =========================================================
   KlikKost — LAPISAN DATA
   Semua mock data dan kamus dipisahkan dari komponen UI supaya
   nanti mudah diganti respons API tanpa menyentuh app.js.
   Diekspos lewat window.KK agar aman dipakai lintas <script>.
   ========================================================= */
(function (global) {
  "use strict";

  /* ---------- Kamus fasilitas kamar (privat, dipakai penghuni sendiri) ---------- */
  const FASILITAS_KAMAR = {
    kasur:          { label: "Kasur + sprei",        short: "Kasur",     icon: "bed" },
    meja:           { label: "Meja belajar",         short: "Meja",      icon: "desk" },
    lemari:         { label: "Lemari pakaian",       short: "Lemari",    icon: "wardrobe" },
    kloset_duduk:   { label: "Kloset duduk",         short: "Kloset duduk",   icon: "klosetDuduk" },
    kloset_jongkok: { label: "Kloset jongkok",       short: "Kloset jongkok", icon: "klosetJongkok" },
    km_dalam:       { label: "Kamar mandi dalam",    short: "KM dalam",  icon: "droplet" },
    km_luar:        { label: "Kamar mandi luar",     short: "KM luar",   icon: "droplet" },
    jendela_luar:   { label: "Jendela menghadap luar", short: "Jendela luar",  icon: "window" },
    jendela_dalam:  { label: "Jendela menghadap koridor", short: "Jendela dalam", icon: "window" },
    ac:             { label: "AC",                   short: "AC",        icon: "snow" },
    water_heater:   { label: "Water heater",         short: "Heater",    icon: "flame" },
  };

  /* ---------- Kamus fasilitas bersama (dipakai ramai-ramai) ---------- */
  const FASILITAS_BERSAMA = {
    dapur:        { label: "Dapur bersama",      short: "Dapur",    icon: "utensils" },
    kulkas:       { label: "Kulkas bersama",     short: "Kulkas",   icon: "fridge" },
    parkir_motor: { label: "Parkir motor",       short: "Parkir",   icon: "bike" },
    jemuran:      { label: "Jemuran atap",       short: "Jemuran",  icon: "hanger" },
    wifi:         { label: "WiFi 24 jam",        short: "WiFi",     icon: "wifi" },
    laundry:      { label: "Laundry di tempat",  short: "Laundry",  icon: "shirt" },
    ruang_belajar:{ label: "Ruang belajar",      short: "R. belajar", icon: "book" },
    cctv:         { label: "CCTV koridor",       short: "CCTV",     icon: "camera" },
  };

  /* ---------- Data kost ----------
     iuran_tambahan[].nominal = rupiah per bulan; 0 berarti sudah termasuk sewa;
     null berarti tidak bisa dipastikan di muka (mis. token listrik). */
  const KOST = [
    {
      id: "melati-a",
      nama: "Kost Melati Tipe A",
      tipe: "Putri",
      verified: true,
      last_updated: "Diperbarui 2 hari lalu",
      status: "Tersedia",
      kamarSisa: 3,
      totalKamar: 12,
      hue: 262,
      peta: { x: 30, y: 38 },
      wa: "6281234567801",
      harga: { bulan: 850000, tahun: 9180000 },
      iuran_tambahan: [
        { label: "Sampah", nominal: 20000, catatan: "Ditarik ibu kos tiap tanggal 5" },
        { label: "Air", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Listrik", nominal: null, catatan: "Token mandiri, rata-rata Rp 60–80rb/bulan" },
      ],
      listrik: { model: "Token Mandiri", detail: "Meteran token per kamar, isi sendiri di Indomaret depan gang" },
      deposit: { nominal: 300000, catatan: "Kembali penuh saat keluar kalau kamar utuh" },
      lokasi: {
        area: "Gang Cempakasari, Sekaran",
        fakultas: "FBS UNNES",
        jarakKm: 0.4,
        jalanKaki: 6,
        ringkas: "6 menit jalan kaki ke FBS UNNES",
        catatan: "Lewat gang kecil, aspal mulus, ada lampu jalan sampai mulut gang.",
      },
      kloset: "duduk",
      fasilitas_kamar: ["kasur", "meja", "lemari", "km_dalam", "kloset_duduk", "jendela_luar"],
      fasilitas_bersama: ["wifi", "dapur", "parkir_motor", "jemuran"],
      aturan: {
        jam_malam: "23.00",
        jam_malam_catatan: "Gerbang dikunci 23.00, penghuni pegang PIN sendiri",
        akses_kunci: "PIN gerbang + kunci kamar sendiri",
        tamu: "Tamu putri boleh sampai 21.00, hanya di ruang tamu",
      },
      verifikasi: {
        wifiMbps: 24,
        wifiCatatan: "Diuji di kamar lantai 2 pukul 20.00, stabil",
        sanitasi: 4.6,
        sanitasiCatatan: "Kamar mandi kering, ada exhaust, dibersihkan 2 hari sekali",
        surveyor: "Rani",
        tanggal: "12 September 2026",
      },
      catatan_jujur:
        "Pemilik tinggal di rumah depan, jadi perbaikan cepat ditangani. Kamar 7 dan 9 kena matahari pagi; kamar 3 gelap sepanjang hari.",
    },
    {
      id: "budi-unnes",
      nama: "Kost Budi UNNES",
      tipe: "Putra",
      verified: true,
      last_updated: "Diperbarui 5 hari lalu",
      status: "Tersedia",
      kamarSisa: 5,
      totalKamar: 16,
      hue: 200,
      peta: { x: 48, y: 55 },
      wa: "6281234567802",
      harga: { bulan: 650000, tahun: 7020000 },
      iuran_tambahan: [
        { label: "Sampah", nominal: 15000, catatan: "Dibayar bareng sewa" },
        { label: "Air", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Listrik", nominal: 0, catatan: "Termasuk, batas 450 watt per kamar" },
      ],
      listrik: { model: "Include", detail: "Termasuk sewa, maksimal 450 watt — rice cooker boleh, AC tidak" },
      deposit: { nominal: 200000, catatan: "Dipotong kalau ada kerusakan" },
      lokasi: {
        area: "Jl. Taman Siswa, Sekaran",
        fakultas: "FMIPA UNNES",
        jarakKm: 0.8,
        jalanKaki: 11,
        ringkas: "11 menit jalan kaki ke FMIPA UNNES",
        catatan: "Jalan utama, ramai kendaraan sampai malam. Warung buka 24 jam di seberang.",
      },
      kloset: "jongkok",
      fasilitas_kamar: ["kasur", "meja", "lemari", "km_luar", "kloset_jongkok", "jendela_luar"],
      fasilitas_bersama: ["wifi", "dapur", "parkir_motor", "jemuran"],
      aturan: {
        jam_malam: "Bebas",
        jam_malam_catatan: "Bebas 24 jam, wajib lapor kalau menginap di luar lebih dari semalam",
        akses_kunci: "Kunci gerbang dipegang tiap penghuni",
        tamu: "Tamu putra sampai 22.00, tidak boleh menginap",
      },
      verifikasi: {
        wifiMbps: 18,
        wifiCatatan: "Turun ke 8 Mbps pukul 21.00 saat 12 orang online bersamaan",
        sanitasi: 4.1,
        sanitasiCatatan: "4 kamar mandi untuk 16 kamar, antre paling ramai 06.30–07.30",
        surveyor: "Fajar",
        tanggal: "9 September 2026",
      },
      catatan_jujur:
        "Termurah yang masih jalan kaki ke kampus, tapi kamar mandi luar dan antrenya nyata. Dinding antar kamar tripleks, suara tembus.",
    },
    {
      id: "sekaran-residence",
      nama: "Griya Sekaran Residence",
      tipe: "Campur",
      verified: true,
      last_updated: "Diperbarui kemarin",
      status: "Tersedia",
      kamarSisa: 2,
      totalKamar: 10,
      hue: 160,
      peta: { x: 66, y: 30 },
      wa: "6281234567803",
      harga: { bulan: 1450000, tahun: 15660000 },
      iuran_tambahan: [
        { label: "Sampah & kebersihan", nominal: 25000, catatan: "Petugas menyapu koridor tiap hari" },
        { label: "Air", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Listrik", nominal: null, catatan: "Token mandiri, rata-rata Rp 150rb/bulan kalau AC dipakai malam" },
      ],
      listrik: { model: "Token Mandiri", detail: "Meteran token per kamar, cukup untuk AC 1/2 PK" },
      deposit: { nominal: 500000, catatan: "Kembali setelah pengecekan kamar" },
      lokasi: {
        area: "Jl. Kalimasada, Sekaran",
        fakultas: "FE & FT UNNES",
        jarakKm: 1.6,
        jalanKaki: 21,
        ringkas: "21 menit jalan kaki atau 5 menit motor ke FE UNNES",
        catatan: "Tanjakan lumayan di 500 meter terakhir; kebanyakan penghuni pakai motor.",
      },
      kloset: "duduk",
      fasilitas_kamar: ["kasur", "meja", "lemari", "km_dalam", "kloset_duduk", "ac", "jendela_luar"],
      fasilitas_bersama: ["wifi", "laundry", "parkir_motor", "jemuran", "ruang_belajar", "cctv"],
      aturan: {
        jam_malam: "Bebas",
        jam_malam_catatan: "Akses kartu 24 jam, lantai putra dan putri dipisah",
        akses_kunci: "Kartu akses gerbang + kunci kamar",
        tamu: "Tamu hanya sampai lobi, tidak boleh naik ke lantai kamar",
      },
      verifikasi: {
        wifiMbps: 45,
        wifiCatatan: "Fiber 100 Mbps dibagi 10 kamar, diuji di kamar paling ujung",
        sanitasi: 4.8,
        sanitasiCatatan: "Kamar mandi dalam berkeramik penuh, tidak ada jamur di nat",
        surveyor: "Rani",
        tanggal: "14 September 2026",
      },
      catatan_jujur:
        "Bangunan 2024, paling rapi di daftar ini. Tapi hitung ulang: token listrik AC bikin biaya bulanan naik sekitar Rp 150rb.",
    },
    {
      id: "cempaka-asri",
      nama: "Kost Cempaka Asri",
      tipe: "Putri",
      verified: true,
      last_updated: "Diperbarui 2 minggu lalu",
      status: "Penuh",
      kamarSisa: 0,
      totalKamar: 8,
      hue: 330,
      peta: { x: 22, y: 62 },
      wa: "6281234567804",
      harga: { bulan: 1100000, tahun: 11880000 },
      iuran_tambahan: [
        { label: "Sampah", nominal: 20000, catatan: "" },
        { label: "Air", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Listrik", nominal: null, catatan: "Token mandiri, rata-rata Rp 100rb/bulan" },
      ],
      listrik: { model: "Token Mandiri", detail: "Meteran token per kamar" },
      deposit: { nominal: 400000, catatan: "Kembali penuh kalau menginap minimal 6 bulan" },
      lokasi: {
        area: "Jl. Cempaka Sari II, Sekaran",
        fakultas: "FIP UNNES",
        jarakKm: 1.2,
        jalanKaki: 16,
        ringkas: "16 menit jalan kaki ke FIP UNNES",
        catatan: "Gang tenang, minim kendaraan, tapi lampu jalan mati di dua titik.",
      },
      kloset: "duduk",
      fasilitas_kamar: ["kasur", "meja", "lemari", "km_dalam", "kloset_duduk", "ac", "jendela_dalam"],
      fasilitas_bersama: ["wifi", "dapur", "kulkas", "parkir_motor", "jemuran"],
      aturan: {
        jam_malam: "22.30",
        jam_malam_catatan: "Gerbang 22.30, ibu kos tinggal di dalam dan benar-benar mengunci",
        akses_kunci: "Kunci kamar sendiri, gerbang dipegang ibu kos",
        tamu: "Tamu putri saja, maksimal sampai 20.00",
      },
      verifikasi: {
        wifiMbps: 32,
        wifiCatatan: "Router terpisah tiap lantai, sinyal penuh di semua kamar",
        sanitasi: 4.7,
        sanitasiCatatan: "Bersih dan wangi, tapi jendela kamar menghadap koridor jadi kurang sirkulasi",
        surveyor: "Dita",
        tanggal: "2 September 2026",
      },
      catatan_jujur:
        "Penuh sampai semester depan, daftar tunggu 4 orang. Biasanya ada kamar kosong tiap Juni dan Januari.",
    },
    {
      id: "banaran-putra",
      nama: "Pondok Banaran Putra",
      tipe: "Putra",
      verified: true,
      last_updated: "Diperbarui 1 minggu lalu",
      status: "Tersedia",
      kamarSisa: 7,
      totalKamar: 20,
      hue: 32,
      peta: { x: 78, y: 70 },
      wa: "6281234567805",
      harga: { bulan: 500000, tahun: 5400000 },
      iuran_tambahan: [
        { label: "Sampah", nominal: 10000, catatan: "Dikumpulkan ketua kost tiap awal bulan" },
        { label: "Air", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Listrik", nominal: 0, catatan: "Termasuk, batas 350 watt per kamar" },
      ],
      listrik: { model: "Include", detail: "Termasuk sewa, maksimal 350 watt — setrika dan rice cooker bergantian" },
      deposit: { nominal: 0, catatan: "Tidak ada deposit" },
      lokasi: {
        area: "Banaran, Gunungpati",
        fakultas: "FIK UNNES",
        jarakKm: 2.4,
        jalanKaki: 31,
        ringkas: "31 menit jalan kaki atau 7 menit motor ke FIK UNNES",
        catatan: "Terlalu jauh untuk jalan kaki tiap hari. Hitung bensin sekitar Rp 80rb/bulan.",
      },
      kloset: "jongkok",
      fasilitas_kamar: ["meja", "km_luar", "kloset_jongkok", "jendela_luar"],
      fasilitas_bersama: ["wifi", "dapur", "parkir_motor", "jemuran"],
      aturan: {
        jam_malam: "Bebas",
        jam_malam_catatan: "Bebas, kunci gerbang dipegang sendiri",
        akses_kunci: "Kunci gerbang + kunci kamar dipegang penghuni",
        tamu: "Tamu bebas sampai 23.00",
      },
      verifikasi: {
        wifiMbps: 12,
        wifiCatatan: "Cukup untuk kelas online, berat untuk unduh file besar",
        sanitasi: 3.9,
        sanitasiCatatan: "Kamar mandi luar bersih tapi lantai licin, tidak ada exhaust",
        surveyor: "Fajar",
        tanggal: "5 September 2026",
      },
      catatan_jujur:
        "Paling murah di daftar, tapi kamar kosong tanpa kasur dan lemari. Siapkan Rp 1,5 juta untuk perabot sendiri.",
    },
    {
      id: "patemon-exclusive",
      nama: "Wisma Patemon Exclusive",
      tipe: "Campur",
      verified: true,
      last_updated: "Diperbarui 3 hari lalu",
      status: "Tersedia",
      kamarSisa: 4,
      totalKamar: 14,
      hue: 220,
      peta: { x: 86, y: 22 },
      wa: "6281234567806",
      harga: { bulan: 1800000, tahun: 19440000 },
      iuran_tambahan: [
        { label: "Sampah & kebersihan", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Air", nominal: 0, catatan: "Sudah termasuk sewa" },
        { label: "Listrik", nominal: 0, catatan: "Termasuk semua, tanpa batas watt" },
        { label: "Shuttle kampus", nominal: 0, catatan: "Gratis, berangkat 06.45 dan 07.30" },
      ],
      listrik: { model: "Include", detail: "Termasuk semua tanpa batas watt, AC boleh menyala 24 jam" },
      deposit: { nominal: 750000, catatan: "Kembali penuh setelah serah terima kamar" },
      lokasi: {
        area: "Patemon, Gunungpati",
        fakultas: "FH UNNES",
        jarakKm: 3.4,
        jalanKaki: 44,
        ringkas: "10 menit naik shuttle gratis ke FH UNNES",
        catatan: "Paling jauh, tapi satu-satunya yang punya antar-jemput tiap pagi.",
      },
      kloset: "duduk",
      fasilitas_kamar: ["kasur", "meja", "lemari", "km_dalam", "kloset_duduk", "ac", "water_heater", "jendela_luar"],
      fasilitas_bersama: ["wifi", "laundry", "dapur", "kulkas", "parkir_motor", "jemuran", "ruang_belajar", "cctv"],
      aturan: {
        jam_malam: "Bebas",
        jam_malam_catatan: "Akses sidik jari 24 jam",
        akses_kunci: "Sidik jari gerbang + kartu kamar",
        tamu: "Tamu wajib tukar kartu identitas di resepsionis",
      },
      verifikasi: {
        wifiMbps: 60,
        wifiCatatan: "Fiber dedicated, diuji di kamar paling ujung lantai 3",
        sanitasi: 4.9,
        sanitasiCatatan: "Dibersihkan petugas tiap hari, kamar mandi kering sepanjang kunjungan",
        surveyor: "Dita",
        tanggal: "15 September 2026",
      },
      catatan_jujur:
        "Semua serba termasuk, jadi tidak ada biaya kejutan. Konsekuensinya Anda jauh dari kampus dan bergantung pada jadwal shuttle.",
    },
    {
      id: "anggrek-kalimasada",
      nama: "Kost Anggrek Kalimasada",
      tipe: "Putri",
      verified: false,
      last_updated: "Diperbarui 3 minggu lalu",
      status: "Penuh",
      kamarSisa: 0,
      totalKamar: 9,
      hue: 288,
      peta: { x: 40, y: 20 },
      wa: "6281234567807",
      harga: { bulan: 750000, tahun: 8100000 },
      iuran_tambahan: [
        { label: "Sampah", nominal: 15000, catatan: "Angka dari pemilik, belum dicek surveyor" },
        { label: "Air", nominal: 0, catatan: "Klaim pemilik: termasuk" },
        { label: "Listrik", nominal: 0, catatan: "Klaim pemilik: termasuk, batas 450 watt" },
      ],
      listrik: { model: "Include", detail: "Klaim pemilik: termasuk, maksimal 450 watt" },
      deposit: { nominal: 250000, catatan: "Informasi dari pemilik" },
      lokasi: {
        area: "Jl. Kalimasada Gang 3, Sekaran",
        fakultas: "FIS UNNES",
        jarakKm: 0.6,
        jalanKaki: 8,
        ringkas: "8 menit jalan kaki ke FIS UNNES",
        catatan: "Jarak dihitung dari peta, belum diukur langsung oleh surveyor.",
      },
      kloset: "jongkok",
      fasilitas_kamar: ["kasur", "lemari", "km_dalam", "kloset_jongkok", "jendela_dalam"],
      fasilitas_bersama: ["wifi", "jemuran", "parkir_motor"],
      aturan: {
        jam_malam: "22.00",
        jam_malam_catatan: "Gerbang 22.00 menurut keterangan pemilik",
        akses_kunci: "Belum dikonfirmasi",
        tamu: "Tamu putri sampai 21.00",
      },
      verifikasi: {
        wifiMbps: null,
        wifiCatatan: "Belum diuji. Pemilik mengklaim 15 Mbps.",
        sanitasi: null,
        sanitasiCatatan: "Belum dinilai surveyor.",
        surveyor: null,
        tanggal: null,
      },
      catatan_jujur:
        "Seluruh data di halaman ini berasal dari pemilik, bukan hasil kunjungan kami. Kunjungan surveyor dijadwalkan pekan depan.",
    },
    {
      id: "taruna-sekaran",
      nama: "Kost Taruna Sekaran",
      tipe: "Putra",
      verified: true,
      last_updated: "Diperbarui 4 hari lalu",
      status: "Tersedia",
      kamarSisa: 2,
      totalKamar: 11,
      hue: 128,
      peta: { x: 57, y: 76 },
      wa: "6281234567808",
      harga: { bulan: 950000, tahun: 10260000 },
      iuran_tambahan: [
        { label: "Sampah", nominal: 20000, catatan: "" },
        { label: "Air", nominal: 25000, catatan: "Dihitung terpisah, sering terlewat saat tanya harga" },
        { label: "Listrik", nominal: null, catatan: "Token mandiri, rata-rata Rp 70rb/bulan" },
      ],
      listrik: { model: "Token Mandiri", detail: "Meteran token per kamar, isi lewat aplikasi" },
      deposit: { nominal: 350000, catatan: "Kembali setengah kalau keluar sebelum 6 bulan" },
      lokasi: {
        area: "Jl. Kalimasada Gang 1, Sekaran",
        fakultas: "FT UNNES",
        jarakKm: 1.0,
        jalanKaki: 13,
        ringkas: "13 menit jalan kaki ke FT UNNES",
        catatan: "Dekat lapangan futsal, ramai sampai 22.00 tiap akhir pekan.",
      },
      kloset: "duduk",
      fasilitas_kamar: ["kasur", "meja", "lemari", "km_dalam", "kloset_duduk", "jendela_luar"],
      fasilitas_bersama: ["wifi", "dapur", "kulkas", "parkir_motor", "jemuran"],
      aturan: {
        jam_malam: "24.00",
        jam_malam_catatan: "Gerbang 24.00, terlambat harus membangunkan penjaga",
        akses_kunci: "Kunci kamar sendiri, gerbang dijaga",
        tamu: "Tamu putra sampai 22.00, wajib lapor penjaga",
      },
      verifikasi: {
        wifiMbps: 28,
        wifiCatatan: "Stabil siang dan malam, diuji dua kali",
        sanitasi: 4.3,
        sanitasiCatatan: "Kamar mandi dalam bersih, dapur bersama agak berminyak",
        surveyor: "Rani",
        tanggal: "13 September 2026",
      },
      catatan_jujur:
        "Air dihitung terpisah Rp 25rb — ini yang paling sering tidak disebut saat calon penghuni bertanya lewat chat.",
    },
  ];

  const FILTER_AWAL = {
    q: "",
    bayar: "bulan",              // bulan | tahun
    hargaMax: { bulan: 2000000, tahun: 22000000 },
    jarak: "all",                // all | dekat | sedang | jauh
    tipe: "all",                 // all | Putra | Putri | Campur
    kloset: "all",               // all | duduk | jongkok
    listrik: "all",              // all | Include | Token Mandiri
    fasilitas: [],               // kunci gabungan kamar + bersama
    status: "all",               // all | Tersedia | Penuh
    urut: "jarak",               // jarak | murah | bersih | cepat
  };

  const BATAS_HARGA = {
    bulan: { min: 500000, max: 2000000, step: 50000 },
    tahun: { min: 5000000, max: 22000000, step: 500000 },
  };

  /* Filter cepat fasilitas — sengaja dibatasi yang paling sering ditanya mahasiswa */
  const FASILITAS_FILTER = ["km_dalam", "ac", "kasur", "wifi", "parkir_motor", "kulkas"];

  global.KK = { FASILITAS_KAMAR, FASILITAS_BERSAMA, KOST, FILTER_AWAL, BATAS_HARGA, FASILITAS_FILTER };
})(window);
