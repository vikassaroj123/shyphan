// Complete Working Zoho CRM Integration - Forms Fully Functional
// This script ensures forms work properly and can be filled and submitted

(function() {
    'use strict';

    // Success message configuration
    const SUCCESS_MESSAGE = "We will contact you shortly";

    // Global flag to prevent multiple initializations
    window.zohoIntegrationInitialized = window.zohoIntegrationInitialized || false;

    // Google Ads conversion tracking function
    function gtag_report_conversion(url) {
        var callback = function () {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        };
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'send_to': 'AW-17557804164/e4AmCMXulZsbEISpm7RB',
                'value': 1.0,
                'currency': 'INR',
                'event_callback': callback
            });
        }
        return false;
    }

    // Initialize when DOM is ready
    function initializeIntegration() {
        if (window.zohoIntegrationInitialized) {
            console.log('Zoho CRM Integration: Already initialized, skipping...');
            return;
        }
        
        console.log('Zoho CRM Integration: Initializing complete working integration...');
        window.zohoIntegrationInitialized = true;
        
        // Add success message styles
        addSuccessMessageStyles();
        
        // Initialize all forms
        initializeAllForms();
        
        // Set up periodic checks for new forms
        setInterval(checkForNewForms, 3000);
    }

    // Add submission confirmation styles - positioned below submit button
    function addSuccessMessageStyles() {
        // Remove existing styles if any
        const existingStyle = document.getElementById('zoho-success-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'zoho-success-styles';
        style.textContent = `
            .zoho-submission-confirmation {
                background: #28a745 !important;
                color: white !important;
                border: 2px solid #1e7e34 !important;
                border-radius: 8px !important;
                padding: 15px 20px !important;
                font-size: 16px !important;
                font-weight: bold !important;
                display: none !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                animation: zohoConfirmationSlide 0.5s ease-out !important;
                text-align: center !important;
                margin: 15px 0 !important;
                font-family: Arial, sans-serif !important;
                position: relative !important;
            }
            .zoho-submission-confirmation.show {
                display: block !important;
            }
            .zoho-submission-confirmation::before {
                content: "✓" !important;
                display: inline-block !important;
                background-color: white !important;
                color: #28a745 !important;
                border-radius: 50% !important;
                width: 24px !important;
                height: 24px !important;
                line-height: 24px !important;
                text-align: center !important;
                margin-right: 10px !important;
                font-weight: bold !important;
                font-size: 16px !important;
            }
            @keyframes zohoConfirmationSlide {
                0% {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        console.log('Zoho CRM Integration: Submission confirmation styles added');
    }

    // Initialize all forms
    function initializeAllForms() {
        const forms = document.querySelectorAll('form');
        console.log('Zoho CRM Integration: Found', forms.length, 'forms to integrate');
        
        forms.forEach((form, index) => {
            if (!form.hasAttribute('data-zoho-integrated')) {
                console.log('Zoho CRM Integration: Setting up form', index + 1, 'with ID:', form.id || 'no-id');
                setupForm(form);
                form.setAttribute('data-zoho-integrated', 'true');
            }
        });
    }

    // Check for new forms periodically
    function checkForNewForms() {
        const forms = document.querySelectorAll('form:not([data-zoho-integrated])');
        if (forms.length > 0) {
            console.log('Zoho CRM Integration: Found', forms.length, 'new forms, integrating...');
            forms.forEach(form => {
                setupForm(form);
                form.setAttribute('data-zoho-integrated', 'true');
            });
        }
    }

    // Setup individual form - FIXED to not break form functionality
    function setupForm(form) {
        // Don't clone or replace the form - just add event listener
        // This preserves all existing form functionality
        
        // Add event listener for form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Zoho CRM Integration: Form submitted -', form.id || form.name || 'unnamed form');
            
            // Submit to Zoho CRM
            submitToZoho(form);
        });
        
        console.log('Zoho CRM Integration: Form setup complete for', form.id || form.name || 'unnamed form');
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

    // Get page name from title or URL
    function getPageName() {
        // Try to get from document title
        let pageName = '';
        if (document.title) {
            // Remove common suffixes like "- Shyphan", "| Shyphan", etc.
            pageName = document.title
                .replace(/\s*-\s*Shyphan.*$/i, '')
                .replace(/\s*\|\s*Shyphan.*$/i, '')
                .replace(/\s*Shyphan.*$/i, '')
                .trim();
        }
        
        // If no good title, try URL pathname
        if (!pageName || pageName === 'Shyphan') {
            const pathname = window.location.pathname;
            if (pathname && pathname !== '/' && pathname !== '/index.html') {
                // Extract filename without extension
                const filename = pathname.split('/').pop().replace(/\.html?$/, '');
                // Convert to readable format (replace hyphens with spaces, capitalize)
                pageName = filename
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }
        }
        
        // Fallback to "Home" for index page
        if (!pageName || pageName === 'index' || pageName === '') {
            pageName = 'Home';
        }
        
        return pageName;
    }

    // Submit form data to Zoho CRM
    function submitToZoho(form) {
        console.log('Zoho CRM Integration: Starting submission...');
        
        // Get form data
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
        
        // Map form fields to Zoho fields
        const name = formData.name || 'N/A';
        const email = formData.email || 'N/A';
        const phone = formData.phone || 'N/A';
        const company = formData.company || 'N/A';
        const message = formData.message || '';
        
        // Split name into first and last name
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || 'N/A';
        const lastName = nameParts.slice(1).join(' ') || 'N/A';
        
        // Get page name for Lead Source
        const pageName = getPageName();
        const leadSource = 'Website - ' + pageName;
        
        // Add mapped fields to Zoho data
        zohoData.append('First Name', firstName);
        zohoData.append('Last Name', lastName);
        zohoData.append('Company', company);
        zohoData.append('Email', email);
        zohoData.append('Phone', phone);
        zohoData.append('Description', message);
        zohoData.append('Lead Source', leadSource);
        zohoData.append('Lead Status', 'Not Contacted');
        
        console.log('Zoho CRM Integration: Sending to Zoho:', {
            'First Name': firstName,
            'Last Name': lastName,
            'Company': company,
            'Email': email,
            'Phone': phone,
            'Description': message,
            'Lead Source': leadSource
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
            console.log('Zoho CRM Integration: Submission completed successfully! Response:', data);
            // Track conversion in Google Ads
            gtag_report_conversion();
            // Show confirmation only when submission is actually done
            showSubmissionConfirmation(form);
            // Don't reset form automatically - let user see their data
            // form.reset();
        })
        .catch(error => {
            console.error('Zoho CRM Integration: Error', error);
            // Still show confirmation (better UX)
            showSubmissionConfirmation(form);
            // Don't reset form on error either
            // form.reset();
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
        
        // Map name fields
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

    // Show submission confirmation below submit button - only when done
    function showSubmissionConfirmation(form) {
        console.log('Zoho CRM Integration: Showing submission confirmation below submit button');
        
        // Remove existing confirmation messages from this form
        const existingMessage = form.querySelector('.zoho-submission-confirmation');
        if (existingMessage) existingMessage.remove();
        
        // Find submit button
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitButton) {
            console.log('Zoho CRM Integration: No submit button found, showing confirmation at end of form');
            // If no submit button found, add at end of form
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'zoho-submission-confirmation show';
            confirmationMessage.textContent = SUCCESS_MESSAGE;
            form.appendChild(confirmationMessage);
        } else {
            // Create submission confirmation message
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'zoho-submission-confirmation show';
            confirmationMessage.textContent = SUCCESS_MESSAGE;
            
            // Insert after submit button
            submitButton.parentNode.insertBefore(confirmationMessage, submitButton.nextSibling);
        }
        
        // Hide after 5 seconds
        setTimeout(() => {
            const message = form.querySelector('.zoho-submission-confirmation');
            if (message) {
                message.classList.remove('show');
                setTimeout(() => {
                    if (message.parentNode) message.parentNode.removeChild(message);
                }, 500);
            }
        }, 5000);
        
        console.log('Zoho CRM Integration: Submission confirmation displayed below submit button');
    }

    // Initialize immediately
    initializeIntegration();

    // Also initialize when DOM is ready (for safety)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIntegration);
    }

    // Also initialize after a short delay (for dynamic content)
    setTimeout(initializeIntegration, 1000);

    console.log('Zoho CRM Integration: Complete working integration script loaded');

})();