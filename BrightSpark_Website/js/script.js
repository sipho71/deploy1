 document.addEventListener("DOMContentLoaded", function () {
    
    /* ==========================================================================
       1. INTERACTIVE LEAFLET MAP (Contact Page)
       ========================================================================== */
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // GPS Coordinates for Kuilsriver, Cape Town (-33.9180, 18.6795)
        const map = L.map('map').setView([-33.9180, 18.6795], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([-33.9180, 18.6795]).addTo(map)
            .bindPopup('<strong>BrightSpark Head Office</strong><br>17 Primrose Street, Kuilsriver')
            .openPopup();
    }

    /* ==========================================================================
       2. DYNAMIC SERVICES FILTER & SEARCH ENGINE (Services Page)
       ========================================================================== */
    const searchInput = document.getElementById('serviceSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const dividers = document.querySelectorAll('.service-divider');

    function executeServiceFiltering() {
        const queryValue = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedActiveFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

        serviceCards.forEach((card) => {
            const headingText = card.querySelector('h3').innerText.toLowerCase();
            const bodyDescriptionText = card.querySelector('p').innerText.toLowerCase();
            const cardCategory = card.dataset.category;

            // Strict string pattern checks for live index extraction
            const matchesSearchQuery = headingText.includes(queryValue) || bodyDescriptionText.includes(queryValue);
            const matchesCategoryFilter = selectedActiveFilter === 'all' || cardCategory === selectedActiveFilter;

            if (matchesSearchQuery && matchesCategoryFilter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });

        // Toggle layout dividers based on active matching structures to keep UI clean
        dividers.forEach(divider => {
            if (selectedActiveFilter !== 'all' || queryValue !== '') {
                divider.style.display = "none";
            } else {
                divider.style.display = "block";
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', executeServiceFiltering);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            executeServiceFiltering();
        });
    });

    /* ==========================================================================
       3. RESPONSIVE GALLERY LIGHTBOX MODAL (Services Page)
       ========================================================================== */
    const lightboxModal = document.getElementById('galleryLightbox');
    const modalImage = document.getElementById('modalImg');
    const modalCaption = document.getElementById('lightboxCaption');
    const imageTriggers = document.querySelectorAll('.lightbox-trigger');
    const closeTrigger = document.querySelector('.close-lightbox');

    imageTriggers.forEach(img => {
        img.addEventListener('click', function () {
            if (lightboxModal && modalImage) {
                lightboxModal.style.display = "flex"; // Centered flex overlay display
                modalImage.src = this.src;
                if (modalCaption) {
                    modalCaption.innerText = this.alt;
                }
            }
        });
    });

    if (closeTrigger && lightboxModal) {
        closeTrigger.addEventListener('click', function () {
            lightboxModal.style.display = "none";
        });

        // Close when clicking safely outside the image area on the dim backdrop mask
        lightboxModal.addEventListener('click', function (event) {
            if (event.target === lightboxModal) {
                lightboxModal.style.display = "none";
            }
        });
    }

    /* ==========================================================================
       4. ENQUIRY FORM VALIDATION & SUCCESS HANDLER (Enquiry Page)
       ========================================================================== */
    const enquiryForm = document.getElementById('enquiryForm');
    const urgencyInput = document.getElementById('urgency');
    
    if (urgencyInput) {
        urgencyInput.addEventListener('input', function() {
            const val = urgencyInput.value;
            const labels = ["Low", "Minor", "Medium", "High", "Emergency"];
            document.getElementById('urgency-val').innerText = `(${val} = ${labels[val-1]})`;
        });
    }

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault(); 
            document.querySelectorAll('.error-message').forEach(el => el.innerText = "");
            let isValid = true;

            const fname = document.getElementById('fname').value.trim();
            const email = document.getElementById('u-email').value.trim();
            const phone = document.getElementById('u-phone').value.trim();
            const service = document.getElementById('service-list').value;
            const details = document.getElementById('details').value.trim();
            const date = document.getElementById('pref-date').value;
            const propRadio = document.querySelector('input[name="property-type"]:checked');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\d{10}$/;

            if (fname === "") {
                document.getElementById('fname-error').innerText = "Full name is required.";
                isValid = false;
            }
            if (!emailRegex.test(email)) {
                document.getElementById('email-error').innerText = "Please enter a valid email address.";
                isValid = false;
            }
            if (phone !== "" && !phoneRegex.test(phone.replace(/\s+/g, ''))) {
                document.getElementById('phone-error').innerText = "Phone number must be exactly 10 digits.";
                isValid = false;
            }
            if (!propRadio) {
                document.getElementById('prop-error').innerText = "Please select a property type.";
                isValid = false;
            }
            if (service === "") {
                document.getElementById('service-error').innerText = "Please select an electrical service.";
                isValid = false;
            }
            if (details.length < 10) {
                document.getElementById('details-error').innerText = "Please provide a brief description (min 10 characters).";
                isValid = false;
            }
            if (date === "") {
                document.getElementById('date-error').innerText = "Please select a preferred visit date.";
                isValid = false;
            }

            if (isValid) {
                 enquiryForm.submit();
            }
        });
    }

    /* ==========================================================================
       5. CONTACT FORM VALIDATION & SIMULATED SMTP ROUTINE (Contact Page)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            document.querySelectorAll('.error-message').forEach(el => el.innerText = "");
            let isValid = true;

            const cname = document.getElementById('cname').value.trim();
            const cemail = document.getElementById('cemail').value.trim();
            const cmessage = document.getElementById('cmessage').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (cname === "") {
                document.getElementById('cname-error').innerText = "Name field cannot be blank.";
                isValid = false;
            }
            if (!emailRegex.test(cemail)) {
                document.getElementById('cemail-error').innerText = "Valid email address required.";
                isValid = false;
            }
            if (cmessage.length < 5) {
                document.getElementById('cmessage-error').innerText = "Message must contain at least 5 characters.";
                isValid = false;
            }

            if (isValid) {
                 contactForm.submit();
            }
        });
    }
});