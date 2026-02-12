document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded'); // Debug: Confirm script runs

    // Hamburger menu toggle (consolidated from duplicates)
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        console.log('Hamburger and navLinks found'); // Debug

        // Toggle menu on hamburger click
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
            console.log('Hamburger clicked, menu active:', navLinks.classList.contains('active')); // Debug
        });

        // Close menu when clicking outside or on a link
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                console.log('Menu closed by outside click'); // Debug
            }
        });

        // Close menu on link click
        navLinks.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            console.log('Menu closed by link click'); // Debug
        });
    } else {
        console.error('Hamburger or navLinks not found - check HTML IDs'); // Debug
    }

    // Enhanced Star Rating Interactivity
    const stars = document.querySelectorAll('.star-rating input');
    stars.forEach(star => {
        star.addEventListener('change', function() {
            // Add a brief glow effect on selection
            const labels = document.querySelectorAll('.star-rating label');
            labels.forEach(label => label.style.animation = 'none'); // Reset
            setTimeout(() => {
                labels.forEach(label => label.style.animation = 'pulse 0.5s ease');
            }, 10);
        });
    });

    // Dynamic account details for Bank Transfer
    const paymentSelect = document.getElementById('payment');
    const accountDetails = document.getElementById('account-details');

    if (paymentSelect && accountDetails) {
        paymentSelect.addEventListener('change', function() {
            if (this.value === 'transfer') {
                accountDetails.style.display = 'block';
            } else {
                accountDetails.style.display = 'none';
            }
        });
    }
});