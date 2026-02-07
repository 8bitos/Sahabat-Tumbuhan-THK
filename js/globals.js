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
Tumbuhan adalah makhluk hidup yang memiliki bagian-bagian tubuh. Setiap bagian tubuh tumbuhan memiliki tugas atau fungsi masing-masing. Semua bagian tersebut saling bekerja sama agar tumbuhan dapat hidup, tumbuh, dan berkembang. Bagian-bagian utama tubuh tumbuhan terdiri dari:

[IMAGE:assets/img/gbr1.png|Gambar Bagian-Bagian Tumbuhan]

Meskipun bentuk dan ukuran tumbuhan berbeda-beda, pada umumnya tumbuhan memiliki bagian-bagian tersebut.
B. Fungsi Masing-Masing Bagian Tubuh Tumbuhan
1. Akar
Akar adalah bagian tumbuhan yang tumbuh ke dalam tanah. Fungsi akar secara lebih jelas yaitu, menyerap air dan zat hara (makanan) dari dalam tanah yang dibutuhkan tumbuhan untuk hidup, dan menjaga tumbuhan agar berdiri tegak dan tidak mudah roboh. Pada beberapa tumbuhan, akar menyimpan cadangan makanan, misalnya wortel, singkong, dan ubi. Tanpa akar, tumbuhan tidak dapat menyerap air sehingga akan layu dan mati.
2. Batang
Batang merupakan bagian tumbuhan yang berada di atas tanah dan menjadi penghubung antara akar dan daun. Fungsi batang adalah menopang tumbuhan agar dapat berdiri tegak, menyalurkan air dan zat hara dari akar ke daun, serta menyalurkan makanan hasil fotosintesis dari daun ke seluruh bagian tumbuhan. Pada tumbuhan tertentu, batang juga berfungsi sebagai tempat menyimpan makanan, seperti pada tebu. Batang sangat penting karena menjadi jalan bagi air dan makanan di dalam tumbuhan.
3. Daun
Daun biasanya berwarna hijau karena mengandung zat hijau daun yang disebut klorofil.Fungsi daun adalah tempat pembuatan makanan melalui proses fotosintesis dengan bantuan cahaya matahari, tempat pertukaran gas, yaitu mengambil karbon dioksida dan melepaskan oksigen, dan tempat terjadinya penguapan air. Daun disebut sebagai dapur tumbuhan karena berfungsi membuat makanan.
4. Bunga
Bunga merupakan bagian tumbuhan yang berperan dalam perkembangbiakan. Fungsi bunga adalah tempat terjadinya penyerbukan, tempat terjadinya pembuahan, dan menghasilkan biji yang dapat tumbuh menjadi tumbuhan baru. Bunga membantu tumbuhan agar dapat menghasilkan keturunan.
5. Buah
Buah adalah bagian tumbuhan yang terbentuk dari bunga setelah terjadi pembuahan.
Fungsi buah adalah melindungi biji agar tidak rusak, dan membantu penyebaran biji, misalnya dengan bantuan hewan, manusia, atau air.
6. Biji
Biji merupakan hasil dari pembuahan dan merupakan calon tumbuhan baru. Fungsi biji adalah menjadi cikal bakal tumbuhan baru, dan menyimpan cadangan makanan yang digunakan saat biji mulai tumbuh.
C. Kaitan Fungsi Bagian Tubuh Tumbuhan dengan Kebutuhan Tumbuhan
1. Untuk Tumbuh
Agar dapat tumbuh dengan baik, tumbuhan memerlukan air, zat hara, dan cahaya matahari.
    1) Akar menyerap air dan zat hara dari tanah.
    2) Batang menyalurkan air dan zat hara ke seluruh bagian tumbuhan.
    3) Daun membuat makanan melalui fotosintesis.
2. Untuk Mempertahankan Diri
    1) Beberapa bagian tubuh tumbuhan membantu tumbuhan melindungi diri dari gangguan.
    2) Batang berduri (seperti pada mawar) melindungi tumbuhan dari hewan pemakan tumbuhan.
    3) Daun berduri atau beracun melindungi tumbuhan dari musuh.
    4) Kulit batang yang keras melindungi bagian dalam tumbuhan.
3. Untuk Berkembang Biak
    1) Tumbuhan berkembang biak agar tidak punah.
    2) Bunga berperan dalam proses penyerbukan dan pembuahan.
    3) Buah dan biji membantu menghasilkan tumbuhan baru.
    4) Biji tumbuh menjadi tanaman baru jika mendapat air, udara, dan cahaya yang cukup.
Kesimpulan
Bagian-bagian tubuh tumbuhan memiliki fungsi yang berbeda-beda tetapi saling berkaitan. Dengan bagian tubuh tersebut, tumbuhan dapat tumbuh, mempertahankan diri, dan berkembang biak sehingga dapat terus hidup dan berkembang di lingkungan sekitarnya.
`;

function updateBookButtonVisibility() {
    bookButton.classList.remove('hidden');
}