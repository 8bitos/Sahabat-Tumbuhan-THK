// js/minigames.js

// Depends on: globals.js, core_functions.js, utils.js

// --- MINIGAME: CANANG SARI (Parahyangan) ---
function startCanangSariMinigame() {
    gameState.currentLocation = 'canang_sari_minigame';
    gameWorld.innerHTML = '';
    gameWorld.classList.add('minigame-active');
    
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container canang-sari-container';
    gameContainer.style.cssText = "display: flex; flex-direction: column; justify-content: space-evenly; height: 100vh; width: 100%; padding: 1rem; background: url('minigames/canang-sari/assets/img/meja.png') no-repeat center center; background-size: cover; box-shadow: none;";

    const itemsContainer = document.createElement('div');
    itemsContainer.id = 'items-container';
    itemsContainer.style.cssText = "flex-shrink: 0; width: 100%; max-width: 800px; margin: 0 auto; padding: 1rem; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 15px; background-color: rgba(255, 255, 255, 0.9); border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);";

    const canangBase = document.createElement('div');
    canangBase.id = 'canang-base';
    canangBase.style.cssText = "display: flex; justify-content: center; align-items: center; width: 100%; height: 45vh; max-height: 350px; padding: 1rem; position: relative; background-size: contain; background-repeat: no-repeat; background-position: center;";

    const bottomUiContainer = document.createElement('div');
    bottomUiContainer.className = 'bottom-ui-container';
    bottomUiContainer.style.cssText = "display: flex; align-items: center; padding: 0.75rem; gap: 1rem; background-color: rgba(255, 255, 255, 0.9); border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; width: 100%;";

    const yanaCharacter = document.createElement('img');
    yanaCharacter.id = 'yana-character';
    yanaCharacter.alt = 'Yana';
    yanaCharacter.style.cssText = "width: 70px; height: 70px; flex-shrink: 0;";

    const dialogueBox = document.createElement('div');
    dialogueBox.className = 'dialogue-box';
    const characterNameEl = document.createElement('p');
    characterNameEl.id = 'character-name';
    characterNameEl.textContent = 'Yana';
    characterNameEl.style.cssText = "font-weight: 600; color: #8e44ad; margin-bottom: 0.25rem;";
    const dialogueTextEl = document.createElement('p');
    dialogueTextEl.id = 'dialogue-text';
    dialogueBox.appendChild(characterNameEl);
    dialogueBox.appendChild(dialogueTextEl);
    
    bottomUiContainer.appendChild(yanaCharacter);
    bottomUiContainer.appendChild(dialogueBox);
    gameContainer.appendChild(itemsContainer);
    gameContainer.appendChild(canangBase);
    gameContainer.appendChild(bottomUiContainer);
    gameWorld.appendChild(gameContainer);
    
    const items = [
        { id: 'canang-base-item', className: 'canang-base-item' }, { id: 'porosan', className: 'porosan' },
        { id: 'pandan', className: 'pandan' }, { id: 'flower-white', className: 'flower-white' },
        { id: 'flower-red', className: 'flower-red' }, { id: 'flower-yellow', className: 'flower-yellow' },
        { id: 'flower-blue', className: 'flower-blue' },
    ];
    const gameSteps = [
        { dialogue: "Halo! Mari kita buat Canang Sari. Pertama, kita butuh Alas Canang sebagai dasarnya.", expression: 'Yana-Smile.png', requiredItem: 'canang-base-item' },
        { dialogue: "Bagus! Sekarang, letakkan Porosan di tengahnya.", expression: 'Yana-Smile.png', requiredItem: 'porosan' },
        { dialogue: "Selanjutnya, Bunga Putih untuk Dewa Iswara di arah Timur (kanan).", expression: 'Yana-Smile.png', requiredItem: 'flower-white' },
        { dialogue: "Lalu, Bunga Merah untuk Dewa Brahma di arah Selatan (bawah).", expression: 'Yana-Smile.png', requiredItem: 'flower-red' },
        { dialogue: "Sekarang Bunga Kuning untuk Dewa Mahadewa di arah Barat (kiri).", expression: 'Yana-Smile.png', requiredItem: 'flower-yellow' },
        { dialogue: "Hampir selesai! Bunga Biru untuk Dewa Wisnu di arah Utara (atas).", expression: 'Yana-Smile.png', requiredItem: 'flower-blue' },
        { dialogue: "Terakhir, tambahkan Pandan sebagai simbol keharuman.", expression: 'Yana-Excited.png', requiredItem: 'pandan' },
    ];
    let currentStepIndex = 0, isBasePlaced = false, selectedItem = null;

    function setLocalDialogue(expression, text) { yanaCharacter.src = `assets/img/Yana/${expression}`; dialogueTextEl.textContent = text; }
    function showYanaBookDialogue() { Swal.fire({ title: 'Hadiah Spesial!', html: `Kamu hebat! Ini buku catatan tentang Yadnya sebagai hadiah.`, icon: 'success', confirmButtonText: 'Terima Buku' }).then(() => { localStorage.setItem('parahyanganBookUnlocked', 'true'); localStorage.setItem('parahyanganCompleted', 'true'); renderHub(); }); }
    function showCompletionPopup() { Swal.fire({ title: 'Kerja Bagus!', text: 'Kamu telah berhasil merangkai Canang Sari!', icon: 'success', confirmButtonText: 'Selesai' }).then(() => showYanaBookDialogue()); }
    function advanceStep() { if (currentStepIndex < gameSteps.length - 1) { currentStepIndex++; setLocalDialogue(gameSteps[currentStepIndex].expression, gameSteps[currentStepIndex].dialogue); updateDraggableItems(); } else { showCompletionPopup(); } }
    function updateDraggableItems() { const requiredItem = gameSteps[currentStepIndex]?.requiredItem; if (!requiredItem) return; items.forEach(item => { const itemEl = document.getElementById(item.id); if (itemEl) { itemEl.draggable = item.id === requiredItem; itemEl.style.cursor = item.id === requiredItem ? 'pointer' : 'not-allowed'; itemEl.style.opacity = item.id === requiredItem ? '1' : '0.5'; } }); }
    function handleDrop(id) {
        const draggedElement = document.getElementById(id);
        const currentStep = gameSteps[currentStepIndex];
        if (!draggedElement || id !== currentStep.requiredItem) { setLocalDialogue('Yana-Sad.png', "Oops, coba lagi!"); return; }
        if (id === 'canang-base-item') { if (!isBasePlaced) { canangBase.style.backgroundImage = `url('minigames/canang-sari/assets/img/canang-base.png')`; isBasePlaced = true; } } 
        else { const placedItem = document.createElement('div'); placedItem.style.backgroundImage = window.getComputedStyle(draggedElement).backgroundImage; placedItem.className = 'placed-item'; canangBase.appendChild(placedItem); }
        draggedElement.style.visibility = 'hidden';
        if (draggedElement.classList.contains('selected')) { draggedElement.classList.remove('selected'); }
        selectedItem = null;
        advanceStep();
    }
    function handleItemClick(itemId) { const itemEl = document.getElementById(itemId); if (!itemEl || itemEl.style.cursor === 'not-allowed') return; const currentlySelected = document.querySelector('.item.selected'); if (currentlySelected) currentlySelected.classList.remove('selected'); if (selectedItem === itemId) { selectedItem = null; } else { itemEl.classList.add('selected'); selectedItem = itemId; } }
    function initializeItems() {
        itemsContainer.innerHTML = '';
        items.forEach(itemData => {
            const itemEl = document.createElement('div');
            itemEl.id = itemData.id;
            itemEl.className = `item ${itemData.className}`;
            itemEl.style.cssText = "width: 65px; height: 65px; cursor: grab; background-size: contain; background-repeat: no-repeat; background-position: center; transition: transform 0.2s; border-radius: 10px;";
            itemEl.style.backgroundImage = `url('minigames/canang-sari/assets/img/${itemData.className.replace('-item', '')}.png')`;
            itemEl.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', e.target.id));
            itemEl.addEventListener('click', () => handleItemClick(itemData.id));
            itemsContainer.appendChild(itemEl);
        });
        updateDraggableItems();
    }
    canangBase.addEventListener('dragover', e => e.preventDefault());
    canangBase.addEventListener('drop', e => { e.preventDefault(); handleDrop(e.dataTransfer.getData('text/plain')); });
    canangBase.addEventListener('click', () => { if (selectedItem) handleDrop(selectedItem); });
    initializeItems(); setLocalDialogue(gameSteps[0].expression, gameSteps[0].dialogue);
}

