document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const videoModal = document.getElementById('video-modal');
    const tomatoGame = document.getElementById('tomato-game');
    const tomatoImage = document.getElementById('tomato-image');
    const tomatoDropLayer = document.getElementById('tomato-drop-layer');
    const tomatoWordsContainer = document.getElementById('tomato-words');
    const tomatoMessage = document.getElementById('tomato-message');
    const tomatoResetButton = document.getElementById('tomato-reset');
    const tomatoDebugPanel = document.getElementById('tomato-debug-panel');
    const tomatoDebugCoords = document.getElementById('tomato-debug-coords');
    const tomatoDebugRect = document.getElementById('tomato-debug-rect');
    const tomatoTransition = document.getElementById('tomato-transition');
    const tomatoTransitionButton = document.getElementById('tomato-transition-button');

    const seedChoices = document.querySelectorAll('.seed-choice');
    const dialogueText = document.getElementById('dialogue-text');
    const lokaAvatar = document.getElementById('loka-avatar');

    const growthStageText = document.getElementById('growth-stage-text');
    const growthProgressBar = document.getElementById('growth-progress');
    const plantImage = document.getElementById('plant-image');
    
    const needBubble = document.getElementById('need-bubble');
    const needIcon = document.getElementById('need-icon');
    const pestElement = document.getElementById('pest');

    const tools = document.querySelectorAll('.tool');
    const videoCloseButton = videoModal.querySelector('.close-button');
    const explanationVideo = document.getElementById('explanation-video');
    const tutorialModal = document.getElementById('tutorial-modal');
    const tutorialStartButton = document.getElementById('tutorial-start-button');
    const speedButton = document.getElementById('speed-button');
    const speedModal = document.getElementById('speed-modal');
    const speedCloseButton = document.getElementById('speed-close-button');
    const speedOptions = document.querySelectorAll('.speed-option');
    const bgAudio = document.getElementById('bg-audio');
    const bubbleSfx = document.getElementById('bubble-sfx');
    const clickSfx = document.getElementById('click-sfx');

    // --- Game Data & State ---
    const plantData = {
        sunflower: {
            stages: ['assets/img/Stage1Plant.png', 'assets/img/Stage2Plant.png', 'assets/img/Stage3Plant.png', 'assets/img/Bloom-Sunflower.png'],
            seed: 'assets/img/Sunflower-Seed.png'
        },
        chili: {
            stages: ['assets/img/Stage1Plant.png', 'assets/img/Stage2Plant.png', 'assets/img/Stage3Plant.png', 'assets/img/Bloom-Chili.png'],
            seed: 'assets/img/Chili-Seed.png'
        }
    };

    const plantFunFacts = {
        sunflower: [
            "Lihat, tunasnya sudah muncul! Merawat kehidupan kecil ini adalah wujud cinta kita pada alam, atau Palemahan.",
            "Batangnya makin kuat! Bunga matahari selalu menghadap ke arah matahari, seolah berterima kasih atas energinya. Itu pelajaran tentang rasa syukur.",
            "Kuncupnya mulai terlihat! Sebentar lagi ia akan mekar dan jadi rumah bagi lebah. Kita membantu ekosistem!"
        ],
        chili: [
            "Tunas cabai pertama! Dalam Tri Hita Karana, merawatnya dari kecil mengajarkan kita tentang proses dan kesabaran.",
            "Daunnya makin lebat! Tanaman ini butuh perhatian kita agar kelak buahnya bisa bermanfaat untuk sesama (Pawongan).",
            "Bakal buahnya muncul! Dari bibit kecil, kini ia siap memberi manfaat. Inilah bukti keharmonisan hubungan kita dengan alam."
        ]
    };

    const needs = ['water', 'sun', 'fertilizer'];
    const needIcons = {
        water: 'assets/img/ikon_air.png',
        sun: 'assets/img/ikon_matahari.png',
        fertilizer: 'assets/img/ikon_pipik.png'
    };

    const tomatoWords = ['daun', 'bunga', 'batang', 'akar', 'buah', 'biji'];
    const tomatoDropZones = [
        { id: 'daun', word: 'daun', x: 74.83, y: 6.00, w: 17.79, h: 8.40 },
        { id: 'bunga', word: 'bunga', x: 2.35, y: 3.39, w: 18.46, h: 9.85 },
        { id: 'buah', word: 'buah', x: 81.21, y: 35.55, w: 18.79, h: 9.85 },
        { id: 'biji', word: 'biji', x: 3.36, y: 60.75, w: 18.79, h: 9.85 },
        { id: 'akar', word: 'akar', x: 74.16, y: 72.63, w: 18.46, h: 9.56 },
        { id: 'batang', word: 'batang', x: 71.14, y: 52.93, w: 21.81, h: 9.85 }
    ];

    let gameState = {
        plantType: null,
        growthPoints: 0,
        currentStage: 0,
        currentNeed: null,
        pestActive: false,
        gameInterval: null,
        interactionTimer: null,
        tutorialDismissed: false,
        isGameActive: false,
        speedMultiplier: 1,
        instantMode: false
    };

    let tomatoState = {
        selectedWord: null,
        placed: new Set(),
        correctCount: 0,
        debug: false,
        dragStart: null,
        isDragging: false
    };

    // --- Functions ---

    function setDialogue(text, character = 'Loka-Smile') {
        dialogueText.textContent = text;
        lokaAvatar.src = `../../assets/img/Loka/${character}.png`;
    }

    function startGame(plantType) {
        if (!gameState.tutorialDismissed) {
            if (tutorialModal) {
                tutorialModal.classList.remove('hidden');
                tutorialModal.style.display = 'flex';
            }
            return;
        }
        gameState.plantType = plantType;
        gameState.growthPoints = 0;
        gameState.currentStage = 0;
        gameState.currentNeed = null;
        gameState.pestActive = false;
        gameState.isGameActive = true;

        plantImage.src = plantData[plantType].seed;
        updateGrowthUI();

        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        setDialogue(`Kamu memilih menanam ${plantType === 'sunflower' ? 'Bunga Matahari' : 'Cabai'}. Ayo kita rawat baik-baik!`);
        attemptNewInteraction(); // Generate first need/pest immediately
        scheduleNextInteraction();
    }

    function scheduleNextInteraction() {
        if (!gameState.isGameActive) return;
        const stages = plantData[gameState.plantType]?.stages || [];
        if (gameState.currentStage >= stages.length - 1) return;
        clearTimeout(gameState.interactionTimer);
        let baseDelay = 1400 + Math.random() * 1600; // 1.4s - 3.0s
        if (gameState.instantMode) baseDelay = 200; // near-instant
        const delay = baseDelay / gameState.speedMultiplier;
        gameState.interactionTimer = setTimeout(() => {
            if (!gameState.isGameActive) return;
            if (!gameState.pestActive && !gameState.currentNeed) {
                attemptNewInteraction();
            }
            scheduleNextInteraction();
        }, delay);
    }

    function generateNeed() {
        const randomNeed = needs[Math.floor(Math.random() * needs.length)];
        gameState.currentNeed = randomNeed;
        needIcon.src = needIcons[randomNeed];
        needBubble.classList.remove('hidden');
        if (bubbleSfx) {
            bubbleSfx.currentTime = 0;
            bubbleSfx.play().catch(() => {});
        }
        setDialogue(`Tanaman kita butuh ${randomNeed === 'water' ? 'air' : (randomNeed === 'sun' ? 'sinar matahari' : 'pupuk')}!`, 'Loka-Explain');
    }

    function satisfyNeed(tool) {
        if (tool === gameState.currentNeed) {
            addGrowthPoints(25);
            setDialogue('Terima kasih! Tanaman ini terlihat lebih sehat.', 'Loka-Excited');
            gameState.currentNeed = null;
            needBubble.classList.add('hidden');
            // Let the next interaction be scheduled naturally
            scheduleNextInteraction();
        } else {
            setDialogue('Oh, bukan itu yang dibutuhkan sekarang.', 'Loka-Sad');
        }
    }

    function attemptNewInteraction() {
        // First, check for pest, as it's more urgent
        if (!gameState.pestActive && Math.random() < 0.15) { // 15% chance
            spawnPest();
        } else if (!gameState.currentNeed && Math.random() < 0.4) { // 40% chance for need
            generateNeed();
        }
    }

    function spawnPest() {
        gameState.pestActive = true;
        pestElement.classList.remove('hidden');
        setDialogue('Aduh, ada hama! Cepat kita basmi!', 'Loka-Shock');
    }

    function removePest() {
        if (!gameState.pestActive) return;
        addGrowthPoints(10); // Bonus points for removing pest
        gameState.pestActive = false;
        pestElement.classList.add('hidden');
        setDialogue('Hama sudah hilang! Kerja bagus!', 'Loka-Smile');
        // Let the next interaction be scheduled naturally
        scheduleNextInteraction();
    }

    function addGrowthPoints(points) {
        gameState.growthPoints += points;
        if (gameState.growthPoints >= 100) {
            const excessPoints = gameState.growthPoints - 100;
            gameState.growthPoints = excessPoints;
            advanceStage();
        } else {
            updateGrowthUI();
        }
    }

    function advanceStage() {
        gameState.currentStage++;
        updateGrowthUI();

        const plantType = gameState.plantType;
        const stageIndex = gameState.currentStage - 1;
        const isFinalStage = gameState.currentStage >= plantData[plantType].stages.length - 1;

        // Check if it's the final, blooming stage
        if (isFinalStage) {
            gameState.isGameActive = false;
            clearTimeout(gameState.interactionTimer);
            gameState.currentNeed = null;
            gameState.pestActive = false;
            needBubble.classList.add('hidden');
            pestElement.classList.add('hidden');
            const funFact = plantFunFacts[plantType][stageIndex];
            setDialogue(funFact, 'Loka-Explain');
            // Wait a few seconds for user to read, then start harvest sequence
            setTimeout(harvest, 4000); 
        } else {
            // It's a mid-growth stage, show the fun fact.
            const funFact = plantFunFacts[plantType][stageIndex];
            setDialogue(funFact, 'Loka-Explain');
        }
    }

    function updateGrowthUI() {
        // Update progress bar
        growthProgressBar.style.width = `${gameState.growthPoints}%`;

        // Update plant image and stage text
        const stages = plantData[gameState.plantType].stages;
        if (gameState.currentStage < stages.length) {
            plantImage.src = stages[gameState.currentStage];
            growthStageText.textContent = `Tahap ${gameState.currentStage + 1}`;
        } 
        if (gameState.currentStage === 0) growthStageText.textContent = 'Bibit';
        if (gameState.currentStage === stages.length -1) growthStageText.textContent = 'Berbunga';

    }

    function harvest() {
        gameState.isGameActive = false;
        clearTimeout(gameState.interactionTimer);
        setDialogue('Hore! Kita berhasil panen!', 'Loka-Excited');
        growthStageText.textContent = 'Panen!';
        growthProgressBar.style.width = `100%`;
        needBubble.classList.add('hidden');
        pestElement.classList.add('hidden');

        // Show transition dialog before tomato minigame
        showTomatoTransition();
    }

    function showTomatoTransition() {
        startScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        videoModal.classList.add('hidden');
        tomatoGame.classList.add('hidden');
        if (tomatoTransition) {
            tomatoTransition.classList.remove('hidden');
        } else {
            showTomatoMinigame();
        }
        if (bgAudio) bgAudio.pause();
    }

    function showVideoModal() {
        videoModal.classList.remove('hidden');
        if (bgAudio) bgAudio.pause();
        explanationVideo.play().catch(() => {}); // Attempt to autoplay the video
    }

    function resetTomatoState() {
        tomatoState.selectedWord = null;
        tomatoState.placed = new Set();
        tomatoState.correctCount = 0;
    }

    function playTomatoSfx(type) {
        if (type === 'correct') {
            if (bubbleSfx) {
                bubbleSfx.currentTime = 0;
                bubbleSfx.play().catch(() => {});
            }
            return;
        }
        if (type === 'wrong') {
            if (clickSfx) {
                clickSfx.currentTime = 0;
                clickSfx.play().catch(() => {});
            }
            return;
        }
        if (type === 'drag') {
            if (clickSfx) {
                clickSfx.currentTime = 0;
                clickSfx.play().catch(() => {});
            }
        }
    }

    function triggerShake(element) {
        if (!element) return;
        element.classList.remove('shake');
        // Force reflow to restart animation
        void element.offsetWidth;
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 450);
    }

    function initTomatoMinigame() {
        if (!tomatoGame || !tomatoImage || !tomatoDropLayer || !tomatoWordsContainer) return;

        resetTomatoState();
        if (tomatoMessage) {
            tomatoMessage.textContent = 'Lengkapi semua kotak dengan benar.';
        }
        tomatoWordsContainer.innerHTML = '';
        tomatoDropLayer.innerHTML = '';

        tomatoWords.forEach(word => {
            const wordBtn = document.createElement('button');
            wordBtn.type = 'button';
            wordBtn.className = 'tomato-word';
            wordBtn.textContent = word;
            wordBtn.setAttribute('draggable', 'true');
            wordBtn.dataset.word = word;

            wordBtn.addEventListener('click', () => {
                if (wordBtn.classList.contains('used')) return;
                tomatoState.selectedWord = word;
                document.querySelectorAll('.tomato-word').forEach(btn => btn.classList.remove('selected'));
                wordBtn.classList.add('selected');
            });

            wordBtn.addEventListener('dragstart', (event) => {
                if (wordBtn.classList.contains('used')) return;
                wordBtn.classList.add('dragging');
                wordBtn.classList.add('shake');
                playTomatoSfx('drag');
                event.dataTransfer.setData('text/plain', word);
            });

            wordBtn.addEventListener('dragend', () => {
                wordBtn.classList.remove('dragging');
                wordBtn.classList.remove('shake');
            });

            tomatoWordsContainer.appendChild(wordBtn);
        });

        const buildTomatoZones = () => {
            const naturalWidth = tomatoImage.naturalWidth || 1;
            const naturalHeight = tomatoImage.naturalHeight || 1;

            const toPercent = (value, axis) => {
                if (typeof value === 'string') {
                    const trimmed = value.trim();
                    if (trimmed.endsWith('%')) return parseFloat(trimmed);
                    if (trimmed.endsWith('px')) {
                        const px = parseFloat(trimmed);
                        return axis === 'x' ? (px / naturalWidth) * 100 : (px / naturalHeight) * 100;
                    }
                    const asNum = parseFloat(trimmed);
                    if (!Number.isNaN(asNum)) return asNum > 100 ? (axis === 'x' ? (asNum / naturalWidth) * 100 : (asNum / naturalHeight) * 100) : asNum;
                }
                if (typeof value === 'number') {
                    if (value > 100) {
                        return axis === 'x' ? (value / naturalWidth) * 100 : (value / naturalHeight) * 100;
                    }
                    return value;
                }
                return 0;
            };

            tomatoDropZones.forEach(zone => {
                const dropEl = document.createElement('div');
                dropEl.className = 'tomato-drop';
                dropEl.dataset.word = zone.word;
                const leftPct = toPercent(zone.x, 'x');
                const topPct = toPercent(zone.y, 'y');
                const widthPct = toPercent(zone.w, 'x');
                const heightPct = toPercent(zone.h, 'y');
                dropEl.style.left = `${leftPct}%`;
                dropEl.style.top = `${topPct}%`;
                dropEl.style.width = `${widthPct}%`;
                dropEl.style.height = `${heightPct}%`;

                dropEl.addEventListener('dragover', (event) => {
                    event.preventDefault();
                    dropEl.classList.add('hover');
                });

                dropEl.addEventListener('dragleave', () => {
                    dropEl.classList.remove('hover');
                });

                dropEl.addEventListener('drop', (event) => {
                    event.preventDefault();
                    dropEl.classList.remove('hover');
                    const droppedWord = event.dataTransfer.getData('text/plain');
                    placeTomatoWord(droppedWord, dropEl);
                });

                dropEl.addEventListener('click', () => {
                    if (!tomatoState.selectedWord) return;
                    placeTomatoWord(tomatoState.selectedWord, dropEl);
                });

                tomatoDropLayer.appendChild(dropEl);
            });
        };

        if (tomatoImage.complete) {
            buildTomatoZones();
        } else {
            tomatoImage.addEventListener('load', buildTomatoZones, { once: true });
        }

    }

    function placeTomatoWord(word, dropEl) {
        if (!word || dropEl.classList.contains('filled')) return;
        const expected = dropEl.dataset.word;
        if (word !== expected) {
            if (tomatoMessage) {
                tomatoMessage.textContent = 'Belum tepat, coba lagi ya.';
            }
            playTomatoSfx('wrong');
            triggerShake(dropEl);
            const wordBtn = tomatoWordsContainer.querySelector(`[data-word="${word}"]`);
            triggerShake(wordBtn);
            return;
        }

        dropEl.textContent = word;
        dropEl.classList.add('filled');
        tomatoState.correctCount += 1;
        tomatoState.placed.add(word);
        if (tomatoMessage) {
            tomatoMessage.textContent = 'Bagus! Lanjutkan.';
        }
        playTomatoSfx('correct');

        const wordBtn = tomatoWordsContainer.querySelector(`[data-word="${word}"]`);
        if (wordBtn) {
            wordBtn.classList.add('used');
            wordBtn.classList.remove('selected');
            wordBtn.setAttribute('draggable', 'false');
        }

        if (tomatoState.correctCount >= tomatoDropZones.length) {
            if (tomatoMessage) {
                tomatoMessage.textContent = 'Semua benar! Lanjut ke video.';
            }
            setTimeout(() => {
                tomatoGame.classList.add('hidden');
                showVideoModal();
            }, 600);
        }
    }

    function showTomatoMinigame() {
        if (!tomatoGame) {
            showVideoModal();
            return;
        }
        startScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        videoModal.classList.add('hidden');
        if (tomatoTransition) {
            tomatoTransition.classList.add('hidden');
        }
        tomatoGame.classList.remove('hidden');
        if (bgAudio) bgAudio.pause();
        initTomatoMinigame();
        updateTomatoDebugState();
    }

    function updateTomatoDebugState() {
        if (!tomatoDebugPanel || !tomatoImage) return;
        const urlParams = new URLSearchParams(window.location.search);
        const debugFromUrl = urlParams.get('tomatoDebug') === '1';
        const debugFromStorage = localStorage.getItem('palemahanTomatoDebug') === 'true';
        tomatoState.debug = debugFromUrl || debugFromStorage;
        tomatoDebugPanel.classList.toggle('hidden', !tomatoState.debug);
        if (tomatoDropLayer) {
            tomatoDropLayer.classList.toggle('hidden', tomatoState.debug);
        }
    }

    function handleTomatoDebugClick(event) {
        if (!tomatoState.debug || !tomatoImage || !tomatoDebugCoords) return;
        const rect = tomatoImage.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;
        tomatoDebugCoords.textContent = `x=${x.toFixed(0)} y=${y.toFixed(0)} | x%=${xPct.toFixed(2)} y%=${yPct.toFixed(2)}`;
    }

    function showLokaBookDialogue() {
        // Hide the video modal first
        videoModal.classList.add('hidden');
        explanationVideo.pause();
        explanationVideo.currentTime = 0;

        const currentCount = parseInt(localStorage.getItem('palemahanCompleteCount') || '0', 10);
        localStorage.setItem('palemahanCompleteCount', String(currentCount + 1));
        localStorage.setItem('palemahanCompleted', 'true'); // Set the flag for minigame completion
        localStorage.setItem('skipIntroOnce', 'true');

        // Redirect to main map immediately
        window.location.href = '../../index.html';
    }

    // --- Event Listeners ---
    seedChoices.forEach(button => {
        button.addEventListener('click', () => {
            startGame(button.dataset.plant);
        });
    });

    tools.forEach(tool => {
        tool.addEventListener('click', () => {
            if (gameState.currentNeed) {
                satisfyNeed(tool.dataset.tool);
            }
        });
    });

    pestElement.addEventListener('click', removePest);

    if (tomatoResetButton) {
        tomatoResetButton.addEventListener('click', () => {
            initTomatoMinigame();
        });
    }

    if (tomatoTransitionButton) {
        tomatoTransitionButton.addEventListener('click', () => {
            showTomatoMinigame();
        });
    }

    function updateTomatoDebugRect(start, current) {
        if (!tomatoDebugRect || !tomatoImage) return;
        const rect = tomatoImage.getBoundingClientRect();
        const x1 = Math.max(0, Math.min(rect.width, start.x));
        const y1 = Math.max(0, Math.min(rect.height, start.y));
        const x2 = Math.max(0, Math.min(rect.width, current.x));
        const y2 = Math.max(0, Math.min(rect.height, current.y));
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        tomatoDebugRect.classList.remove('hidden');
        tomatoDebugRect.style.left = `${left}px`;
        tomatoDebugRect.style.top = `${top}px`;
        tomatoDebugRect.style.width = `${width}px`;
        tomatoDebugRect.style.height = `${height}px`;
    }

    function finalizeTomatoDebugRect(start, end) {
        if (!tomatoDebugCoords || !tomatoImage) return;
        const rect = tomatoImage.getBoundingClientRect();
        const x1 = Math.max(0, Math.min(rect.width, start.x));
        const y1 = Math.max(0, Math.min(rect.height, start.y));
        const x2 = Math.max(0, Math.min(rect.width, end.x));
        const y2 = Math.max(0, Math.min(rect.height, end.y));
        const left = Math.min(x1, x2);
        const top = Math.min(y1, y2);
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const leftPct = (left / rect.width) * 100;
        const topPct = (top / rect.height) * 100;
        const widthPct = (width / rect.width) * 100;
        const heightPct = (height / rect.height) * 100;
        tomatoDebugCoords.textContent = `x1=${left.toFixed(0)} y1=${top.toFixed(0)} x2=${(left + width).toFixed(0)} y2=${(top + height).toFixed(0)} | x=${leftPct.toFixed(2)} y=${topPct.toFixed(2)} w=${widthPct.toFixed(2)} h=${heightPct.toFixed(2)}`;
    }

    if (tomatoImage) {
        tomatoImage.addEventListener('dragstart', (event) => {
            event.preventDefault();
        });

        tomatoImage.addEventListener('pointerdown', (event) => {
            if (!tomatoState.debug) return;
            event.preventDefault();
            const rect = tomatoImage.getBoundingClientRect();
            tomatoState.isDragging = true;
            tomatoState.dragStart = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            updateTomatoDebugRect(tomatoState.dragStart, tomatoState.dragStart);
        });

        tomatoImage.addEventListener('pointermove', (event) => {
            if (!tomatoState.debug || !tomatoState.isDragging || !tomatoState.dragStart) return;
            const rect = tomatoImage.getBoundingClientRect();
            const current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            updateTomatoDebugRect(tomatoState.dragStart, current);
        });

        const endDrag = (event) => {
            if (!tomatoState.debug || !tomatoState.isDragging || !tomatoState.dragStart) return;
            const rect = tomatoImage.getBoundingClientRect();
            const end = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            tomatoState.isDragging = false;
            finalizeTomatoDebugRect(tomatoState.dragStart, end);
        };

        tomatoImage.addEventListener('pointerup', endDrag);
        tomatoImage.addEventListener('pointerleave', endDrag);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() !== 'd') return;
        const next = !(localStorage.getItem('palemahanTomatoDebug') === 'true');
        localStorage.setItem('palemahanTomatoDebug', String(next));
        updateTomatoDebugState();
    });

    videoCloseButton.addEventListener('click', () => {
        showLokaBookDialogue(); // Call the new function to show Loka's book dialogue
    });

    explanationVideo.addEventListener('ended', () => {
        showLokaBookDialogue(); // Call the new function to show Loka's book dialogue
    });

    // --- Tutorial Modal ---
    if (tutorialModal && tutorialStartButton) {
        tutorialModal.classList.remove('hidden');
        tutorialModal.style.display = 'flex';
        tutorialStartButton.addEventListener('click', () => {
            tutorialModal.classList.add('hidden');
            tutorialModal.style.display = 'none';
            gameState.tutorialDismissed = true;
        });
    }

    // --- Background Audio ---
    function tryPlayAudio() {
        if (!bgAudio) return;
        bgAudio.volume = 0.6;
        bgAudio.play().catch(() => {
            const resume = () => {
                bgAudio.play().finally(() => {
                    document.removeEventListener('click', resume);
                });
            };
            document.addEventListener('click', resume);
        });
    }
    tryPlayAudio();

    // --- Speed Controls ---
    function setSpeed(mode) {
        gameState.instantMode = mode === 'instant';
        gameState.speedMultiplier = mode === 'instant' ? 3 : parseInt(mode, 10);
        speedOptions.forEach(btn => btn.classList.remove('active'));
        const activeBtn = Array.from(speedOptions).find(btn => btn.dataset.speed === mode);
        if (activeBtn) activeBtn.classList.add('active');
        scheduleNextInteraction();
        if (gameState.instantMode && !gameState.currentNeed && !gameState.pestActive) {
            attemptNewInteraction();
        }
    }

    if (speedButton && speedModal) {
        speedButton.addEventListener('click', () => {
            speedModal.classList.remove('hidden');
        });
    }

    if (speedCloseButton && speedModal) {
        speedCloseButton.addEventListener('click', () => {
            speedModal.classList.add('hidden');
        });
    }

    speedOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            setSpeed(btn.dataset.speed);
        });
    });

    // Default active speed
    setSpeed('1');

    // Click feedback for interactive controls
    document.addEventListener('click', (event) => {
        if (!clickSfx) return;
        const interactive = event.target.closest('button, .tool, .seed-choice, #pest, .close-button');
        if (!interactive) return;
        clickSfx.currentTime = 0;
        clickSfx.play().catch(() => {});
    });
}); // Proper closing for DOMContentLoaded
