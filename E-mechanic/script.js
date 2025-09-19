// E-Mechanic App JavaScript

// Dataset for services and pricing
const servicesData = [
    { 
        service: "Accelerator Throttle Issue (Ola S1)", 
        showroomPrice: 1800, 
        emechanicPrice: 900,
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>`
    },
    { 
        service: "Battery Connector Problem (Ather 450X)", 
        showroomPrice: 2200, 
        emechanicPrice: 950,
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="6" width="18" height="10" rx="2" ry="2"/>
            <line x1="23" y1="13" x2="23" y2="11"/>
        </svg>`
    },
    { 
        service: "Annual Maintenance Checkup", 
        showroomPrice: 4000, 
        emechanicPrice: 2500,
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>`
    },
    { 
        service: "Brake Pad Replacement", 
        showroomPrice: 1200, 
        emechanicPrice: 700,
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>`
    }
];

// Global state
let currentTab = 'home';
let currentService = null;
let progressStep = 1;
let trackInterval = null;
let isServiceBooked = false;
let bookingDetails = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    populateServices();
    populateServiceHistory();
    setupEventListeners();
});

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to selected nav item
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    currentTab = tabName;
    
    // Handle tab-specific logic
    if (tabName === 'track') {
        updateTrackPage();
    } else {
        stopTrackingDemo();
    }
    
}

