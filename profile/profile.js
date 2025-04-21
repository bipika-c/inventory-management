document.addEventListener('DOMContentLoaded', function() {
    // Edit Profile Button
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const viewMode = document.getElementById('viewMode');
    const editMode = document.getElementById('editMode');
    
    // Profile Image Upload
    const uploadBtn = document.getElementById('uploadBtn');
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');
    
    // Edit Profile
    editProfileBtn.addEventListener('click', function() {
        viewMode.style.display = 'none';
        editMode.style.display = 'block';
    });
    
    // Cancel Edit
    cancelEditBtn.addEventListener('click', function() {
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
    });
    
    // Save Profile
    saveProfileBtn.addEventListener('click', function() {
        // Get form values
        const name = document.getElementById('nameInput').value;
        const address = document.getElementById('addressInput').value;
        const dob = document.getElementById('dobInput').value;
        const gender = document.getElementById('genderInput').value;
        const phone = document.getElementById('phoneInput').value;
        const email = document.getElementById('emailInput').value;
        
        // Update display values
        document.getElementById('nameValue').textContent = name;
        document.getElementById('addressValue').textContent = address;
        document.getElementById('dobValue').textContent = dob;
        document.getElementById('genderValue').textContent = gender;
        document.getElementById('phoneValue').textContent = phone;
        document.getElementById('emailValue').textContent = email;
        
        // Update header display
        document.getElementById('displayName').textContent = name;
        document.getElementById('displayLocation').textContent = address;
        
        // Show success message
        showAlert('Profile updated successfully!', 'success');
        
        // Switch back to view mode
        viewMode.style.display = 'block';
        editMode.style.display = 'none';
    });
    
    // Profile Image Upload
    uploadBtn.addEventListener('click', function() {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
                showAlert('Profile picture updated!', 'success');
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Function to show alerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '1050';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => {
                alertDiv.remove();
            }, 150);
        }, 3000);
    }
});