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
    fileInput.style.display = 'none';  // Hide the default file input

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

    // Append elements to the container
    container.appendChild(dropArea);
    container.appendChild(imageDisplay);
    container.appendChild(coordDisplay);

    // Append the container to the body
    document.body.appendChild(container);

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
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.pointerEvents = 'none';
                imageDisplay.appendChild(overlay);

                // Hide the drop area after an image is displayed
                dropArea.style.display = 'none';

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
                    dot.style.backgroundColor = 'red';
                    dot.style.borderRadius = '50%';
                    dot.style.transform = 'translate(-50%, -50%)';
                    overlay.appendChild(dot);
                });
            };
            reader.readAsDataURL(file);
        }
    }

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

// Simulate DOMContentLoaded event
const event = new dom.window.Event('DOMContentLoaded');
document.dispatchEvent(event);

console.log(dom.window.document.body.innerHTML);