 // This script adds interactivity to the dashboard
 document.addEventListener('DOMContentLoaded', function() {
    // Get all process buttons
    const processButtons = document.querySelectorAll('.btn-process');
    
    // Add click event to each button
    processButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the count from the button text
            const countText = this.textContent;
            const count = parseInt(countText);
            
            if (count > 0) {
                // Show alert with the count
                alert(`Processing ${count} items. This would open the processing interface.`);
            } else {
                // Show message for zero items
                alert('No items to process at this time.');
            }
        });
    });
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'transform 0.3s ease';
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Initialize tooltips if needed
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});