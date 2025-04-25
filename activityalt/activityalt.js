document.addEventListener('DOMContentLoaded', function() {
    // Sample data for inventory alerts
    const inventoryData = [
        { sn: 1, itemName: 'Laptop', alertType: 'Missing Item', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item is missing from inventory. Last seen in Warehouse A.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Incomplete', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item has incomplete information in the system.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Missing Item', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item is missing from inventory. Last seen in Warehouse B.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Movement', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Unauthorized movement detected for this item.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Incomplete', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item has incomplete information in the system.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Missing Item', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item is missing from inventory. Last seen in Warehouse C.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Movement', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Unauthorized movement detected for this item.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Incomplete', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item has incomplete information in the system.' },
        { sn: 1, itemName: 'Laptop', alertType: 'Incomplete', rfid: '1234567890', timeStamp: '2025-02-17 09:30:00', eventName: 'Alert', description: 'Item has incomplete information in the system.' }
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
            if (item.alertType === 'Missing Item') {
                alertBadgeClass = 'alert-missing';
            } else if (item.alertType === 'Incomplete') {
                alertBadgeClass = 'alert-incomplete';
            } else if (item.alertType === 'Movement') {
                alertBadgeClass = 'alert-movement';
            }
            
            row.innerHTML = `
                <td>${item.sn}</td>
                <td>${item.itemName}</td>
                <td>${item.rfid}</td>
                <td><span class="alert-badge ${alertBadgeClass}">${item.alertType}</span></td>
                <td>${item.timeStamp}</td>
                <td><button class="btn-view" data-item-name="${item.itemName}">view</button></td>
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
                c.classList.remove('active-missing');
                c.classList.remove('active-incomplete');
                c.classList.remove('active-movement');
            });
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Add specific active class based on filter type
            const filterValue = this.getAttribute('data-filter');
            if (filterValue === 'Missing Item') {
                this.classList.add('active-missing');
            } else if (filterValue === 'Incomplete') {
                this.classList.add('active-incomplete');
            } else if (filterValue === 'Movement') {
                this.classList.add('active-movement');
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
                item.itemName.toLowerCase().includes(searchTerm) ||
                item.rfid.toLowerCase().includes(searchTerm) ||
                item.alertType.toLowerCase().includes(searchTerm) ||
                item.timeStamp.toLowerCase().includes(searchTerm)
            );
        }
        
        // Update current data and populate table
        currentData = filteredData;
        populateTable(filteredData);
    }
    
    // View button functionality - Open modal with item details
    document.querySelector('#inventoryTable').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-view')) {
            const itemName = e.target.getAttribute('data-item-name');
            const item = inventoryData.find(item => item.itemName === itemName);
            
            if (item) {
                // Populate modal with item details
                document.getElementById('modal-item-name').textContent = item.itemName;
                
                // Set alert type with appropriate badge
                const alertTypeElement = document.getElementById('modal-alert-type');
                let alertBadgeClass = '';
                if (item.alertType === 'Missing Item') {
                    alertBadgeClass = 'alert-missing';
                } else if (item.alertType === 'Incomplete') {
                    alertBadgeClass = 'alert-incomplete';
                } else if (item.alertType === 'Movement') {
                    alertBadgeClass = 'alert-movement';
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