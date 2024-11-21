document.addEventListener('DOMContentLoaded', function() {
// Create the main container
const container = document.createElement('div');
container.style.textAlign = 'center';
container.style.margin = '20px';

// Create the title
const title = document.createElement('h1');
title.textContent = 'SAM Object Recognition';
container.appendChild(title);

// Create the file input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'imageInput';
fileInput.accept = 'image/*';
fileInput.style.display = 'none'; // Hide the default file input

// Create a custom button for file selection
const customButton = document.createElement('button');
customButton.textContent = 'Select an Image';
customButton.style.padding = '10px';
customButton.style.margin = '10px';
customButton.style.cursor = 'pointer';
customButton.onclick = () => fileInput.click();

// Create the drag and drop area
const dropArea = document.createElement('div');
dropArea.id = 'dropArea';
dropArea.style.border = '2px dashed #ccc';
dropArea.style.borderRadius = '20px';
dropArea.style.padding = '20px';
dropArea.style.margin = '20px auto';
dropArea.style.maxWidth = '80%';
dropArea.style.minHeight = '200px';
dropArea.style.display = 'flex';
dropArea.style.alignItems = 'center';
dropArea.style.justifyContent = 'center';
dropArea.style.flexDirection = 'column';
dropArea.style.cursor = 'pointer';

const dropText = document.createElement('p');
dropText.textContent = 'Drag and drop an image here';
dropText.style.margin = '0';
dropArea.appendChild(dropText);

const orText = document.createElement('p');
orText.textContent = 'or';
orText.style.margin = '10px 0';
dropArea.appendChild(orText);

dropArea.appendChild(customButton);
dropArea.appendChild(fileInput);

// Create the display area for the image
const imageDisplay = document.createElement('div');
imageDisplay.id = 'imageDisplay';
imageDisplay.style.position = 'relative';
imageDisplay.style.display = 'inline-block';

// Create a div to display coordinates
const coordDisplay = document.createElement('div');
coordDisplay.id = 'coordDisplay';
coordDisplay.style.marginTop = '10px';
coordDisplay.style.fontSize = '16px';

// Create buttons container
const buttonsContainer = document.createElement('div');
buttonsContainer.style.marginTop = '10px';
buttonsContainer.style.display = 'none'; // Initially hidden

// Create Include button
const includeButton = document.createElement('button');
includeButton.textContent = 'Include';
includeButton.style.margin = '0 10px';
includeButton.style.padding = '10px';

// Create Exclude button
const excludeButton = document.createElement('button');
excludeButton.textContent = 'Exclude';
excludeButton.style.margin = '0 10px';
excludeButton.style.padding = '10px';

// Create Clear button
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.style.margin = '0 10px';
clearButton.style.padding = '10px';
clearButton.style.backgroundColor = '#f0f0f0';

// Add Process button to buttonsContainer
const processButton = document.createElement('button');
processButton.textContent = 'Process with SAM2';
processButton.style.margin = '0 10px';
processButton.style.padding = '10px';
processButton.style.backgroundColor = '#4CAF50';
processButton.style.color = 'white';
buttonsContainer.appendChild(processButton);

// Append buttons to container
buttonsContainer.appendChild(includeButton);
buttonsContainer.appendChild(excludeButton);
buttonsContainer.appendChild(clearButton);

// Append elements to the container
container.appendChild(dropArea);
container.appendChild(imageDisplay);
container.appendChild(coordDisplay);
container.appendChild(buttonsContainer);

// Append the container to the body
document.body.appendChild(container);

// Variable to track current selection mode
let currentMode = 'include'; // default to include mode

// Function to handle the selected file
function handleFile(file) {
if (file) {
const reader = new FileReader();
reader.onload = function(e) {
const img = document.createElement('img');
img.src = e.target.result;

// Set the fixed size for the image
img.style.width = '100%';
img.style.height = 'auto';
img.style.maxHeight = '80vh';
img.style.objectFit = 'contain';

// Clear previous images and dots
imageDisplay.innerHTML = '';
imageDisplay.appendChild(img);

// Create an overlay div for dots
const overlay = document.createElement('div');
overlay.id = 'dotsOverlay'; // Add an ID for easy reference
overlay.style.position = 'absolute';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.pointerEvents = 'none';
imageDisplay.appendChild(overlay);

// Hide the drop area after an image is displayed
dropArea.style.display = 'none';
buttonsContainer.style.display = 'block';

// Add click event listener to the image
img.addEventListener('click', function(event) {
const rect = img.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;

// Calculate percentages
const xPercent = (x / rect.width) * 100;
const yPercent = (y / rect.height) * 100;

coordDisplay.textContent = `Clicked coordinates: (${Math.round(xPercent)}%, ${Math.round(yPercent)}%)`;
console.log([Math.round(xPercent), Math.round(yPercent)]);

// Create a dot to mark the clicked position
const dot = document.createElement('div');
dot.style.position = 'absolute';
dot.style.left = `${xPercent}%`;
dot.style.top = `${yPercent}%`;
dot.style.width = '10px';
dot.style.height = '10px';
dot.style.backgroundColor = currentMode === 'include' ? 'green' : 'red';
dot.style.borderRadius = '50%';
dot.style.transform = 'translate(-50%, -50%)';
overlay.appendChild(dot);
});

// Include button functionality
includeButton.onclick = function() {
currentMode = 'include';
includeButton.style.backgroundColor = '#90EE90'; // Light green to indicate active
excludeButton.style.backgroundColor = ''; // Reset exclude button
};

// Exclude button functionality
excludeButton.onclick = function() {
currentMode = 'exclude';
excludeButton.style.backgroundColor = '#FFB6C1'; // Light red to indicate active
includeButton.style.backgroundColor = ''; // Reset include button
};

// Clear button functionality
clearButton.onclick = function() {
const overlay = document.getElementById('dotsOverlay');
if (overlay) {
overlay.innerHTML = ''; // Remove all dots
}
};
};
reader.readAsDataURL(file);
}
}
// Process button functionality
processButton.onclick = function() {
    // Get current image
    const img = imageDisplay.querySelector('img');

    // Get dots
    const overlay = document.getElementById('dotsOverlay');
    const dots = overlay.querySelectorAll('div');

    const points = Array.from(dots).map(dot => {
        const left = parseFloat(dot.style.left);
        const top = parseFloat(dot.style.top);
        return [left, top];
    });

    // Convert image to base64
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const base64Image = canvas.toDataURL('image/jpeg');

    // Send to Django backend
    fetch('/process_sam2/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            image: base64Image,
            points: points
        })
    })
    .then(response => response.json())
    .then(data => {
        // Handle processed image/masks
        console.log(data);
    });
};

// Add the image upload functionality
fileInput.addEventListener('change', function(event) {
handleFile(event.target.files[0]);
});

// Add drag and drop functionality
dropArea.addEventListener('dragover', function(e) {
e.preventDefault();
dropArea.style.border = '2px solid #000';
});

dropArea.addEventListener('dragleave', function(e) {
e.preventDefault();
dropArea.style.border = '2px dashed #ccc';
});

dropArea.addEventListener('drop', function(e) {
e.preventDefault();
dropArea.style.border = '2px dashed #ccc';
handleFile(e.dataTransfer.files[0]);
});
});

