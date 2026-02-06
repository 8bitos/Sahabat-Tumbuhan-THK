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

async function startQuiz() {
    quizOverlay.classList.remove('hidden');
    currentQuestionIndex = 0;
    userAnswers = {}; // Reset answers for a new quiz
    quizQuestions = []; // Clear previous questions
    
    // Reset buttons
    prevQuestionBtn.disabled = true;
    nextQuestionBtn.disabled = false;
    submitQuizBtn.classList.add('hidden');

    quizQuestionTextEl.innerHTML = '<p>Loading quiz...</p>';
    quizOptionsContainerEl.innerHTML = '';
    quizImageContainerEl.innerHTML = '';
    questionNumberEl.textContent = '';

    try {
        const response = await fetch('quiz.txt');
        if (!response.ok) throw new Error('Failed to load quiz.txt');
        const text = await response.text();
        
        quizQuestions = parseQuizText(text);
        if (quizQuestions.length === 0) {
            quizQuestionTextEl.innerHTML = '<p>Gagal memuat quiz. Tidak ada pertanyaan yang ditemukan.</p>';
            nextQuestionBtn.disabled = true;
            return;
        }
        
        displayQuestion(currentQuestionIndex);
        
        prevQuestionBtn.onclick = goToPreviousQuestion;
        nextQuestionBtn.onclick = goToNextQuestion;
        submitQuizBtn.onclick = submitQuiz;

    } catch (error) {
        console.error('Error starting quiz:', error);
        quizQuestionTextEl.innerHTML = '<p>Gagal memuat quiz. Silakan coba lagi.</p>';
        nextQuestionBtn.disabled = true;
    }
}

function displayQuestion(index) {
    recordAnswer(); // Save answer for the question we're leaving

    const q = quizQuestions[index];
    questionNumberEl.textContent = `Pertanyaan ${index + 1} dari ${quizQuestions.length}`;
    quizQuestionTextEl.textContent = q.question;
    
    quizImageContainerEl.innerHTML = '';
    if (q.image) {
        const img = document.createElement('img');
        img.src = `assets/img/Soal/${q.image}`;
        img.alt = `Soal ${q.id}`;
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
    const selectedOption = quizOptionsContainerEl.querySelector('input[name="currentQuestion"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = selectedOption.value;
    } else {
        delete userAnswers[currentQuestionIndex]; // No answer selected, ensure it's not stored
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
}

function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
}

function submitQuiz() {
    recordAnswer(); // Save the answer for the last question

    let correctAnswers = 0;
    let incorrectAnswers = 0;

    quizQuestions.forEach((q, index) => {
        if (userAnswers[index] && userAnswers[index] === q.answer) {
            correctAnswers++;
        } else {
            // Only count as incorrect if an answer was actually given
            if (userAnswers[index]) {
                incorrectAnswers++;
            }
        }
    });

    const totalQuestions = quizQuestions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

                    Swal.fire({

                        title: 'Quiz Selesai!',

                        html: `

                        <p>Total Soal: ${totalQuestions}</p>

                        <p>Jawaban Benar: ${correctAnswers}</p>

                        <p>Jawaban Salah: ${incorrectAnswers}</p>

                        <p>Skor Kamu: <strong>${score} / 100</strong></p>

                    `,

                        icon: 'info',

                        confirmButtonText: 'OK'

                    }).then(() => {

                        quizOverlay.classList.add('hidden'); // Hide the quiz

                        renderHub(); // Go back to the main map

                    });}

function parseQuizText(text) {
    const questions = [];
    const questionBlocks = text.split(/(?=\n\s*\d+\.)/).filter(block => block.trim() !== '');

    questionBlocks.forEach(block => {
        const fullBlock = block.trim();
        const questionData = {
            id: '',
            question: '',
            image: null,
            options: {},
            answer: ''
        };

        // Extract ID and main question text
        const idMatch = fullBlock.match(/^(\d+)\.(.*)/s);
        if (!idMatch) return; // Skip if ID not found
        questionData.id = idMatch[1];
        let remainingBlock = idMatch[2].trim();

        // Extract image if present
        const imageMatch = remainingBlock.match(/\((.*?\.png)\)/);
        if (imageMatch) {
            questionData.image = imageMatch[1];
            remainingBlock = remainingBlock.replace(/\(.*?\)/, '').trim(); // Remove image part from remaining block
        }

        // Split by options to isolate question and then options
        // Refactored logic to handle options on the same line
        const firstOptionIndex = remainingBlock.search(/[A-D]\./);
        if (firstOptionIndex !== -1) {
            questionData.question = remainingBlock.substring(0, firstOptionIndex).trim();
            const optionsBlock = remainingBlock.substring(firstOptionIndex);

            // Regex to capture each option (letter and text)
            // It looks for A., B., C., D. and captures everything until the next option or the answer key/end of block
            const optionRegex = /([A-D])\.\s*(.*?)(?=\s*[A-D]\.|\n\s*Kunci jawaban|\n\s*Jawaban|\n\s*JAWABAN|\n\s*$)/gs;
            
            for (const match of optionsBlock.matchAll(optionRegex)) {
                const optionLetter = match[1];
                const optionText = match[2].trim();
                questionData.options[optionLetter] = optionText;
            }
        } else {
            // If no options are found (e.g., only question text before answer)
            questionData.question = remainingBlock.trim();
        }

        // Extract answer
        const answerMatch = fullBlock.match(/(?:Kunci jawaban|Jawaban|JAWABAN)[:\s]*([A-D])/i);
        if (answerMatch) {
            questionData.answer = answerMatch[1].toUpperCase();
        }
        
        if (questionData.question && Object.keys(questionData.options).length > 0 && questionData.answer) {
            questions.push(questionData);
        }
    });
    return questions;
}
