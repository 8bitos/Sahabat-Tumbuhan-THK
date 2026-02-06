// js/intro_sequence.js

// Depends on: globals.js, core_functions.js, audio_utils.js

// Helper to safely play background music after user interaction
function playBackgroundMusicSafely() {
    if (backgroundMusic) {
        backgroundMusic.play().then(() => {
            fadeInMusic();
        }).catch(error => {
            console.warn("Autoplay was prevented. Music will start on next interaction.", error);
            // Optionally, add a small play button for the user to click if music hasn't started
        });
    }
}

function startIntroOverlaySequence() {
    const introOverlayContainer = document.getElementById('intro-overlay-container');
    const introTitle = document.getElementById('intro-title');
    const introTextArea = document.getElementById('intro-text-area');
    const introButtons = document.getElementById('intro-buttons'); // Get the intro-buttons div
    const introNextBtn = document.getElementById('intro-next-btn');
    
    // Check for saved player name
    const savedPlayerName = localStorage.getItem('playerName');
    if (savedPlayerName) {
        introOverlayContainer.classList.add('hidden');
        renderHub();
        // Music will be handled by the first user interaction on the map (e.g. clicking a location)
        // or explicitly played on page load with muted status if that's acceptable.
        // For now, it will start on the first click in the main game.
        return; // Skip intro if name exists
    }
    
    function showIntroStep(stepIndex) {
        currentIntroStep = stepIndex;
        introButtons.innerHTML = ''; // Clear existing buttons
        introTextArea.innerHTML = ''; // Clear existing text area content
    
        if (currentIntroStep < introSteps.length) {
            const step = introSteps[currentIntroStep];
            introTitle.textContent = step.title;
    
            if (step.type === 'name-input') {
                introTextArea.innerHTML = `<p>${step.text}</p><input type="text" id="player-name-input" placeholder="Nama Kamu" required style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: 80%; max-width: 300px; margin-top: 10px;">`;
                const startButton = document.createElement('button');
                startButton.id = 'intro-start-game-btn';
                startButton.textContent = 'Mulai Petualangan';
                startButton.className = 'intro-next-btn'; // Use same styling as next button
                introButtons.appendChild(startButton);
    
                startButton.addEventListener('click', () => {
                    const playerNameInput = document.getElementById('player-name-input');
                    const playerName = playerNameInput.value.trim();
                    if (playerName) {
                        localStorage.setItem('playerName', playerName);
                        // Play music on this interaction
                        playBackgroundMusicSafely();
                        // Proceed to next step or directly to game if this is the last "intro" step
                        showIntroStep(currentIntroStep + 1);
                    } else {
                        Swal.fire('Oopps!', 'Nama tidak boleh kosong.', 'warning');
                    }
                });
                introNextBtn.style.display = 'none'; // Hide default next button
            } else {
                introTextArea.textContent = step.text;
                introNextBtn.style.display = 'block'; // Show default next button
    
                if (step.type === 'splash') {
                    introNextBtn.textContent = 'Mulai';
                } else if (currentIntroStep === introSteps.length - 1) {
                    introNextBtn.textContent = 'Masuk ke menu map';
                } else {
                    introNextBtn.textContent = 'Lanjut';
                }
                introButtons.appendChild(introNextBtn); // Append default next button
            }
        }
    }
    
    // Event listener for the default introNextBtn
    introNextBtn.addEventListener('click', () => {
        if (introSteps[currentIntroStep].type !== 'name-input') { // Only proceed if not name input step
            if (currentIntroStep < introSteps.length - 1) {
                showIntroStep(currentIntroStep + 1);
            } else {
                introOverlayContainer.classList.add('hidden'); // Hide the intro
                renderHub(); // Start the main game
                // Play music on this interaction
                playBackgroundMusicSafely();
            }
        }
    });       
    introOverlayContainer.classList.remove('hidden'); // Ensure it's visible
    showIntroStep(0); // Start with the first step
}
