// js/audio_utils.js
console.log('audio_utils.js loaded');

let currentVolume = 0;
const maxVolume = 0.7; // Adjust as needed
const fadeDuration = 3000; // 3 seconds
const fadeInterval = 50; // Milliseconds between volume adjustments

function fadeInMusic() {
    if (!backgroundMusic.paused) {
        backgroundMusic.volume = currentVolume;
        const fadeAudio = setInterval(() => {
            currentVolume += maxVolume / (fadeDuration / fadeInterval);
            if (currentVolume >= maxVolume) {
                currentVolume = maxVolume;
                clearInterval(fadeAudio);
            }
            backgroundMusic.volume = currentVolume;
        }, fadeInterval);
    }
}
