document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const qrModal = document.getElementById('qrModal'); // Modal for QR code input
    const responseModal = document.getElementById('responseModal'); // Modal for server response
    const openModalBtn = document.getElementById('openModalBtn'); // Button to open QR code modal
    const qrInput = document.getElementById('qrInput'); // Hidden input field for QR code
    const responseMessage = document.getElementById('responseMessage'); // Element to display server response

    let qrCodeBuffer = ''; // Buffer to temporarily store QR code data
    let processing = false; // Flag to prevent multiple processing
    const bufferFlushInterval = 100; // Time interval to flush the buffer

    // Open the QR code modal and focus the input field
    openModalBtn.onclick = function() {
        qrModal.style.display = 'flex'; // Show the QR code modal
        qrInput.focus(); // Focus on the hidden QR code input field
    }

    // Function to close both modals
    const closeModals = function() {
        qrModal.style.display = 'none'; // Hide the QR code modal
        responseModal.style.display = 'none'; // Hide the response modal
    }

    // Attach event listeners to close modals when clicking on the close button
    const closeModalElements = document.getElementsByClassName('close');
    Array.from(closeModalElements).forEach(element => {
        element.onclick = closeModals; // Close modal when close button is clicked
    });

    // Close modals when clicking outside of them
    window.onclick = function(event) {
        if (event.target == qrModal || event.target == responseModal) {
            closeModals(); // Close modal when clicking outside
        }
    }

    // Handle QR code input and buffer the data for processing
    qrInput.addEventListener('input', function() {
        qrCodeBuffer += qrInput.value; // Append the input value to the buffer
        qrInput.value = ''; // Clear the input field for the next batch
        if (!processing) {
            processing = true;
            setTimeout(processBuffer, bufferFlushInterval); // Process buffer after a short delay
        }
    });

    // Function to process the QR code buffer
    function processBuffer() {
        if (qrCodeBuffer) {
            sendQRCode(qrCodeBuffer); // Send the QR code data to the server
            qrCodeBuffer = ''; // Clear buffer after processing
            qrModal.style.display = 'none'; // Close the QR code modal
        }
        processing = false; // Reset processing flag to allow further processing
    }

    // Function to send the QR code data to the server
    function sendQRCode(qrCode) {
        fetch('http://localhost:3000/api/member/scan', {
            method: 'POST', // Use POST method for submitting data
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({ qrCode }) // Convert QR code data to JSON format
        })
        .then(response => response.json()) // Ensure server response is in JSON format
        .then(data => {
            console.log('Success:', data); // Log success message to console
            responseMessage.textContent = `Server Response: ${JSON.stringify(data)}`; // Display server response
            responseModal.style.display = 'flex'; // Show the response modal
        })
        .catch((error) => {
            console.error('Error:', error); // Log error message to console
            responseMessage.textContent = `Error: ${error}`; // Display error message
            responseModal.style.display = 'flex'; // Show the response modal
        });
    }

    // Close the QR code modal when the input field loses focus
    qrInput.addEventListener('blur', function() {
        qrModal.style.display = 'none'; // Hide the QR code modal on blur
    });
});
