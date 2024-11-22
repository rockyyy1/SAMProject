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

    // Add Back button to buttonsContainer
  const BackButton = document.createElement('button');
  BackButton.textContent = 'Back';
  BackButton.style.margin = '0 10px';
  BackButton.style.padding = '10px';
  BackButton.style.backgroundColor = '#Ff0000';
  BackButton.style.color = 'white';

  buttonsContainer.appendChild(BackButton);
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
      };
      reader.readAsDataURL(file);
    }
  }

  // Include button functionality
  includeButton.onclick = function() {
    currentMode = 'include';
    includeButton.style.backgroundColor = '#90EE90'; // Light green to indicate active
    excludeButton.style.backgroundColor = ''; // Reset exclude button
  };

    // BackButton button functionality
  BackButton.onclick = function() {
    location.reload();
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

// Process button functionality
  processButton.onclick = function() {
    // Disable the button and show loading state
    processButton.disabled = true;
    processButton.textContent = 'Processing...';

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
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg');

    // Send to Django backend
        fetch('http://127.0.0.1:8000/process/', {
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
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Create and display the processed image
        const processedImg = document.createElement('img');
        processedImg.src = data.processed_image;
        processedImg.style.width = '100%';
        processedImg.style.height = 'auto';
        processedImg.style.maxHeight = '80vh';
        processedImg.style.objectFit = 'contain';
        processedImg.style.marginTop = '20px';

        // Clear previous images and add the processed image
        imageDisplay.innerHTML = '';
        imageDisplay.appendChild(processedImg);

        // Hide the buttons container
        buttonsContainer.style.display = 'none';

        // Add "Start Over" and "Add to Database" buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';

        const startOverButton = document.createElement('button');
        startOverButton.textContent = 'Back';
        startOverButton.style.marginRight = '10px';
        startOverButton.style.padding = '10px';
        startOverButton.onclick = function() {
          location.reload();
        };

        const addToDbButton = document.createElement('button');
        addToDbButton.textContent = 'Add to Database';
        addToDbButton.style.padding = '10px';
        addToDbButton.onclick = function() {
          const title = prompt('Enter a title for this image:');
          if (title) {
            fetch('http://127.0.0.1:8000/add_image/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
              },
              body: JSON.stringify({
                title: title,
                image: data.processed_image
              })
            })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                alert('Image added to database successfully!');
                loadImageList();
              } else {
                alert('Failed to add image to database: ' + result.error);
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('Error adding image to database: ' + error.message);
            });
          }
        };

        buttonContainer.appendChild(startOverButton);
        buttonContainer.appendChild(addToDbButton);
        imageDisplay.appendChild(buttonContainer);

        // Add image list container
        const imageListContainer = document.createElement('div');
        imageListContainer.id = 'imageList';
        imageListContainer.style.marginTop = '40px';
        container.appendChild(imageListContainer);

        loadImageList();
      } else {
        console.error('Processing failed:', data.error);
        alert('Processing failed: ' + data.error);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error processing image: ' + error.message);
    })
    .finally(() => {
      // Re-enable the button and reset text
      processButton.disabled = false;
      processButton.textContent = 'Process with SAM2';
    });
  };

function loadImageList() {
  fetch('http://127.0.0.1:8000/get_images/')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        const imageListContainer = document.getElementById('imageList');
        imageListContainer.innerHTML = '<h2>Saved Images</h2>';
        if (data.images.length === 0) {
          imageListContainer.innerHTML += '<p>No images saved yet.</p>';
        } else {
          data.images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.style.marginBottom = '20px';
            imageItem.style.padding = '10px';
            imageItem.style.border = '1px solid #ccc';
            imageItem.style.borderRadius = '5px';

            const img = document.createElement('img');
            img.src = image.image;
            img.style.width = '200px';
            img.style.height = 'auto';
            img.style.marginRight = '10px';

            const title = document.createElement('span');
            title.textContent = image.title;
            title.style.fontWeight = 'bold';

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.style.marginLeft = '10px';
            updateButton.onclick = function() {
              const newTitle = prompt('Enter a new title:', image.title);
              if (newTitle) {
                updateImage(image.id, newTitle);
              }
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.marginLeft = '10px';
            deleteButton.onclick = function() {
              if (confirm('Are you sure you want to delete this image?')) {
                deleteImage(image.id);
              }
            };

            imageItem.appendChild(img);
            imageItem.appendChild(title);
            imageItem.appendChild(updateButton);
            imageItem.appendChild(deleteButton);
            imageListContainer.appendChild(imageItem);
          });
        }
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      const imageListContainer = document.getElementById('imageList');
      imageListContainer.innerHTML = `<p>Error loading image list: ${error.message}</p>`;
    });
}

function updateImage(imageId, newTitle) {
  fetch(`http://127.0.0.1:8000/update_image/${imageId}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ title: newTitle })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      alert('Image updated successfully!');
      loadImageList();
    } else {
      throw new Error(result.error || 'Failed to update image');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error updating image: ' + error.message);
  });
}

function deleteImage(imageId) {
  fetch(`http://127.0.0.1:8000/delete_image/${imageId}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrftoken')
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    if (result.success) {
      alert('Image deleted successfully!');
      loadImageList();
    } else {
      throw new Error(result.error || 'Failed to delete image');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error deleting image: ' + error.message);
  });
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

  // Function to get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
});

