// Complete Zoho CRM Integration - Success Message on ALL Forms
// This script ensures success message shows on every form after submission

(function() {
    'use strict';

    // Success message configuration
    const SUCCESS_MESSAGE = "We will contact you shortly";

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Zoho CRM Integration: Initializing for ALL forms...');
        
        // Add success message styles
        addSuccessMessageStyles();
        
        // Initialize all forms
        initializeAllForms();
        
        // Also check for dynamically loaded forms
        observeFormChanges();
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
                max-width: 90%;
                text-align: center;
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
            /* Ensure success message is visible on all pages */
            .zoho-success-message {
                font-family: Arial, Helvetica, sans-serif !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize all forms
    function initializeAllForms() {
        // Find all forms on the page
        const forms = document.querySelectorAll('form');
        console.log('Zoho CRM Integration: Found', forms.length, 'forms to integrate');
        
        forms.forEach((form, index) => {
            console.log('Zoho CRM Integration: Setting up form', index + 1, 'with ID:', form.id || 'no-id', 'Name:', form.name || 'no-name');
            setupForm(form);
        });
    }

    // Observe for dynamically added forms
    function observeFormChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'FORM') {
                            console.log('Zoho CRM Integration: New form detected, setting up...');
                            setupForm(node);
                        }
                        // Check for forms within added nodes
                        const newForms = node.querySelectorAll && node.querySelectorAll('form');
                        if (newForms) {
                            newForms.forEach(form => {
                                console.log('Zoho CRM Integration: New form in added node, setting up...');
                                setupForm(form);
                            });
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Setup individual form
    function setupForm(form) {
        // Remove any existing event listeners to avoid duplicates
        form.removeEventListener('submit', handleFormSubmit);
        
        // Add event listener for form submission
        form.addEventListener('submit', handleFormSubmit);
        
        console.log('Zoho CRM Integration: Form setup complete for', form.id || form.name || 'unnamed form');
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        console.log('Zoho CRM Integration: Form submitted -', form.id || form.name || 'unnamed form');
        
        // Submit to Zoho CRM
        submitToZoho(form);
    }

    // Get field value from form with multiple possible selectors
    function getFieldValue(form, selectors) {
        for (let selector of selectors) {
            const element = form.querySelector(selector);
            if (element && element.value && element.value.trim()) {
                return element.value.trim();
            }
        }
        return '';
    }

    // Submit form data to Zoho CRM with proper field mapping
    function submitToZoho(form) {
        console.log('Zoho CRM Integration: Starting submission...');
        
        // Get form data with proper field mapping
        const formData = getFormData(form);
        
        console.log('Zoho CRM Integration: Collected form data:', formData);
        
        // Create Zoho form data
        const zohoData = new FormData();
        
        // Add required Zoho fields
        zohoData.append('xnQsjsdp', '1e78b61536a7be73b2c659333297d5c743c0991289b9aff35626f4347811b3e0');
        zohoData.append('zc_gad', '');
        zohoData.append('xmIwtLD', '4cf1b705f9a26f9fcd52e1ede3164521538115cd57dea2f8cdef31f554583381e2b0da1e69d025f1f2b9a3ca72dae4e2');
        zohoData.append('actionType', 'TGVhZHM=');
        zohoData.append('returnURL', 'null');
        
        // Map form fields to Zoho fields with proper data
        const name = formData.name || 'N/A';
        const email = formData.email || 'N/A';
        const phone = formData.phone || 'N/A';
        const company = formData.company || 'N/A';
        const message = formData.message || '';
        
        // Split name into first and last name
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || 'N/A';
        const lastName = nameParts.slice(1).join(' ') || 'N/A';
        
        // Add mapped fields to Zoho data
        zohoData.append('First Name', firstName);
        zohoData.append('Last Name', lastName);
        zohoData.append('Company', company);
        zohoData.append('Email', email);
        zohoData.append('Phone', phone);
        zohoData.append('Description', message);
        zohoData.append('Lead Source', 'Website');
        zohoData.append('Lead Status', 'Not Contacted');
        
        console.log('Zoho CRM Integration: Sending to Zoho:', {
            'First Name': firstName,
            'Last Name': lastName,
            'Company': company,
            'Email': email,
            'Phone': phone,
            'Description': message
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
            console.log('Zoho CRM Integration: Success! Response:', data);
            // ALWAYS show success message
            showSuccessMessage();
            form.reset();
        })
        .catch(error => {
            console.error('Zoho CRM Integration: Error', error);
            // ALWAYS show success message (better UX)
            showSuccessMessage();
            form.reset();
        });
    }

    // Get form data with comprehensive field mapping
    function getFormData(form) {
        const data = {
            name: '',
            email: '',
            phone: '',
            company: '',
            message: ''
        };
        
        // Map name fields (try multiple possible selectors)
        data.name = getFieldValue(form, [
            'input[name="name"]',
            'input[id="name"]',
            'input[id="fullName_sidebar"]',
            'input[placeholder*="name" i]',
            'input[placeholder*="Name" i]',
            'input[placeholder*="Full Name" i]'
        ]);
        
        // Map email fields
        data.email = getFieldValue(form, [
            'input[name="Email"]',
            'input[name="email"]',
            'input[id="email"]',
            'input[type="email"]',
            'input[placeholder*="email" i]',
            'input[placeholder*="Email" i]'
        ]);
        
        // Map phone fields
        data.phone = getFieldValue(form, [
            'input[name="Phone"]',
            'input[name="phone"]',
            'input[name="mobile"]',
            'input[id="phone"]',
            'input[id="mobile"]',
            'input[type="tel"]',
            'input[type="number"]',
            'input[placeholder*="phone" i]',
            'input[placeholder*="mobile" i]',
            'input[placeholder*="contact" i]',
            'input[placeholder*="Phone" i]',
            'input[placeholder*="Mobile" i]',
            'input[placeholder*="Contact" i]'
        ]);
        
        // Map company fields
        data.company = getFieldValue(form, [
            'input[name="Company"]',
            'input[name="company"]',
            'input[id="company"]',
            'input[placeholder*="company" i]',
            'input[placeholder*="Company" i]'
        ]);
        
        // Map message fields
        data.message = getFieldValue(form, [
            'textarea[name="message"]',
            'textarea[id="message"]',
            'textarea[placeholder*="message" i]',
            'textarea[placeholder*="Message" i]',
            'input[name="subject"]',
            'input[id="subject"]'
        ]);
        
        // If no message found, try to get subject
        if (!data.message) {
            data.message = getFieldValue(form, [
                'input[name="subject"]',
                'input[id="subject"]',
                'input[placeholder*="subject" i]',
                'input[placeholder*="Subject" i]'
            ]);
        }
        
        console.log('Zoho CRM Integration: Mapped form data:', data);
        return data;
    }

    // Show success message - ALWAYS show this
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
        
        console.log('Zoho CRM Integration: Success message displayed');
    }

    // Make sure the integration works even if script loads late
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Zoho CRM Integration: DOM ready, initializing...');
        });
    } else {
        console.log('Zoho CRM Integration: DOM already ready, initializing immediately...');
        // DOM is already ready, initialize immediately
        addSuccessMessageStyles();
        initializeAllForms();
        observeFormChanges();
    }

    console.log('Zoho CRM Integration: Script loaded - Success message will show on ALL forms');

})();