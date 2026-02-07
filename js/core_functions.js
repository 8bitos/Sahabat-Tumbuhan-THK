// js/core_functions.js

// Depends on: globals.js, audio_utils.js, tts.js (external)

function updateUI() {
    // This function is now empty after removing progress bars
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
    return localStorage.getItem('palemahanCompleted') === 'true' &&
           localStorage.getItem('pawonganCompleted') === 'true' &&
           localStorage.getItem('parahyanganCompleted') === 'true';
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

    // --- Update book button visibility FIRST ---
    updateBookButtonVisibility();

    // --- Then, display "Book Received" messages if a minigame was just completed ---
    const parahyanganCompleted = localStorage.getItem('parahyanganCompleted');
    if (parahyanganCompleted === 'true') {
        Swal.fire({
            title: 'Selamat!',
            html: `Kamu telah mendapatkan Buku Yadnya! Sekarang kamu bisa mempelajarinya lebih dalam.`,
            icon: 'success',
            confirmButtonText: 'Oke'
        });
    }

    const pawonganBookUnlocked = localStorage.getItem('pawonganBookUnlocked');
    if (pawonganBookUnlocked === 'true') {
        Swal.fire({
            title: 'Selamat!',
            html: `Kamu telah mendapatkan Buku Obat-obatan! Sekarang kamu bisa mempelajarinya lebih dalam.`,
            icon: 'success',
            confirmButtonText: 'Oke'
        });
    }

    const palemahanBookUnlocked = localStorage.getItem('palemahanBookUnlocked');
    if (palemahanBookUnlocked === 'true') {
        Swal.fire({
            title: 'Selamat!',
            html: `Kamu telah mendapatkan Buku Material Tanaman! Sekarang kamu bisa mempelajarinya lebih dalam.`,
            icon: 'success',
            confirmButtonText: 'Oke'
        });
    }


    // Check if at least one minigame is completed to show the quiz button
    const anyMinigameCompleted = localStorage.getItem('palemahanCompleted') === 'true' ||
                                 localStorage.getItem('pawonganCompleted') === 'true' ||
                                 localStorage.getItem('parahyanganCompleted') === 'true';

    if (anyMinigameCompleted) {
        quizButton.classList.remove('hidden');
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

    updateBookButtonVisibility(); // Update book visibility after rendering the hub
}
