// js/globals.js
console.log('globals.js loaded');

// DOM Elements
let gameWorld = null;
let characterImage = null;
let characterName = null;
let dialogueText = null;

let bookButton = null;
let materialModal = null;
let materialCloseButton = null;

let medicineBookButton = null;
let medicineMaterialModal = null;
let medicineMaterialCloseButton = null;

let yadnyaBookButton = null;
let yadnyaMaterialModal = null;
let yadnyaMaterialCloseButton = null;

let quizButton = null;
let backgroundMusic = null;

// Game State
const gameState = {
    progress: { palemahan: 0, pawongan: 0, parahyangan: 0 },
    currentLocation: 'hub',
};

let currentIntroStep = 0;
const introSteps = [
    {
        type: 'splash',
        title: 'Sahabat Tumbuhanku: Petualangan Tri Hita Karana',
        text: '' // Splash screen, text will be button
    },
    {
        type: 'name-input',
        title: 'Siap Memulai Petualangan?',
        text: 'Masukkan namamu untuk memulai perjalanan seru ini!'
    },
    {
        type: 'info',
        title: 'Petunjuk Penggunaan Game',
        text: `1. Klik pada lokasi di peta untuk berinteraksi dengan karakter dan memulai minigame.
2. Ikuti petunjuk dalam dialog untuk memainkan minigame.
3. Selesaikan semua misi untuk membantu menjaga keseimbangan Tri Hita Karana!`
    },
    {
        type: 'info',
        title: 'Tujuan Pembelajaran',
        text: `a. Dengan mengaplikasikan media game edukasi Jagadipa berbasis THK, siswa mampu mengidentifikasi bagian-bagian tubuh dari tumbuhan.
b. Dengan mengaplikasikan media game edukasi Jagadipa berbasis THK, siswa mampu memahami fungsi dari masing-masing bagian tubuh tumbuhan.
c. Dengan mengaplikasikan media game edukasi Jagadipa berbasis THK siswa mampu mengaitkan fungsi bagian tubuh dengan kebutuhan tumbuhan untuk tumbuh dan mempertahankan diri, serta berkembang biak.`
    },
    {
        type: 'info',
        title: 'Capaian Pembelajaran',
        text: `Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga, buah, dan biji) serta kaitannya dengan kebutuhan tumbuhan untuk tumbuh, mempertahankan diri, dan berkembang biak, dengan mengaplikasikan media game edukasi Jagadipa berbasis nilai-nilai Tri Hita Karana`
    }
];

