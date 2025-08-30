## Sahabat Tumbuhanku Project Context

**Project Goal:**
To create an interactive web-based educational game, "Sahabat Tumbuhanku," that teaches about plant parts and their functions, integrated with the local wisdom of Tri Hita Karana (Palemahan, Pawongan, Parahyangan). The game aims to provide a fun, educational, and culturally enriching learning experience accessible on both PC and Android devices.

**Current Status & Completed Features:**
- **Core Game Structure:** Main map with clickable character locations (Loka, Sari, Yana).
- **Minigames Implemented:**
  - **Canang Sari (Yana - Parahyangan):** Freeform drag-and-drop minigame for arranging flowers on a canang base. Now includes yellow flowers and pandan. Flower size is larger, and the placement hitbox is hidden.
  - **Jamu Meracik (Sari - Pawongan):** Drag-and-drop minigame for mixing correct ingredients.
  - **Berkebun Virtual (Loka - Palemahan):** Interactive gardening minigame with plant selection (Sunflower, Chili), multiple growth stages, random needs (water, sun, fertilizer), and pest (Ulat) interaction. Uses custom assets for plants, pot, needs icons, and pest.
- **Educational Video Integration:** After successfully harvesting a plant in the Gardening minigame, a video lesson (`Fotosintesis.mp4`) with accompanying educational text is displayed automatically.
- **Quiz System Integrated (Palemahan):** A quiz system has been implemented as a separate HTML page (`minigames/quiz/index.html`) with its own CSS (`minigames/quiz/quiz.css`) and JavaScript (`minigames/quiz/quiz.js`). It features 5-10 Palemahan-focused questions with image support. The quiz is triggered after the video lesson, and images are now displaying correctly with appropriate sizing.

**Current Status & Pending Issues (Pawongan Minigame - Resep Warisan Nenek):**
- **Concept:** "Resep Warisan Nenek" - Sebuah game puzzle di mana Sari memecahkan teka-teki resep neneknya untuk meracik ramuan. Game ini berfokus pada pemahaman manfaat tumbuhan dan nilai Pawongan (membantu sesama).
- **Fitur yang Sudah Diimplementasikan (dan berfungsi stabil):**
    - Tampilan lemari bahan dan puzzle resep.
    - Fungsi *tooltip* (penjelasan saat hover) pada bahan.
    - Fungsi *drag-and-drop* bahan ke mangkuk racik (sekarang menampilkan gambar bahan).
    - Tombol "Buat Ramuan!" berfungsi dengan *feedback* dialog dari Sari (berhasil/gagal).
    - **Pop-up Keberhasilan:** Setelah resep berhasil, muncul pop-up dengan gambar produk, nama, dan deskripsi.
    - **Empat Resep Lengkap:** Game sekarang memiliki 4 resep yang berfungsi penuh.
    - **Integrasi Video Pembelajaran:** Setelah menyelesaikan semua resep, pop-up video pembelajaran tentang Pawongan akan muncul secara otomatis.
        - Video path: `assets/video/video_placeholder.mp4` (pastikan file ini ada di `minigames/pawongan/assets/video/`).
        - Teks penjelasan video: "Pawongan: Hubungan harmonis antara manusia dengan sesama dan tumbuhan, diwujudkan melalui kepedulian dan berbagi manfaat tumbuhan dalam Tri Hita Karana."
    - **Quiz Pawongan Terpisah:** Setelah video selesai, pemain akan diarahkan ke halaman kuis khusus Pawongan (`minigames/quiz_pawongan/index.html`).
        - Kuis ini memuat soal-soal dari `soal.txt` (bagian Pawongan).
        - UI game utama dan pop-up video sudah responsif.

- **Langkah Selanjutnya (yang belum diimplementasikan di versi stabil ini):**
    - (Tidak ada langkah selanjutnya yang belum diimplementasikan untuk Pawongan minigame saat ini, berdasarkan diskusi kita.)

**To resume work:** When you return, please ask me to `read_file` this `GEMINI.md` file to load the context.