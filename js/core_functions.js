// js/core_functions.js

// Depends on: globals.js, audio_utils.js, tts.js (external)

function updateUI() {
    // This function is now empty after removing progress bars
}

function updatePlayerNameBadge() {
    if (!playerNameBadge) return;
    const name = localStorage.getItem('playerName');
    if (name) {
        playerNameBadge.textContent = `Pemain: ${name}`;
        playerNameBadge.classList.remove('hidden');
    } else {
        playerNameBadge.classList.add('hidden');
    }
}

function setDialogue(char, text, expression = '', buttons = []) {
    characterName.textContent = char;
    dialogueText.textContent = text;
    // TTS.speak(text, char); // Add TTS call - this is called directly now if TTS is enabled

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

    if (typeof TTS !== 'undefined' && typeof TTS.speak === 'function') {
        TTS.speak(text, char);
    }
}

function checkAllMinigamesCompleted() {
    // For testing, we can manually set these in the console:
    // localStorage.setItem('palemahanCompleted', 'true');
    // localStorage.setItem('pawonganCompleted', 'true');
    // localStorage.setItem('parahyanganCompleted', 'true');
    const palemahanCount = parseInt(localStorage.getItem('palemahanCompleteCount') || '0', 10);
    const pawonganCount = parseInt(localStorage.getItem('pawonganCompleteCount') || '0', 10);
    const parahyanganCount = parseInt(localStorage.getItem('parahyanganCompleteCount') || '0', 10);
    const palemahanDone = localStorage.getItem('palemahanCompleted') === 'true' || palemahanCount > 0;
    const pawonganDone = localStorage.getItem('pawonganCompleted') === 'true' || pawonganCount > 0;
    const parahyanganDone = localStorage.getItem('parahyanganCompleted') === 'true' || parahyanganCount > 0;
    return palemahanDone && pawonganDone && parahyanganDone;
}

function renderHub() {
    // --- Check if we need to launch a minigame directly ---
    const minigameToStart = localStorage.getItem('startMinigame');
    if (minigameToStart) {
        localStorage.removeItem('startMinigame'); // Clear the flag
        switch (minigameToStart) {
            case 'pawongan':
                startJamuMinigame();
                return; // Stop further rendering of the hub
            case 'palemahan':
                startGardeningMinigame();
                return; // Stop further rendering of the hub
            case 'parahyangan':
                startCanangSariMinigame();
                return; // Stop further rendering of the hub
        }
    }

    gameState.currentLocation = 'hub';
    gameWorld.innerHTML = '';
    gameWorld.classList.remove('minigame-active');
    setDialogue('Narator', 'Kamu berada di halaman sekolah. Ke mana kamu akan pergi selanjutnya? Klik salah satu lokasi.');
    updatePlayerNameBadge();

    // --- Update book button visibility FIRST ---
    updateBookButtonVisibility();

    // --- Then, display "Book Received" messages if a minigame was just completed ---
    const lokaBookUnlocked = localStorage.getItem('lokaBookUnlocked');
    if (lokaBookUnlocked === 'true') {
        Swal.fire({
            title: 'Selamat!',
            html: `Kamu telah mendapatkan Buku Tumbuhan! Sekarang kamu bisa mempelajarinya lebih dalam.`,
            icon: 'success',
            confirmButtonText: 'Oke'
        });
        localStorage.removeItem('lokaBookUnlocked'); // Remove after displaying
    }

    // Show quiz button only when all minigames are completed
    if (checkAllMinigamesCompleted()) {
        quizButton.classList.remove('hidden');
        const popupShown = localStorage.getItem('allMinigamesCompletedPopupShown') === 'true';
        if (!popupShown) {
            Swal.fire({
                title: 'Hebat!',
                text: 'Semua minigame sudah selesai. Saatnya mengerjakan quiz.',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Mulai Quiz',
                cancelButtonText: 'Nanti'
            }).then((result) => {
                localStorage.setItem('allMinigamesCompletedPopupShown', 'true');
                if (result.isConfirmed) startQuiz();
            });
        }
    } else {
        quizButton.classList.add('hidden');
    }

    const locations = [
        { id: 'yana', name: 'Parahyangan', top: '75%', left: '25%', mission: 'parahyangan' }, // Bottom: Parahyangan
        { id: 'sari', name: 'Pawongan', top: '50%', left: '50%', mission: 'pawongan' }, // Middle: Pawongan
        { id: 'loka', name: 'Palemahan', top: '25%', left: '15%', mission: 'palemahan' }  // Top: Palemahan
    ];

    locations.forEach(loc => {
        const locElement = document.createElement('div');
        locElement.id = `location-${loc.id}`;
        locElement.className = 'map-location';
        
        const avatarPath = `assets/img/${loc.id.charAt(0).toUpperCase() + loc.id.slice(1)}/${loc.id}.png`;
        locElement.style.backgroundImage = `url('${avatarPath}')`;

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

    updateBookButtonVisibility(); // Update book visibility after rendering the hub
}
