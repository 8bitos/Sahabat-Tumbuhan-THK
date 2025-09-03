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

    async function loadPawonganQuestions() {
        try {
            const response = await fetch('../../soal.txt');
            const text = await response.text();
            const lines = text.split('\n');
            const pawonganQuestions = [];
            let inPawonganSection = false;
            let currentQuestion = null;

            for (const line of lines) {
                const trimmedLine = line.trim();

                if (trimmedLine.startsWith('🔹 II. Soal Tujuan 2:')) {
                    inPawonganSection = true;
                    continue;
                }
                if (trimmedLine.startsWith('🔹 III. Soal Tujuan 3:')) {
                    inPawonganSection = false;
                    break;
                }

                if (inPawonganSection) {
                    if (trimmedLine.endsWith('.png')) {
                        if (currentQuestion) {
                            currentQuestion.image = trimmedLine;
                        }
                        continue;
                    }

                    if (/^\d+\.\s/.test(trimmedLine)) {
                        if (currentQuestion) {
                            // Clean up options before adding
                            currentQuestion.options = currentQuestion.options.map(opt => opt.replace(/^[a-zA-Z]\.\s?/, '').replace('✅', '').trim());
                            pawonganQuestions.push(currentQuestion);
                        }
                        currentQuestion = {
                            question: trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim(),
                            options: [],
                            correctAnswer: '',
                            image: ''
                        };
                    } else if (/^[A-D]\.\s/i.test(trimmedLine)) {
                        if (currentQuestion) {
                            currentQuestion.options.push(trimmedLine);
                            if (trimmedLine.includes('✅')) {
                                currentQuestion.correctAnswer = trimmedLine.charAt(0).toUpperCase();
                            }
                        }
                    } else if (trimmedLine.startsWith('Kunci jawaban:') || trimmedLine.startsWith('Jawaban:')) {
                        if (currentQuestion) {
                            const answer = trimmedLine.split(':')[-1].trim().charAt(0).toUpperCase();
                            currentQuestion.correctAnswer = answer;
                        }
                    }
                }
            }
            if (currentQuestion) {
                 currentQuestion.options = currentQuestion.options.map(opt => opt.replace(/^[a-zA-Z]\.\s?/, '').replace('✅', '').trim());
                pawonganQuestions.push(currentQuestion);
            }
            return pawonganQuestions;
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

            if (question.image) {
                quizImage.src = `../quiz/assets/img/${question.image}`;
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
                feedback: "Jangan berkecil hati. Kepedulian itu bisa dilatih, kok. Mari kita belajar bersama tentang bagaimana menjadi sahabat yang baik bagi sesama."
            };
        } else if (score <= 5) {
            result = {
                expression: 'MemberiTahu',
                title: 'Terus Berusaha!',
                feedback: "Tidak apa-apa, yang penting niat baikmu sudah ada. Terus belajar untuk lebih peka terhadap orang lain, dan kamu akan jadi teman yang hebat."
            };
        } else if (score <= 8) {
            result = {
                expression: 'Smile',
                title: 'Kerja Bagus!',
                feedback: "Bagus sekali! Kamu mengerti pentingnya kepedulian dan hubungan baik antar manusia. Terus sebarkan kebaikan di sekitarmu, ya!"
            };
        } else { // 9+
            result = {
                expression: 'Excited',
                title: 'Luar Biasa!',
                feedback: "Wow, hebat! Kamu punya hati yang tulus dan pemahaman yang luar biasa tentang menolong sesama. Kamu adalah teman yang sangat berharga!"
            };
        }

        characterAvatar.src = `../../assets/img/Sari/Sari-${result.expression}.png`;
        resultsTitle.textContent = result.title;
        characterFeedback.textContent = result.feedback;
        scoreText.textContent = `Skor Kamu: ${score} dari ${quizQuestions.length}`;
    }

    backToMapBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    quizQuestions = await loadPawonganQuestions();
    displayQuestion();
});