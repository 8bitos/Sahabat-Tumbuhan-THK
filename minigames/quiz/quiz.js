import { quizQuestions } from '../../quizData.js';

document.addEventListener('DOMContentLoaded', () => {
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

    let currentQuestionIndex = 0;
    let score = 0;

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const question = quizQuestions[currentQuestionIndex];
            quizQuestion.textContent = question.question;
            quizOptions.innerHTML = '';

            quizImage.classList.add('hidden');
            quizImage.src = '';

            if (question.image) {
                quizImage.src = `assets/img/${question.image}`;
                quizImage.classList.remove('hidden');
            }

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
                title: 'Jangan Menyerah!',
                feedback: "Jangan sedih, belajar itu proses. Yang terpenting adalah keinginanmu untuk peduli pada alam. Ayo kita coba lagi nanti, aku akan bantu!"
            };
        } else if (score <= 5) {
            result = {
                expression: 'Explain',
                title: 'Terus Berusaha!',
                feedback: "Tidak apa-apa, kamu sudah berusaha dengan baik! Ada beberapa hal yang mungkin perlu kita pelajari lagi bersama. Jangan ragu untuk bertanya padaku!"
            };
        } else if (score <= 8) {
            result = {
                expression: 'Smile',
                title: 'Kerja Bagus!',
                feedback: "Kerja bagus! Kamu sudah punya pemahaman yang kuat tentang cara merawat alam. Terus asah kepedulianmu, ya!"
            };
        } else { // 9+
            result = {
                expression: 'Excited',
                title: 'Luar Biasa!',
                feedback: "Luar biasa! Kamu benar-benar sahabat terbaik bagi para tumbuhan! Pemahamanmu tentang Palemahan sangat mendalam. Alam pasti bangga padamu!"
            };
        }

        // Fallback for missing expression assets
        const validExpressions = ['Excited', 'Explain', 'Sad', 'Smile'];
        const avatarExpression = validExpressions.includes(result.expression) ? result.expression : 'Smile';

        characterAvatar.src = `../../assets/img/Loka/Loka-${avatarExpression}.png`;
        resultsTitle.textContent = result.title;
        characterFeedback.textContent = result.feedback;
        scoreText.textContent = `Skor Kamu: ${score} dari ${quizQuestions.length}`;
    }

    backToMapBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    displayQuestion();
});