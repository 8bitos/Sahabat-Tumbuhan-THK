document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('minigameRushVisited', 'true');
    const isUnlocked = localStorage.getItem('quizCompleted') === 'true'
        || (localStorage.getItem('quizScore') !== null && localStorage.getItem('quizScore') !== '');
    if (!isUnlocked) {
        Swal.fire({
            title: 'Mode Terkunci',
            text: 'Selesaikan quiz dulu untuk membuka Minigame Rush.',
            icon: 'warning',
            confirmButtonText: 'Kembali'
        }).then(() => {
            window.location.href = '../../index.html';
        });
        return;
    }

    const timeEl = document.getElementById('time-left');
    const scoreEl = document.getElementById('score');
    const roundEl = document.getElementById('round-time');
    const comboEl = document.getElementById('combo');
    const levelEl = document.getElementById('level');
    const tagEl = document.getElementById('challenge-tag');
    const textEl = document.getElementById('challenge-text');
    const arenaEl = document.getElementById('arena');
    const feedbackEl = document.getElementById('feedback');
    const cardEl = document.querySelector('.rush-card');
    const bgAudio = document.getElementById('bg-audio');
    const clickSfx = document.getElementById('click-sfx');
    const rushStartSfx = document.getElementById('rush-start-sfx');
    const correctSfx = document.getElementById('correct-sfx');
    const wrongSfx = document.getElementById('wrong-sfx');
    const comboUpSfx = document.getElementById('combo-up-sfx');
    const timeBonusSfx = document.getElementById('time-bonus-sfx');
    const countdownSfx = document.getElementById('countdown-sfx');
    const roundTransitionSfx = document.getElementById('round-transition-sfx');
    const newBestSfx = document.getElementById('new-best-sfx');

    let timeLeft = 90;
    let score = 0;
    let roundTime = 9;
    let timerId = null;
    let roundTimerId = null;
    let locked = false;
    let selectedItem = null;
    let currentRound = null;
    let roundState = null;
    let combo = 0;
    let multiplier = 1;
    let level = 1;
    let isFirstRound = true;

    const icons = {
        Air: '../palemahan/assets/img/ikon_air.png',
        Matahari: '../palemahan/assets/img/ikon_matahari.png',
        Pupuk: '../palemahan/assets/img/ikon_pipik.png',
        Jahe: '../pawongan/assets/img/jahe.png',
        'Gula Merah': '../pawongan/assets/img/gula_merah.png',
        Kunyit: '../pawongan/assets/img/kunyit.png',
        'Pandan Pawongan': '../pawongan/assets/img/pandan.png',
        'Jeruk Nipis': '../pawongan/assets/img/jeruk_nipis.png',
        Garam: '../pawongan/assets/img/garam.png',
        'Pandan Canang': '../canang-sari/assets/img/pandan.png',
        Porosan: '../canang-sari/assets/img/porosan.png',
        'Bunga Putih': '../canang-sari/assets/img/flower-white.png',
        'Bunga Merah': '../canang-sari/assets/img/flower-red.png',
        'Bunga Kuning': '../canang-sari/assets/img/flower-yellow.png',
        'Bunga Biru': '../canang-sari/assets/img/flower-blue.png'
    };

    const rounds = [
        {
            mode: 'Palemahan',
            type: 'single-drop',
            prompt: 'Tanaman butuh air. Seret tool yang tepat ke target.',
            targetLabel: 'Kebutuhan Tanaman',
            answer: 'Air',
            options: ['Air', 'Matahari', 'Pupuk']
        },
        {
            mode: 'Palemahan',
            type: 'single-drop',
            prompt: 'Tanaman butuh sinar matahari.',
            targetLabel: 'Kebutuhan Tanaman',
            answer: 'Matahari',
            options: ['Air', 'Matahari', 'Pupuk']
        },
        {
            mode: 'Palemahan',
            type: 'single-drop',
            prompt: 'Tanaman butuh pupuk.',
            targetLabel: 'Kebutuhan Tanaman',
            answer: 'Pupuk',
            options: ['Air', 'Matahari', 'Pupuk']
        },
        {
            mode: 'Pawongan',
            type: 'recipe-drop',
            prompt: 'Racik Wedang Jahe Kunyit. Seret 3 bahan ke mangkuk.',
            targetLabel: 'Mangkuk Racik',
            answerSet: ['Jahe', 'Gula Merah', 'Kunyit'],
            options: ['Jahe', 'Gula Merah', 'Kunyit', 'Pandan Pawongan', 'Jeruk Nipis', 'Garam']
        },
        {
            mode: 'Pawongan',
            type: 'recipe-drop',
            prompt: 'Racik Sari Pandan Nipis.',
            targetLabel: 'Mangkuk Racik',
            answerSet: ['Pandan Pawongan', 'Jeruk Nipis', 'Garam'],
            options: ['Jahe', 'Gula Merah', 'Kunyit', 'Pandan Pawongan', 'Jeruk Nipis', 'Garam']
        },
        {
            mode: 'Parahyangan',
            type: 'single-drop',
            prompt: 'Canang: simbol keharuman? Seret item ke alas.',
            targetLabel: 'Alas Canang',
            answer: 'Pandan Canang',
            options: ['Porosan', 'Pandan Canang', 'Bunga Merah', 'Bunga Biru']
        },
        {
            mode: 'Parahyangan',
            type: 'single-drop',
            prompt: 'Canang: bunga arah Timur.',
            targetLabel: 'Alas Canang',
            answer: 'Bunga Putih',
            options: ['Bunga Putih', 'Bunga Merah', 'Bunga Kuning', 'Bunga Biru']
        }
    ];

    function updateStats() {
        timeEl.textContent = String(Math.max(0, timeLeft));
        scoreEl.textContent = String(score);
        roundEl.textContent = String(Math.max(0, roundTime));
        comboEl.textContent = `${combo} (x${multiplier})`;
        levelEl.textContent = String(level);
    }

    function setFeedback(text, ok) {
        feedbackEl.textContent = text;
        feedbackEl.className = `feedback ${ok ? 'ok' : 'no'}`;
    }

    function clearRoundTimer() {
        if (roundTimerId) {
            clearInterval(roundTimerId);
            roundTimerId = null;
        }
    }

    function playSfx(audioEl, volume = 0.8) {
        if (!audioEl) return;
        audioEl.volume = volume;
        audioEl.currentTime = 0;
        audioEl.play().catch(() => {});
    }

    function triggerFx(ok) {
        if (!cardEl) return;
        cardEl.classList.remove('fx-ok', 'fx-no');
        void cardEl.offsetWidth;
        cardEl.classList.add(ok ? 'fx-ok' : 'fx-no');
    }

    function resetCombo() {
        combo = 0;
        multiplier = 1;
    }

    function addCombo() {
        const prev = multiplier;
        combo += 1;
        multiplier = Math.min(4, 1 + Math.floor(combo / 3));
        if (multiplier > prev) {
            playSfx(comboUpSfx, 0.85);
        }
    }

    function updateDifficulty() {
        const elapsed = 90 - timeLeft;
        if (elapsed >= 60) level = 4;
        else if (elapsed >= 40) level = 3;
        else if (elapsed >= 20) level = 2;
        else level = 1;
    }

    function getRoundBaseTime() {
        if (level === 1) return 9;
        if (level === 2) return 7;
        if (level === 3) return 6;
        return 5;
    }

    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function createItemButton(label) {
        const btn = document.createElement('button');
        btn.className = 'dnd-item';
        btn.draggable = true;
        btn.dataset.item = label;
        btn.innerHTML = `
            <div class="icon" style="background-image:url('${icons[label] || ''}')"></div>
            <span>${label}</span>
        `;
        btn.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', label);
        });
        btn.addEventListener('click', () => {
            document.querySelectorAll('.dnd-item.selected').forEach((n) => n.classList.remove('selected'));
            btn.classList.add('selected');
            selectedItem = label;
        });
        return btn;
    }

    function evaluateSingleDrop(item) {
        if (locked) return;
        locked = true;
        clearRoundTimer();
        const correct = item === currentRound.answer;
        if (correct) {
            addCombo();
            score += 12 * multiplier;
            timeLeft = Math.min(99, timeLeft + 1);
            setFeedback(`Benar! +${12 * multiplier} skor, +1 detik`, true);
            triggerFx(true);
            playSfx(correctSfx, 0.9);
            playSfx(timeBonusSfx, 0.75);
        } else {
            resetCombo();
            score = Math.max(0, score - 5);
            setFeedback(`Salah. Jawaban: ${currentRound.answer}`, false);
            triggerFx(false);
            playSfx(wrongSfx, 0.9);
        }
        updateStats();
        setTimeout(startRound, 500);
    }

    function evaluateRecipeDrop() {
        if (locked) return;
        locked = true;
        clearRoundTimer();
        const picked = [...roundState.picked].sort().join('|');
        const answer = [...currentRound.answerSet].sort().join('|');
        const correct = picked === answer;
        if (correct) {
            addCombo();
            score += 16 * multiplier;
            timeLeft = Math.min(99, timeLeft + 2);
            setFeedback(`Resep tepat! +${16 * multiplier} skor, +2 detik`, true);
            triggerFx(true);
            playSfx(correctSfx, 0.9);
            playSfx(timeBonusSfx, 0.8);
        } else {
            resetCombo();
            score = Math.max(0, score - 6);
            setFeedback(`Salah. Resep benar: ${currentRound.answerSet.join(', ')}`, false);
            triggerFx(false);
            playSfx(wrongSfx, 0.9);
        }
        updateStats();
        setTimeout(startRound, 650);
    }

    function renderSingleDropRound() {
        arenaEl.innerHTML = '';
        roundState = {};

        const hint = document.createElement('p');
        hint.className = 'hint';
        hint.textContent = 'Drag & drop item ke target (atau pilih item lalu tap target).';
        arenaEl.appendChild(hint);

        const target = document.createElement('div');
        target.className = 'drop-zone';
        target.innerHTML = `<p>${currentRound.targetLabel}</p>`;
        target.addEventListener('dragover', (e) => e.preventDefault());
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.dataTransfer.getData('text/plain');
            evaluateSingleDrop(item);
        });
        target.addEventListener('click', () => {
            if (selectedItem) evaluateSingleDrop(selectedItem);
        });
        arenaEl.appendChild(target);

        const grid = document.createElement('div');
        grid.className = 'dnd-grid';
        currentRound.options.forEach((label) => grid.appendChild(createItemButton(label)));
        arenaEl.appendChild(grid);
    }

    function renderRecipeRound() {
        arenaEl.innerHTML = '';
        roundState = { picked: [] };

        const hint = document.createElement('p');
        hint.className = 'hint';
        hint.textContent = 'Drop 3 bahan ke mangkuk, lalu klik "Selesai Racik".';
        arenaEl.appendChild(hint);

        const bowl = document.createElement('div');
        bowl.className = 'drop-zone bowl';
        bowl.innerHTML = '<p>Mangkuk Racik (0/3)</p><div class="picked-row"></div>';
        const bowlTitle = bowl.querySelector('p');
        const pickedRow = bowl.querySelector('.picked-row');

        function addPicked(item) {
            if (locked) return;
            if (roundState.picked.length >= 3) return;
            if (roundState.picked.includes(item)) return;
            roundState.picked.push(item);
            const chip = document.createElement('div');
            chip.className = 'picked-chip';
            chip.style.backgroundImage = `url('${icons[item] || ''}')`;
            chip.title = item;
            pickedRow.appendChild(chip);
            bowlTitle.textContent = `Mangkuk Racik (${roundState.picked.length}/3)`;
        }

        bowl.addEventListener('dragover', (e) => e.preventDefault());
        bowl.addEventListener('drop', (e) => {
            e.preventDefault();
            const item = e.dataTransfer.getData('text/plain');
            addPicked(item);
        });
        bowl.addEventListener('click', () => {
            if (selectedItem) addPicked(selectedItem);
        });
        arenaEl.appendChild(bowl);

        const grid = document.createElement('div');
        grid.className = 'dnd-grid';
        currentRound.options.forEach((label) => grid.appendChild(createItemButton(label)));
        arenaEl.appendChild(grid);

        const submit = document.createElement('button');
        submit.className = 'ui-btn';
        submit.textContent = 'Selesai Racik';
        submit.addEventListener('click', () => {
            if (roundState.picked.length !== 3) {
                setFeedback('Wajib 3 bahan dulu.', false);
                return;
            }
            evaluateRecipeDrop();
        });
        arenaEl.appendChild(submit);
    }

    function onRoundTimeout() {
        if (locked) return;
        locked = true;
        resetCombo();
        score = Math.max(0, score - 4);
        setFeedback('Waktu ronde habis! -4 skor', false);
        triggerFx(false);
        playSfx(wrongSfx, 0.85);
        updateStats();
        setTimeout(startRound, 450);
    }

    function startRoundTimer() {
        updateDifficulty();
        roundTime = getRoundBaseTime();
        updateStats();
        clearRoundTimer();
        roundTimerId = setInterval(() => {
            roundTime -= 1;
            updateStats();
            if (roundTime <= 3 && roundTime > 0) {
                playSfx(countdownSfx, 0.7);
            }
            if (roundTime <= 0) onRoundTimeout();
        }, 1000);
    }

    function startRound() {
        if (timeLeft <= 0) return;
        locked = false;
        selectedItem = null;
        document.querySelectorAll('.dnd-item.selected').forEach((n) => n.classList.remove('selected'));
        currentRound = randomFrom(rounds);
        tagEl.textContent = currentRound.mode;
        textEl.textContent = currentRound.prompt;
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        updateDifficulty();
        if (isFirstRound) {
            playSfx(rushStartSfx, 0.9);
            isFirstRound = false;
        } else {
            playSfx(roundTransitionSfx, 0.75);
        }

        if (currentRound.type === 'recipe-drop') {
            renderRecipeRound();
        } else {
            renderSingleDropRound();
        }
        startRoundTimer();
    }

    function finishGame() {
        clearInterval(timerId);
        clearRoundTimer();
        if (bgAudio) bgAudio.pause();
        localStorage.setItem('minigameRushLastScore', String(score));
        const best = parseInt(localStorage.getItem('minigameRushBestScore') || '0', 10);
        const isNewBest = score > best;
        if (isNewBest) localStorage.setItem('minigameRushBestScore', String(score));
        if (isNewBest) {
            playSfx(newBestSfx, 0.9);
        }

        Swal.fire({
            title: 'Tantangan Selesai',
            html: `
                <p>Skor Akhir: <strong>${score}</strong></p>
                <p>Best Score: <strong>${Math.max(score, best)}</strong></p>
                ${isNewBest ? '<p>Best score baru!</p>' : ''}
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Main Lagi',
            cancelButtonText: 'Kembali ke Map',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) window.location.reload();
            else window.location.href = '../../index.html';
        });
    }

    function startGlobalTimer() {
        timerId = setInterval(() => {
            timeLeft -= 1;
            updateDifficulty();
            updateStats();
            if (timeLeft <= 0) finishGame();
        }, 1000);
    }

    function startAudio() {
        if (!bgAudio) return;
        bgAudio.volume = 0.55;
        const resume = () => {
            bgAudio.play().finally(() => {
                document.removeEventListener('pointerdown', resume);
                document.removeEventListener('touchstart', resume);
                document.removeEventListener('keydown', resume);
            });
        };
        document.addEventListener('pointerdown', resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
        bgAudio.play().catch(() => {});
    }

    document.addEventListener('click', (event) => {
        if (!clickSfx) return;
        const interactive = event.target.closest('button, .drop-zone');
        if (!interactive) return;
        clickSfx.currentTime = 0;
        clickSfx.play().catch(() => {});
    });

    updateStats();
    startRound();
    startGlobalTimer();
    startAudio();
});
