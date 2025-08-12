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

    // --- Functions ---
    function setDialogue(expression, text) {
        yanaCharacter.src = `../../assets/img/Yana/${expression}`;
        dialogueText.textContent = text;
    }

    function initializeItems() {
        itemsContainer.innerHTML = '';
        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.id = item.id;
            itemEl.className = `item ${item.className}`;
            itemEl.draggable = false; // Initially not draggable
            itemEl.addEventListener('dragstart', dragStart);
            itemsContainer.appendChild(itemEl);
        });
        updateDraggableItems();
    }

    function updateDraggableItems() {
        const requiredItem = gameSteps[currentStepIndex]?.requiredItem;
        if (!requiredItem) return;

        items.forEach(item => {
            const itemEl = document.getElementById(item.id);
            if (itemEl) {
                const isDraggable = item.id === requiredItem;
                itemEl.draggable = isDraggable;
                itemEl.style.cursor = isDraggable ? 'grab' : 'not-allowed';
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
    }

    // --- Event Listener for Video Close Button ---
    videoCloseButton.addEventListener('click', hideVideoModal);

    // --- Event Listener for Video Ended ---
    explanationVideo.addEventListener('ended', () => {
        hideVideoModal();
        // Redirect to quiz after video ends
        window.location.href = '../quiz_parahyangan/index.html';
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
        const draggedElement = document.getElementById(id);
        const currentStep = gameSteps[currentStepIndex];

        if (id !== currentStep.requiredItem) {
            setDialogue('Yana-Sad.png', "Oops, sepertinya itu bukan bahan yang tepat. Coba lagi, ya!");
            return;
        }

        const canangRect = canangBase.getBoundingClientRect();
        const dropX = e.clientX;
        const dropY = e.clientY;

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
                const relativeX = e.clientX - canangRect.left;
                const relativeY = e.clientY - canangRect.top;
                placedItem.style.left = `${relativeX - (draggedElement.offsetWidth / 2)}px`;
                placedItem.style.top = `${relativeY - (draggedElement.offsetHeight / 2)}px`;

                canangBase.appendChild(placedItem);
            }

            // Make the original item in the shelf disappear
            draggedElement.style.visibility = 'hidden';

            advanceStep();
        } else {
            setDialogue('Yana-Sad.png', "Hmm, coba letakkan di tempat yang benar.");
        }
    }

    // --- Event Listeners ---
    gameContainer.addEventListener('dragover', dragOver);
    gameContainer.addEventListener('drop', drop);

    // --- Initial Game Start ---
    initializeItems();
    const firstStep = gameSteps[0];
    setDialogue(firstStep.expression, firstStep.dialogue);
});