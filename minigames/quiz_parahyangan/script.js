document.addEventListener('DOMContentLoaded', async () => {
    // Quiz elements
    const quizContainer = document.getElementById('quiz-container');
    const quizImage = document.getElementById('quiz-image');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const finishQuizBtn = document.getElementById('finish-quiz-btn');

    // Results elements
    const resultsContainer = document.getElementById('results-container');
    const characterAvatar = document.getElementById('character-avatar');
    const resultsTitle = document.getElementById('results-title');
    const characterFeedback = document.getElementById('character-feedback');
    const scoreText = document.getElementById('score-text');
    const backToMapBtn = document.getElementById('back-to-map-btn');

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    async function loadParahyanganQuestions() {
        try {
            const response = await fetch('../../soal.txt');
            const text = await response.text();
            const lines = text.split('\n');
            const parahyanganQuestions = [];
            let inParahyanganSection = false;
            let currentQuestion = null;

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('🔹 III. Soal Tujuan 3:')) {
                    inParahyanganSection = true;
                    continue;
                }
                if (inParahyanganSection) {
                    if (/^\d+\.\s/.test(trimmedLine)) {
                        if (currentQuestion) parahyanganQuestions.push(currentQuestion);
                        currentQuestion = { question: trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim(), options: [], correctAnswer: '' };
                    } else if (/^[A-D]\.\s/.test(trimmedLine) || /^[a-d]\.\s/.test(trimmedLine)) {
                        if (currentQuestion) currentQuestion.options.push(trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim());
                    } else if (trimmedLine.startsWith('Kunci jawaban:') || trimmedLine.startsWith('Jawaban:')) {
                        if (currentQuestion) currentQuestion.correctAnswer = trimmedLine.slice(-1);
                    }
                }
            }
            if (currentQuestion) parahyanganQuestions.push(currentQuestion);
            return parahyanganQuestions;
        } catch (error) {
            console.error('Error loading or parsing soal.txt:', error);
            return [];
        }
    }

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const question = quizQuestions[currentQuestionIndex];
            quizQuestion.textContent = question.question;
            quizOptions.innerHTML = '';
            quizImage.classList.add('hidden');
            quizImage.src = '';

            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option btn';
                button.textContent = option;
                button.dataset.option = String.fromCharCode(65 + index);
                button.addEventListener('click', () => checkAnswer(button, question.correctAnswer));
                quizOptions.appendChild(button);
            });

            quizFeedback.textContent = '';
            nextQuestionBtn.classList.add('hidden');
            finishQuizBtn.classList.add('hidden');
            Array.from(quizOptions.children).forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'wrong');
            });
        } else {
            endQuiz();
        }
    }

    function checkAnswer(selectedButton, correctAnswer) {
        Array.from(quizOptions.children).forEach(button => {
            button.disabled = true;
        });

        if (selectedButton.dataset.option === correctAnswer) {
            selectedButton.classList.add('correct');
            quizFeedback.textContent = 'Benar!';
            score++;
        } else {
            selectedButton.classList.add('wrong');
            quizFeedback.textContent = `Salah. Jawaban yang benar adalah ${correctAnswer}.`;
            Array.from(quizOptions.children).forEach(button => {
                if (button.dataset.option === correctAnswer) {
                    button.classList.add('correct');
                }
            });
        }

        if (currentQuestionIndex < quizQuestions.length - 1) {
            nextQuestionBtn.classList.remove('hidden');
        } else {
            finishQuizBtn.classList.remove('hidden');
        }
    }

    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    finishQuizBtn.addEventListener('click', endQuiz);

    function endQuiz() {
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        let result;
        if (score <= 2) {
            result = {
                expression: 'Sad',
                title: 'Jangan Menyerah',
                feedback: "Jangan sedih. Rasa syukur itu ada di dalam hati kita semua, kadang kita hanya perlu bantuan untuk menemukannya. Mari kita cari bersama-sama."
            };
        } else if (score <= 5) {
            result = {
                expression: 'Smile',
                title: 'Terus Berusaha!',
                feedback: "Tidak apa-apa. Belajar bersyukur adalah perjalanan. Niat tulusmu sudah terlihat, dan itu yang paling penting."
            };
        } else if (score <= 8) {
            result = {
                expression: 'Smile',
                title: 'Kerja Bagus!',
                feedback: "Sangat bagus. Kamu mengerti cara menunjukkan rasa terima kasih melalui perbuatan. Terus jaga ketenangan dan kedamaian hatimu."
            };
        } else { // 9+
            result = {
                expression: 'Excited',
                title: 'Luar Biasa!',
                feedback: "Luar biasa! Hatimu begitu tulus dan pemahamanmu tentang rasa syukur sangat mendalam. Kamu memancarkan keharmonisan dengan Sang Pencipta."
            };
        }

        characterAvatar.src = `../../assets/img/Yana/Yana-${result.expression}.png`;
        resultsTitle.textContent = result.title;
        characterFeedback.textContent = result.feedback;
        scoreText.textContent = `Skor Kamu: ${score} dari ${quizQuestions.length}`;
    }

    backToMapBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    quizQuestions = await loadParahyanganQuestions();
    displayQuestion();
});