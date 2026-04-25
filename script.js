const input = document.getElementById('qr-input');
const generateBtn = document.getElementById('generate-btn');
const qrContainer = document.getElementById('qr-container');
const qrCode = document.getElementById('qr-code');
const downloadBtn = document.getElementById('download-btn');
const errorMessage = document.getElementById('error-message');

// QR Code API endpoint
const QR_API_URL = 'https://api.qrserver.com/v1/create-qr-code/';

function validateInput(text) {
    if (!text || text.trim() === '') {
        return { valid: false, message: 'Please enter some text or a URL' };
    }
    if (text.length > 2000) {
        return { valid: false, message: 'Input is too long (max 2000 characters)' };
    }
    return { valid: true, message: '' };
}

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = '';
}

function generateQRCode() {
    const text = input.value;
    const validation = validateInput(text);
    
    if (!validation.valid) {
        showError(validation.message);
        qrContainer.classList.remove('active');
        downloadBtn.classList.remove('active');
        return;
    }
    
    clearError();
    
    // Build API URL with parameters
    const params = new URLSearchParams({
        data: text,
        size: '200x200',
        format: 'png',
        margin: 10
    });
    
    const qrUrl = `${QR_API_URL}?${params.toString()}`;
    
    // Update QR code image
    qrCode.src = qrUrl;
    qrContainer.classList.add('active');
    downloadBtn.classList.add('active');
}

function downloadQRCode() {
    const text = input.value.trim();
    if (!text) return;
    
    // Create a larger version for download
    const params = new URLSearchParams({
        data: text,
        size: '400x400',
        format: 'png',
        margin: 10
    });
    
    const downloadUrl = `${QR_API_URL}?${params.toString()}`;
    
    // Fetch and download the image
    fetch(downloadUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch(() => {
            showError('Failed to download QR code');
        });
}

// Event listeners
generateBtn.addEventListener('click', generateQRCode);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQRCode();
    }
});

input.addEventListener('input', clearError);

downloadBtn.addEventListener('click', downloadQRCode);
