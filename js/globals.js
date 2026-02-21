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

let settingsButton = null;
let settingsModal = null;
let settingsCloseButton = null;
let toggleMusicButton = null;
let resetProgressButton = null;
let playerNameBadge = null;

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
        text: 'Pengembang: Putu Surya Gutama'
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
        title: 'Capaian Pembelajaran',
        text: `Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan (akar, batang, daun, bunga, buah, dan biji) serta kaitannya dengan kebutuhan tumbuhan untuk tumbuh, mempertahankan diri, dan berkembang biak, dengan mengaplikasikan media game edukasi Jagadipa berbasis nilai-nilai Tri Hita Karana`
    },
    {
        type: 'info',
        title: 'Tujuan Pembelajaran',
        text: `1) Dengan mengaplikasikan media game edukasi Jagadipa berbasis THK, siswa mampu mengenali dan menyebutkan dan menunjukkan (mengidentifikasi) bagian-bagian tubuh dari tumbuhan.
2) Dengan mengaplikasikan media game edukasi Jagadipa berbasis THK, siswa mampu menjelaskan (menganalisis) fungsi dari masing-masing bagian tubuh tumbuhan.
3) Dengan mengaplikasikan media game edukasi Jagadipa berbasis THK siswa mampu mengaitkan fungsi bagian tubuh dengan kebutuhan tumbuhan untuk tumbuh dan mempertahankan diri, serta berkembang biak.`
    }
];

