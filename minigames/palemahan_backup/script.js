const items = [
    { name: 'Daun Kering', type: 'organik', image: 'assets/img/daun_kering.png' },
    { name: 'Botol Plastik', type: 'anorganik', image: 'assets/img/botol_plastik.png' },
    { name: 'Baterai Bekas', type: 'b3', image: 'assets/img/baterai_bekas.png' },
    { name: 'Sisa Makanan', type: 'organik', image: 'assets/img/sisa_makanan.png' },
    { name: 'Kertas Bekas', type: 'anorganik', image: 'assets/img/kertas_bekas.png' },
    { name: 'Lampu Rusak', type: 'b3', image: 'assets/img/lampu_rusak.png' },
    { name: 'Kulit Buah', type: 'organik', image: 'assets/img/kulit_buah.png' },
    { name: 'Kaleng Minuman', type: 'anorganik', image: 'assets/img/kaleng_minuman.png' },
    { name: 'Pestisida', type: 'b3', image: 'assets/img/pestisida.png' },
    { name: 'Ranting Pohon', type: 'organik', image: 'assets/img/ranting_pohon.png' },
    { name: 'Kaca Pecah', type: 'anorganik', image: 'assets/img/kaca_pecah.png' },
    { name: 'Obat Kadaluarsa', type: 'b3', image: 'assets/img/obat_kadaluarsa.png' },
    { name: 'Tulang Ikan', type: 'organik', image: 'assets/img/tulang_ikan.png' },
    { name: 'Plastik Kresek', type: 'anorganik', image: 'assets/img/plastik_kresek.png' },
    { name: 'Termometer Raksa', type: 'b3', image: 'assets/img/termometer_raksa.png' }
];

let currentItem = null;
let timeLeft = 60; // Waktu dalam detik
let score = 0;
const goal = 5; // Target skor
let timerInterval;
let gameState = 'start'; // 'start', 'playing', 'end'

// Audio
const correctSound = new Audio('assets/sound/correct.mp3');
const incorrectSound = new Audio('assets/sound/incorrect.mp3');

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const itemContainer = document.querySelector('.item-container');
const bins = document.querySelectorAll('.bin');
const messageDisplay = document.getElementById('message');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const goalDisplay = document.getElementById('goal');
const endMessage = document.getElementById('end-message');
const finalScoreDisplay = document.getElementById('final-score');

// Inisialisasi tampilan goal
goalDisplay.textContent = goal;

// Game State Management
function showScreen(screen) {
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

function startGame() {
    gameState = 'playing';
    showScreen(gameScreen);
    timeLeft = 60;
    score = 0;
    timeDisplay.textContent = timeLeft;
    scoreDisplay.textContent = score;
    loadNewItem();
    startTimer();
}

function getRandomItem() {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function loadNewItem() {
    currentItem = getRandomItem();
    itemContainer.innerHTML = `<div class="item" draggable="true" data-type="${currentItem.type}"><img src="${currentItem.image}" alt="${currentItem.name}"></div>`;
    messageDisplay.textContent = '';
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const item = document.querySelector('.item');

    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', currentItem.type); 
    });

    bins.forEach(bin => {
        bin.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            const itemType = e.dataTransfer.getData('text/plain');
            const binType = e.currentTarget.dataset.type; 

            if (itemType === binType) {
                correctSound.play();
                messageDisplay.textContent = 'Benar! Sampah berhasil dipilah.';
                score++;
                scoreDisplay.textContent = score;
                bin.classList.add('correct');
                setTimeout(() => bin.classList.remove('correct'), 500);

                if (score >= goal) {
                    endGame(true);
                } else {
                    setTimeout(loadNewItem, 1000);
                }
            } else {
                incorrectSound.play();
                messageDisplay.textContent = 'Salah! Waktu berkurang 5 detik!';
                timeLeft = Math.max(0, timeLeft - 5); 
                timeDisplay.textContent = timeLeft;
                bin.classList.add('incorrect');
                setTimeout(() => bin.classList.remove('incorrect'), 500);
            }
        });
    });
}

function startTimer() {
    clearInterval(timerInterval); 
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);
}

function endGame(win) {
    gameState = 'end';
    clearInterval(timerInterval);
    showScreen(endScreen);
    finalScoreDisplay.textContent = score;

    if (win) {
        endMessage.textContent = 'Selamat! Kamu berhasil memilah semua sampah!';
    } else {
        endMessage.textContent = 'Waktu habis! Kamu hanya berhasil memilah ' + score + ' sampah. Coba lagi!';
    }
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Initial state
showScreen(startScreen);