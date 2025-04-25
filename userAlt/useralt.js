document.addEventListener('DOMContentLoaded', function() {
    // Sample data for employee alerts
    const alertData = [
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Pending Approval', timeStamp: '2025-02-17 09:30:00', alertCount: 12, resolvedAt: 'NULL', description: 'Employee account pending approval from administrator.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Role Update', timeStamp: '2025-02-17 09:30:00', alertCount: 2, resolvedAt: '2025-02-17 11:00:00', description: 'Employee role has been updated in the system.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Login Attempt', timeStamp: '2025-02-17 09:30:00', alertCount: 12, resolvedAt: '2025-02-17 11:00:00', description: 'Multiple login attempts detected for this employee.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Login Attempt', timeStamp: '2025-02-17 09:30:00', alertCount: 34, resolvedAt: '2025-02-17 11:00:00', description: 'Multiple login attempts detected for this employee.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Role Update', timeStamp: '2025-02-17 09:30:00', alertCount: 22, resolvedAt: '2025-02-17 11:00:00', description: 'Employee role has been updated in the system.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Pending Approval', timeStamp: '2025-02-17 09:30:00', alertCount: 11, resolvedAt: 'NULL', description: 'Employee account pending approval from administrator.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Login Attempt', timeStamp: '2025-02-17 09:30:00', alertCount: 42, resolvedAt: '2025-02-17 11:00:00', description: 'Multiple login attempts detected for this employee.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Pending Approval', timeStamp: '2025-02-17 09:30:00', alertCount: 12, resolvedAt: 'NULL', description: 'Employee account pending approval from administrator.' },
        { sn: 1, name: 'Name', employeeId: '1234567890', alertType: 'Role Update', timeStamp: '2025-02-17 09:30:00', alertCount: 12, resolvedAt: '2025-02-17 11:00:00', description: 'Employee role has been updated in the system.' }
    ];

    // Keep a copy of the original data for filtering
    let currentData = [...alertData];
    
    // Function to populate the table with data
    function populateTable(data) {
        const tableBody = document.querySelector('#inventoryTable tbody');
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            // Determine the alert type class
            let alertBadgeClass = '';
            if (item.alertType === 'Pending Approval') {
                alertBadgeClass = 'alert-pending';
            } else if (item.alertType === 'Role Update') {
                alertBadgeClass = 'alert-role';
            } else if (item.alertType === 'Login Attempt') {
                alertBadgeClass = 'alert-login';
            }
            
            // Format the resolved at value
            const resolvedAtDisplay = item.resolvedAt === 'NULL' ? 
                '<span class="null-value">NULL</span>' : 
                item.resolvedAt;
            
            row.innerHTML = `
                <td>${item.sn}</td>
                <td>${item.name}</td>
                <td>${item.employeeId}</td>
                <td><span class="alert-badge ${alertBadgeClass}">${item.alertType}</span></td>
                <td>${item.timeStamp}</td>
                <td>${item.alertCount}</td>
                <td>${resolvedAtDisplay}</td>
                <td><button class="btn-view" data-employee-id="${item.employeeId}" data-alert-type="${item.alertType}">view</button></td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Update the showing entries text
        document.getElementById('showing-entries').textContent = data.length;
        document.getElementById('total-entries').textContent = alertData.length;
    }
    
    // Initial population of the table
    populateTable(alertData);
    
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
                c.classList.remove('active-pending');
                c.classList.remove('active-role');
                c.classList.remove('active-login');
            });
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Add specific active class based on filter type
            const filterValue = this.getAttribute('data-filter');
            if (filterValue === 'Pending Approval') {
                this.classList.add('active-pending');
            } else if (filterValue === 'Role Update') {
                this.classList.add('active-role');
            } else if (filterValue === 'Login Attempt') {
                this.classList.add('active-login');
            }
            
            // Get current search term
            const searchTerm = searchInput.value.toLowerCase();
            
            // Apply both search and filter
            applySearchAndFilter(searchTerm, filterValue);
        });
    });
    
    // Function to apply both search and filter
    function applySearchAndFilter(searchTerm, filterValue) {
        let filteredData = [...alertData];
        
        // Apply filter if not "all"
        if (filterValue !== 'all') {
            filteredData = filteredData.filter(item => item.alertType === filterValue);
        }
        
        // Apply search if there's a search term
        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.employeeId.toLowerCase().includes(searchTerm) ||
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
            const employeeId = e.target.getAttribute('data-employee-id');
            const alertType = e.target.getAttribute('data-alert-type');
            const item = alertData.find(item => 
                item.employeeId === employeeId && 
                item.alertType === alertType
            );
            
            if (item) {
                // Populate modal with item details
                document.getElementById('modal-name').textContent = item.name;
                document.getElementById('modal-employee-id').textContent = item.employeeId;
                
                // Set alert type with appropriate badge
                const alertTypeElement = document.getElementById('modal-alert-type');
                let alertBadgeClass = '';
                if (item.alertType === 'Pending Approval') {
                    alertBadgeClass = 'alert-pending';
                } else if (item.alertType === 'Role Update') {
                    alertBadgeClass = 'alert-role';
                } else if (item.alertType === 'Login Attempt') {
                    alertBadgeClass = 'alert-login';
                }
                alertTypeElement.innerHTML = `<span class="alert-badge ${alertBadgeClass}">${item.alertType}</span>`;
                
                document.getElementById('modal-alert-count').textContent = item.alertCount;
                document.getElementById('modal-timestamp').textContent = item.timeStamp;
                
                // Format the resolved at value
                const resolvedAtElement = document.getElementById('modal-resolved-at');
                if (item.resolvedAt === 'NULL') {
                    resolvedAtElement.innerHTML = '<span class="null-value">NULL</span>';
                } else {
                    resolvedAtElement.textContent = item.resolvedAt;
                }
                
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