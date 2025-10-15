// Zoho CRM Integration Script
// This script integrates existing forms with Zoho CRM using the exact form code provided

(function() {
    'use strict';

    // Zoho CRM form configuration from provided code
    const ZOHO_CONFIG = {
        formId: 'webform1030997000000474013',
        formName: 'WebToLeads1030997000000474013',
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

    // Add success message styles (improved with better positioning and green tick)
    function addSuccessMessageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .wf_customMessageBox{
                font-family: Arial, Helvetica, sans-serif;
                color: #132C14;
                background: #F5FAF5;
                box-shadow: 0 4px 12px 0 rgba(0,0,0,0.15);
                max-width: 90%;
                width: max-content;
                word-break: break-word;
                z-index: 11000;
                border-radius: 8px;
                border: 2px solid #12AA67;
                min-width: 200px;
                padding: 20px 25px;
                display: flex;
                align-items: center;
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translate(-50%, 0);
                animation: slideUp 0.5s ease-out;
            }
            .wf_customCircle{
                position: relative;
                background-color: #12AA67;
                border-radius: 100%;
                width: 24px;
                height: 24px;
                flex: none;
                margin-right: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .wf_customCheckMark{
                box-sizing: unset !important;
                position: absolute;
                transform: rotate(45deg);
                left: 7px;
                top: 3px;
                height: 12px;
                width: 6px;
                border-bottom: 3px solid #fff;
                border-right: 3px solid #fff;
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
            .sidebar-thanks, #msgSubmit {
                background: #F5FAF5 !important;
                color: #132C14 !important;
                border: 2px solid #12AA67 !important;
                border-radius: 8px !important;
                padding: 20px 25px !important;
                margin: 20px 0 !important;
                text-align: center !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                position: relative !important;
                animation: slideUp 0.5s ease-out !important;
            }
            .sidebar-thanks.show::before, #msgSubmit.show::before {
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
        `;
        document.head.appendChild(style);
    }

    // Initialize existing forms without changing their design
    function initializeExistingForms() {
        // Find all forms that need Zoho integration
        const forms = document.querySelectorAll('form[id*="contact"], form[name*="contact"], form[id*="feedback"], form[name*="feedback"], form[id="contactForm"], form[id*="sidebar"], form[id*="webform"]');
        
        forms.forEach(form => {
            setupZohoForm(form);
        });
    }

    // Setup Zoho form functionality while preserving original design
    function setupZohoForm(form) {
        // Check if there's already a success message container
        let successMessage = form.parentNode.querySelector('#sidebar-thanks, #msgSubmit, #wf_splash');
        
        if (!successMessage) {
            // Add success message container after the form
            successMessage = document.createElement('div');
            successMessage.className = 'wf_customMessageBox';
            successMessage.id = 'wf_splash';
            successMessage.style.display = 'none';
            successMessage.innerHTML = `
                <div class="wf_customCircle">
                    <div class="wf_customCheckMark"></div>
                </div>
                <span id="wf_splash_info">${SUCCESS_MESSAGE}</span>
            `;
            
            // Insert success message after the form
            form.parentNode.insertBefore(successMessage, form.nextSibling);
        }
        
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

    // Add hidden Zoho fields to existing form (from provided code)
    function addZohoHiddenFields(form) {
        // Zoho required hidden fields
        const hiddenFields = [
            { name: 'xnQsjsdp', value: ZOHO_CONFIG.xnQsjsdp },
            { name: 'zc_gad', value: '', id: 'zc_gad' },
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

    // Validate form (simplified - no required fields)
    function validateForm(form) {
        // Basic email validation if email field exists
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.style.borderColor = '#ff0000';
                alert('Please enter a valid email address.');
                return false;
            } else {
                emailField.style.borderColor = '';
            }
        }
        
        return true;
    }

    // Submit form to Zoho (using exact code from provided form)
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
        
        // Submit via AJAX (using exact code from provided form)
        fetch('https://crm.zoho.in/crm/WebToLeadForm', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Show success message (using exact code from provided form)
            const splashinfodom = document.getElementById('wf_splash_info');
            if (splashinfodom) {
                splashinfodom.innerText = SUCCESS_MESSAGE;
            }
            const splashdom = document.getElementById('wf_splash');
            if (splashdom) {
                splashdom.style.display = '';
                setTimeout(function() {
                    splashdom.style.display = 'none';
                }, 5000);
            }
            
            // Show success message in the form's success container
            if (successMessage) {
                // Check if it's the sidebar-thanks container
                if (successMessage.id === 'sidebar-thanks') {
                    successMessage.style.display = 'block';
                    successMessage.textContent = SUCCESS_MESSAGE;
                    successMessage.classList.add('show');
                } else if (successMessage.id === 'msgSubmit') {
                    successMessage.style.display = 'block';
                    successMessage.textContent = SUCCESS_MESSAGE;
                    successMessage.classList.add('show');
                } else {
                    // Custom success message
                    const formSuccessMsg = successMessage.querySelector('#wf_splash_info');
                    if (formSuccessMsg) {
                        formSuccessMsg.innerText = SUCCESS_MESSAGE;
                    }
                    successMessage.style.display = '';
                }
                
                setTimeout(function() {
                    successMessage.style.display = 'none';
                    successMessage.classList.remove('show');
                }, 5000);
            }
            
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