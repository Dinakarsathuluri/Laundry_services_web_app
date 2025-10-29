
(function() {
    emailjs.init("3ya3YwXDhMqPGPgCM");
})();

const services = [
    { id: 1, name: 'Dry Cleaning', price: 200.00, icon: '👔', currency: '₹' },
    { id: 2, name: 'Wash & Fold', price: 100.00, icon: '🧺', currency: '₹' },
    { id: 3, name: 'Ironing', price: 30.00, icon: '♨', currency: '₹' },
    { id: 4, name: 'Stain Removal', price: 500.00, icon: '🧴', currency: '₹' },
    { id: 5, name: 'Leather & Suede Cleaning', price: 999.00, icon: '🧥', currency: '₹' },
    { id: 6, name: 'Wedding Dress Cleaning', price: 2800.00, icon: '👰', currency: '₹' }
];

let cart = [];
let messageTimeout;

const servicesListDiv = document.querySelector('.servicesList');
const cartTableBody = document.getElementById('cartTable-body');
const totalAmountSpan = document.getElementById('totalAmount');
const bookBtn = document.querySelector('.book-btn');
const formMessage = document.getElementById('formMessage');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const bookingForm = document.getElementById('bookingForm');

function renderservices() {
    servicesListDiv.innerHTML = '';
    services.forEach(service => {
        const incart = cart.some(item => item.id === service.id);
        const itemdiv = document.createElement('div');

        itemdiv.style = `margin:45px 0px`;

        itemdiv.innerHTML = `
      <span class="service-icon" style="font-size:2rem;">${service.icon}</span>
      <span style="font-size:1.2rem;">${service.name}</span>
      <span style="font-size:1.5rem; margin-left:15px; color: dodgerblue;">${service.currency}${service.price}</span>
      <button style="float:right; margin-top:12px; font-size:1rem; font-weight:bold; padding:10px 20px;" class="${incart ? 'remove-item-btn' : 'add-item-btn'} btn" data-id="${service.id}">
      ${incart ? 'Remove Item <span style=" font-size:1rem;">⊖</span>' : 'Add Item <span style=" font-size:1rem;">⊕</span>'}
      </button>
    `;
        servicesListDiv.appendChild(itemdiv)
    });

    document.querySelectorAll('.add-item-btn').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

function addToCart(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service && !cart.some(item => item.id === serviceId)) {
        cart.push(service);
        updateCart();
        renderservices();
    }
}

function removeFromCart(serviceId) {
    cart = cart.filter(item => item.id !== serviceId);
    updateCart();
    renderservices();
}

function updateCart() {
    cartTableBody.innerHTML = '';

    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr class="empty-cart">
                <td colspan="3">
                    <span id="i-icon">ⓘ</span>
                    <p id="tbody-para">No Items Added</p>
                    <p>Add items to the cart from the services bar</p>
                </td>
            </tr>
        `;
        totalAmountSpan.textContent = '₹0.00';
        bookBtn.classList.add('blurred');
        bookBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="text-align:center; padding:10px;">${index + 1}</td>
                <td style="text-align:center; padding:10px;">${item.name}</td>
                <td style="text-align:center; padding:10px;">${item.currency}${item.price.toFixed(2)}</td>
            `;
            cartTableBody.appendChild(row);
        });
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalAmountSpan.textContent = `₹${total.toFixed(2)}`;

        bookBtn.classList.remove('blurred');
        bookBtn.disabled = false;
    }
}

// Input validation listeners
fullNameInput.addEventListener('focus', showValidationWarning);
fullNameInput.addEventListener('input', showValidationWarning);

emailInput.addEventListener('focus', showValidationWarning);
emailInput.addEventListener('input', showValidationWarning);

phoneInput.addEventListener('focus', showValidationWarning);
phoneInput.addEventListener('input', showValidationWarning);

function showValidationWarning() {
    // Only show warning if cart is empty
    if (cart.length === 0) {
        clearTimeout(messageTimeout);

        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.style.marginTop = '10px';
        formMessage.innerHTML = 'ⓘ <strong>Add the items to the cart to book</strong>';

        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
        return;
    }

    // If cart has items, validate form fields
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Check if all fields have valid input
    if (fullName === '' || email === '' || phone === '') {
        clearTimeout(messageTimeout);
        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.style.marginTop = '10px';
        formMessage.innerHTML = 'ⓘ <strong>Please fill in all fields</strong>';

        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
    } else if (!validateEmail(email)) {
        clearTimeout(messageTimeout);
        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.style.marginTop = '10px';
        formMessage.innerHTML = 'ⓘ <strong>Invalid Email Format</strong>';

        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
    } else if (!validatePhone(phone)) {
        clearTimeout(messageTimeout);
        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.style.marginTop = '10px';
        formMessage.innerHTML = 'ⓘ <strong>Phone must be 10 digits</strong>';

        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
    } else {
        clearTimeout(messageTimeout);
        formMessage.innerHTML = '';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

// Form submission handler with EmailJS integration
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate all fields
    if (!fullName || !email || !phone) {
        clearTimeout(messageTimeout);
        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.innerHTML = 'ⓘ <strong>Please fill in all fields</strong>';
        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
        return;
    }

    if (!validateEmail(email)) {
        clearTimeout(messageTimeout);
        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.innerHTML = 'ⓘ <strong>Invalid Email Format</strong>';
        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
        return;
    }

    if (!validatePhone(phone)) {
        clearTimeout(messageTimeout);
        formMessage.style.color = '#ff6b6b';
        formMessage.style.fontSize = '0.9rem';
        formMessage.innerHTML = 'ⓘ <strong>Phone must be 10 digits</strong>';
        messageTimeout = setTimeout(() => {
            formMessage.innerHTML = '';
        }, 2000);
        return;
    }

    // Prepare services list for email
    const servicesList = cart.map(item => 
        `${item.name} - ${item.currency}${item.price.toFixed(2)}`
    ).join('\n');

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    // EmailJS template parameters
    const templateParams = {
        user_name: fullName,
        user_email: email,
        user_phone: phone,
        services_list: servicesList,
        total_amount: `₹${totalAmount.toFixed(2)}`
    };

    // Show sending message
    clearTimeout(messageTimeout);
    formMessage.style.color = '#2196f3';
    formMessage.style.fontSize = '0.9rem';
    formMessage.innerHTML = 'ⓘ <strong>Sending email...</strong>';

    // Send email using EmailJS
    emailjs.send('service_g4n4sem', 'template_r9qqbyk', templateParams)
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            clearTimeout(messageTimeout);
            formMessage.style.color = '#4caf50';
            formMessage.style.fontSize = '1rem';
            formMessage.innerHTML = '✓ <strong>Thank you For Booking the Service We will get back to you soon!</strong>';

            // Reset form and cart after 3 seconds
            setTimeout(() => {
                cart = [];
                updateCart();
                renderservices();
                bookingForm.reset();
                formMessage.innerHTML = '';
            }, 3000);
        })
        .catch((error) => {
            console.log('FAILED...', error);
            
            // Show error message
            clearTimeout(messageTimeout);
            formMessage.style.color = '#ff6b6b';
            formMessage.style.fontSize = '0.9rem';
            formMessage.innerHTML = '✗ <strong>Failed to send email. Please try again.</strong>';
            
            setTimeout(() => {
                formMessage.innerHTML = '';
            }, 3000);
        });
});



renderservices();
updateCart();



