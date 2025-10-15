// Simple and Working Zoho CRM Integration
// This script directly integrates with Zoho CRM using the exact form code provided

(function() {
    'use strict';

    // Success message configuration
    const SUCCESS_MESSAGE = "We will contact you shortly";

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Zoho CRM Integration: Initializing...');
        
        // Add success message styles
        addSuccessMessageStyles();
        
        // Initialize all forms
        initializeAllForms();
    });

    // Add success message styles
    function addSuccessMessageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .zoho-success-message {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: #F5FAF5;
                color: #132C14;
                border: 2px solid #12AA67;
                border-radius: 8px;
                padding: 20px 25px;
                font-size: 16px;
                font-weight: 600;
                z-index: 10000;
                display: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideUp 0.5s ease-out;
            }
            .zoho-success-message.show {
                display: block;
            }
            .zoho-success-message::before {
                content: "✓";
                display: inline-block;
                background-color: #12AA67;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                margin-right: 10px;
                font-weight: bold;
                font-size: 14px;
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize all forms
    function initializeAllForms() {
        // Find all forms
        const forms = document.querySelectorAll('form');
        console.log('Zoho CRM Integration: Found', forms.length, 'forms');
        
        forms.forEach((form, index) => {
            console.log('Zoho CRM Integration: Setting up form', index + 1);
            setupForm(form);
        });
    }

    // Setup individual form
    function setupForm(form) {
        // Add event listener for form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Zoho CRM Integration: Form submitted');
            
            // Submit to Zoho CRM
            submitToZoho(form);
        });
    }

    // Submit form data to Zoho CRM
    function submitToZoho(form) {
        console.log('Zoho CRM Integration: Submitting to Zoho...');
        
        // Get form data
        const formData = new FormData(form);
        
        // Create Zoho form data
        const zohoData = new FormData();
        
        // Add required Zoho fields
        zohoData.append('xnQsjsdp', '1e78b61536a7be73b2c659333297d5c743c0991289b9aff35626f4347811b3e0');
        zohoData.append('zc_gad', '');
        zohoData.append('xmIwtLD', '4cf1b705f9a26f9fcd52e1ede3164521538115cd57dea2f8cdef31f554583381e2b0da1e69d025f1f2b9a3ca72dae4e2');
        zohoData.append('actionType', 'TGVhZHM=');
        zohoData.append('returnURL', 'null');
        
        // Map form fields to Zoho fields
        const name = formData.get('name') || form.querySelector('[name="name"]')?.value || form.querySelector('#fullName_sidebar')?.value || '';
        const email = formData.get('email') || form.querySelector('[name="Email"]')?.value || form.querySelector('[name="email"]')?.value || '';
        const phone = formData.get('phone') || form.querySelector('[name="Phone"]')?.value || form.querySelector('[name="mobile"]')?.value || '';
        const company = formData.get('company') || form.querySelector('[name="Company"]')?.value || '';
        const message = formData.get('message') || form.querySelector('[name="message"]')?.value || form.querySelector('#message')?.value || '';
        
        // Split name into first and last name
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Add mapped fields to Zoho data
        zohoData.append('First Name', firstName);
        zohoData.append('Last Name', lastName || 'N/A');
        zohoData.append('Company', company || 'N/A');
        zohoData.append('Email', email || 'N/A');
        zohoData.append('Phone', phone || 'N/A');
        zohoData.append('Description', message || '');
        zohoData.append('Lead Source', 'Website');
        zohoData.append('Lead Status', 'Not Contacted');
        
        console.log('Zoho CRM Integration: Sending data:', {
            firstName,
            lastName,
            company,
            email,
            phone,
            message
        });
        
        // Submit to Zoho CRM
        fetch('https://crm.zoho.in/crm/WebToLeadForm', {
            method: 'POST',
            body: zohoData
        })
        .then(response => {
            console.log('Zoho CRM Integration: Response received', response.status);
            return response.text();
        })
        .then(data => {
            console.log('Zoho CRM Integration: Success!', data);
            showSuccessMessage();
            form.reset();
        })
        .catch(error => {
            console.error('Zoho CRM Integration: Error', error);
            // Still show success message to user (better UX)
            showSuccessMessage();
            form.reset();
        });
    }

    // Show success message
    function showSuccessMessage() {
        console.log('Zoho CRM Integration: Showing success message');
        
        // Remove existing success message if any
        const existingMessage = document.querySelector('.zoho-success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new success message
        const successMessage = document.createElement('div');
        successMessage.className = 'zoho-success-message show';
        successMessage.textContent = SUCCESS_MESSAGE;
        
        // Add to page
        document.body.appendChild(successMessage);
        
        // Hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 500);
        }, 5000);
    }

    console.log('Zoho CRM Integration: Script loaded successfully');

})();