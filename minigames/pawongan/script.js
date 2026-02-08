document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const riddleTextEl = document.getElementById('riddle-text');
    const ingredientsShelf = document.getElementById('ingredients-shelf');
    const dialogueTextEl = document.getElementById('dialogue-text');
    const tooltip = document.getElementById('tooltip');
    const mixingBowl = document.getElementById('mixing-bowl');
    const checkButton = document.getElementById('check-button');
    const sariAvatarEl = document.getElementById('sari-avatar');

    // --- Game Data ---
    const ingredients = [
        { id: 'jahe', name: 'Jahe', clue: 'Memberi rasa hangat dan meredakan masuk angin.', color: '#e6c5a8', image: 'jahe.png' },
        { id: 'kunyit', name: 'Kunyit', clue: 'Si Raja Jamu, pewarna kuning alami, bagus untuk daya tahan tubuh.', color: '#f9a825', image: 'kunyit.png' },
        { id: 'pandan', name: 'Daun Pandan', clue: 'Daun hijau ini memberikan aroma wangi dan menenangkan.', color: '#4CAF50', image: 'pandan.png' },
        { id: 'gula_merah', name: 'Gula Merah', clue: 'Pemanis alami dari pohon kelapa, legit dan berenergi.', color: '#6d4c41', image: 'gula_merah.png' },
        { id: 'jeruk_nipis', name: 'Jeruk Nipis', clue: 'Kecil, hijau, dan sangat asam, kaya akan Vitamin C.', color: '#8bc34a', image: 'jeruk_nipis.png' },
        { id: 'garam', name: 'Garam', clue: 'Memberi rasa asin, penyeimbang rasa.', color: '#f5f5f5', image: 'garam.png' }
    ];

    const recipes = [
        {
            riddle: `"Untuk menghangatkan badan yang kedinginan, campurkan tiga bahan: 'Si Hangat dari Tanah', 'Si Manis Legit dari Pohon Kelapa', dan 'Si Raja Jamu'."`,
            solution: ['jahe', 'gula_merah', 'kunyit'],
            pawonganTarget: 'Ini akan kubuatkan untuk Pak Satpam yang sering berjaga malam.',
            productName: 'Wedang Jahe Kunyit',
            productDescription: 'Ramuan hangat yang cocok untuk menghangatkan badan dan meningkatkan daya tahan tubuh.',
            productImage: 'wedang _jahe_kunyit.png' // Corrected filename with space
        },
        {
            riddle: `"Membuat minuman penenang pikiran, butuh 'Si Hijau Harum dari Pekarangan', 'Si Asam yang Mencerahkan', dan sedikit 'Penyeimbang Rasa'."`,
            solution: ['pandan', 'jeruk_nipis', 'garam'],
            pawonganTarget: 'Minuman ini cocok untuk Ibu Guru yang sedang banyak pikiran.',
            productName: 'Sari Pandan Nipis',
            productDescription: 'Minuman segar yang membantu menenangkan pikiran dan kaya akan vitamin C.',
            productImage: 'sari_pandan_nipis.png'
        },
        {
            riddle: `"Untuk mengatasi pegal-pegal, campurkan 'Si Raja Jamu', 'Si Asam yang Menyegarkan', dan 'Si Manis Legit dari Pohon Kelapa'."`,
            solution: ['kunyit', 'jeruk_nipis', 'gula_merah'],
            pawonganTarget: 'Ini untuk Nenek yang sering pegal.',
            productName: 'Jamu Kunyit Asam',
            productDescription: 'Minuman tradisional yang berkhasiat untuk meredakan pegal-pegal dan menyegarkan badan.',
            productImage: 'jamu_kunyit_asam.png'
        },
        {
            riddle: `"Untuk melegakan tenggorokan dan menghangatkan badan, butuh 'Si Hangat dari Tanah', 'Si Asam yang Mencerahkan', dan sedikit 'Penyeimbang Rasa'."`,
            solution: ['jahe', 'jeruk_nipis', 'garam'],
            pawonganTarget: 'Ini untuk Adik yang batuk.',
            productName: 'Perasan Jahe Nipis',
            productDescription: 'Ramuan alami yang efektif untuk meredakan batuk, pilek, dan menghangatkan tubuh.',
            productImage: 'perasan_jahe_nipis.png'
        }
    ];

    // --- Game State ---
    let currentRecipeIndex = 0;
    let currentMix = [];
    let selectedIngredient = null; // To track tap-and-drop selection

    // --- Tooltip Functions ---
    function showTooltip(event, text) {
        tooltip.textContent = text;
        tooltip.style.left = `${event.pageX + 15}px`;
        tooltip.style.top = `${event.pageY + 15}px`;
        tooltip.style.visibility = 'visible';
    }

    function moveTooltip(event) {
        tooltip.style.left = `${event.pageX + 15}px`;
        tooltip.style.top = `${event.pageY + 15}px`;
    }

    function hideTooltip() {
        tooltip.style.visibility = 'hidden';
    }

                // --- Core Functions ---
        function renderIngredients() {
            ingredientsShelf.innerHTML = '';
            ingredients.forEach(ing => {
                const wrapperEl = document.createElement('div');
                wrapperEl.className = 'ingredient-item-wrapper';
                wrapperEl.id = `wrapper-${ing.id}`; // Give wrapper an ID for easier selection
                wrapperEl.dataset.id = ing.id; // Store ingredient ID on wrapper
                wrapperEl.draggable = true; // Make wrapper draggable
    
                wrapperEl.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.id); // Get id from dataset on wrapper
                });
                wrapperEl.addEventListener('mouseover', e => {
                    tooltip.textContent = ing.clue;
                    tooltip.style.left = `${e.pageX + 15}px`;
                    tooltip.style.top = `${e.pageY + 15}px`;
                    tooltip.style.visibility = 'visible';
                    setDialogue('explain', ing.clue); // Dialogue on hover
                });
                wrapperEl.addEventListener('mousemove', e => {
                    tooltip.style.left = `${e.pageX + 15}px`;
                    tooltip.style.top = `${e.pageY + 15}px`;
                });
                wrapperEl.addEventListener('mouseout', () => {
                    tooltip.style.visibility = 'hidden';
                    setDialogue('explain', 'Bantu aku memecahkan resep nenek ini!'); // Reset dialogue
                });
    
                // --- Tap and Drop Logic ---
                wrapperEl.addEventListener('click', () => {
                    // Show the clue in the dialogue box on click
                    setDialogue('explain', ing.clue);
    
                    // If this ingredient is already selected, deselect it
                    if (wrapperEl.classList.contains('selected')) {
                        wrapperEl.classList.remove('selected');
                        selectedIngredient = null;
                    } else {
                        // Deselect any other selected ingredient
                        const currentlySelected = document.querySelector('.ingredient-item-wrapper.selected');
                        if (currentlySelected) {
                            currentlySelected.classList.remove('selected');
                        }
                        // Select the new ingredient
                        wrapperEl.classList.add('selected');
                        selectedIngredient = ing.id;
                    }
                });
    
                const ingEl = document.createElement('div');
                ingEl.className = 'ingredient-shape'; // This will now represent the image only
                ingEl.style.backgroundImage = `url('assets/img/${ing.image}')`; // Corrected path
                ingEl.style.width = '100%'; // Make it fill the wrapper
                ingEl.style.height = '80%'; // Adjust height for name
                
                const nameEl = document.createElement('span');
                nameEl.textContent = ing.name;
                nameEl.className = 'ingredient-name';
    
                wrapperEl.appendChild(ingEl);
                wrapperEl.appendChild(nameEl);
                ingredientsShelf.appendChild(wrapperEl);
            });
        }
    
        function addIngredientToMix(id) {        const ingredient = ingredients.find(ing => ing.id === id);
        if (ingredient) {
            if (currentMix.length < 3) {
                if (!currentMix.includes(id)) {
                    currentMix.push(id);
                    const mixedEl = document.createElement('div');
                    mixedEl.className = 'mixed-ingredient';
                    mixedEl.style.backgroundImage = `url('assets/img/${ingredient.image}')`; // Corrected path
                    mixedEl.style.backgroundSize = 'contain';
                    mixedEl.style.backgroundRepeat = 'no-repeat';
                    mixedEl.style.backgroundPosition = 'center';
                    mixingBowl.appendChild(mixedEl);

                    // Deselect after adding
                    const selectedEl = document.querySelector('.ingredient-shape.selected');
                    if (selectedEl) {
                        selectedEl.classList.remove('selected');
                    }
                    selectedIngredient = null;

                } else {
                    setDialogue('sad', `${ingredient.name} sudah ada di mangkuk.`);
                }
            } else {
                setDialogue('sad', 'Mangkuk sudah penuh, maksimal 3 bahan.');
            }
        } else {
            setDialogue('sad', `Bahan dengan ID ${id} tidak dikenal.`);
        }
    }

    function loadRecipe(index) {
        currentRecipeIndex = index;
        const recipe = recipes[index];
        riddleTextEl.textContent = recipe.riddle;
        setDialogue('explain', 'Bantu aku memecahkan resep nenek ini!');
        resetMix();
    }

    function resetMix() {
        currentMix = [];
        mixingBowl.innerHTML = '';
        checkButton.disabled = false;
        // Clear selection
        const currentlySelected = document.querySelector('.ingredient-shape.selected');
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }
        selectedIngredient = null;
    }

    function setDialogue(type, text) {
        dialogueTextEl.textContent = text;
        let imageName = 'Sari-Smile.png';
        switch (type) {
            case 'explain':
                imageName = 'Sari-MemberiTahu.png';
                break;
            case 'excited':
                imageName = 'Sari-Excited.png';
                break;
            case 'sad':
                imageName = 'Sari-Sad.png';
                break;
        }
        sariAvatarEl.src = `../../assets/img/Sari/${imageName}`;
    }

    // --- Drag and Drop Logic ---
    mixingBowl.addEventListener('dragover', e => {
        e.preventDefault();
        mixingBowl.classList.add('drag-over');
    });

    mixingBowl.addEventListener('dragleave', () => mixingBowl.classList.remove('drag-over'));

    mixingBowl.addEventListener('drop', e => {
        e.preventDefault();
        mixingBowl.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        addIngredientToMix(id);
    });

    // --- Tap to Drop Logic ---
    mixingBowl.addEventListener('click', () => {
        if (selectedIngredient) {
            addIngredientToMix(selectedIngredient);
        }
    });

    // --- Check Button Logic ---
    checkButton.addEventListener('click', () => {
        const recipe = recipes[currentRecipeIndex];
        const isCorrect = recipe.solution.length === currentMix.length && recipe.solution.sort().every((v, i) => v === currentMix.sort()[i]);

        if (isCorrect) {
            setDialogue('excited', `Berhasil! Kombinasi ini benar. ${recipe.pawonganTarget}`);
            checkButton.disabled = true;
            showSuccessPopup(recipe); // Call function to show popup
        } else {
            setDialogue('sad', 'Hmm, sepertinya ini bukan kombinasi yang tepat. Coba lagi.');
            setTimeout(resetMix, 2000);
        }
    });

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
    
    // --- Success Popup Functions ---
    const successPopup = document.getElementById('success-popup');    const popupProductName = document.getElementById('popup-product-name');
    const popupProductDescription = document.getElementById('popup-product-description');
    const popupProductShape = document.getElementById('popup-product-shape');
    const nextRecipeButton = document.getElementById('next-recipe-button');

    function showSariBookDialogue() {
        // Hide the video modal first
        videoModal.classList.add('hidden');
        explanationVideo.pause();
        explanationVideo.currentTime = 0;

        Swal.fire({
            title: 'Hadiah Spesial!',
            html: `Wah, kamu hebat! Kamu berhasil membuat semua resep nenek. Saat merapikan, aku menemukan buku catatannya yang berisi semua informasi tentang bahan-bahan ini. Aku berikan padamu sebagai hadiah!`,
            icon: 'success',
            confirmButtonText: 'Terima Buku Obat',
            allowOutsideClick: false,
        }).then(() => {
            localStorage.setItem('pawonganBookUnlocked', 'true');
            localStorage.setItem('pawonganCompleted', 'true'); // Set the flag for minigame completion
            window.location.href = '../../index.html'; // Redirect to main map
        });
    }

    function showSuccessPopup(recipe) {
        popupProductName.textContent = recipe.productName;
        popupProductDescription.textContent = recipe.productDescription;
        popupProductShape.style.backgroundImage = `url('assets/img/${recipe.productImage}')`; // Corrected path
        successPopup.style.visibility = 'visible';
    }

    nextRecipeButton.addEventListener('click', () => {
        successPopup.style.visibility = 'hidden';
        currentRecipeIndex++;
        if (currentRecipeIndex < recipes.length) {
            loadRecipe(currentRecipeIndex);
        } else {
            // All recipes completed, show video then grant the "Buku Obat"
            setDialogue('excited', 'Selamat! Kamu telah menyelesaikan semua resep nenek!');
            showVideoModal('assets/video/video_placeholder.mp4', 'Pawongan: Hubungan harmonis antara manusia dengan sesama dan tumbuhan, diwujudkan melalui kepedulian dan berbagi manfaat tumbuhan dalam Tri Hita Karana.');
        }
    });

    // --- Event Listener for Video Close Button ---
    videoCloseButton.addEventListener('click', hideVideoModal);

    // --- Event Listener for Video Ended ---
    explanationVideo.addEventListener('ended', () => {
        hideVideoModal();
        window.location.href = '../../../index.html'; // Redirect to main map
    });

    // --- Event Listener for Video Close Button ---
    videoCloseButton.addEventListener('click', () => {
        showSariBookDialogue(); // Call the new function to show Sari's book dialogue
    });

    // --- Event Listener for Video Ended ---
    explanationVideo.addEventListener('ended', () => {
        showSariBookDialogue(); // Call the new function to show Sari's book dialogue
    });
    
    // --- Initial Load ---
    renderIngredients();
    loadRecipe(0);
});