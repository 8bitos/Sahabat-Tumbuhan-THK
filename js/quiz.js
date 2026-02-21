// js/quiz.js

// Depends on: globals.js, sweetalert2

let quizQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {}; // Store user's selected option for each question
let quizTimer; // For potential future timer feature

// DOM Elements for Quiz UI
const quizOverlay = document.getElementById('quiz-overlay-container');
const questionNumberEl = document.getElementById('question-number');
const quizQuestionTextEl = document.getElementById('quiz-question-text');
const quizImageContainerEl = document.getElementById('quiz-image-container');
const quizOptionsContainerEl = document.getElementById('quiz-options-container');
const prevQuestionBtn = document.getElementById('prev-question-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const submitQuizBtn = document.getElementById('submit-quiz-btn');

// Quiz data migrated from quiz.txt
const quizQuestionsData = [
    {
        question: "Bagian tumbuhan yang ditunjuk pada gambar di atas berfungsi untuk …",
        image: "soal1.png",
        options: {
            A: "Menyerap air dan mineral dari tanah",
            B: "Mengangkut hasil fotosintesis",
            C: "Tempat terjadinya fotosintesis",
            D: "Menarik serangga penyerbuk"
        },
        answer: "A"
    },
    {
        question: "Perhatikan gambar berikut ini!\nBagian tumbuhan yang ditunjukkan oleh tanda panah pada gambar di atas adalah …",
        image: "soal2.png",
        options: {
            A: "Akar",
            B: "Daun",
            C: "Batang",
            D: "Bunga"
        },
        answer: "B"
    },
    {
        question: "Perhatikan gambar berikut ini!\nBagian bunga yang mempunyai fungsi untuk menarik serangga hinggap adalah….",
        image: "soal3.png",
        options: {
            A: "Kelopak",
            B: "Putik",
            C: "Benang sari",
            D: "Mahkota"
        },
        answer: "D"
    },
    {
        question: "Tumbuhan melakukan fotosintesis untuk memasak makanan sendiri. Bagian tumbuhan yang berfungsi utama sebagai tempat fotosintesis adalah...",
        image: null,
        options: {
            A: "Akar",
            B: "Batang",
            C: "Daun",
            D: "Biji"
        },
        answer: "C"
    },
    {
        question: "Perhatikan gambar di bawah ini\nBagian tumbuhan yang tegak dan berfungsi menghubungkan akar dengan daun. Bagian tumbuhan tersebut adalah …",
        image: "soal5.png",
        options: {
            A: "Batang",
            B: "Bunga",
            C: "Akar",
            D: "Buah"
        },
        answer: "A"
    },
    {
        question: "Ada beberapa jenis bagian-bagian tumbuhan. Bagian tumbuhan manakah yang berfungsi menyerap air dan zat hara dari tanah?",
        image: null,
        options: {
            A: "Daun",
            B: "Biji",
            C: "Batang",
            D: "Akar"
        },
        answer: "D"
    },
    {
        question: "Bagian buah yang berfungsi melindungi biji di dalamnya disebut apa?",
        image: null,
        options: {
            A: "Kulit batang",
            B: "Daun",
            C: "Daging buah",
            D: "Kloroplas"
        },
        answer: "C"
    },
    {
        question: "Tumbuhan berikut yang memiliki akar serabut adalah …",
        image: null,
        options: {
            A: "Kacang",
            B: "Padi",
            C: "Mangga",
            D: "Jambu"
        },
        answer: "B"
    },
    {
        question: "Perhatikanlah gambar di bawah ini!\nManakah bagian tumbuhan yang biasanya paling banyak mengandung klorofil?",
        image: "soal9.png",
        options: {
            A: "(4) Akar",
            B: "(3) Batang",
            C: "(1) Daun",
            D: "(2) Bunga"
        },
        answer: "C"
    },
    {
        question: "Mengapa akar sangat penting bagi kelangsungan hidup tumbuhan?",
        image: null,
        options: {
            A: "Karena dapat berubah menjadi buah",
            B: "Karena berfungsi mengedarkan oksigen",
            C: "Karena menyerap air dan menancapkan tumbuhan",
            D: "Karena bisa menjadi tempat hidup serangga"
        },
        answer: "C"
    },
    {
        question: "Jika daun pada tumbuhan dirusak, maka proses fotosintesis akan terganggu karena ...",
        image: null,
        options: {
            A: "Daun menyerap air",
            B: "Mengurangi permukaan daun untuk menyerap cahaya matahari, yang merupakan energi utama fotosintesis",
            C: "Daun menarik penyerbuk",
            D: "Daun menyimpan cadangan makanan"
        },
        answer: "B"
    },
    {
        question: "Fungsi utama bunga pada tumbuhan adalah untuk ...",
        image: null,
        options: {
            A: "Menghasilkan oksigen",
            B: "Menarik hewan",
            C: "Perkembangbiakan",
            D: "Menyerap sinar matahari"
        },
        answer: "C"
    },
    {
        question: "Bunga membantu penyerbukan dengan menarik serangga. Hal ini menunjukkan …",
        image: null,
        options: {
            A: "Hubungan manusia dengan Tuhan",
            B: "Hubungan makhluk hidup dengan alam",
            C: "Hubungan manusia dengan teknologi",
            D: "Hubungan manusia dengan benda"
        },
        answer: "B"
    },
    {
        question: "Akar memiliki fungsi yang sangat penting bagi tumbuhan. Jika akar tumbuhan tidak kuat, dampaknya adalah ...",
        image: null,
        options: {
            A: "Tumbuhan tidak bisa berbunga",
            B: "Tumbuhan mudah roboh dan kering",
            C: "Daun akan berubah warna",
            D: "Tumbuhan akan menjadi tanaman air"
        },
        answer: "B"
    },
    {
        question: "Tumbuhan kaktus memiliki batang berduri dan tebal karena ...",
        image: null,
        options: {
            A: "Menyimpan air di daerah kering",
            B: "Menyerap lebih banyak oksigen",
            C: "Melindungi diri dari hewan",
            D: "Membuang air berlebih"
        },
        answer: "A"
    },
    {
        question: "Menanam pohon di sekitar rumah menunjukkan kepedulian terhadap …",
        image: null,
        options: {
            A: "Hubungan manusia dengan Tuhan",
            B: "Hubungan manusia dengan alam",
            C: "Hubungan antar manusia saja",
            D: "Kepentingan pribadi"
        },
        answer: "B"
    },
    {
        question: "Terdapat biji pada buah yang berfungsi untuk...",
        image: null,
        options: {
            A: "Menjadi makanan manusia",
            B: "Tempat menyimpan air",
            C: "Perkembangbiakan tumbuhan",
            D: "Membuat daun baru"
        },
        answer: "C"
    },
    {
        question: "Daun pada tumbuhan menghasilkan oksigen, oksigen tersebut yang dimanfaatkan oleh ..",
        image: null,
        options: {
            A: "Tumbuhan saja",
            B: "Hewan pemakan tumbuhan",
            C: "Semua makhluk hidup",
            D: "Hanya serangga"
        },
        answer: "C"
    },
    {
        question: "Bagian tumbuhan yang menjadi alat perkembangbiakan generatif adalah …",
        image: null,
        options: {
            A: "Akar",
            B: "Batang",
            C: "Daun",
            D: "Bunga"
        },
        answer: "D"
    },
    {
        question: "Akar tunjang pada pohon bakau berfungsi untuk.....",
        image: null,
        options: {
            A: "Menarik serangga",
            B: "Bertahan di tanah berlumpur",
            C: "Mempercepat pertumbuhan buah",
            D: "Menyimpan cadangan makanan"
        },
        answer: "B"
    },
    {
        question: "Kebutuhan utama tumbuhan untuk membuat makanan sendiri adalah ...",
        image: null,
        options: {
            A: "Air, tanah, dan pupuk",
            B: "Cahaya matahari, air, dan udara",
            C: "Serangga, air, dan tanah",
            D: "Manusia, pupuk, dan air"
        },
        answer: "B"
    },
    {
        question: "Daun cemara berbentuk kecil dan runcing. Bentuk tersebut berfungsi untuk …",
        image: null,
        options: {
            A: "Menyerap banyak air",
            B: "Mengurangi penguapan",
            C: "Menarik serangga",
            D: "Menyimpan makanan"
        },
        answer: "B"
    },
    {
        question: "Batang yang lunak dan berongga pada tumbuhan padi berfungsi untuk …",
        image: null,
        options: {
            A: "Mempercepat penyerapan zat hara",
            B: "Menyalurkan hasil fotosintesis dan menopang tumbuhan",
            C: "Melindungi bunga dari serangga",
            D: "Menyimpan cadangan makanan"
        },
        answer: "B"
    },
    {
        question: "Tidak menebang pohon sembarangan karena akar pohon dapat mencegah tanah longsor. Hal ini menunjukkan hubungan …",
        image: null,
        options: {
            A: "Manusia dengan Tuhan",
            B: "Manusia dengan alam",
            C: "Manusia dengan sesama",
            D: "Manusia dengan budaya"
        },
        answer: "B"
    },
    {
        question: "Jika tidak ada daun pada tumbuhan, maka proses fotosintesis akan ...",
        image: null,
        options: {
            A: "Tetap terjadi",
            B: "Meningkat",
            C: "Berkurang atau tidak terjadi",
            D: "Menyebabkan bunga gugur"
        },
        answer: "C"
    },
    {
        question: "Kegiatan menjaga tanaman di lingkungan sekolah mencerminkan nilai ...",
        image: null,
        options: {
            A: "Kepedulian terhadap sesama",
            B: "Tanggung jawab terhadap lingkungan",
            C: "Kewajiban sebagai siswa",
            D: "Keinginan untuk bermain"
        },
        answer: "B"
    },
    {
        question: "Duri pada tanaman mawar merupakan contoh bagian tubuh tumbuhan yang berfungsi untuk …",
        image: null,
        options: {
            A: "Membantu perkembangbiakan",
            B: "Mempercepat pertumbuhan",
            C: "Mempertahankan diri dari musuh",
            D: "Menyerap air dari tanah"
        },
        answer: "C"
    },
    {
        question: "Merawat tumbuhan berarti melaksanakan ajaran Tri Hita Karana karena dapat menciptakan…",
        image: null,
        options: {
            A: "Kerusakan alam",
            B: "Keharmonisan antara manusia, alam, dan Tuhan",
            C: "Persaingan hidup",
            D: "Kepentingan pribadi"
        },
        answer: "B"
    },
    {
        question: "Mengikuti kegiatan penghijauan di lingkungan sekolah menunjukkan sikap …",
        image: null,
        options: {
            A: "Individualisme",
            B: "Tanggung jawab warga negara",
            C: "Ketidakpedulian",
            D: "Kepentingan pribadi"
        },
        answer: "B"
    },
    {
        question: "Jika hutan ditebang secara liar, dampak yang terjadi adalah…",
        image: null,
        options: {
            A: "Tumbuhan tumbuh lebih subur",
            B: "Hubungan manusia dan alam menjadi seimbang",
            C: "Fungsi tumbuhan terganggu dan merusak hubungan manusia dengan alam",
            D: "Perkembangbiakan tumbuhan meningkat"
            },
        answer: "C"
    }
];

async function startQuiz() {
    quizOverlay.classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = {}; // Reset answers for a new quiz
    quizQuestions = quizQuestionsData; // Assign the hardcoded data
    
    // Reset buttons
    prevQuestionBtn.disabled = true;
    nextQuestionBtn.disabled = false;
    submitQuizBtn.classList.add('hidden');

    quizQuestionTextEl.innerHTML = '<p>Memuat quiz...</p>';
    quizOptionsContainerEl.innerHTML = '';
    quizImageContainerEl.innerHTML = '';
    questionNumberEl.textContent = '';

    if (quizQuestions.length === 0) {
        quizQuestionTextEl.innerHTML = '<p>Tidak ada pertanyaan quiz yang ditemukan.</p>';
        nextQuestionBtn.disabled = true;
        return;
    }
    
    displayQuestion(currentQuestionIndex);
    
    prevQuestionBtn.onclick = goToPreviousQuestion;
    nextQuestionBtn.onclick = goToNextQuestion;
    submitQuizBtn.onclick = submitQuiz;
}

function displayQuestion(index) {
    const q = quizQuestions[index];
    questionNumberEl.textContent = `Pertanyaan ${index + 1} dari ${quizQuestions.length}`;
    quizQuestionTextEl.textContent = q.question;
    
    quizImageContainerEl.innerHTML = '';
    if (q.image) {
        const img = document.createElement('img');
        img.src = `assets/img/Soal/${q.image}`;
        img.alt = `Soal ${index + 1}`; // Use index for alt text
        quizImageContainerEl.appendChild(img);
    }

    quizOptionsContainerEl.innerHTML = '';
    for (const key in q.options) {
        const label = document.createElement('label');
        label.innerHTML = `
            <input type="radio" name="currentQuestion" value="${key}">
            ${key}. ${q.options[key]}
        `;
        // Check if this option was previously selected by the user
        if (userAnswers[index] === key) {
            label.querySelector('input[type="radio"]').checked = true;
        }
        quizOptionsContainerEl.appendChild(label);
    }

    // Update navigation button states
    prevQuestionBtn.disabled = currentQuestionIndex === 0;
    nextQuestionBtn.disabled = currentQuestionIndex === quizQuestions.length - 1;
    
    if (currentQuestionIndex === quizQuestions.length - 1) {
        submitQuizBtn.classList.remove('hidden');
        nextQuestionBtn.classList.add('hidden'); // Hide next button on last question
    } else {
        submitQuizBtn.classList.add('hidden');
        nextQuestionBtn.classList.remove('hidden');
    }
}

function recordAnswer() {
    console.log(`recordAnswer called for question index: ${currentQuestionIndex}`);
    const selectedOption = quizOptionsContainerEl.querySelector('input[name="currentQuestion"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = selectedOption.value;
        console.log(`Answer recorded for question ${currentQuestionIndex}: ${selectedOption.value}`);
    } else {
        delete userAnswers[currentQuestionIndex]; // No answer selected, ensure it's not stored
        console.log(`No answer selected for question ${currentQuestionIndex}. Removing from userAnswers.`);
    }
    console.log('Current userAnswers state:', { ...userAnswers });
}

function goToNextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        recordAnswer(); // Save answer for the current question
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
}