// Populate services on home tab
function populateServices() {
    const servicesGrid = document.getElementById('services-grid');
    servicesGrid.innerHTML = '';
    
    servicesData.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <div class="service-header">
                <div class="service-icon">${service.icon}</div>
                <div class="service-name">${service.service}</div>
            </div>
            <div class="service-pricing">
                <span class="showroom-price">₹${service.showroomPrice.toLocaleString()}</span>
                <span class="emechanic-price">₹${service.emechanicPrice.toLocaleString()}</span>
            </div>
        `;
        servicesGrid.appendChild(serviceCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Service type toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const datePicker = document.getElementById('date-picker');
            if (this.dataset.type === 'schedule') {
                datePicker.style.display = 'block';
            } else {
                datePicker.style.display = 'none';
            }
        });
    });
    
    // Booking form submission
    document.getElementById('booking-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleBookingSubmission();
    });
}

// Handle booking form submission
function handleBookingSubmission() {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    // Validate form
    const name = formData.get('name');
    const evBrand = formData.get('ev-brand');
    const issue = formData.get('issue');
    
    if (!name || !evBrand || !issue) {
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Booking...';
    submitButton.disabled = true;
    
    // Simulate API call with realistic timing
    setTimeout(() => {
        // Get selected service based on form data
        currentService = servicesData.find(service => {
            if (issue === 'accelerator') return service.service.includes('Accelerator');
            if (issue === 'battery') return service.service.includes('Battery');
            if (issue === 'brake') return service.service.includes('Brake');
            if (issue === 'annual') return service.service.includes('Annual');
            return false;
        }) || servicesData[0];
        
        // Set booking state
        isServiceBooked = true;
        bookingDetails = {
            name: name,
            evBrand: evBrand,
            issue: issue,
            serviceType: document.querySelector('.toggle-btn.active').dataset.type,
            bookingTime: new Date(),
            mechanic: 'Ravi Kumar',
            eta: '25 mins'
        };
        
        // Service booked silently
        
        // Show mechanic card
        showMechanicCard();
        
        // Reset form
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Auto-scroll to mechanic card
        setTimeout(() => {
            document.getElementById('mechanic-card').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 500);
        
    }, 2000);
}

// Show mechanic assignment card
function showMechanicCard() {
    const mechanicCard = document.getElementById('mechanic-card');
    const showroomPrice = document.getElementById('showroom-price');
    const emechanicPrice = document.getElementById('emechanic-price');
    const discountBadge = document.getElementById('discount-badge');
    
    if (currentService) {
        showroomPrice.textContent = `₹${currentService.showroomPrice.toLocaleString()}`;
        emechanicPrice.textContent = `₹${currentService.emechanicPrice.toLocaleString()}`;
        
        const discount = Math.round(((currentService.showroomPrice - currentService.emechanicPrice) / currentService.showroomPrice) * 100);
        discountBadge.textContent = `-${discount}%`;
    }
    
    mechanicCard.style.display = 'block';
    mechanicCard.scrollIntoView({ behavior: 'smooth' });
}

// Call mechanic functionality
function callMechanic() {
    // In a real app, this would trigger a phone call
    // Silent call - no popup or message
}

// Update track page based on booking state
function updateTrackPage() {
    const trackTab = document.getElementById('track-tab');
    
    if (isServiceBooked) {
        // Show tracking interface
        showTrackingInterface();
        startTrackingDemo();
    } else {
        // Show no booking state
        showNoBookingState();
    }
}

// Show tracking interface when service is booked
function showTrackingInterface() {
    const trackTab = document.getElementById('track-tab');
    
    // Update header with booking info
    const trackHeader = trackTab.querySelector('.track-header');
    trackHeader.innerHTML = `
        <h2 class="section-title">Service Checkpoints</h2>
        <p class="track-subtitle">Monitor your repair progress in real-time</p>
        <div class="booking-info">
            <div class="booking-detail">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${getServiceName(bookingDetails.issue)}</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">Mechanic:</span>
                <span class="detail-value">${bookingDetails.mechanic}</span>
            </div>
            <div class="booking-detail">
                <span class="detail-label">ETA:</span>
                <span class="detail-value">${bookingDetails.eta}</span>
            </div>
        </div>
    `;
    
    // Show progress section
    const progressSection = trackTab.querySelector('.progress-section');
    progressSection.style.display = 'block';
    
    // Remove no-booking section if it exists
    const noBookingSection = trackTab.querySelector('.no-booking-section');
    if (noBookingSection) {
        noBookingSection.remove();
    }
}

// Show no booking state
function showNoBookingState() {
    const trackTab = document.getElementById('track-tab');
    
    // Update header
    const trackHeader = trackTab.querySelector('.track-header');
    trackHeader.innerHTML = `
        <h2 class="section-title">No Active Service</h2>
        <p class="track-subtitle">Book a service to track your repair progress</p>
    `;
    
    // Hide progress section
    const progressSection = trackTab.querySelector('.progress-section');
    progressSection.style.display = 'none';
    
    // Add book service section
    let noBookingSection = trackTab.querySelector('.no-booking-section');
    if (!noBookingSection) {
        noBookingSection = document.createElement('div');
        noBookingSection.className = 'no-booking-section';
        trackTab.appendChild(noBookingSection);
    }
    
    noBookingSection.innerHTML = `
        <div class="no-booking-card">
            <div class="no-booking-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
            </div>
            <h3 class="no-booking-title">Ready to Book?</h3>
            <p class="no-booking-description">Get your EV serviced by certified mechanics at your doorstep</p>
            <button class="book-service-btn" onclick="switchTab('book')">
                Book Service Now
            </button>
        </div>
    `;
}

// Get service name from issue value
function getServiceName(issue) {
    const serviceNames = {
        'accelerator': 'Accelerator Throttle Issue',
        'battery': 'Battery Connector Problem',
        'brake': 'Brake Pad Replacement',
        'annual': 'Annual Maintenance Checkup',
        'charging': 'Charging Port Issue',
        'motor': 'Motor Malfunction',
        'display': 'Display Screen Problem',
        'horn': 'Horn Not Working',
        'lights': 'Headlight/Taillight Issue',
        'tire': 'Tire Puncture/Replacement',
        'chain': 'Chain Lubrication',
        'suspension': 'Suspension Problem',
        'controller': 'Controller Unit Issue',
        'wiring': 'Wiring Harness Problem',
        'unknown': 'Unknown Issue',
        'other': 'Other'
    };
    return serviceNames[issue] || 'Service';
}

// Start tracking demo
function startTrackingDemo() {
    if (!isServiceBooked) return;
    
    // Reset to step 1 (Assigned)
    progressStep = 1;
    updateProgressBar();
    
    // Auto-progress through steps every 5 minutes
    trackInterval = setInterval(() => {
        progressStep++;
        if (progressStep <= 4) {
            updateProgressBar();
        } else {
            stopTrackingDemo();
        }
    }, 300000); // 5 minutes = 300,000 milliseconds
}


// Stop tracking demo
function stopTrackingDemo() {
    if (trackInterval) {
        clearInterval(trackInterval);
        trackInterval = null;
    }
}

// Update progress bar
function updateProgressBar() {
    const line = document.querySelector('.line');
    const dots = document.querySelectorAll('.dot');
    const labels = document.querySelectorAll('.label');
    
    // Update line progress
    if (line) {
        line.className = `line active-${progressStep}`;
    }
    
    // Update dots and labels
    dots.forEach((dot, index) => {
        const stepNumber = index + 1;
        
        // Remove all state classes
        dot.classList.remove('active', 'completed');
        
        if (stepNumber < progressStep) {
            // Completed steps
            dot.classList.add('completed');
        } else if (stepNumber === progressStep) {
            // Current active step
            dot.classList.add('active');
        }
    });
    
    // Update labels
    labels.forEach((label, index) => {
        const stepNumber = index + 1;
        
        // Remove all state classes
        label.classList.remove('active', 'completed');
        
        if (stepNumber < progressStep) {
            // Completed steps
            label.classList.add('completed');
        } else if (stepNumber === progressStep) {
            // Current active step
            label.classList.add('active');
        }
    });
}

// Add step-specific notifications
function addStepNotification() {
    const notifications = [
        { 
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>`, 
            text: 'Ravi Kumar is on the way! ETA: 15 minutes' 
        },
        { 
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>`, 
            text: 'Repair in progress - Working on your EV' 
        },
        { 
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
            </svg>`, 
            text: 'Repair completed - Quality check in progress' 
        }
    ];
    
    if (progressStep <= 4) {
        const notification = notifications[progressStep - 2];
        if (notification) {
            addNotification(notification.icon, notification.text);
        }
    }
}

