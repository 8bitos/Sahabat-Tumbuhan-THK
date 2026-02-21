document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const videoModal = document.getElementById('video-modal');

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

        // Show the video modal immediately
        videoModal.classList.remove('hidden');
        explanationVideo.play(); // Attempt to autoplay the video
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
}); // Proper closing for DOMContentLoaded
