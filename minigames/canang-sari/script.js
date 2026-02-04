document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const itemsContainer = document.getElementById('items-container');
    const canangBase = document.getElementById('canang-base');
    const yanaCharacter = document.getElementById('yana-character');
    const dialogueText = document.getElementById('dialogue-text');
    const gameContainer = document.querySelector('.game-container');

    // --- Game Data ---
    const items = [
        { id: 'canang-base-item', name: 'Alas Canang', className: 'canang-base-item' },
        { id: 'porosan', name: 'Porosan', className: 'porosan' },
        { id: 'pandan', name: 'Pandan', className: 'pandan' },
        { id: 'flower-white', name: 'Bunga Putih', className: 'flower-white' },
        { id: 'flower-red', name: 'Bunga Merah', className: 'flower-red' },
        { id: 'flower-yellow', name: 'Bunga Kuning', className: 'flower-yellow' },
        { id: 'flower-blue', name: 'Bunga Biru', className: 'flower-blue' },
    ];

    const gameSteps = [
        { dialogue: "Halo! Mari kita buat Canang Sari. Pertama, kita butuh Alas Canang sebagai dasarnya.", expression: 'Yana-Smile.png', requiredItem: 'canang-base-item', targetZone: 'base' },
        { dialogue: "Bagus! Sekarang, letakkan Porosan di tengahnya. Ini adalah simbol pemujaan.", expression: 'Yana-Smile.png', requiredItem: 'porosan', targetZone: 'center' },
        { dialogue: "Selanjutnya, Bunga Putih untuk Dewa Iswara di arah Timur (kanan).", expression: 'Yana-Smile.png', requiredItem: 'flower-white', targetZone: 'east' },
        { dialogue: "Lalu, Bunga Merah untuk Dewa Brahma di arah Selatan (bawah).", expression: 'Yana-Smile.png', requiredItem: 'flower-red', targetZone: 'south' },
        { dialogue: "Sekarang Bunga Kuning untuk Dewa Mahadewa di arah Barat (kiri).", expression: 'Yana-Smile.png', requiredItem: 'flower-yellow', targetZone: 'west' },
        { dialogue: "Hampir selesai! Bunga Biru untuk Dewa Wisnu di arah Utara (atas).", expression: 'Yana-Smile.png', requiredItem: 'flower-blue', targetZone: 'north' },
        { dialogue: "Terakhir, tambahkan Pandan sebagai simbol keharuman.", expression: 'Yana-Excited.png', requiredItem: 'pandan', targetZone: 'anywhere' },
    ];

    // --- Game State ---
    let currentStepIndex = 0;
    let isBasePlaced = false;
    let selectedItem = null; // For tap-and-drop

    // --- Functions ---
    function setDialogue(expression, text) {
        yanaCharacter.src = `../../assets/img/Yana/${expression}`;
        dialogueText.textContent = text;
        TTS.speak(text, 'Yana'); // Add TTS call
    }

    function initializeItems() {
        itemsContainer.innerHTML = '';
        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.id = item.id;
            itemEl.className = `item ${item.className}`;
            itemEl.draggable = false; // Initially not draggable
            itemEl.addEventListener('dragstart', dragStart);

            // --- Tap and Drop Logic ---
            itemEl.addEventListener('click', () => handleItemClick(item.id));

            itemsContainer.appendChild(itemEl);
        });
        updateDraggableItems();
    }

    function handleItemClick(itemId) {
        const itemEl = document.getElementById(itemId);
        if (!itemEl || itemEl.style.cursor === 'not-allowed') {
            setDialogue('Yana-Sad.png', "Belum saatnya menggunakan bahan itu.");
            return; // Ignore clicks on non-draggable items
        }

        // Deselect if already selected
        if (itemEl.classList.contains('selected')) {
            itemEl.classList.remove('selected');
            selectedItem = null;
        } else {
            // Deselect any other item
            const currentlySelected = document.querySelector('.item.selected');
            if (currentlySelected) {
                currentlySelected.classList.remove('selected');
            }
            // Select the new item
            itemEl.classList.add('selected');
            selectedItem = itemId;
        }
    }

    function updateDraggableItems() {
        const requiredItem = gameSteps[currentStepIndex]?.requiredItem;
        if (!requiredItem) return;

        items.forEach(item => {
            const itemEl = document.getElementById(item.id);
            if (itemEl) {
                const isDraggable = item.id === requiredItem;
                itemEl.draggable = isDraggable;
                itemEl.style.cursor = isDraggable ? 'pointer' : 'not-allowed'; // Use pointer for clickable items
                itemEl.style.opacity = isDraggable ? '1' : '0.5';
            }
        });
        // Hide the base item from the shelf once it's placed
        const baseItemEl = document.getElementById('canang-base-item');
        if (baseItemEl && isBasePlaced) {
            baseItemEl.style.display = 'none';
        }
    }

    function advanceStep() {
        if (currentStepIndex < gameSteps.length - 1) { // Check if there are more steps
            currentStepIndex++;
            const currentStep = gameSteps[currentStepIndex];
            setDialogue(currentStep.expression, currentStep.dialogue);
            updateDraggableItems();
        } else {
            // --- Game Completion ---
            showCompletionPopup();
        }
    }

    // --- Video Modal Elements ---
    const videoModal = document.getElementById('video-modal');
    const explanationVideo = document.getElementById('explanation-video');
    const videoExplanationText = document.getElementById('video-explanation-text');
    const videoCloseButton = videoModal.querySelector('.close-button');

    // --- Video Functions ---
    function showVideoModal(videoSrc, explanationText) {
        explanationVideo.src = videoSrc;
        videoExplanationText.textContent = explanationText;
        videoModal.classList.remove('hidden');
        explanationVideo.play();
    }

    function hideVideoModal() {
        explanationVideo.pause();
        explanationVideo.currentTime = 0; // Reset video to start
        videoModal.classList.add('hidden');
        // Show the game container again when video is closed
        gameContainer.classList.remove('hidden');
    }

    // --- Event Listener for Video Close Button ---
    videoCloseButton.addEventListener('click', hideVideoModal);

    // --- Event Listener for Video Ended ---
    explanationVideo.addEventListener('ended', () => {
        hideVideoModal();
        startQuiz(); // Start the quiz directly after video ends
    });

    function showCompletionPopup() {
        Swal.fire({
            title: 'Kerja Bagus!',
            text: 'Kamu telah berhasil merangkai Canang Sari dengan sempurna! Ini adalah wujud syukur dan bagian dari Parahyangan.',
            icon: 'success',
            confirmButtonText: 'Lanjut ke Video', // Changed button text
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                // Hide the game container before showing the video
                gameContainer.classList.add('hidden');
                // Show video modal after user confirms
                showVideoModal('assets/video/video_placeholder.mp4', 'Parahyangan: Hubungan harmonis antara manusia dengan Tuhan, diwujudkan melalui rasa syukur dan persembahan.');
            }
        });
    }

    function playSound(sound) {
        try {
            const audio = new Audio(`assets/sound/${sound}.mp3`);
            audio.play();
        } catch (error) {
            console.error(`Could not play sound: ${sound}`, error);
        }
    }

    // --- Drag and Drop Handlers ---
    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const canangRect = canangBase.getBoundingClientRect();
        const dropX = e.clientX;
        const dropY = e.clientY;
        handleDrop(id, dropX, dropY, canangRect);
    }

    function handleCanangClick(e) {
        if (selectedItem) {
            const canangRect = canangBase.getBoundingClientRect();
            const dropX = e.clientX;
            const dropY = e.clientY;
            handleDrop(selectedItem, dropX, dropY, canangRect);
        }
    }

    function handleDrop(id, dropX, dropY, canangRect) {
        const draggedElement = document.getElementById(id);
        const currentStep = gameSteps[currentStepIndex];

        if (id !== currentStep.requiredItem) {
            setDialogue('Yana-Sad.png', "Oops, sepertinya itu bukan bahan yang tepat. Coba lagi, ya!");
            return;
        }

        let isCorrectPlacement = false;

        // Check if the drop is within the canang base for all items except the base itself
        if (currentStep.targetZone !== 'base' && 
            (dropX < canangRect.left || dropX > canangRect.right || dropY < canangRect.top || dropY > canangRect.bottom)) {
            setDialogue('Yana-Sad.png', "Letakkan bahannya di atas Alas Canang ya.");
            return;
        }

        // --- Placement Logic ---
        if (currentStep.targetZone === 'base') {
            if (!isBasePlaced) {
                canangBase.style.backgroundImage = "url('assets/img/canang-base.png')";
                canangBase.classList.add('placed');
                isBasePlaced = true;
                isCorrectPlacement = true;
            }
        } else {
            // For other items, placement is correct if dropped on the base
            isCorrectPlacement = true;
        }

        if (isCorrectPlacement) {
            playSound('pas'); // Play success sound
            
            if (currentStep.targetZone !== 'base') { // Only create placed item for non-base items
                // Create a placed item on the canang base
                const placedItem = document.createElement('div');
                placedItem.className = `placed-item ${draggedElement.className}`;
                
                // Position the item relative to the canang base
                const relativeX = dropX - canangRect.left;
                const relativeY = dropY - canangRect.top;
                placedItem.style.left = `${relativeX - (draggedElement.offsetWidth / 2)}px`;
                placedItem.style.top = `${relativeY - (draggedElement.offsetHeight / 2)}px`;

                canangBase.appendChild(placedItem);
            }

            // Make the original item in the shelf disappear
            draggedElement.style.visibility = 'hidden';

            // Deselect item after placing
            if (draggedElement.classList.contains('selected')) {
                draggedElement.classList.remove('selected');
            }
            selectedItem = null;

            advanceStep();
        } else {
            setDialogue('Yana-Sad.png', "Hmm, coba letakkan di tempat yang benar.");
        }
    }

    // --- Quiz Variables and Functions (Integrated from minigames/quiz_parahyangan/script.js) ---
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
            const response = await fetch('../../soal.txt'); // Path relative to minigames/canang-sari/
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
                    if (trimmedLine.endsWith('.png')) {
                        if (currentQuestion) {
                            currentQuestion.image = trimmedLine;
                        }
                        continue;
                    }

                    if (/^\d+\.\s/.test(trimmedLine)) {
                        if (currentQuestion) {
                            currentQuestion.options = currentQuestion.options.map(opt => opt.replace(/^[a-zA-Z]\.\s?/, '').replace('✅', '').trim());
                            parahyanganQuestions.push(currentQuestion);
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
                            const parts = trimmedLine.split(':');
                            const answer = parts[parts.length - 1].trim().charAt(0).toUpperCase();
                            currentQuestion.correctAnswer = answer;
                        }
                    }
                }
            }
            if (currentQuestion) {
                 currentQuestion.options = currentQuestion.options.map(opt => opt.replace(/^[a-zA-Z]\.\s?/, '').replace('✅', '').trim());
                parahyanganQuestions.push(currentQuestion);
            }
            return parahyanganQuestions;
        } catch (error) {
            console.error('Error loading or parsing soal.txt:', error);
            return [];
        }
    }

    async function startQuiz() {
        // Hide game container and show quiz container
        gameContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');

        quizQuestions = await loadParahyanganQuestions();
        if (quizQuestions.length === 0) {
            // If no questions loaded, directly show results with an error
            endQuiz();
            return;
        }

        currentQuestionIndex = 0;
        score = 0;
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const question = quizQuestions[currentQuestionIndex];
            quizQuestion.textContent = question.question;
            quizOptions.innerHTML = '';

            quizImage.classList.add('hidden');
            quizImage.src = '';

            if (question.image) {
                // Path to quiz images relative to minigames/canang-sari/
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

    function endQuiz() {
        quizContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        if (quizQuestions.length === 0) {
            resultsTitle.textContent = 'Gagal Memuat Kuis';
            characterFeedback.textContent = 'Tidak ada soal kuis yang berhasil dimuat. Mohon periksa kembali sumber soal.';
            characterAvatar.src = `../../../assets/img/Yana/Yana-Sad.png`; // Path to Yana avatar relative to minigames/canang-sari/
            scoreText.textContent = 'Skor Kamu: N/A';
            return;
        }

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

        characterAvatar.src = `../../../assets/img/Yana/Yana-${result.expression}.png`; // Path to Yana avatar relative to minigames/canang-sari/
        resultsTitle.textContent = result.title;
        characterFeedback.textContent = result.feedback;
        scoreText.textContent = `Skor Kamu: ${score} dari ${quizQuestions.length}`;
    }

    // --- Event Listeners for Quiz Navigation ---
    nextQuestionBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    finishQuizBtn.addEventListener('click', endQuiz);

    backToMapBtn.addEventListener('click', () => {
        window.location.href = '../../../index.html'; // Path back to main index.html
    });

    // --- Event Listeners ---
    gameContainer.addEventListener('dragover', dragOver);
    gameContainer.addEventListener('drop', drop);
    canangBase.addEventListener('click', handleCanangClick); // For tap-and-drop

    // --- Initial Game Start ---
    initializeItems();
    const firstStep = gameSteps[0];
    setDialogue(firstStep.expression, firstStep.dialogue);
});