// Add notification
function addNotification(icon, text) {
    const notificationsSection = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">${text}</div>
    `;
    
    notificationsSection.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Populate service history
function populateServiceHistory() {
    const historyList = document.getElementById('service-history');
    historyList.innerHTML = '';
    
    // Show last 3 services
    const recentServices = servicesData.slice(0, 3);
    
    recentServices.forEach((service, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date();
        date.setDate(date.getDate() - (index + 1) * 7); // Simulate past dates
        
        historyItem.innerHTML = `
            <div class="history-service">${service.service}</div>
            <div class="history-date">${date.toLocaleDateString()}</div>
            <div class="history-pricing">
                <span class="showroom-price">Showroom: ₹${service.showroomPrice.toLocaleString()}</span>
                <span class="emechanic-price">E-Mechanic: ₹${service.emechanicPrice.toLocaleString()}</span>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Logout functionality
function logout() {
    // Silent logout - no popup or message
    // In a real app, this would redirect to the login screen
}

// Utility function to format currency
function formatCurrency(amount) {
    return `₹${amount.toLocaleString()}`;
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    // Adjust layout if needed
    if (window.innerWidth < 480) {
        // Mobile-specific adjustments
        document.querySelectorAll('.service-card').forEach(card => {
            card.style.padding = '1rem';
        });
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function() {}, {passive: true});

// Prevent zoom on double tap for mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Handle tab navigation
        const focusableElements = document.querySelectorAll('button, input, select, [tabindex]');
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex > 0) {
                focusableElements[currentIndex - 1].focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex < focusableElements.length - 1) {
                focusableElements[currentIndex + 1].focus();
            }
        }
    }
});

// Add loading states for better UX
function showLoading(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
}

// Add error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #EF4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 3000);
}

// Add success messages
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #22C55E;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Reset function for clean state
function resetApp() {
    // Reset booking form
    document.getElementById('booking-form').reset();
    document.getElementById('mechanic-card').style.display = 'none';
    
    // Reset booking state
    isServiceBooked = false;
    bookingDetails = null;
    
    // Reset tracking
    stopTrackingDemo();
    progressStep = 1;
    document.getElementById('notifications').innerHTML = '';
    updateProgressBar();
    
    // Reset to home tab
    switchTab('home');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    .error-message, .success-message {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    #demo-controls button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);

