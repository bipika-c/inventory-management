// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize filter panel
    initializeFilters();
});

// Toggle sidebar on mobile
document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    
    if (window.innerWidth <= 768 && 
        !sidebar.contains(event.target) && 
        !toggleBtn.contains(event.target) && 
        sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
});

// Add active class to current nav item
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
});

// Table search functionality
const tableSearch = document.getElementById('tableSearch');
if (tableSearch) {
    tableSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        updateVisibleItemsCount();
    });
}

// View button functionality
const viewButtons = document.querySelectorAll('.view-btn');
viewButtons.forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const itemName = row.cells[1].textContent;
        const statusElement = row.cells[2].querySelector('.status-badge');
        const status = statusElement ? statusElement.textContent : '';
        const category = row.cells[3].textContent;
        const location = row.cells[4].textContent;
        const rfid = row.cells[5].textContent;
        const timestamp = row.cells[6].textContent;
        
        // Update modal content
        document.getElementById('modalItemName').textContent = itemName;
        document.getElementById('modalStatus').textContent = status;
        document.getElementById('modalCategory').textContent = category;
        document.getElementById('modalLocation').textContent = location;
        document.getElementById('modalRfid').textContent = rfid;
        document.getElementById('modalTimestamp').textContent = timestamp;
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('itemDetailsModal'));
        modal.show();
    });
});

// Edit button functionality
const editButtons = document.querySelectorAll('.edit-btn');
editButtons.forEach(button => {
    button.addEventListener('click', function() {
        const row = this.closest('tr');
        const itemName = row.cells[1].textContent;
        
        // Show a toast notification
        showToast(`Editing ${itemName}`, 'Edit functionality would open a form here.');
    });
});

// Function to show toast notifications
function showToast(title, message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    // Add toast to container
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Initialize and show the toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 5000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

// Add animation to status badges
const statusBadges = document.querySelectorAll('.status-badge');
statusBadges.forEach(badge => {
    badge.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    badge.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('show');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading state
    const contentBody = document.querySelector('.content-body');
    if (contentBody) {
        contentBody.style.opacity = '0.6';
        contentBody.style.pointerEvents = 'none';
        
        // Simulate data loading
        setTimeout(() => {
            contentBody.style.opacity = '1';
            contentBody.style.pointerEvents = 'auto';
            contentBody.style.transition = 'opacity 0.3s ease';
        }, 500);
    }
});

// Filter Panel Functionality
function initializeFilters() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterPanel = document.getElementById('filterPanel');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const dateFilter = document.getElementById('dateFilter');
    const customDateRange = document.getElementById('customDateRange');
    
    // Toggle filter panel
    filterToggleBtn.addEventListener('click', function() {
        filterPanel.classList.toggle('show');
    });
    
    // Show/hide custom date range based on date filter selection
    dateFilter.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
        }
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        const statusFilter = document.getElementById('statusFilter').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        const locationFilter = document.getElementById('locationFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        // Apply filters to table rows
        const tableRows = document.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        tableRows.forEach(row => {
            let showRow = true;
            
            // Status filter
            if (statusFilter && statusFilter !== '') {
                const statusCell = row.cells[2].querySelector('.status-badge');
                const statusText = statusCell ? statusCell.textContent : '';
                if (statusText !== statusFilter) {
                    showRow = false;
                }
            }
            
            // Category filter
            if (categoryFilter && categoryFilter !== '') {
                const categoryText = row.cells[3].textContent;
                if (categoryText !== categoryFilter) {
                    showRow = false;
                }
            }
            
            // Location filter
            if (locationFilter && locationFilter !== '') {
                const locationText = row.cells[4].textContent;
                if (locationText !== locationFilter) {
                    showRow = false;
                }
            }
            
            // Date filter (simplified for demo)
            if (dateFilter && dateFilter !== '' && dateFilter !== 'custom') {
                // In a real application, you would parse the date and apply proper filtering
                // This is just a placeholder for demonstration
            }
            
            // Custom date range
            if (dateFilter === 'custom') {
                const dateFrom = document.getElementById('dateFrom').value;
                const dateTo = document.getElementById('dateTo').value;
                
                if (dateFrom && dateTo) {
                    // In a real application, you would parse the date and apply proper filtering
                    // This is just a placeholder for demonstration
                }
            }
            
            // Show or hide row based on filters
            if (showRow) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Update active filters badge
        updateActiveFiltersBadge();
        
        // Update visible items count
        document.getElementById('visibleItems').textContent = visibleCount;
        
        // Show toast notification
        showToast('Filters Applied', `Showing ${visibleCount} items that match your filters.`);
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', function() {
        // Reset all filter dropdowns
        document.getElementById('statusFilter').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('locationFilter').value = '';
        document.getElementById('dateFilter').value = '';
        
        // Hide custom date range
        customDateRange.style.display = 'none';
        
        // Show all rows
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            row.style.display = '';
        });
        
        // Update active filters badge
        document.getElementById('activeFilters').textContent = '';
        
        // Update visible items count
        const totalItems = tableRows.length;
        document.getElementById('visibleItems').textContent = totalItems;
        
        // Show toast notification
        showToast('Filters Reset', 'All filters have been cleared.');
    });
}

// Update active filters badge
function updateActiveFiltersBadge() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    let activeFiltersCount = 0;
    
    if (statusFilter && statusFilter !== '') activeFiltersCount++;
    if (categoryFilter && categoryFilter !== '') activeFiltersCount++;
    if (locationFilter && locationFilter !== '') activeFiltersCount++;
    if (dateFilter && dateFilter !== '') activeFiltersCount++;
    
    const activeFiltersBadge = document.getElementById('activeFilters');
    
    if (activeFiltersCount > 0) {
        activeFiltersBadge.textContent = `${activeFiltersCount} active filter${activeFiltersCount > 1 ? 's' : ''}`;
    } else {
        activeFiltersBadge.textContent = '';
    }
}

// Update visible items count
function updateVisibleItemsCount() {
    const tableRows = document.querySelectorAll('tbody tr');
    let visibleCount = 0;
    
    tableRows.forEach(row => {
        if (row.style.display !== 'none') {
            visibleCount++;
        }
    });
    
    document.getElementById('visibleItems').textContent = visibleCount;
}



