document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    const hideLoadingOverlay = () => {
        if (!loadingOverlay || loadingOverlay.classList.contains('hidden')) return;
        loadingOverlay.classList.add('hidden');
        loadingOverlay.setAttribute('aria-busy', 'false');
    };

    window.addEventListener('load', () => {
        hideLoadingOverlay();
    });

    // Fallback: ensure overlay hides even if load event is delayed.
    setTimeout(() => {
        hideLoadingOverlay();
    }, 2500);

    // --- INITIALIZE GAME ---
    async function init() { // Make init an async function
        // --- Assign DOM Elements ---
        gameWorld = document.getElementById('game-world');
        characterImage = document.getElementById('character-image');
        characterName = document.getElementById('character-name');
        dialogueText = document.getElementById('dialogue-text');

        settingsButton = document.getElementById('settings-button');
        playerNameBadge = document.getElementById('player-name-badge');
        settingsModal = document.getElementById('settings-modal');
        settingsCloseButton = document.getElementById('settings-close-button');
        toggleMusicButton = document.getElementById('toggle-music-button');
        resetProgressButton = document.getElementById('reset-progress-button');

        bookButton = document.getElementById('book-button');
        materialModal = document.getElementById('material-modal');
        materialCloseButton = document.getElementById('material-close-button');

        quizButton = document.getElementById('quiz-button');
        backgroundMusic = document.getElementById('background-music');
        const clickSfx = document.getElementById('click-sfx');

        updatePlayerNameBadge();

        if (playerNameBadge) {
            playerNameBadge.addEventListener('click', () => {
                const palemahanCount = parseInt(localStorage.getItem('palemahanCompleteCount') || '0', 10);
                const pawonganCount = parseInt(localStorage.getItem('pawonganCompleteCount') || '0', 10);
                const parahyanganCount = parseInt(localStorage.getItem('parahyanganCompleteCount') || '0', 10);
                const palemahanDone = localStorage.getItem('palemahanCompleted') === 'true' || palemahanCount > 0;
                const pawonganDone = localStorage.getItem('pawonganCompleted') === 'true' || pawonganCount > 0;
                const parahyanganDone = localStorage.getItem('parahyanganCompleted') === 'true' || parahyanganCount > 0;
                const quizScore = localStorage.getItem('quizScore');
                const minigameRushBestScore = localStorage.getItem('minigameRushBestScore');
                const minigameRushLastScore = localStorage.getItem('minigameRushLastScore');

                const row = (label, done, count) => `
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.08);">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-weight:700; color:${done ? '#2f7d32' : '#7b2c16'};">${done ? '✓' : '○'}</span>
                            <span>${label}</span>
                        </div>
                        <span style="font-weight:700;">${count}x</span>
                    </div>
                `;

                Swal.fire({
                    title: 'Progress Pemain',
                    html: `
                        ${row('Palemahan', palemahanDone, palemahanCount)}
                        ${row('Pawongan', pawonganDone, pawonganCount)}
                        ${row('Parahyangan', parahyanganDone, parahyanganCount)}
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.08);">
                            <span style="font-weight:700;">Skor Minigame</span>
                            <span style="font-weight:700;">${minigameRushBestScore ? 'Best ' + minigameRushBestScore : '-'}</span>
                        </div>
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.08);">
                            <span>Skor Terakhir Minigame</span>
                            <span style="font-weight:700;">${minigameRushLastScore || '-'}</span>
                        </div>
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:6px 0;">
                            <span style="font-weight:700;">Skor Quiz</span>
                            <span style="font-weight:700;">${quizScore ? quizScore + ' / 100' : '-'}</span>
                        </div>
                    `,
                    icon: 'info',
                    confirmButtonText: 'Tutup'
                });
            });
        }

        // Initialize music state from localStorage
        const isMusicMuted = localStorage.getItem('isMusicMuted') === 'true';
        backgroundMusic.muted = isMusicMuted;
        if (isMusicMuted) {
            toggleMusicButton.textContent = 'Nyalakan Musik';
        } else {
            toggleMusicButton.textContent = 'Matikan Musik';
        }

        // Ensure BGM plays on first user interaction in main menu
        const tryStartBgm = () => {
            if (!backgroundMusic || backgroundMusic.muted) return;
            backgroundMusic.play().finally(() => {
                document.removeEventListener('pointerdown', tryStartBgm);
                document.removeEventListener('keydown', tryStartBgm);
            });
        };
        document.addEventListener('pointerdown', tryStartBgm, { once: true });
        document.addEventListener('keydown', tryStartBgm, { once: true });

        // Global click feedback for interactive controls
        document.addEventListener('click', (event) => {
            if (!clickSfx) return;
            const interactive = event.target.closest('button, .map-location, .dialogue-button, .nav-button, .settings-option-button, .close-button, label');
            if (!interactive) return;
            if (localStorage.getItem('isMusicMuted') === 'true') return;
            clickSfx.currentTime = 0;
            clickSfx.play().catch(() => {});
        });

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
