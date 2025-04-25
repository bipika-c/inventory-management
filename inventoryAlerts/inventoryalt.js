document.addEventListener('DOMContentLoaded', function() {
    // Sample data for inventory alerts
    const inventoryData = [
        { sn: 1, itemId: '123456789', itemName: 'Wireless Headphones', alertType: 'Low Stock', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Stock Alert', description: 'Current stock level is below the minimum threshold. Please reorder soon.' },
        { sn: 2, itemId: '234567890', itemName: 'Smart Watch', alertType: 'Damaged', rfid: '2345678901', timeStamp: '2025-02-17 10:15:00', eventName: 'Quality Check', description: 'Item reported damaged during quality inspection. Requires assessment.' },
        { sn: 3, itemId: '345678901', itemName: 'Protein Powder', alertType: 'Expired', rfid: '3456789012', timeStamp: '2025-02-17 11:45:00', eventName: 'Expiry Alert', description: 'Product has reached its expiration date. Remove from inventory.' },
        { sn: 4, itemId: '456789012', itemName: 'Laptop Charger', alertType: 'Damaged', rfid: '4567890123', timeStamp: '2025-02-17 13:20:00', eventName: 'Return Process', description: 'Customer returned item as damaged. Needs inspection.' },
        { sn: 5, itemId: '567890123', itemName: 'Wireless Mouse', alertType: 'Low Stock', rfid: '5678901234', timeStamp: '2025-02-17 14:10:00', eventName: 'Stock Alert', description: 'Only 5 units remaining in stock. Reorder point reached.' },
        { sn: 6, itemId: '678901234', itemName: 'Vitamin Supplements', alertType: 'Expired', rfid: '6789012345', timeStamp: '2025-02-17 15:30:00', eventName: 'Expiry Alert', description: 'Batch expired yesterday. Schedule for disposal.' },
        { sn: 7, itemId: '789012345', itemName: 'USB Cable', alertType: 'Damaged', rfid: '7890123456', timeStamp: '2025-02-17 16:45:00', eventName: 'Warehouse Check', description: 'Package damaged during handling. Contents may be affected.' },
        { sn: 8, itemId: '890123456', itemName: 'Bluetooth Speaker', alertType: 'Low Stock', rfid: '8901234567', timeStamp: '2025-02-17 17:20:00', eventName: 'Stock Alert', description: 'High demand item running low. Expedite next order.' },
        { sn: 9, itemId: '901234567', itemName: 'Face Cream', alertType: 'Expired', rfid: '9012345678', timeStamp: '2025-02-17 18:05:00', eventName: 'Expiry Alert', description: 'Product expired. Remove from sales floor immediately.' }
    ];

    // Keep a copy of the original data for filtering
    let currentData = [...inventoryData];
    
    // Function to populate the table with data
    function populateTable(data) {
        const tableBody = document.querySelector('#inventoryTable tbody');
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Determine the alert type class
            let alertBadgeClass = '';
            if (item.alertType === 'Low Stock') {
                alertBadgeClass = 'alert-low-stock';
            } else if (item.alertType === 'Damaged') {
                alertBadgeClass = 'alert-damaged';
            } else if (item.alertType === 'Expired') {
                alertBadgeClass = 'alert-expired';
            }
            
            row.innerHTML = `
                <td>${item.sn}</td>
                <td>${item.itemId}</td>
                <td>${item.itemName}</td>
                <td><span class="alert-badge ${alertBadgeClass}">${item.alertType}</span></td>
                <td>${item.rfid}</td>
                <td>${item.timeStamp}</td>
                <td>${item.eventName}</td>
                <td><button class="btn-view" data-item-id="${item.itemId}">view</button></td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Update the showing entries text
        document.getElementById('showing-entries').textContent = data.length;
        document.getElementById('total-entries').textContent = inventoryData.length;
    }
    
    // Initial population of the table
    populateTable(inventoryData);
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // Get the currently active filter
        const activeFilter = document.querySelector('.filter-chip.active').getAttribute('data-filter');
        
        // Apply both search and filter
        applySearchAndFilter(searchTerm, activeFilter);
    });
    
    // Filter functionality with chips
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            filterChips.forEach(c => {
                c.classList.remove('active');
                c.classList.remove('active-low-stock');
                c.classList.remove('active-damaged');
                c.classList.remove('active-expired');
            });
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Add specific active class based on filter type
            const filterValue = this.getAttribute('data-filter');
            if (filterValue === 'Low Stock') {
                this.classList.add('active-low-stock');
            } else if (filterValue === 'Damaged') {
                this.classList.add('active-damaged');
            } else if (filterValue === 'Expired') {
                this.classList.add('active-expired');
            }
            
            // Get current search term
            const searchTerm = searchInput.value.toLowerCase();
            
            // Apply both search and filter
            applySearchAndFilter(searchTerm, filterValue);
        });
    });
    
    // Function to apply both search and filter
    function applySearchAndFilter(searchTerm, filterValue) {
        let filteredData = [...inventoryData];
        
        // Apply filter if not "all"
        if (filterValue !== 'all') {
            filteredData = filteredData.filter(item => item.alertType === filterValue);
        }
        
        // Apply search if there's a search term
        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.itemId.toLowerCase().includes(searchTerm) ||
                item.itemName.toLowerCase().includes(searchTerm) ||
                item.rfid.toLowerCase().includes(searchTerm) ||
                item.eventName.toLowerCase().includes(searchTerm)
            );
        }
        
        // Update current data and populate table
        currentData = filteredData;
        populateTable(filteredData);
    }
    
    // View button functionality - Open modal with item details
    document.querySelector('#inventoryTable').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-view')) {
            const itemId = e.target.getAttribute('data-item-id');
            const item = inventoryData.find(item => item.itemId === itemId);
            
            if (item) {
                // Populate modal with item details
                document.getElementById('modal-item-id').textContent = item.itemId;
                document.getElementById('modal-item-name').textContent = item.itemName;
                
                // Set alert type with appropriate badge
                const alertTypeElement = document.getElementById('modal-alert-type');
                let alertBadgeClass = '';
                if (item.alertType === 'Low Stock') {
                    alertBadgeClass = 'alert-low-stock';
                } else if (item.alertType === 'Damaged') {
                    alertBadgeClass = 'alert-damaged';
                } else if (item.alertType === 'Expired') {
                    alertBadgeClass = 'alert-expired';
                }
                alertTypeElement.innerHTML = `<span class="alert-badge ${alertBadgeClass}">${item.alertType}</span>`;
                
                document.getElementById('modal-rfid').textContent = item.rfid;
                document.getElementById('modal-timestamp').textContent = item.timeStamp;
                document.getElementById('modal-event-name').textContent = item.eventName;
                document.getElementById('modal-description').textContent = item.description;
                
                // Show the modal
                const modal = new bootstrap.Modal(document.getElementById('itemDetailsModal'));
                modal.show();
            }
        }
    });
    
    // Pagination functionality (simplified for demo)
    document.querySelector('.pagination').addEventListener('click', function(e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();
            
            // Remove active class from all page items
            document.querySelectorAll('.page-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked page item
            e.target.closest('.page-item').classList.add('active');
            
            // In a real application, this would load the appropriate page of data
        }
    });
});