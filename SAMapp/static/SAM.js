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
    container.appendChild(fileInput);

    // Create the display area for the image
    const imageDisplay = document.createElement('div');
    imageDisplay.id = 'imageDisplay';
    container.appendChild(imageDisplay);

    // Append the container to the body
    document.body.appendChild(container);

    // Add the image upload functionality
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;

                // Set the fixed size for the image
                img.style.minWidth = '100vw';   // Minimum width
                img.style.minHeight = '200px';  // Minimum height
                img.style.maxWidth = '100vw';    // Max width is 100% of the viewport width
                img.style.maxHeight = '80vh';    // Max height is 80% of the viewport height
                img.style.objectFit = 'contain';  // Maintain aspect ratio

                // Clear previous images
                imageDisplay.innerHTML = '';
                imageDisplay.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
});