// --- MINIGAME: JAMU (Pawongan) ---
function startJamuMinigame() {
    checkJamuCompletion();
}
function checkJamuCompletion() {
    setDialogue('Sari', 'Terima kasih! Jamu ini pasti akan membantunya.', 'Excited');
    localStorage.setItem('pawonganBookUnlocked', 'true');
    localStorage.setItem('pawonganCompleted', 'true');
    renderHub();
}

// --- MINIGAME: GARDENING (Palemahan) ---
function startGardeningMinigame() {
    gameState.currentLocation = 'gardening_minigame';
    gameWorld.innerHTML = '';
    gameWorld.classList.add('minigame-active');
    const plantTypes = {
        sunflower: { name: 'Bunga Matahari', seed: 'minigames/palemahan/assets/img/Sunflower-Seed.png', stages: ['minigames/palemahan/assets/img/Stage1Plant.png', 'minigames/palemahan/assets/img/Stage2Plant.png', 'minigames/palemahan/assets/img/Stage3Plant.png', 'minigames/palemahan/assets/img/Bloom-Sunflower.png'] },
        chili: { name: 'Cabai', seed: 'minigames/palemahan/assets/img/Chili-Seed.png', stages: ['minigames/palemahan/assets/img/Stage1Plant.png', 'minigames/palemahan/assets/img/Stage2Plant.png', 'minigames/palemahan/assets/img/Stage3Plant.png', 'minigames/palemahan/assets/img/Bloom-Chili.png'] }
    };
    const needs = { water: { name: 'Air', path: 'minigames/palemahan/assets/img/ikon_air.png' }, sun: { name: 'Sinar Matahari', path: 'minigames/palemahan/assets/img/ikon_matahari.png' }, fertilizer: { name: 'Pupuk', path: 'minigames/palemahan/assets/img/ikon_pipik.png' } };
    const board = document.createElement('div');
    board.className = 'minigame-board';
    board.id = 'gardening-board';
    const pot = document.createElement('div');
    pot.id = 'gardening-pot';
    const plantContainer = document.createElement('div');
    plantContainer.className = 'plant-container';
    const controls = document.createElement('div');
    controls.id = 'gardening-controls';

    if (gameState.plant) {
        const plantData = plantTypes[gameState.plant.type];
        let imagesHTML = '';
        for (let i = 0; i < plantData.stages.length; i++) {
            const isActive = i === (gameState.plant.stage - 1);
            imagesHTML += `<div class="plant ${isActive ? 'active' : ''}" style="background-image: url('${plantData.stages[i]}')"></div>`;
        }
        plantContainer.innerHTML = imagesHTML;
        pot.appendChild(plantContainer);

        const thoughtBubble = document.createElement('div');
        thoughtBubble.id = 'thought-bubble';
        const needIcon = document.createElement('div');
        needIcon.id = 'need-icon';
        if (gameState.plant.hasPest) { needIcon.style.backgroundImage = `url('minigames/palemahan/assets/img/Ulat.png')`; thoughtBubble.appendChild(needIcon); pot.appendChild(thoughtBubble); } 
        else if (gameState.plant.needs) { needIcon.style.backgroundImage = `url('${needs[gameState.plant.needs].path}')`; thoughtBubble.appendChild(needIcon); pot.appendChild(thoughtBubble); }
        if (gameState.plant.hasPest) {
            const pest = document.createElement('div');
            pest.id = 'pest';
            pest.addEventListener('click', () => { setDialogue('Loka', 'Hore! Ulatnya sudah pergi.', 'Excited'); gameState.plant.hasPest = false; const needKeys = Object.keys(needs); gameState.plant.needs = needKeys[Math.floor(Math.random() * needKeys.length)]; startGardeningMinigame(); });
            pot.appendChild(pest);
        }
        if (gameState.plant.stage < plantData.stages.length) {
            Object.keys(needs).forEach(needKey => {
                const actionButton = document.createElement('button');
                actionButton.className = 'action-button';
                actionButton.innerHTML = `<img src="${needs[needKey].path}" alt="${needs[needKey].name}"><span>${needs[needKey].name}</span>`;
                actionButton.addEventListener('click', () => {
                    if (gameState.plant.hasPest) { setDialogue('Loka', 'Aduh, ada ulat!', 'Sad'); return; }
                    if (gameState.plant.needs === needKey) {
                        gameState.plant.stage++;
                        setDialogue('Loka', 'Bagus! Tanamanmu tumbuh sehat!', 'Smile');
                        if (gameState.plant.stage < plantData.stages.length) {
                            if (Math.random() < 0.3) { gameState.plant.hasPest = true; } 
                            else { const needKeys = Object.keys(needs); gameState.plant.needs = needKeys[Math.floor(Math.random() * needKeys.length)]; }
                        } else { gameState.plant.needs = null; }
                    } else { setDialogue('Loka', 'Bukan itu yang ia butuhkan.', 'Explain'); }
                    setTimeout(startGardeningMinigame, 1500);
                });
                controls.appendChild(actionButton);
            });
        } else {
            const harvestButton = document.createElement('button');
            harvestButton.textContent = 'Panen Hasil';
            harvestButton.className = 'action-button';
            harvestButton.addEventListener('click', () => { setDialogue('Loka', 'Panen berhasil!', 'Excited'); gameState.plant = null; localStorage.setItem('palemahanBookUnlocked', 'true'); localStorage.setItem('palemahanCompleted', 'true'); startVideoLesson('minigames/palemahan/assets/video/Fotosintesis.mp4', 'Memahami Fotosintesis', 'Fotosintesis adalah proses...', renderHub); });
            controls.appendChild(harvestButton);
        }
        const backButton = document.createElement('button');
        backButton.textContent = 'Kembali ke Peta';
        backButton.addEventListener('click', () => { gameState.plant = null; renderHub(); });
        controls.appendChild(backButton);
    } else {
        setDialogue('Loka', 'Kamu mau menanam yang mana?', 'Explain');
        Object.keys(plantTypes).forEach(type => {
            const seedButton = document.createElement('button');
            seedButton.className = 'seed-choice';
            seedButton.style.backgroundImage = `url('${plantTypes[type].seed}')`;
            seedButton.addEventListener('click', () => { gameState.plant = { type: type, stage: 1, needs: 'water', hasPest: false }; startGardeningMinigame(); });
            controls.appendChild(seedButton);
        });
    }
    board.appendChild(pot);
    board.appendChild(controls);
    gameWorld.appendChild(board);
}