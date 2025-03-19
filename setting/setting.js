// Toggle Alert Options
const stockAlertToggle = document.getElementById('stockAlertToggle');
const alertOptions = document.querySelector('.alert-options');

stockAlertToggle.addEventListener('change', function() {
    if (this.checked) {
        alertOptions.style.display = 'block';
    } else {
        alertOptions.style.display = 'none';
    }
});

// Toggle Notification Options
const notificationToggle = document.getElementById('notificationToggle');
const notificationOptions = document.querySelector('.notification-options');

notificationToggle.addEventListener('change', function() {
    if (this.checked) {
        notificationOptions.style.display = 'block';
    } else {
        notificationOptions.style.display = 'none';
    }
});

// Toggle Backup Options
const backupToggle = document.getElementById('backupToggle');
const backupOptions = document.querySelector('.backup-options');

backupToggle.addEventListener('change', function() {
    if (this.checked) {
        backupOptions.style.display = 'block';
    } else {
        backupOptions.style.display = 'none';
    }
});

// Backup Now Button
const backupNowBtn = document.getElementById('backupNowBtn');
const backupProgress = document.getElementById('backupProgress');

backupNowBtn.addEventListener('click', function() {
    // Show progress bar
    backupProgress.classList.remove('d-none');
    const progressBar = backupProgress.querySelector('.progress-bar');
    
    // Simulate backup progress
    let progress = 0;
    const interval = setInterval(function() {
        progress += 10;
        progressBar.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
        
        if (progress >= 100) {
            clearInterval(interval);
            // Show success message
            setTimeout(function() {
                backupProgress.classList.add('d-none');
                alert('Backup completed successfully!');
            }, 500);
        }
    }, 300);
});

// Add animation when cards are in viewport
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.settings-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
        }, 100 * index);
    });
});