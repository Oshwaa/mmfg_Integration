document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const qrModal = document.getElementById('qrModal'); 
    const responseModal = document.getElementById('responseModal'); 
    const openModalBtn = document.getElementById('openModalBtn'); 
    const qrInput = document.getElementById('qrInput'); 
    const expiryDateInput = document.getElementById('expiryDate'); 
    const amountInput = document.getElementById('amount'); 
    const responseMessage = document.getElementById('responseMessage'); 

    let qrCodeBuffer = '';
    let processing = false; //wag alisin buffer
    const bufferFlushInterval = 100; // Interval to flush the buffer

   
    openModalBtn.onclick = function() {
        qrModal.style.display = 'flex';
        qrInput.focus();
    }

 
    const closeModals = function() {
        qrModal.style.display = 'none';
        responseModal.style.display = 'none';
    }

  
    const closeModalElements = document.getElementsByClassName('close');
    Array.from(closeModalElements).forEach(element => {
        element.onclick = closeModals;
    });

   
    window.onclick = function(event) {
        if (event.target == qrModal || event.target == responseModal) {
            closeModals();
        }
    }

 
    qrInput.addEventListener('input', function() {
        qrCodeBuffer += qrInput.value;
        qrInput.value = '';
        if (!processing) {
            processing = true;
            setTimeout(processBuffer, bufferFlushInterval);
        }
    });

    function processBuffer() {
        if (qrCodeBuffer) {
            const expiryDate = expiryDateInput.value; //YYYY-MM-DD format
            const amount = amountInput.value; 
            sendQRCode(qrCodeBuffer, expiryDate, amount);
            qrCodeBuffer = ''; 
            qrModal.style.display = 'none'; 
        }
        processing = false;
    }

    // Send the QR code data, expiry date, and amount to the server
    function sendQRCode(qrCode, expiry_date, amount) {
        fetch(`http://localhost:3000/api/member/extend/${qrCode}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                qrCode,
                expiry_date,
                amount
            })
        })
        .then(response => response.json()) 
        .then(data => {
            console.log('Success:', data);
            responseMessage.textContent = `Server Response: ${JSON.stringify(data)}`;
            responseModal.style.display = 'flex'; 
        })
        .catch((error) => {
            console.error('Error:', error);
            responseMessage.textContent = `Error: ${error}`;
            responseModal.style.display = 'flex'; 
        });
    }

    // Close the QR code modal when the input loses focus
    qrInput.addEventListener('blur', function() {
        qrModal.style.display = 'none';
    });
});
