document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const qrModal = document.getElementById('qrModal'); // QR code input modal
    const responseModal = document.getElementById('responseModal'); // Response modal
    const openModalBtn = document.getElementById('openModalBtn'); // Button to open QR code modal
    const qrInput = document.getElementById('qrInput'); // Hidden input for QR code
    const expiryDateInput = document.getElementById('expiryDate'); // Input for expiry date
    const amountInput = document.getElementById('amount'); // Input for amount
    const responseMessage = document.getElementById('responseMessage'); // Element to show server response

    let qrCodeBuffer = ''; // Buffer to store QR code data temporarily
    let processing = false; // Flag to check if buffer is being processed
    const bufferFlushInterval = 100; // Interval to flush the buffer

    // Open QR code modal and focus the hidden input
    openModalBtn.onclick = function() {
        qrModal.style.display = 'flex';
        qrInput.focus();
    }

    // Function to close both modals
    const closeModals = function() {
        qrModal.style.display = 'none';
        responseModal.style.display = 'none';
    }

    // Attach event listeners to close modals when clicking on the close button
    const closeModalElements = document.getElementsByClassName('close');
    Array.from(closeModalElements).forEach(element => {
        element.onclick = closeModals;
    });

    // Close modals when clicking outside of them
    window.onclick = function(event) {
        if (event.target == qrModal || event.target == responseModal) {
            closeModals();
        }
    }

    // Handle QR code input, buffer the data, and process it after a delay
    qrInput.addEventListener('input', function() {
        qrCodeBuffer += qrInput.value;
        qrInput.value = ''; // Clear input field for next batch
        if (!processing) {
            processing = true;
            setTimeout(processBuffer, bufferFlushInterval);
        }
    });

    // Process the QR code buffer
    function processBuffer() {
        if (qrCodeBuffer) {
            const expiryDate = expiryDateInput.value; // Get expiry date in YYYY-MM-DD format
            const amount = amountInput.value; // Get amount
            sendQRCode(qrCodeBuffer, expiryDate, amount);
            qrCodeBuffer = ''; // Clear buffer after processing
            qrModal.style.display = 'none'; // Close QR code modal
        }
        processing = false; // Allow further processing
    }

    // Send the QR code data, expiry date, and amount to the server
    function sendQRCode(qrCode, expiry_date, amount) {
        fetch(`http://localhost:3000/api/member/extend/${qrCode}`, {
            method: 'PUT', // Use PUT method for updating
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                qrCode,
                expiry_date,
                amount
            })
        })
        .then(response => response.json()) // Ensure server responds with JSON
        .then(data => {
            console.log('Success:', data);
            responseMessage.textContent = `Server Response: ${JSON.stringify(data)}`;
            responseModal.style.display = 'flex'; // Show response modal
        })
        .catch((error) => {
            console.error('Error:', error);
            responseMessage.textContent = `Error: ${error}`;
            responseModal.style.display = 'flex'; // Show response modal
        });
    }

    // Close the QR code modal when the input loses focus
    qrInput.addEventListener('blur', function() {
        qrModal.style.display = 'none'; // Close QR code modal on blur
    });
});
