document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const gameWorld = document.getElementById('game-world');
    const characterImage = document.getElementById('character-image');
    const characterName = document.getElementById('character-name');
    const dialogueText = document.getElementById('dialogue-text');

    // Import quiz questions
    

    // Import quiz questions
    

    // Import quiz questions
    

    // Import quiz questions
    

    // Import quiz questions
    

    // Game State
    const gameState = {
        progress: { palemahan: 0, pawongan: 0, parahyangan: 0 },
        currentLocation: 'hub',
    };

    // --- CORE FUNCTIONS ---

    function updateUI() {
        // This function is now empty after removing progress bars
    }

    function setDialogue(char, text, expression = '', buttons = []) {
        characterName.textContent = char;
        dialogueText.textContent = text;
        if (char !== 'Narator' && expression) {
            characterImage.src = `assets/img/${char}/${char}-${expression}.png`;
            characterImage.style.display = 'block';
        } else {
            characterImage.style.display = 'none';
        }

        const dialogueButtons = document.getElementById('dialogue-buttons');
        dialogueButtons.innerHTML = ''; // Clear existing buttons

        buttons.forEach(buttonInfo => {
            const button = document.createElement('button');
            button.className = `dialogue-button ${buttonInfo.className || ''}`;
            button.textContent = buttonInfo.text;
            button.addEventListener('click', buttonInfo.onClick);
            dialogueButtons.appendChild(button);
        });
    }

    function renderHub() {
        gameState.currentLocation = 'hub';
        gameWorld.innerHTML = '';
        gameWorld.classList.remove('minigame-active');
        setDialogue('Narator', 'Kamu berada di halaman sekolah. Ke mana kamu akan pergi selanjutnya? Klik salah satu lokasi.');

        const locations = [
            { id: 'loka', name: 'Taman (Loka)', top: '20%', left: '15%', mission: 'palemahan' },
            { id: 'sari', name: 'Kantin (Sari)', top: '50%', left: '50%', mission: 'pawongan' },
            { id: 'yana', name: 'Pura (Yana)', top: '75%', left: '25%', mission: 'parahyangan' }
        ];

        locations.forEach(loc => {
            const locElement = document.createElement('div');
            locElement.id = `location-${loc.id}`;
            locElement.className = 'map-location';
            
            const avatarImg = document.createElement('img');
            avatarImg.src = `assets/img/${loc.id.charAt(0).toUpperCase() + loc.id.slice(1)}/${loc.id.charAt(0).toUpperCase() + loc.id.slice(1)}-Smile.png`;
            avatarImg.alt = loc.name;
            avatarImg.className = 'map-location-avatar';
            locElement.appendChild(avatarImg);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = loc.name;
            locElement.appendChild(nameSpan);

            locElement.style.top = loc.top;
            locElement.style.left = loc.left;
            locElement.addEventListener('click', () => {
                switch (loc.mission) {
                    case 'palemahan':
                        window.location.href = 'minigames/palemahan_menu.html';
                        break;
                    case 'pawongan':
                        window.location.href = 'minigames/pawongan_menu.html';
                        break;
                    case 'parahyangan':
                        window.location.href = 'minigames/parahyangan_menu.html';
                        break;
                    default:
                        setDialogue('Narator', `Misi untuk ${loc.name} belum siap.`);
                        break;
                }
            });
            gameWorld.appendChild(locElement);
        });
    }

    // --- DRAGGABLE HELPER ---
    function makeDraggable(element, container) {
        let isDragging = false, offsetX, offsetY;
        element.style.cursor = 'grab';
        element.addEventListener('mousedown', e => {
            if (e.target !== element && !e.target.classList.contains('dropped-item')) return;
            isDragging = true;
            const elemRect = element.getBoundingClientRect();
            offsetX = e.clientX - elemRect.left;
            offsetY = e.clientY - elemRect.top;
            element.style.cursor = 'grabbing';
            element.style.zIndex = 1000;
            e.stopPropagation();
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const containerRect = container.getBoundingClientRect();
            let x = e.clientX - containerRect.left - offsetX;
            let y = e.clientY - containerRect.top - offsetY;
            x = Math.max(0, Math.min(x, containerRect.width - element.offsetWidth));
            y = Math.max(0, Math.min(y, containerRect.height - element.offsetHeight));
            element.style.position = 'absolute';
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
                element.style.zIndex = 'auto';
            }
        });
    }

    // --- MINIGAME: CANANG SARI (Freeform) ---
    function startCanangSariMinigame() {
        window.location.href = 'minigames/canang-sari/index.html';
    }

    // --- MINIGAME: JAMU ---
    function startJamuMinigame() {
        gameState.currentLocation = 'jamu_minigame';
        gameWorld.innerHTML = '';
        gameWorld.classList.add('minigame-active');
        setDialogue('Sari', 'Bantu aku membuat jamu! Seret bahan yang benar ke mangkuk.', 'MemberiTahu');

        const board = document.createElement('div');
        board.className = 'minigame-board';
        board.id = 'jamu-board';

        const recipe = document.createElement('div');
        recipe.id = 'jamu-recipe';
        recipe.innerHTML = '<p><strong>Resep:</strong> Kunyit & Pandan</p>';

        const dropZone = document.createElement('div');
        dropZone.id = 'jamu-drop-zone';
        dropZone.className = 'minigame-drop-zone';

        const itemSource = document.createElement('div');
        itemSource.className = 'minigame-item-source';

        const items = [
            { id: 'kunyit', src: 'assets/img/Sari/Sari-Smile.png', correct: true }, // Placeholder
            { id: 'pandan', src: 'minigames/canang-sari/assets/img/pandan.png', correct: true },
            { id: 'bunga-merah', src: 'minigames/canang-sari/assets/img/flower-red.png', correct: false }
        ];

        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'minigame-item jamu-ingredient';
            div.style.backgroundImage = `url('${item.src}')`;
            div.draggable = true;
            div.addEventListener('dragstart', e => e.dataTransfer.setData('isCorrect', item.correct));
            itemSource.appendChild(div);
        });

        dropZone.addEventListener('dragover', e => e.preventDefault());

        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            if (e.dataTransfer.getData('isCorrect') === 'true') {
                e.target.style.backgroundColor = '#c8e6c9'; // Greenish feedback
                const correctCount = (dropZone.dataset.correctCount || 0) + 1;
                dropZone.dataset.correctCount = correctCount;
                if (correctCount >= 2) checkJamuCompletion();
            } else {
                setDialogue('Sari', 'Oh, itu bukan bahan yang tepat. Coba lagi!', 'Sad');
            }
        });

        board.appendChild(recipe);
        board.appendChild(dropZone);
        board.appendChild(itemSource);
        gameWorld.appendChild(board);
    }

    function checkJamuCompletion() {
        setDialogue('Sari', 'Terima kasih! Jamu ini pasti akan membantunya.', 'Excited');
        gameState.progress.pawongan = Math.min(100, gameState.progress.pawongan + 25);
        
        const backButton = document.createElement('button');
        backButton.id = 'complete-button';
        backButton.textContent = 'Selesai & Kembali';
        gameWorld.querySelector('.minigame-board').appendChild(backButton);
        backButton.addEventListener('click', renderHub);
    }

    // --- VIDEO LESSON FUNCTION ---
    function startVideoLesson(videoPath, lessonTitle, lessonText, onVideoEndedCallback) {
        gameWorld.innerHTML = '';
        gameWorld.classList.add('minigame-active'); // Center the video
        setDialogue('Narator', 'Perhatikan video berikut untuk memahami materi.');

        const videoContainer = document.createElement('div');
        videoContainer.id = 'video-lesson-container';

        const videoPlayer = document.createElement('video');
        videoPlayer.id = 'video-player';
        videoPlayer.controls = true;
        videoPlayer.autoplay = true;
        videoPlayer.src = videoPath;

        const lessonTextArea = document.createElement('div');
        lessonTextArea.id = 'lesson-text-area';
        lessonTextArea.innerHTML = `<h4>${lessonTitle}</h4><p>${lessonText}</p>`;

        videoPlayer.addEventListener('ended', () => {
            setDialogue('Narator', 'Video telah selesai. Siap untuk melanjutkan?');
            if (onVideoEndedCallback) {
                onVideoEndedCallback();
            }
        });

        videoContainer.appendChild(videoPlayer);
        videoContainer.appendChild(lessonTextArea);
        gameWorld.appendChild(videoContainer);
    }

    // --- QUIZ FUNCTIONS ---
    function startQuiz() {
        quizActive = true;
        currentQuestionIndex = 0;
        score = 0;
        // Do NOT clear gameWorld.innerHTML here
        // gameWorld.classList.remove('minigame-active'); // Keep minigame-active if it helps centering video

        quizOverlayContainer.classList.remove('hidden'); // Show quiz overlay

        setDialogue('Narator', 'Waktunya menguji pemahamanmu! Jawab pertanyaan-pertanyaan berikut.');
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const question = quizQuestions[currentQuestionIndex];
            quizQuestion.textContent = question.question;
            quizOptions.innerHTML = ''; // Clear previous options
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option'; // Use class from HTML
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
        quizActive = false;
        quizOverlayContainer.classList.add('hidden'); // Hide quiz overlay

        const percentageScore = (score / quizQuestions.length) * 100;
        let feedbackMessage = '';
        let progressIncrease = 0;

        if (percentageScore >= 80) {
            feedbackMessage = `Luar biasa! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Pemahamanmu tentang tumbuhan sangat baik!`;
            progressIncrease = 30; // Significant progress for high score
        } else if (percentageScore >= 50) {
            feedbackMessage = `Bagus! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Terus belajar untuk meningkatkan pemahamanmu.`;
            progressIncrease = 15; // Moderate progress
        } else {
            feedbackMessage = `Jangan menyerah! Kamu mendapatkan ${score} dari ${quizQuestions.length} pertanyaan (${percentageScore.toFixed(0)}%). Mari kita ulangi materinya dan coba lagi nanti.`;
            progressIncrease = 5; // Small progress
        }

        // Update Tri Hita Karana progress (e.g., Palemahan for plant knowledge)
        gameState.progress.palemahan = Math.min(100, gameState.progress.palemahan + progressIncrease);
        

        setDialogue('Narator', feedbackMessage);

        // No need to re-renderHub here, as the map was never cleared
        // The back to hub button can be handled by the existing game flow
        // For now, just let the dialogue finish and user can click map locations
    }

    

    

    

    

    

    // --- INITIALIZE GAME ---
    function startGardeningMinigame() {
        gameState.currentLocation = 'gardening_minigame';
        gameWorld.innerHTML = '';
        gameWorld.classList.add('minigame-active');

        const plantTypes = {
            sunflower: {
                name: 'Bunga Matahari',
                seed: 'minigames/palemahan/assets/img/Sunflower-Seed.png',
                stages: ['minigames/palemahan/assets/img/Stage1Plant.png', 'minigames/palemahan/assets/img/Stage2Plant.png', 'minigames/palemahan/assets/img/Stage3Plant.png', 'minigames/palemahan/assets/img/Bloom-Sunflower.png']
            },
            chili: {
                name: 'Cabai',
                seed: 'minigames/palemahan/assets/img/Chili-Seed.png',
                stages: ['minigames/palemahan/assets/img/Stage1Plant.png', 'minigame/palemahan/assets/img/Stage2Plant.png', 'minigames/palemahan/assets/img/Stage3Plant.png', 'minigames/palemahan/assets/img/Bloom-Chili.png']
            }
        };

        const needs = {
            water: { name: 'Air', path: 'minigames/palemahan/assets/img/ikon_air.png' },
            sun: { name: 'Sinar Matahari', path: 'minigames/palemahan/assets/img/ikon_matahari.png' },
            fertilizer: { name: 'Pupuk', path: 'minigames/palemahan/assets/img/ikon_pipik.png' }
        };

        // Initial dialogue is handled by the hub click now

        const board = document.createElement('div');
        board.className = 'minigame-board';
        board.id = 'gardening-board';

        const pot = document.createElement('div');
        pot.id = 'gardening-pot';

        const plantContainer = document.createElement('div');
        plantContainer.className = 'plant-container';

        if (gameState.plant) {
            const plantData = plantTypes[gameState.plant.type];
            let imagesHTML = '';
            for (let i = 0; i < plantData.stages.length; i++) {
                const isActive = i === (gameState.plant.stage - 1);
                imagesHTML += `<div class="plant ${isActive ? 'active' : ''}" style="background-image: url('${plantData.stages[i]}')"></div>`;
            }
            plantContainer.innerHTML = imagesHTML;
            pot.appendChild(plantContainer);

            if (gameState.plant.needs) {
                const thoughtBubble = document.createElement('div');
                thoughtBubble.id = 'thought-bubble';
                const needIcon = document.createElement('div');
                needIcon.id = 'need-icon';
                needIcon.style.backgroundImage = `url('${needs[gameState.plant.needs].path}')`;
                thoughtBubble.appendChild(needIcon);
                pot.appendChild(thoughtBubble);
            }

            if (gameState.plant.hasPest) {
                const pest = document.createElement('div');
                pest.id = 'pest';
                pest.addEventListener('click', () => {
                    setDialogue('Loka', 'Hore! Ulatnya sudah pergi. Sekarang tanamanmu bisa tumbuh dengan tenang.', 'Excited');
                    gameState.plant.hasPest = false;
                    const needKeys = Object.keys(needs);
                    gameState.plant.needs = needKeys[Math.floor(Math.random() * needKeys.length)];
                    startGardeningMinigame();
                });
                pot.appendChild(pest);
            }
        }

        const controls = document.createElement('div');
        controls.id = 'gardening-controls';

        if (!gameState.plant) {
            setDialogue('Loka', 'Setiap tanaman itu unik. Kamu mau menanam yang mana?', 'Explain');
            Object.keys(plantTypes).forEach(type => {
                const seedButton = document.createElement('button');
                seedButton.className = 'seed-choice';
                seedButton.style.backgroundImage = `url('${plantTypes[type].seed}')`;
                seedButton.addEventListener('click', () => {
                    gameState.plant = { type: type, stage: 1, needs: null, hasPest: false };
                    setDialogue('Loka', `Pilihan yang bagus! ${plantTypes[type].name} adalah tanaman yang hebat. Ayo kita lihat apa yang ia butuhkan pertama kali.`, 'Smile');
                    const needKeys = Object.keys(needs);
                    gameState.plant.needs = needKeys[Math.floor(Math.random() * needKeys.length)];
                    setTimeout(startGardeningMinigame, 1500);
                });
                controls.appendChild(seedButton);
            });
        } else if (gameState.plant.stage < plantTypes[gameState.plant.type].stages.length) {
            Object.keys(needs).forEach(needKey => {
                const actionButton = document.createElement('button');
                actionButton.className = 'action-button';
                actionButton.innerHTML = `<img src="${needs[needKey].path}" alt="${needs[needKey].name}"><span>${needs[needKey].name}</span>`;
                actionButton.addEventListener('click', () => {
                    if (gameState.plant.hasPest) {
                        setDialogue('Loka', 'Aduh, ada ulat! Usir dulu yuk, kasihan tanamannya.', 'Sad');
                        return;
                    }
                    if (gameState.plant.needs === needKey) {
                        gameState.plant.stage++;
                        gameState.progress.palemahan = Math.min(100, gameState.progress.palemahan + 8);
                        
                        let growthDialogue = {
                            water: 'Benar! Air membantu akar menyerap nutrisi dari tanah. Lihat, ia jadi lebih segar!',
                            sun: 'Tepat! Sinar matahari memberi energi untuk fotosintesis. Tanamanmu jadi lebih kuat!',
                            fertilizer: 'Pintar! Pupuk memberikan makanan tambahan yang penting. Batangnya jadi lebih kokoh!'
                        };
                        setDialogue('Loka', growthDialogue[needKey], 'Smile');
                        
                        if (gameState.plant.stage < plantTypes[gameState.plant.type].stages.length) {
                            if (Math.random() < 0.3) {
                                gameState.plant.hasPest = true;
                                gameState.plant.needs = null;
                                setDialogue('Loka', 'Oh tidak! Ada ulat yang datang. Cepat klik untuk mengusirnya!', 'Shock');
                            } else {
                                const needKeys = Object.keys(needs);
                                gameState.plant.needs = needKeys[Math.floor(Math.random() * needKeys.length)];
                            }
                        } else {
                            gameState.plant.needs = null;
                        }
                    } else {
                        setDialogue('Loka', `Hmm, sepertinya bukan itu yang ia butuhkan sekarang. Coba lihat lagi gelembungnya.`, 'Explain');
                    }
                    setTimeout(startGardeningMinigame, 1800);
                });
                controls.appendChild(actionButton);
            });
        } else {
            setDialogue('Loka', `Luar biasa! ${plantTypes[gameState.plant.type].name} milikmu sudah tumbuh sempurna! Waktunya memanen hasilnya.`, 'Excited');
            const harvestButton = document.createElement('button');
            harvestButton.textContent = 'Panen Hasil';
            harvestButton.className = 'action-button';
            harvestButton.addEventListener('click', () => {
                gameState.progress.palemahan = Math.min(100, gameState.progress.palemahan + 20);
                
                setDialogue('Loka', 'Panen berhasil! Merawat tanaman mengajarkan kita untuk sabar dan peduli pada alam.', 'Excited');
                gameState.plant = null;
                // Call video lesson after harvest
                startVideoLesson(
                    'minigames/palemahan/assets/video/Fotosintesis.mp4',
                    'Memahami Fotosintesis',
                    'Fotosintesis adalah proses di mana tumbuhan mengubah energi cahaya menjadi energi kimia. Ini adalah cara tumbuhan membuat makanannya sendiri menggunakan air, karbon dioksida, dan sinar matahari. Proses ini menghasilkan oksigen yang kita hirup!',
                    () => {
                        // TODO: Call startQuiz() here after video ends
                        setDialogue('Narator', 'Video selesai! Sekarang kamu siap untuk kuis.');
                        window.location.href = 'minigames/quiz/index.html';
                    }
                );
            });
            controls.appendChild(harvestButton);
        }

        if (gameState.plant) { // Only show back button if a plant has been chosen
            const backButton = document.createElement('button');
            backButton.textContent = 'Kembali ke Peta';
            backButton.addEventListener('click', () => {
                gameState.plant = null; // Reset plant when leaving
                renderHub();
            });
            controls.appendChild(backButton);
        }

        board.appendChild(pot);
        board.appendChild(controls);
        gameWorld.appendChild(board);
    }

    // --- INITIALIZE GAME ---
    function init() {
        renderHub();
        
    }

    init();
});