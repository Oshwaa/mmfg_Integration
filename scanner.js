document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const qrModal = document.getElementById('qrModal'); 
    const responseModal = document.getElementById('responseModal');
    const openModalBtn = document.getElementById('openModalBtn'); 
    const qrInput = document.getElementById('qrInput'); 
    const responseMessage = document.getElementById('responseMessage'); 

    let qrCodeBuffer = ''; 
    let processing = false; 
    const bufferFlushInterval = 100; 


    openModalBtn.onclick = function() {
        qrModal.style.display = 'flex';
        qrInput.focus(); 
    }

    // Function to close both modals
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
            sendQRCode(qrCodeBuffer);
            qrCodeBuffer = '';
            qrModal.style.display = 'none'; 
        }
        processing = false; 
    }

    function sendQRCode(qrCode) {
        fetch('http://localhost:3000/api/member/scan', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ qrCode })
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

    qrInput.addEventListener('blur', function() {
        qrModal.style.display = 'none'; 
    });
});
