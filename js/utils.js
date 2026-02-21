// js/utils.js

// --- DRAGGABLE HELPER ---
function makeDraggable(element, container) {
    let isDragging = false, offsetX, offsetY;
    element.style.cursor = 'grab';
    element.addEventListener('mousedown', e => {
        if (e.target !== element && !e.target.classList.contains('dropped-item')) return;
        isDragging = true;
        const elemRect = element.getBoundingClientRect();
        offsetX = e.clientX - elemRect.left;
        offsetY = e.clientY - elemRect.top;
        element.style.cursor = 'grabbing';
        element.style.zIndex = 1000;
        e.stopPropagation();
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const containerRect = container.getBoundingClientRect();
        let x = e.clientX - containerRect.left - offsetX;
        let y = e.clientY - containerRect.top - offsetY;
        x = Math.max(0, Math.min(x, containerRect.width - element.offsetWidth));
        y = Math.max(0, Math.min(y, containerRect.height - element.offsetHeight));
        element.style.position = 'absolute';
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'grab';
            element.style.zIndex = 'auto';
        }
    });
}

// --- VIDEO LESSON FUNCTION ---
function startVideoLesson(videoPath, lessonTitle, lessonText, onVideoEndedCallback) {
    gameWorld.innerHTML = '';
    gameWorld.classList.add('minigame-active'); // Center the video
    setDialogue('Narator', 'Perhatikan video berikut untuk memahami materi.');

    const videoContainer = document.createElement('div');
    videoContainer.id = 'video-lesson-container';

    const videoPlayer = document.createElement('video');
    videoPlayer.id = 'video-player';
    videoPlayer.controls = true;
    videoPlayer.autoplay = true;
    videoPlayer.src = videoPath;

    const lessonTextArea = document.createElement('div');
    lessonTextArea.id = 'lesson-text-area';
    lessonTextArea.innerHTML = `<h4>${lessonTitle}</h4><p>${lessonText}</p>`;

    videoPlayer.addEventListener('ended', () => {
        setDialogue('Narator', 'Video telah selesai. Siap untuk melanjutkan?');
        if (onVideoEndedCallback) {
            onVideoEndedCallback();
        }
    });

    videoContainer.appendChild(videoPlayer);
    videoContainer.appendChild(lessonTextArea);
    gameWorld.appendChild(videoContainer);
}

// --- TEXT FORMATTING UTILITY ---
function formatPlantMaterialContent(plainText) {
    let html = '';
    const lines = plainText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let inList = false;

    lines.forEach(line => {
        // Image handling: [IMAGE:path/to/image.png|alt text]
        const imageMatch = line.match(/\[IMAGE:(.+?)\|(.+?)\]/);
        if (imageMatch) {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            const imagePath = imageMatch[1];
            const altText = imageMatch[2];
            html += `<div class="material-image-container"><img src="${imagePath}" alt="${altText}"></div>`;
            return; // Skip to next line after handling image
        }

        if (line.match(/^[A-C]\.\s/)) {
            // Main sections (e.g., "A. Bagian-Bagian Tubuh Tumbuhan")
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<h2 class="material-heading">${line}</h2>`;
        } else if (line.match(/^\d+(\.\d+)*\.\s/)) {
            // Numbered sub-sections (e.g., "1. Akar")
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<h3 class="material-subheading">${line}</h3>`;
        } else if (line.match(/^\d+\)\s/)) {
            if (!inList) {
                html += '<ul class="material-text-justify">';
                inList = true;
            }
            html += `<li class="material-text-justify">${line.replace(/^\d+\)\s/, '')}</li>`;
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            // List items
            if (!inList) {
                html += '<ul class="material-text-justify">'; // Apply to UL for all list items
                inList = true;
            }
            html += `<li class="material-text-justify">${line.substring(2)}</li>`;
        } else if (line.startsWith('Fungsi: ') || line.startsWith('Fungsi akar secara lebih jelas adalah: ')) {
            // Bold specific function descriptions
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p class="material-text-justify"><strong>${line}</strong></p>`;
        }
        else {
            // Regular paragraphs
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p class="material-text-justify">${line}</p>`;
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html;
}
