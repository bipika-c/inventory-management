 // Sample user data with photos
 let users = [
    {
        id: '1',
        firstName: 'Ram',
        lastName: 'Hari',
        email: 'ram@gmail.com',
        role: 'admin',
        status: 'active',
        createdDate: '2023-01-15',
        photo: '/assets/luffy.jpg'
    },
    {
        id: '2',
        firstName: 'Hari',
        lastName: 'Lal',
        email: 'hari@gmail.com.com',
        role: 'user',
        status: 'inactive',
        createdDate: '2023-02-20',
        photo: '/assets/zoro.jpg'
    },
    {
        id: '3',
        firstName: 'Shyam',
        lastName: 'Lal',
        email: 'shyam@gmail.com.com',
        role: 'editor',
        status: 'pending',
        createdDate: '2023-03-10',
        photo: '/assets/sanji.jpg'
    },
    {
        id: '4',
        firstName: 'Rita',
        lastName: 'Re',
        email: 'rita@gmail.com',
        role: 'user',
        status: 'active',
        createdDate: '2023-04-05',
        photo: '/assets/nami.jpg'
    },
    {
        id: '5',
        firstName: 'Sita',
        lastName: 'Se',
        email: 'sita@gmail.com',
        role: 'admin',
        status: 'active',
        createdDate: '2023-05-12',
        photo: '/assets/robin.png'
    },
    {
        id: '6',
        firstName: 'Gita',
        lastName: 'Se',
        email: 'gita@gmail.com',
        role: 'user',
        status: 'active',
        createdDate: '2023-05-12',
        photo: '/assets/ussop.jpg'
    },
    {
        id: '7',
        firstName: 'Eta',
        lastName: 'Se',
        email: 'eta@gmail.com',
        role: 'user',
        status: 'active',
        createdDate: '2023-05-12',
        photo: '/assets/chopper.jpg'
    },
    {
        id: '8',
        firstName: 'HEhe',
        lastName: 'Se',
        email: 'hehe@gmail.com',
        role: 'user',
        status: 'active',
        createdDate: '2023-05-12',
        photo: '/assets/brook.jpg'
    },
    {
        id: '9',
        firstName: 'Super',
        lastName: 'Se',
        email: 'super@gmail.com',
        role: 'user',
        status: 'active',
        createdDate: '2023-05-12',
        photo: '/assets/franky.jpg'
    },
    {
        id: '10',
        firstName: 'Macha',
        lastName: 'Water',
        email: 'man@gmail.com',
        role: 'admin',
        status: 'active',
        createdDate: '2023-05-12',
        photo: '/assets/zim.png'
    }
];

// DOM Elements
const userTableBody = document.getElementById('userTableBody');
const emptyState = document.getElementById('emptyState');
const newUserBtn = document.getElementById('newUserBtn');
const emptyStateBtn = document.getElementById('emptyStateBtn');
const saveUserBtn = document.getElementById('saveUser');
const searchInput = document.getElementById('searchInput');
const applyFilterBtn = document.getElementById('applyFilter');
const resetFilterBtn = document.getElementById('resetFilter');
const photoUpload = document.getElementById('photoUpload');
const avatarPreview = document.getElementById('avatarPreview');

// Current user photo data URL
let currentUserPhoto = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderUserTable();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Open new user modal
    newUserBtn.addEventListener('click', openNewUserModal);
    emptyStateBtn.addEventListener('click', openNewUserModal);

    // Save user
    saveUserBtn.addEventListener('click', saveUser);

    // Search functionality
    searchInput.addEventListener('input', function() {
        renderUserTable();
    });

    // Apply filter
    applyFilterBtn.addEventListener('click', function() {
        renderUserTable();
        // Close dropdown
        document.getElementById('filterDropdown').click();
    });

    // Reset filter
    resetFilterBtn.addEventListener('click', function() {
        document.getElementById('roleFilter').value = '';
        document.getElementById('statusFilter').value = '';
        renderUserTable();
    });

    // Photo upload
    photoUpload.addEventListener('change', handlePhotoUpload);
}

// Open new user modal
function openNewUserModal() {
    // Reset form
    document.getElementById('userForm').reset();
    document.getElementById('userModalLabel').textContent = 'Add New User';
    
    // Reset avatar preview
    avatarPreview.innerHTML = '<i class="bi bi-person"></i>';
    currentUserPhoto = '';
    
    // Set save button action
    saveUserBtn.onclick = saveUser;
    
    // Show modal
    new bootstrap.Modal(document.getElementById('userModal')).show();
}

// Handle photo upload
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showToast('Please select an image file', 'danger');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentUserPhoto = e.target.result;
        avatarPreview.innerHTML = `<img src="${currentUserPhoto}" alt="User avatar">`;
    };
    reader.readAsDataURL(file);
}

// Save user data
function saveUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;
    const password = document.getElementById('password').value;

    // Validate form
    if (!firstName || !lastName || !email || !role || !status || !password) {
        showToast('Please fill in all required fields', 'danger');
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        role,
        status,
        createdDate: new Date().toISOString().split('T')[0],
        photo: currentUserPhoto || getInitialsAvatar(firstName, lastName)
    };

    // Add to users array
    users.push(newUser);
    
    // Close modal and render table
    bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    renderUserTable();
    
    // Show success message
    showToast('User added successfully', 'success');
}