let plantMaterialContent = `
A. Bagian-Bagian Tubuh Tumbuhan
Tumbuhan adalah makhluk hidup yang memiliki bagian-bagian tubuh. Setiap bagian tubuh tumbuhan memiliki tugas atau fungsi masing-masing. Semua bagian tersebut saling bekerja sama agar tumbuhan dapat hidup, tumbuh, dan berkembang. Bagian-bagian utama tubuh tumbuhan terdiri dari:

[IMAGE:assets/img/gbr1.png|Bagian-bagian tubuh tumbuhan]

Meskipun bentuk dan ukuran tumbuhan berbeda-beda, pada umumnya tumbuhan memiliki bagian-bagian tersebut.

B. Fungsi Masing-Masing Bagian Tubuh Tumbuhan
1. Akar
Akar adalah bagian tumbuhan yang tumbuh ke dalam tanah. Fungsinya menyerap air dan zat hara (makanan) dari tanah serta menjaga tumbuhan agar berdiri tegak. Pada beberapa tumbuhan, akar menyimpan cadangan makanan, misalnya wortel, singkong, dan ubi.
2. Batang
Batang merupakan bagian tumbuhan yang berada di atas tanah dan menjadi penghubung antara akar dan daun. Fungsinya menopang tumbuhan, menyalurkan air dan zat hara dari akar ke daun, serta menyalurkan makanan hasil fotosintesis ke seluruh bagian tumbuhan.
3. Daun
Daun biasanya berwarna hijau karena mengandung klorofil. Fungsinya sebagai tempat pembuatan makanan melalui fotosintesis, tempat pertukaran gas, dan tempat terjadinya penguapan air.
4. Bunga
Bunga berperan dalam perkembangbiakan. Fungsinya sebagai tempat penyerbukan dan pembuahan, serta menghasilkan biji.
5. Buah
Buah terbentuk dari bunga setelah pembuahan. Fungsinya melindungi biji dan membantu penyebaran biji.
6. Biji
Biji merupakan hasil pembuahan dan menjadi calon tumbuhan baru. Biji menyimpan cadangan makanan bagi tumbuhan baru.

C. Kaitan Fungsi Bagian Tubuh Tumbuhan dengan Kebutuhan Tumbuhan
1. Untuk Tumbuh
Tumbuhan memerlukan air, zat hara, dan cahaya matahari.
1) Akar menyerap air dan zat hara dari tanah.
2) Batang menyalurkan air dan zat hara ke seluruh bagian tumbuhan.
3) Daun membuat makanan melalui fotosintesis.

2. Untuk Mempertahankan Diri
Tumbuhan tidak dapat berpindah tempat seperti hewan. Oleh karena itu, tumbuhan memiliki bagian tubuh khusus untuk melindungi diri dari musuh maupun lingkungan yang kurang baik.
1) Duri
Duri melindungi tumbuhan dari hewan pemakan tumbuhan. Contoh: mawar dan kaktus.
2) Getah lengket atau beracun
Getah dapat membuat hewan enggan memakan tumbuhan. Contoh: pohon nangka dan kamboja.
3) Rambut halus atau bulu tajam
Rambut halus dapat menyebabkan rasa gatal atau perih. Contoh: daun jelatang.
4) Daun tebal dan berdaging
Daun tebal dapat menyimpan air sehingga tumbuhan tahan kering. Contoh: lidah buaya.
5) Bau tidak sedap
Beberapa tumbuhan mengeluarkan bau menyengat untuk mengusir hewan.
6) Kulit batang yang keras
Kulit batang melindungi bagian dalam tumbuhan dari gangguan.

3. Untuk Berkembang Biak
[IMAGE:assets/img/perkembangbiakkan.jpg|Perkembangbiakan]
Perkembangbiakan generatif terjadi melalui bunga dan biji. Bunga adalah alat perkembangbiakan pada tumbuhan berbunga. Hasil akhirnya adalah biji, yang akan tumbuh menjadi tumbuhan baru jika mendapat cukup air, udara, serta cahaya matahari.

[IMAGE:assets/img/bunga.jpg|Bagian-bagian bunga]
Bagian-bagian bunga dan fungsinya:
1) Benang sari (alat kelamin jantan)
- Terdiri atas tangkai sari dan kepala sari.
- Kepala sari menghasilkan serbuk sari yang mengandung sel kelamin jantan.
- Serbuk sari berpindah ke putik melalui angin, air, hewan, atau manusia (penyerbukan).
2) Putik (alat kelamin betina)
- Terdiri atas kepala putik, tangkai putik, dan bakal buah.
- Kepala putik menerima serbuk sari.
- Di dalam bakal buah terdapat bakal biji.
- Setelah pembuahan, bakal biji berkembang menjadi biji dan bakal buah menjadi buah.
3) Mahkota bunga
- Berwarna cerah dan berbau harum, menarik serangga agar membantu penyerbukan.
4) Kelopak bunga
- Melindungi bunga saat masih kuncup agar tidak rusak.

4. Perkembangbiakan Vegetatif (Tanpa Biji)
Perkembangbiakan vegetatif menghasilkan tumbuhan baru tanpa penyerbukan dan pembuahan. Tumbuhan baru tumbuh dari bagian tubuh tumbuhan seperti akar, batang, atau daun.

4.1 Vegetatif Alami (Tanpa Bantuan Manusia)
1) Tunas
- Tunas tumbuh di pangkal batang atau akar dekat induknya.
- Lama-kelamaan tunas menjadi tumbuhan baru.
- Contoh: pisang dan bambu.
2) Umbi Batang
- Batang membesar di dalam tanah dan menyimpan cadangan makanan.
- Pada umbi terdapat mata tunas yang dapat tumbuh menjadi tanaman baru.
- Contoh: kentang.
3) Umbi Lapis
- Terdiri atas lapisan daun berdaging yang menyimpan makanan.
- Jika ditanam, bagian tersebut dapat tumbuh menjadi tanaman baru.
- Contoh: bawang merah.
4) Rimpang (Akar Tinggal)
- Batang tumbuh mendatar di dalam tanah.
- Dari batang muncul tunas dan akar baru.
- Contoh: jahe, kunyit, lengkuas.
5) Spora
- Alat perkembangbiakan pada tumbuhan tertentu yang tidak menghasilkan bunga dan biji.
- Contoh: lumut dan pohon paku.

4.2 Vegetatif Buatan (Dengan Bantuan Manusia)
1) Stek
- Memotong bagian batang atau daun, lalu ditanam agar tumbuh akar dan menjadi tanaman baru.
- Contoh: singkong dan bunga mawar.
2) Cangkok
- Batang dikupas kulitnya, lalu dibungkus tanah agar tumbuh akar.
- Setelah berakar, batang dipotong dan ditanam.
3) Okulasi (Menempel)
- Menggabungkan mata tunas dari satu tanaman ke tanaman lain agar menghasilkan sifat lebih baik.
4) Menyambung (Grafting)
- Menyambungkan batang atas ke batang bawah tanaman lain yang sejenis.
- Contoh: mangga, jeruk, dan jambu.

Kesimpulan
Bagian-bagian tubuh tumbuhan memiliki fungsi yang berbeda-beda tetapi saling berkaitan. Dengan bagian tubuh tersebut, tumbuhan dapat tumbuh, mempertahankan diri, dan berkembang biak sehingga dapat terus hidup dan berkembang di lingkungan sekitarnya.
`;

function updateBookButtonVisibility() {
    bookButton.classList.remove('hidden');
}
