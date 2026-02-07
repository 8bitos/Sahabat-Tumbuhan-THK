document.addEventListener('DOMContentLoaded', () => {
    // --- INITIALIZE GAME ---
    async function init() { // Make init an async function
        // --- Assign DOM Elements ---
        gameWorld = document.getElementById('game-world');
        characterImage = document.getElementById('character-image');
        characterName = document.getElementById('character-name');
        dialogueText = document.getElementById('dialogue-text');

        settingsButton = document.getElementById('settings-button');
        settingsModal = document.getElementById('settings-modal');
        settingsCloseButton = document.getElementById('settings-close-button');
        toggleMusicButton = document.getElementById('toggle-music-button');
        resetProgressButton = document.getElementById('reset-progress-button');

        bookButton = document.getElementById('book-button');
        materialModal = document.getElementById('material-modal');
        materialCloseButton = document.getElementById('material-close-button');

        quizButton = document.getElementById('quiz-button');
        backgroundMusic = document.getElementById('background-music');

        // Initialize music state from localStorage
        const isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';
        backgroundMusic.muted = isMusicMuted;
        if (isMusicMuted) {
            toggleMusicButton.textContent = 'Nyalakan Musik';
        } else {
            toggleMusicButton.textContent = 'Matikan Musik';
        }

        // --- Setup Event Listeners for Buttons ---
        settingsButton.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            settingsModal.style.display = 'flex';
        });

        settingsCloseButton.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            settingsModal.style.display = 'none';
        });

        toggleMusicButton.addEventListener('click', () => {
            backgroundMusic.muted = !backgroundMusic.muted;
            localStorage.setItem('isMusicMuted', backgroundMusic.muted);
            if (backgroundMusic.muted) {
                toggleMusicButton.textContent = 'Nyalakan Musik';
            } else {
                toggleMusicButton.textContent = 'Matikan Musik';
            }
        });

        resetProgressButton.addEventListener('click', () => {
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Semua progress Anda akan dihapus permanen!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, reset sekarang!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear();
                    Swal.fire(
                        'Dihapus!',
                        'Progress Anda telah direset.',
                        'success'
                    ).then(() => {
                        window.location.reload(); // Reload the page to restart the game
                    });
                }
            });
        });

        bookButton.addEventListener('click', () => {
            const materialTextArea = materialModal.querySelector('.material-text-area');
            if (materialTextArea) {
                materialTextArea.innerHTML = formatPlantMaterialContent(plantMaterialContent); // Use the formatter
            }
            materialModal.classList.remove('hidden');
            materialModal.style.display = 'flex';
        });

        materialCloseButton.addEventListener('click', () => {
            materialModal.classList.add('hidden');
            materialModal.style.display = 'none';
        });

        quizButton.addEventListener('click', () => {
            startQuiz();
        });

        startIntroOverlaySequence();
    }

    init();
});