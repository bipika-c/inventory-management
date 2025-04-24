// Sample data for the inventory table
const inventoryItems = [
    { id: "ITM001", name: "Laptop", quantity: 15, price: 1299.99, category: "Electronics" },
    { id: "ITM002", name: "T-Shirt", quantity: 50, price: 24.99, category: "Clothing" },
    { id: "ITM003", name: "Coffee Maker", quantity: 8, price: 89.99, category: "Electronics" },
    { id: "ITM004", name: "Headphones", quantity: 25, price: 149.99, category: "Electronics" },
    { id: "ITM005", name: "Desk Chair", quantity: 12, price: 199.99, category: "Furniture" },
    { id: "ITM006", name: "Smartphone", quantity: 20, price: 899.99, category: "Electronics" },
    { id: "ITM007", name: "Notebook", quantity: 100, price: 4.99, category: "Books" },
    { id: "ITM008", name: "Water Bottle", quantity: 40, price: 14.99, category: "Other" },
    { id: "ITM009", name: "Backpack", quantity: 30, price: 49.99, category: "Clothing" },
];

// Initialize Bootstrap modals
let viewModal, editModal, deleteModal, addModal;

// Current item index for edit/delete operations
let currentItemIndex = -1;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Bootstrap modals
    viewModal = new bootstrap.Modal(document.getElementById("viewItemModal"));
    editModal = new bootstrap.Modal(document.getElementById("editItemModal"));
    deleteModal = new bootstrap.Modal(document.getElementById("deleteConfirmModal"));
    addModal = new bootstrap.Modal(document.getElementById("addItemModal"));

    // Populate the table with initial data
    populateTable();

    // Add event listeners
    document.getElementById("searchInput").addEventListener("keyup", searchItems);
    document.getElementById("addInventoryBtn").addEventListener("click", () => {
        document.getElementById("addItemForm").reset();
        addModal.show();
    });
    document.getElementById("saveEditBtn").addEventListener("click", saveEditedItem);
    document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete);
    document.getElementById("saveNewItemBtn").addEventListener("click", addNewItem);

    // Toggle sidebar on mobile
    const toggleSidebar = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener("click", () => {
            sidebar.classList.toggle("show");
        });
    }

    // Show welcome toast
    showToast("Welcome", "Inventory Management System is ready to use", "info");
});

