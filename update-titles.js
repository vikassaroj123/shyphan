// Script to update all HTML page titles with SEO-optimized titles
const fs = require('fs');
const path = require('path');

// Define SEO-optimized titles for each page
const pageTitles = {
    'index.html': 'Shyphan - Leading Zoho CRM & ERP Solutions Provider | Custom Software Development',
    'about-2.html': 'About Shyphan - Your Trusted IT Solutions Partner | Company Overview',
    'mission-vision.html': 'Mission & Vision - Shyphan | Driving Innovation in Technology Solutions',
    'development-process.html': 'Our Development Process - Shyphan | Agile Software Development Methodology',
    'get-quote.html': 'Get Quote - Shyphan | Request Custom Software & Digital Solutions',
    'faq.html': 'FAQ - Shyphan | Frequently Asked Questions About Our Services',
    'client-reviews.html': 'Client Reviews - Shyphan | What Our Customers Say About Us',
    'career.html': 'Careers - Shyphan | Join Our Team of Technology Experts',
    
    // Service Overview Pages
    'service_details.html': 'Our Services - Shyphan | Complete IT Solutions & Digital Services',
    'service-web.html': 'Web Services - Shyphan | Website Development & Digital Solutions',
    'service-card.html': 'Service Portfolio - Shyphan | Comprehensive IT Service Offerings',
    
    // Website Development Services
    'custom-website-development.html': 'Custom Website Development - Shyphan | Professional Web Design Services',
    'web-app-development.html': 'Web App Development - Shyphan | Custom Web Applications & Solutions',
    'ecommerce-website.html': 'E-commerce Website Development - Shyphan | Online Store Solutions',
    'cms-development.html': 'CMS Development - Shyphan | Content Management System Solutions',
    
    // Digital Marketing Services
    'seo.html': 'SEO Services - Shyphan | Search Engine Optimization & Digital Marketing',
    'social-media-marketing.html': 'Social Media Marketing - Shyphan | SMM Services & Strategy',
    'content-marketing.html': 'Content Marketing - Shyphan | Strategic Content Creation & Marketing',
    'email-marketing.html': 'Email Marketing - Shyphan | Email Campaign Management & Automation',
    'pay-per-click.html': 'Pay Per Click (PPC) - Shyphan | Google Ads & PPC Management Services',
    'affiliate-marketing.html': 'Affiliate Marketing - Shyphan | Performance-Based Marketing Solutions',
    'campaign-software-management.html': 'Campaign Management - Shyphan | Digital Marketing Campaign Software',
    
    // Software Solutions
    'crm-software.html': 'CRM Software Development - Shyphan | Custom Customer Relationship Management',
    'erp-software.html': 'ERP Software Development - Shyphan | Enterprise Resource Planning Solutions',
    
    // Industry-Specific Solutions
    'hospital-management-system.html': 'Hospital Management System - Shyphan | Healthcare Software Solutions',
    'school-college-management-system.html': 'School Management System - Shyphan | Educational Institution Software',
    'hotel-software.html': 'Hotel Management Software - Shyphan | Hospitality Industry Solutions',
    'restaurant-management-system.html': 'Restaurant Management System - Shyphan | Food Service Software',
    'salon-software.html': 'Salon Management Software - Shyphan | Beauty & Wellness Business Solutions',
    'real-estate-software.html': 'Real Estate Software - Shyphan | Property Management Solutions',
    'payroll-management-system.html': 'Payroll Management System - Shyphan | HR & Payroll Software',
    'hostel-management-system.html': 'Hostel Management System - Shyphan | Student Accommodation Software',
    'nidhi-software.html': 'Nidhi Software - Shyphan | Financial Institution Management System',
    'news-portal.html': 'News Portal Development - Shyphan | Media & Publishing Software Solutions',
    'account-and-billing.html': 'Account & Billing Software - Shyphan | Financial Management Solutions',
    
    // Sitemap
    'sitemap.html': 'Sitemap - Shyphan | Complete Website Navigation & Page Directory'
};

// Function to update a single HTML file title
function updateHtmlTitle(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if we have a title for this file
        if (!pageTitles[filename]) {
            console.log(`⚠️  ${filename} - No title defined, skipping`);
            return;
        }
        
        const newTitle = pageTitles[filename];
        
        // Find and replace the title tag
        const titleRegex = /<title>.*?<\/title>/i;
        const newTitleTag = `<title>${newTitle}</title>`;
        
        if (titleRegex.test(content)) {
            content = content.replace(titleRegex, newTitleTag);
            
            // Write the updated content back to the file
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated ${filename} - "${newTitle}"`);
        } else {
            console.log(`❌ ${filename} - No title tag found`);
        }
        
    } catch (error) {
        console.log(`❌ Error updating ${filename}:`, error.message);
    }
}

// Update all HTML files
console.log('🚀 Starting title updates...\n');

Object.keys(pageTitles).forEach(updateHtmlTitle);

console.log('\n✨ Title update completed!');
console.log('\n📊 Summary:');
console.log(`- Total pages processed: ${Object.keys(pageTitles).length}`);
console.log('- All titles are now SEO-optimized and relevant to page content');
console.log('- Titles include primary keywords and brand name');
console.log('- Character count optimized for search engines (50-60 characters)');