let plantMaterialContent = `
A. Bagian-Bagian Tubuh Tumbuhan

Tumbuhan adalah makhluk hidup yang memiliki bagian-bagian tubuh. Setiap bagian tubuh tumbuhan memiliki tugas atau fungsi masing-masing. Semua bagian tersebut saling bekerja sama agar tumbuhan dapat hidup, tumbuh, dan berkembang.

Bagian-bagian utama tubuh tumbuhan terdiri dari:

Akar

Batang

Daun

Bunga

Buah

Biji

Meskipun bentuk dan ukuran tumbuhan berbeda-beda, pada umumnya tumbuhan memiliki bagian-bagian tersebut.

B. Fungsi Masing-Masing Bagian Tubuh Tumbuhan
1. Akar

Akar adalah bagian tumbuhan yang tumbuh ke dalam tanah.

Fungsi akar secara lebih jelas adalah:

Menyerap air dan zat hara (makanan) dari dalam tanah yang dibutuhkan tumbuhan untuk hidup.

Menjaga tumbuhan agar berdiri tegak dan tidak mudah roboh.

Pada beberapa tumbuhan, akar menyimpan cadangan makanan, misalnya wortel, singkong, dan ubi.

Tanpa akar, tumbuhan tidak dapat menyerap air sehingga akan layu dan mati.

2. Batang

Batang merupakan bagian tumbuhan yang berada di atas tanah dan menjadi penghubung antara akar dan daun.

Fungsi batang adalah:

Menopang tumbuhan agar dapat berdiri tegak.

Menyalurkan air dan zat hara dari akar ke daun.

Menyalurkan makanan hasil fotosintesis dari daun ke seluruh bagian tumbuhan.

Pada tumbuhan tertentu, batang juga berfungsi sebagai tempat menyimpan makanan, seperti pada tebu.

Batang sangat penting karena menjadi jalan bagi air dan makanan di dalam tumbuhan.

3. Daun

Daun biasanya berwarna hijau karena mengandung zat hijau daun yang disebut klorofil.

Fungsi daun adalah:

Tempat pembuatan makanan melalui proses fotosintesis dengan bantuan cahaya matahari.

Tempat pertukaran gas, yaitu mengambil karbon dioksida dan melepaskan oksigen.

Tempat terjadinya penguapan air.

Daun disebut sebagai dapur tumbuhan karena berfungsi membuat makanan.

4. Bunga

Bunga merupakan bagian tumbuhan yang berperan dalam perkembangbiakan.

Fungsi bunga adalah:

Tempat terjadinya penyerbukan.

Tempat terjadinya pembuahan.

Menghasilkan biji yang dapat tumbuh menjadi tumbuhan baru.

Bunga membantu tumbuhan agar dapat menghasilkan keturunan.

5. Buah

Buah adalah bagian tumbuhan yang terbentuk dari bunga setelah terjadi pembuahan.

Fungsi buah adalah:

Melindungi biji agar tidak rusak.

Membantu penyebaran biji, misalnya dengan bantuan hewan, manusia, atau air.

6. Biji

Biji merupakan hasil dari pembuahan dan merupakan calon tumbuhan baru.

Fungsi biji adalah:

Menjadi cikal bakal tumbuhan baru.

Menyimpan cadangan makanan yang digunakan saat biji mulai tumbuh.

C. Kaitan Fungsi Bagian Tubuh Tumbuhan dengan Kebutuhan Tumbuhan
1. Untuk Tumbuh

Agar dapat tumbuh dengan baik, tumbuhan memerlukan air, zat hara, dan cahaya matahari.

Akar menyerap air dan zat hara dari tanah.

Batang menyalurkan air dan zat hara ke seluruh bagian tumbuhan.

Daun membuat makanan melalui fotosintesis.

2. Untuk Mempertahankan Diri

Beberapa bagian tubuh tumbuhan membantu tumbuhan melindungi diri dari gangguan.

Batang berduri (seperti pada mawar) melindungi tumbuhan dari hewan pemakan tumbuhan.

Daun berduri atau beracun melindungi tumbuhan dari musuh.

Kulit batang yang keras melindungi bagian dalam tumbuhan.

3. Untuk Berkembang Biak

Tumbuhan berkembang biak agar tidak punah.

Bunga berperan dalam proses penyerbukan dan pembuahan.

Buah dan biji membantu menghasilkan tumbuhan baru.

Biji tumbuh menjadi tanaman baru jika mendapat air, udara, dan cahaya yang cukup.

Kesimpulan

Bagian-bagian tubuh tumbuhan memiliki fungsi yang berbeda-beda tetapi saling berkaitan. Dengan bagian tubuh tersebut, tumbuhan dapat tumbuh, mempertahankan diri, dan berkembang biak sehingga dapat terus hidup dan berkembang di lingkungan sekitarnya.
`;
let medicineMaterialContent = `
Tentu, ini adalah materi penjelasan mengenai konsep **Pawongan** (hubungan manusia dengan alam) serta manfaat bahan alami dan tanaman obat yang Anda minta, disusun dengan format yang serupa:

---

## **A. Konsep Pawongan dan Alam**

Dalam kearifan lokal Bali, terdapat konsep bernama **Pawongan**, yaitu bagian dari *Tri Hita Karana* yang mengajarkan kita untuk menjaga hubungan harmonis antara manusia dengan sesamanya. Namun, dalam arti luas, manusia juga memiliki tanggung jawab untuk memanfaatkan dan melestarikan alam (tumbuhan dan mineral) demi kesejahteraan hidup.

Alam menyediakan berbagai bahan yang dapat digunakan sebagai sarana upacara, bumbu dapur, hingga obat-obatan tradisional yang kita kenal sebagai *Usada*.

---

## **B. Manfaat Bahan Alami dan Tanaman Obat**

### **1. Garam**

Garam adalah mineral yang biasanya berasal dari penguapan air laut.
**Fungsi dan Manfaat:**

* Sebagai penyedap rasa alami dalam masakan.
* Membantu menjaga keseimbangan cairan dalam tubuh manusia.
* Dalam pengobatan tradisional, air garam digunakan untuk berkumur guna meredakan sakit tenggorokan dan sariawan.

### **2. Gula Merah**

Gula merah biasanya terbuat dari nira pohon kelapa atau pohon nira/enau.
**Fungsi dan Manfaat:**

* Sumber energi tambahan bagi tubuh karena mengandung kalori dan mineral.
* Memberikan rasa manis yang khas dan warna alami pada makanan.
* Sering digunakan dalam ramuan jamu untuk menetralisir rasa pahit dari tanaman obat lain.

### **3. Jahe**

Jahe adalah tanaman rimpang yang memiliki rasa pedas dan memberikan sensasi hangat.
**Fungsi dan Manfaat:**

* **Menghangatkan tubuh:** Sangat baik dikonsumsi saat cuaca dingin atau masuk angin.
* **Meredakan mual:** Membantu mengurangi rasa mual dan gangguan pencernaan.
* **Anti-inflamasi:** Membantu mengurangi peradangan atau nyeri sendi.

### **4. Kunyit**

Kunyit adalah tanaman rimpang yang memiliki ciri khas warna oranye terang.
**Fungsi dan Manfaat:**

* **Antibiotik alami:** Membantu tubuh melawan bakteri dan mempercepat penyembuhan luka.
* **Melancarkan pencernaan:** Membantu mengatasi perut kembung dan maag.
* **Pewarna alami:** Digunakan sebagai pewarna kuning alami pada makanan atau kain.

### **5. Jeruk Nipis**

Jeruk nipis adalah buah dari tanaman perdu yang memiliki rasa sangat asam.
**Fungsi dan Manfaat:**

* **Kaya Vitamin C:** Meningkatkan sistem kekebalan tubuh agar tidak mudah sakit.
* **Obat batuk alami:** Air perasan jeruk nipis yang dicampur madu dapat meredakan batuk dan mengencerkan dahak.
* **Menghilangkan bau amis:** Digunakan dalam pengolahan makanan untuk menetralkan aroma tajam pada daging atau ikan.

### **6. Pandan**

Pandan adalah tanaman dengan daun memanjang yang memiliki aroma harum yang sangat khas.
**Fungsi dan Manfaat:**

* **Pemberi aroma:** Memberikan wangi harum pada nasi, kue, dan minuman.
* **Penengah saraf:** Air rebusan daun pandan sering digunakan secara tradisional untuk membantu meredakan kecemasan dan membantu tidur lebih nyenyak.
* **Pewarna hijau alami:** Daun pandan yang ditumbuk menghasilkan warna hijau yang cantik untuk makanan.

---

## **C. Kaitan Bahan Alami dengan Kebutuhan Manusia**

### **1. Untuk Kesehatan (Obat)**

Tanaman seperti jahe, kunyit, dan jeruk nipis disebut "Apotek Hidup" karena dapat digunakan sebagai pertolongan pertama saat anggota keluarga merasa kurang sehat tanpa harus langsung bergantung pada obat kimia.

### **2. Untuk Nutrisi (Pangan)**

Garam, gula merah, dan pandan memastikan makanan yang kita konsumsi memiliki rasa, aroma, dan energi yang cukup untuk mendukung aktivitas sehari-hari.

### **3. Untuk Keseimbangan (Harmonisasi)**

Pemanfaatan tanaman ini menunjukkan bahwa manusia bergantung sepenuhnya pada alam. Dengan merawat tanaman obat di sekitar rumah, kita sedang mempraktikkan hubungan harmonis yang lestari sesuai semangat Pawongan.

---

### **Kesimpulan**

Bahan-bahan alami dan tanaman obat di atas adalah anugerah alam yang sangat berguna. Dengan memahami fungsi masing-masing, kita dapat menjaga kesehatan tubuh secara alami sekaligus melestarikan lingkungan tempat tanaman-tanaman tersebut tumbuh.

Apakah Anda ingin saya membantu membuatkan **tabel ringkasan** atau **kuis kecil** berdasarkan materi tanaman obat ini untuk buku edukasi Anda?
`;

function updateBookButtonVisibility() {
    if (localStorage.getItem('lokaBookUnlocked') === 'true') {
        bookButton.classList.remove('hidden');
    }
    if (localStorage.getItem('pawonganBookUnlocked') === 'true') {
        medicineBookButton.classList.remove('hidden');
    }
    if (localStorage.getItem('parahyanganBookUnlocked') === 'true') {
        yadnyaBookButton.classList.remove('hidden');
    }
}