// Render user table
function renderUserTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.firstName.toLowerCase().includes(searchTerm) || 
            user.lastName.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm);
        
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        const matchesStatus = statusFilter ? user.status === statusFilter : true;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Clear table
    userTableBody.innerHTML = '';

    // Show empty state if no users
    if (filteredUsers.length === 0) {
        document.querySelector('.table-responsive').style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    // Hide empty state and show table
    document.querySelector('.table-responsive').style.display = 'block';
    emptyState.style.display = 'none';

    // Render each user
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.className = 'fade-in';
        row.style.animationDelay = `${index * 0.05}s`;
        
        // Create status badge
        const statusBadge = getStatusBadge(user.status);
        
        // Create user avatar
        const userAvatar = user.photo ? 
            `<img src="${user.photo}" alt="${user.firstName} ${user.lastName}" class="user-avatar">` : 
            `<div class="user-avatar">${getInitials(user.firstName, user.lastName)}</div>`;
        
        row.innerHTML = `
            <td>
                <div class="user-info">
                    ${userAvatar}
                    <div>
                        <div class="user-name">${user.firstName} ${user.lastName}</div>
                        <div class="user-email d-md-none">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="badge bg-light text-dark">${capitalizeFirstLetter(user.role)}</span></td>
            <td>${statusBadge}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary action-btn me-1 " onclick="editUser('${user.id}')">
                    <i class="bi bi-pencil" style=></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn" onclick="deleteUser('${user.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        userTableBody.appendChild(row);
    });
}

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Populate form
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;
    document.getElementById('status').value = user.status;
    document.getElementById('password').value = '********'; // Placeholder

    // Update avatar preview
    if (user.photo) {
        avatarPreview.innerHTML = `<img src="${user.photo}" alt="User avatar">`;
        currentUserPhoto = user.photo;
    } else {
        avatarPreview.innerHTML = `<div class="user-avatar">${getInitials(user.firstName, user.lastName)}</div>`;
        currentUserPhoto = '';
    }

    // Update modal title
    document.getElementById('userModalLabel').textContent = 'Edit User';

    // Show modal
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();

    // Update save button to update instead of create
    saveUserBtn.onclick = function() {
        updateUser(userId, userModal);
    };
}

// Update user
function updateUser(userId, modal) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;

    // Update user
    users[userIndex] = {
        ...users[userIndex],
        firstName,
        lastName,
        email,
        role,
        status,
        photo: currentUserPhoto || users[userIndex].photo
    };

    // Close modal and render table
    modal.hide();
    renderUserTable();
    
    // Show success message
    showToast('User updated successfully', 'success');
}

// Delete user
function deleteUser(userId) {
    // Create and show confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal fade';
    confirmModal.id = 'confirmDeleteModal';
    confirmModal.setAttribute('tabindex', '-1');
    confirmModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(confirmModal);
    
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
    
    document.getElementById('confirmDelete').addEventListener('click', function() {
        // Remove user
        users = users.filter(u => u.id !== userId);
        
        // Close modal
        modal.hide();
        
        // Remove modal from DOM after hiding
        document.getElementById('confirmDeleteModal').addEventListener('hidden.bs.modal', function() {
            document.getElementById('confirmDeleteModal').remove();
        });
        
        // Render table
        renderUserTable();
        
        // Show success message
        showToast('User deleted successfully', 'success');
    });
}

// Helper Functions
function getStatusBadge(status) {
    let badgeClass = '';
    let icon = '';
    
    switch (status) {
        case 'active':
            badgeClass = 'badge-active';
            icon = '<i class="bi bi-check-circle-fill"></i>';
            break;
        case 'inactive':
            badgeClass = 'badge-inactive';
            icon = '<i class="bi bi-x-circle-fill"></i>';
            break;
        case 'pending':
            badgeClass = 'badge-pending';
            icon = '<i class="bi bi-clock-fill"></i>';
            break;
        default:
            badgeClass = 'bg-secondary';
            icon = '<i class="bi bi-question-circle-fill"></i>';
    }
    
    return `<span class="badge ${badgeClass}">${icon} ${capitalizeFirstLetter(status)}</span>`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

function getInitialsAvatar(firstName, lastName) {
    // This would normally generate an avatar with initials
    // For simplicity, we'll return an empty string
    return '';
}

// Toast notification
function showToast(message, type = 'primary') {
    const toastContainer = document.querySelector('.toast-container');
    
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    
    // Set icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="bi bi-check-circle-fill"></i>';
            break;
        case 'danger':
            icon = '<i class="bi bi-exclamation-circle-fill"></i>';
            break;
        case 'warning':
            icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
            break;
        default:
            icon = '<i class="bi bi-info-circle-fill"></i>';
    }
    
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${icon} ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toastEl);
    
    // Initialize and show toast
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    
    // Remove from DOM after hiding
    toastEl.addEventListener('hidden.bs.toast', function() {
        toastEl.remove();
    });
}

// Expose functions to global scope for onclick handlers
window.editUser = editUser;
window.deleteUser = deleteUser;