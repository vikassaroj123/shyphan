// Zoho CRM Integration Script
// This script handles form submission to Zoho CRM while preserving original form design

(function() {
    'use strict';

    // Zoho CRM form configuration
    const ZOHO_CONFIG = {
        xnQsjsdp: '1e78b61536a7be73b2c659333297d5c743c0991289b9aff35626f4347811b3e0',
        xmIwtLD: '4cf1b705f9a26f9fcd52e1ede3164521538115cd57dea2f8cdef31f554583381e2b0da1e69d025f1f2b9a3ca72dae4e2',
        actionType: 'TGVhZHM=',
        returnURL: 'null'
    };

    // Success message configuration
    const SUCCESS_MESSAGE = "We will contact you shortly";

    // Initialize Zoho CRM integration
    function initZohoCRM() {
        // Add success message styles
        addSuccessMessageStyles();
        
        // Initialize all existing forms
        initializeExistingForms();
    }

    // Add success message styles
    function addSuccessMessageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .zoho-success-message {
                background: #F5FAF5;
                color: #132C14;
                border: 1px solid #A9D3AB;
                border-radius: 6px;
                padding: 15px 20px;
                margin: 20px 0;
                display: none;
                align-items: center;
                box-shadow: 0 2px 6px 0 rgba(0,0,0,0.25);
                font-family: Arial, Helvetica, sans-serif;
                font-weight: 500;
            }
            .zoho-success-message.show {
                display: flex;
            }
            .zoho-success-icon {
                background-color: #12AA67;
                border-radius: 100%;
                width: 20px;
                height: 20px;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .zoho-success-checkmark {
                width: 6px;
                height: 10px;
                border: solid #fff;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize existing forms without changing their design
    function initializeExistingForms() {
        // Find all forms that need Zoho integration
        const forms = document.querySelectorAll('form[id*="contact"], form[name*="contact"], form[id*="feedback"], form[name*="feedback"], form[id="contactForm"]');
        
        forms.forEach(form => {
            setupZohoForm(form);
        });
    }

    // Setup Zoho form functionality while preserving original design
    function setupZohoForm(form) {
        // Add success message container after the form
        const successMessage = document.createElement('div');
        successMessage.className = 'zoho-success-message';
        successMessage.innerHTML = `
            <div class="zoho-success-icon">
                <div class="zoho-success-checkmark"></div>
            </div>
            <span>${SUCCESS_MESSAGE}</span>
        `;
        
        // Insert success message after the form
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // Add hidden Zoho fields to the existing form
        addZohoHiddenFields(form);
        
        // Setup form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                submitToZoho(form, successMessage);
            }
        });
    }

    // Add hidden Zoho fields to existing form
    function addZohoHiddenFields(form) {
        // Zoho required hidden fields
        const hiddenFields = [
            { name: 'xnQsjsdp', value: ZOHO_CONFIG.xnQsjsdp },
            { name: 'zc_gad', value: '', id: 'zc_gad_' + Math.random().toString(36).substr(2, 9) },
            { name: 'xmIwtLD', value: ZOHO_CONFIG.xmIwtLD },
            { name: 'actionType', value: ZOHO_CONFIG.actionType },
            { name: 'returnURL', value: ZOHO_CONFIG.returnURL },
            { name: 'Lead Source', value: 'Website' },
            { name: 'Lead Status', value: 'Not Contacted' }
        ];

        hiddenFields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            if (field.id) input.id = field.id;
            form.appendChild(input);
        });
    }

    // Validate form
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff0000';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.style.borderColor = '#ff0000';
                alert('Please enter a valid email address.');
                isValid = false;
            }
        }
        
        return isValid;
    }

    // Submit form to Zoho
    function submitToZoho(form, successMessage) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent || submitBtn.value;
            submitBtn.textContent = 'Submitting...';
            submitBtn.value = 'Submitting...';
        }
        
        // Map form fields to Zoho fields
        mapFormFieldsToZoho(form);
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Submit via AJAX
        fetch('https://crm.zoho.in/crm/WebToLeadForm', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Show success message
            successMessage.classList.add('show');
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset form
            form.reset();
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form. Please try again.');
        })
        .finally(() => {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                submitBtn.value = 'Submit';
            }
        });
    }

    // Map existing form fields to Zoho CRM fields
    function mapFormFieldsToZoho(form) {
        // Get existing form fields
        const nameField = form.querySelector('input[placeholder*="name"], input[name*="name"], input[id*="name"]');
        const emailField = form.querySelector('input[type="email"], input[placeholder*="email"], input[name*="email"]');
        const phoneField = form.querySelector('input[placeholder*="phone"], input[placeholder*="mobile"], input[name*="phone"], input[name*="mobile"]');
        const companyField = form.querySelector('input[placeholder*="company"], input[name*="company"]');
        const messageField = form.querySelector('textarea, input[placeholder*="message"]');
        
        // Create or update Zoho field mappings
        const zohoFields = [
            { zoho: 'First Name', value: nameField ? nameField.value.split(' ')[0] || '' : '' },
            { zoho: 'Last Name', value: nameField ? nameField.value.split(' ').slice(1).join(' ') || nameField.value : '' },
            { zoho: 'Email', value: emailField ? emailField.value : '' },
            { zoho: 'Phone', value: phoneField ? phoneField.value : '' },
            { zoho: 'Company', value: companyField ? companyField.value : 'N/A' },
            { zoho: 'Description', value: messageField ? messageField.value : '' }
        ];
        
        // Add or update hidden fields for Zoho
        zohoFields.forEach(field => {
            let hiddenField = form.querySelector(`input[name="${field.zoho}"]`);
            if (!hiddenField) {
                hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = field.zoho;
                form.appendChild(hiddenField);
            }
            hiddenField.value = field.value;
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initZohoCRM);
    } else {
        initZohoCRM();
    }

})();