// Function to populate the table with data
function populateTable() {
    const tableBody = document.getElementById("inventoryTableBody");
    tableBody.innerHTML = "";

    if (inventoryItems.length === 0) {
        // Show empty state
        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="bi bi-inbox empty-state-icon"></i>
                        <h4 class="empty-state-title">No items found</h4>
                        <p class="empty-state-description">Add your first inventory item to get started.</p>
                        <button class="btn btn-primary" id="emptyStateAddBtn">
                            <i class="bi bi-plus-lg me-1"></i>
                            Add Item
                        </button>
                    </div>
                </td>
            </tr>
        `;
        
        document.getElementById("emptyStateAddBtn").addEventListener("click", () => {
            document.getElementById("addItemForm").reset();
            addModal.show();
        });
        
        return;
    }

    inventoryItems.forEach((item, index) => {
        const row = document.createElement("tr");
        
        // Determine stock status badge
        let stockStatus = '';
        if (typeof item.quantity === 'number') {
            if (item.quantity > 10) {
                stockStatus = '<span class="badge badge-in-stock"><i class="bi bi-check-circle-fill me-1"></i>In Stock</span>';
            } else if (item.quantity > 0) {
                stockStatus = '<span class="badge badge-low-stock"><i class="bi bi-exclamation-circle-fill me-1"></i>Low Stock</span>';
            } else {
                stockStatus = '<span class="badge badge-out-of-stock"><i class="bi bi-x-circle-fill me-1"></i>Out of Stock</span>';
            }
        }
        
        // Format price
        const formattedPrice = typeof item.price === 'number' ? 
            `$${item.price.toFixed(2)}` : item.price;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="fw-medium">${item.id}</span></td>
            <td><span class="fw-medium">${item.name}</span></td>
            <td>${item.quantity}</td>
            <td>${formattedPrice}</td>
            <td>${stockStatus}</td>
            <td>
                <div class="action-btn-group">
                    <button class="action-btn view-btn" data-index="${index}" title="View details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-index="${index}" title="Edit item">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn delete-btn" data-index="${index}" title="Delete item">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners to the action buttons
    addButtonEventListeners();
}

// Function to add event listeners to the action buttons
function addButtonEventListeners() {
    // View button event listeners
    document.querySelectorAll(".view-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            viewItem(index);
        });
    });

    // Edit button event listeners
    document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            editItem(index);
        });
    });

    // Delete button event listeners
    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            deleteItem(index);
        });
    });
}

// Function to view item details
function viewItem(index) {
    const item = inventoryItems[index];
    const detailsContainer = document.getElementById("viewItemDetails");

    // Determine stock status
    let stockStatusClass = 'badge-in-stock';
    let stockStatusText = 'In Stock';
    let stockIcon = 'check-circle-fill';
    
    if (typeof item.quantity === 'number') {
        if (item.quantity <= 0) {
            stockStatusClass = 'badge-out-of-stock';
            stockStatusText = 'Out of Stock';
            stockIcon = 'x-circle-fill';
        } else if (item.quantity <= 10) {
            stockStatusClass = 'badge-low-stock';
            stockStatusText = 'Low Stock';
            stockIcon = 'exclamation-circle-fill';
        }
    }

    // Format price
    const formattedPrice = typeof item.price === 'number' ? 
        `$${item.price.toFixed(2)}` : item.price;
    
    // Calculate total value
    const totalValue = (item.quantity * item.price).toFixed(2);

    detailsContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="card-title mb-0 fw-bold">${item.name}</h5>
                    <span class="badge ${stockStatusClass}">
                        <i class="bi bi-${stockIcon} me-1"></i>
                        ${stockStatusText}
                    </span>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                        <i class="bi bi-upc text-primary"></i>
                                    </div>
                                    <div>
                                        <div class="text-muted small">Item ID</div>
                                        <div class="fw-medium">${item.id}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                        <i class="bi bi-tag text-primary"></i>
                                    </div>
                                    <div>
                                        <div class="text-muted small">Category</div>
                                        <div class="fw-medium">${item.category}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                        <i class="bi bi-boxes text-primary"></i>
                                    </div>
                                    <div>
                                        <div class="text-muted small">Quantity</div>
                                        <div class="fw-medium">${item.quantity} units</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                                        <i class="bi bi-currency-dollar text-primary"></i>
                                    </div>
                                    <div>
                                        <div class="text-muted small">Unit Price</div>
                                        <div class="fw-medium">${formattedPrice}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card bg-primary text-white">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="opacity-75 small">Total Value</div>
                                <div class="fs-4 fw-bold">$${totalValue}</div>
                            </div>
                            <i class="bi bi-cash-coin fs-1 opacity-25"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    viewModal.show();
}

// Function to prepare edit item form
function editItem(index) {
    currentItemIndex = index;
    const item = inventoryItems[index];

    document.getElementById("editItemIndex").value = index;
    document.getElementById("editItemId").value = item.id;
    document.getElementById("editItemName").value = item.name;
    document.getElementById("editQuantity").value = item.quantity;
    document.getElementById("editPrice").value = item.price;
    document.getElementById("editCategory").value = item.category;

    editModal.show();
}

// Function to save edited item
function saveEditedItem() {
    const index = parseInt(document.getElementById("editItemIndex").value);

    if (index >= 0 && index < inventoryItems.length) {
        const oldItem = {...inventoryItems[index]};
        
        inventoryItems[index] = {
            id: document.getElementById("editItemId").value,
            name: document.getElementById("editItemName").value,
            quantity: parseInt(document.getElementById("editQuantity").value),
            price: parseFloat(document.getElementById("editPrice").value),
            category: document.getElementById("editCategory").value,
        };

        populateTable();
        editModal.hide();
        
        // Show success notification
        showToast("Item Updated", `${oldItem.name} has been updated successfully.`, "success");
    }
}

// Function to prepare delete confirmation
function deleteItem(index) {
    currentItemIndex = index;
    const item = inventoryItems[index];

    document.getElementById("deleteItemInfo").textContent = `Item: ${item.name} (ID: ${item.id})`;

    deleteModal.show();
}

// Function to confirm and delete item
function confirmDelete() {
    if (currentItemIndex >= 0 && currentItemIndex < inventoryItems.length) {
        const deletedItem = inventoryItems[currentItemIndex];
        inventoryItems.splice(currentItemIndex, 1);
        populateTable();
        deleteModal.hide();
        
        // Show success notification
        showToast("Item Deleted", `${deletedItem.name} has been removed from inventory.`, "error");
    }
}

// Function to add a new item
function addNewItem() {
    // Form validation
    const form = document.getElementById("addItemForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const newItem = {
        id: document.getElementById("newItemId").value,
        name: document.getElementById("newItemName").value,
        quantity: parseInt(document.getElementById("newQuantity").value),
        price: parseFloat(document.getElementById("newPrice").value),
        category: document.getElementById("newCategory").value,
    };

    // Check if ID already exists
    const existingItem = inventoryItems.find(item => item.id === newItem.id);
    if (existingItem) {
        showToast("Error", "An item with this ID already exists.", "error");
        return;
    }

    inventoryItems.push(newItem);
    populateTable();
    addModal.hide();
    
    // Reset form
    form.reset();
    
    // Show success notification
    showToast("Item Added", `${newItem.name} has been added to inventory.`, "success");
}

// Function to search items
function searchItems() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const tableRows = document.querySelectorAll("#inventoryTableBody tr");

    let hasResults = false;
    
    tableRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = "";
            hasResults = true;
        } else {
            row.style.display = "none";
        }
    });
    
    // If no results found and we have rows
    if (!hasResults && tableRows.length > 0 && searchTerm !== "") {
        // Check if we already have a "no results" row
        const noResultsRow = document.querySelector(".no-results-row");
        if (!noResultsRow) {
            const tableBody = document.getElementById("inventoryTableBody");
            const noResultsRow = document.createElement("tr");
            noResultsRow.className = "no-results-row";
            noResultsRow.innerHTML = `
                <td colspan="7">
                    <div class="text-center py-4">
                        <i class="bi bi-search" style="font-size: 2.5rem; color: var(--gray-light);"></i>
                        <h5 class="mt-3 mb-1">No items found</h5>
                        <p class="text-muted">Try a different search term</p>
                    </div>
                </td>
            `;
            tableBody.appendChild(noResultsRow);
        }
    } else {
        // Remove "no results" row if it exists
        const noResultsRow = document.querySelector(".no-results-row");
        if (noResultsRow) {
            noResultsRow.remove();
        }
    }
}

// Function to show toast notifications
function showToast(title, message, type = "info") {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastEl = document.createElement("div");
    toastEl.className = "toast slide-in-right";
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");
    
    // Set icon based on type
    let icon = "info-circle-fill";
    
    switch(type) {
        case "success":
            icon = "check-circle-fill";
            break;
        case "error":
            icon = "exclamation-circle-fill";
            type = "error";
            break;
        case "warning":
            icon = "exclamation-triangle-fill";
            break;
    }
    
    // Toast content
    toastEl.innerHTML = `
        <div class="toast-header">
            <div class="toast-icon ${type}">
                <i class="bi bi-${icon}"></i>
            </div>
            <div class="toast-title">${title}</div>
            <div class="toast-time">Just now</div>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toastEl);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 5000
    });
    toast.show();
    
    // Remove from DOM after hiding
    toastEl.addEventListener('hidden.bs.toast', function () {
        toastEl.remove();
    });
}