document.addEventListener('DOMContentLoaded', () => {
    // --- INITIALIZE GAME ---
    async function init() { // Make init an async function
        // --- Assign DOM Elements ---
        gameWorld = document.getElementById('game-world');
        characterImage = document.getElementById('character-image');
        characterName = document.getElementById('character-name');
        dialogueText = document.getElementById('dialogue-text');

        bookButton = document.getElementById('book-button');
        materialModal = document.getElementById('material-modal');
        materialCloseButton = document.getElementById('material-close-button');

        quizButton = document.getElementById('quiz-button');
        backgroundMusic = document.getElementById('background-music');

        // --- Setup Event Listeners for Buttons ---
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