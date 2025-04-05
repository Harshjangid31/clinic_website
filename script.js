// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Initialize EmailJS
(function() {
    // Initialize with your EmailJS public key
    emailjs.init("t-mu5P2docNt9MF6u");
})();

// Appointment Form Handling
const appointmentForm = document.getElementById('appointmentForm');

appointmentForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(appointmentForm);
    const appointmentData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        message: formData.get('message')
    };

    // Debug log
    console.log('Form Data:', appointmentData);

    // Validate form data
    if (!validateForm(appointmentData)) {
        return;
    }

    try {
        // Show loading state
        const submitBtn = appointmentForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Format date for display
        const formattedDate = formatDate(appointmentData.date);

        // Debug log
        console.log('Sending email with data:', {
            user_email: appointmentData.email,
            user_name: appointmentData.name,
            user_phone: appointmentData.phone,
            date: formattedDate,
            time: appointmentData.time,
            message: appointmentData.message || "No specific concerns mentioned"
        });

        // Send email using EmailJS
        const response = await emailjs.send(
            "service_e94wczc",
            "template_bmvvqwe", {
                user_email: appointmentData.email,
                user_name: appointmentData.name,
                user_phone: appointmentData.phone,
                date: formattedDate,
                time: appointmentData.time,
                message: appointmentData.message || "No specific concerns mentioned",
                to_email: "harshharsh9949@gmail.com"
            }
        );

        // Debug log
        console.log('First email response:', response);

        if (response.status === 200) {
            // Show success message
            showNotification('Appointment request sent successfully! We will contact you shortly.', 'success');

            // Send confirmation email to patient
            const confirmResponse = await emailjs.send(
                "service_e94wczc",
                "template_2asg0a1", {
                    to_name: appointmentData.name,
                    to_email: appointmentData.email,
                    appointment_date: formattedDate,
                    appointment_time: appointmentData.time
                }
            );

            // Debug log
            console.log('Confirmation email response:', confirmResponse);

            // Reset form
            appointmentForm.reset();
        } else {
            throw new Error('Failed to send email');
        }
    } catch (error) {
        console.error('Detailed error:', error);
        showNotification(`Error booking appointment: ${error.message || 'Unknown error'}. Please try WhatsApp or call us directly.`, 'error');
    } finally {
        // Reset button state
        const submitBtn = appointmentForm.querySelector('.submit-btn');
        submitBtn.textContent = 'Book Appointment';
        submitBtn.disabled = false;
    }
});

// Form validation
function validateForm(data) {
    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.date || !data.time) {
        showNotification('Please fill in all required fields.', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    // Phone validation (Indian phone number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid 10-digit phone number.', 'error');
        return false;
    }

    // Date validation
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        showNotification('Please select a future date.', 'error');
        return false;
    }

    return true;
}

// Helper function to format date
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = '#fff';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease-out';

    // Set background color based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    }

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// WhatsApp Integration
const whatsappBtn = document.querySelector('.whatsapp-btn');
whatsappBtn.addEventListener('click', (e) => {
    // You can customize the message here
    const message = 'Hello! I would like to book an appointment.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917891781718?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
});