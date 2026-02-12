// Fade-in animations on scroll (unchanged)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
});

document.querySelectorAll('.feature-card, .about-card, .subject-card, .why-card, .faq-item').forEach(card => {
    observer.observe(card);
});

// Opay Payment Confirmation and Receipt Generation
document.getElementById('confirmButton')?.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const txnRef = document.getElementById('txnRef').value;

    if (!name || !email || !phone || !subject || !txnRef) {
        alert('Please fill in all fields, including transaction reference.');
        return;
    }

    // Simulate confirmation (In production, verify manually or via Opay API)
    alert('Payment confirmed! Generating receipt...');

    // Generate Receipt
    const date = new Date().toLocaleString();

    document.getElementById('receiptName').textContent = name;
    document.getElementById('receiptEmail').textContent = email;
    document.getElementById('receiptPhone').textContent = phone;
    document.getElementById('receiptSubject').textContent = subject;
    document.getElementById('receiptTxnRef').textContent = txnRef;
    document.getElementById('receiptDate').textContent = date;

    document.getElementById('receipt').style.display = 'block';
});

// Print Receipt Function
function printReceipt() {
    const receipt = document.getElementById('receipt');
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Receipt</title></head><body>' + receipt.innerHTML + '</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// Hamburger Menu Toggle (Enhanced)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger?.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
    const bars = hamburger.querySelectorAll('.bar');
    if (hamburger.classList.contains('open')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close menu on outside click or link click
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

navLinks?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
        hamburger.classList.remove('open');
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

