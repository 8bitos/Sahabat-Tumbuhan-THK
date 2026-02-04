// tts.js - Text-to-Speech Module

const TTS = (() => {
    let voices = [];
    let voiceMap = {};
    let isInitialized = false;
    let isTtsEnabled = true; // Default to true, will be updated by script.js

    // Function to load voices. It's often asynchronous.
    function loadVoices() {
        return new Promise((resolve) => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length) {
                resolve(voices);
                return;
            }
            window.speechSynthesis.onvoiceschanged = () => {
                voices = window.speechSynthesis.getVoices();
                resolve(voices);
            };
        });
    }

    // Assigns distinct voices to each character
    async function assignVoices() {
        await loadVoices();
        
        // Prioritize Indonesian voices
        const indonesianVoices = voices.filter(voice => voice.lang.startsWith('id-ID'));
        
        // Fallback to any available voices if Indonesian ones are not found
        const voicePool = indonesianVoices.length > 3 ? indonesianVoices : voices;

        if (voicePool.length > 0) {
            voiceMap = {
                'Loka': voicePool[0], // First available voice
                'Sari': voicePool.length > 1 ? voicePool[1] : voicePool[0], // Second, or fallback to first
                'Yana': voicePool.length > 2 ? voicePool[2] : voicePool[0], // Third, or fallback to first
                'Narator': voicePool.length > 3 ? voicePool[3] : voicePool[0] // Fourth, or fallback to first
            };
        } else {
            console.warn('TTS: No voices available on this browser.');
        }

        isInitialized = true;
        console.log('TTS initialized. Voice map:', voiceMap);
    }

    // New method to set TTS enabled state
    function setTtsEnabled(enabled) {
        isTtsEnabled = enabled;
        if (!isTtsEnabled && window.speechSynthesis) {
            window.speechSynthesis.cancel(); // Stop speaking if turned off
        }
    }

    // Public function to speak text
    function speak(text, character) {
        if (!isTtsEnabled) { // Check the flag first
            return;
        }
        if (!isInitialized || !window.speechSynthesis) {
            console.warn('TTS not ready or not supported.');
            return;
        }

        // Stop any currently speaking utterance
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Assign a voice based on the character
        if (voiceMap[character]) {
            utterance.voice = voiceMap[character];
        }

        // Set properties for the utterance (optional)
        utterance.pitch = 1;
        utterance.rate = 1; // Speed
        utterance.volume = 1;

        window.speechSynthesis.speak(utterance);
    }

    // New init function to be called from main script
    async function init() {
        await assignVoices(); // Assign voices when init is called
    }

    // Don't call assignVoices() immediately here.
    // It will be called by init().

    return {
        init: init, // Expose init
        speak: speak,
        setTtsEnabled: setTtsEnabled // Expose setter
    };
})();
