import { quizQuestions } from '../../quizData.js';

document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const quizImage = document.getElementById('quiz-image');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const finishQuizBtn = document.getElementById('finish-quiz-btn');

    let currentQuestionIndex = 0;
    let score = 0;

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const question = quizQuestions[currentQuestionIndex];
            quizQuestion.textContent = question.question;
            quizOptions.innerHTML = ''; // Clear previous options

            // Hardcoded image display based on currentQuestionIndex
            // Assuming quizQuestions are in order of original soal.txt
            // Questions with images: 1, 3, 4, 5, 10 (original numbering)
            // In 0-indexed array: 0, 2, 3, 4, 9
            quizImage.classList.add('hidden'); // Hide by default
            quizImage.src = ''; // Clear previous src

            switch (currentQuestionIndex) {
                case 0: // Original Question 1
                    quizImage.src = 'assets/img/question1.jpg';
                    quizImage.classList.remove('hidden');
                    break;
                case 2: // Original Question 3
                    quizImage.src = 'assets/img/question3.jpg';
                    quizImage.classList.remove('hidden');
                    break;
                case 3: // Original Question 4
                    quizImage.src = 'assets/img/question4.jpg';
                    quizImage.classList.remove('hidden');
                    break;
                case 4: // Original Question 5
                    quizImage.src = 'assets/img/question5.jpg';
                    quizImage.classList.remove('hidden');
                    break;
                // Note: Original Question 10 is not in the first 7 questions parsed.
                // If quizQuestions contains more than 7 questions, this case might be needed.
                // case 9: // Original Question 10
                //     quizImage.src = 'assets/img/question10.jpg';
                //     quizImage.classList.remove('hidden');
                //     break;
            }

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
            feedbackMessage = `Luar biasa! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Pemahamanmu tentang tumbuhan sangat baik!`;
        } else if (percentageScore >= 50) {
            feedbackMessage = `Bagus! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Terus belajar untuk meningkatkan pemahamanmu.`;
        } else {
            feedbackMessage = `Jangan menyerah! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Mari kita ulangi materinya dan coba lagi nanti.`;
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

    // Initial display of the first question
    displayQuestion();
});