function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        recordAnswer(); // Save answer for the current question
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
}

function submitQuiz() {
    recordAnswer(); // Save the answer for the last question

    let correctAnswers = 0;
    // Iterate over quizQuestionsData to ensure correct answer comparison
    quizQuestionsData.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = q.answer;
        const isCorrect = userAnswer === correctAnswer;
        console.log(`Question ${index}: User Answer = ${userAnswer}, Correct Answer = ${correctAnswer}, Is Correct = ${isCorrect}`);
        if (isCorrect) {
            correctAnswers++;
        }
    });

    const totalQuestions = quizQuestionsData.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    localStorage.setItem('quizScore', String(score));

    console.log('Quiz Result - Debug:');
    console.log('Total Questions:', totalQuestions);
    console.log('Correct Answers:', correctAnswers);
    console.log('Incorrect Answers:', totalQuestions - correctAnswers);
    console.log('Score:', score);

    Swal.fire({
        title: 'Quiz Selesai!',
        html: `
            <p>Total Soal: ${totalQuestions}</p>
            <p>Jawaban Benar: ${correctAnswers}</p>
            <p>Jawaban Salah: ${totalQuestions - correctAnswers}</p>
            <p>Skor Kamu: <strong>${score} / 100</strong></p>
        `,
        icon: 'info',
        confirmButtonText: 'OK'
    }).then(() => {
        quizOverlay.classList.add('hidden'); // Hide the quiz
        renderHub(); // Go back to the main map
    });
}
