document.addEventListener('DOMContentLoaded', async () => {
    const quizContainer = document.getElementById('quiz-container');
    const quizImage = document.getElementById('quiz-image');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const finishQuizBtn = document.getElementById('finish-quiz-btn');

    let quizQuestions = []; // Will be populated dynamically
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
                    if (/^\d+\.\s/.test(trimmedLine)) { // New question
                        if (currentQuestion) {
                            parahyanganQuestions.push(currentQuestion);
                        }
                        currentQuestion = {
                            question: trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim(),
                            options: [],
                            correctAnswer: ''
                        };
                    } else if (/^[A-D]\.\s/.test(trimmedLine) || /^[a-d]\.\s/.test(trimmedLine)) { // Option
                        if (currentQuestion) {
                            currentQuestion.options.push(trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim());
                        }
                    } else if (trimmedLine.startsWith('Kunci jawaban:') || trimmedLine.startsWith('Jawaban:')) {
                        if (currentQuestion) {
                            currentQuestion.correctAnswer = trimmedLine.slice(-1);
                        }
                    }
                }
            }
            if (currentQuestion) {
                parahyanganQuestions.push(currentQuestion);
            }
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
            quizOptions.innerHTML = ''; // Clear previous options

            quizImage.classList.add('hidden'); // Hide image for now
            quizImage.src = ''; // Clear previous src

            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option';
                button.textContent = option;
                button.dataset.option = String.fromCharCode(65 + index); // A, B, C, D
                button.addEventListener('click', () => checkAnswer(button, question.correctAnswer));
                quizOptions.appendChild(button);
            });
            quizFeedback.textContent = '';
            nextQuestionBtn.classList.add('hidden');
            finishQuizBtn.classList.add('hidden');
            // Enable all buttons for the new question
            Array.from(quizOptions.children).forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'wrong');
            });
        } else {
            endQuiz();
        }
    }

    function checkAnswer(selectedButton, correctAnswer) {
        // Disable all buttons after an answer is selected
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
            // Highlight the correct answer
            Array.from(quizOptions.children).forEach(button => {
                if (button.dataset.option === correctAnswer) {
                    button.classList.add('correct');
                }
            });
        }

        if (currentQuestionIndex < quizQuestions.length - 1) {
            nextQuestionBtn.classList.remove('hidden');
            nextQuestionBtn.onclick = nextQuestion;
        } else {
            finishQuizBtn.classList.remove('hidden');
            finishQuizBtn.onclick = endQuiz;
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }

    function endQuiz() {
        const percentageScore = (score / quizQuestions.length) * 100;
        let feedbackMessage = '';

        if (percentageScore >= 80) {
            feedbackMessage = `Luar biasa! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Pemahamanmu tentang tumbuhan sangat baik!`
        } else if (percentageScore >= 50) {
            feedbackMessage = `Bagus! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Terus belajar untuk meningkatkan pemahamanmu.`
        } else {
            feedbackMessage = `Jangan menyerah! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Mari kita ulangi materinya dan coba lagi nanti.`
        }

        quizQuestion.textContent = 'Kuis Selesai!';
        quizOptions.innerHTML = `<p>${feedbackMessage}</p>`;
        quizFeedback.textContent = '';
        nextQuestionBtn.classList.add('hidden');
        finishQuizBtn.classList.add('hidden');
        quizImage.classList.add('hidden'); // Hide image at the end of quiz

        const backToMainButton = document.createElement('button');
        backToMainButton.textContent = 'Kembali ke Game Utama';
        backToMainButton.className = 'action-button'; // Re-use existing button style
        backToMainButton.style.marginTop = '20px';
        backToMainButton.addEventListener('click', () => {
            window.location.href = '../../index.html'; // Navigate back to main game
        });
        quizOptions.appendChild(backToMainButton); // Append to options div for centering
    }

    // Initial load of questions and display
    quizQuestions = await loadParahyanganQuestions();
    displayQuestion();
});
