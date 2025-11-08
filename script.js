(function(){
  emailjs.init({
  publicKey: "3ya3YwXDhMqPGPgCM",
  });
})();

const servicesList = document.querySelector('.servicesList');
const cartTableBody = document.getElementById('cartTable-body');
const totalAmountSpan = document.getElementById('totalAmount');
const bookingForm = document.getElementById('bookingForm');
const bookNowButton = document.querySelector('.book-btn');
const formMessage = document.getElementById('formMessage');


const formInputs = bookingForm ? bookingForm.querySelectorAll('input') : [];
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');


let cart = [];


function renderservices() {
  cartTableBody.innerHTML = '';
    if (cart.length === 0) {
      console.log("No items in cart");
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td>
          <div class="t-body-empty">
            <span class="icon-tbody">ⓘ</span>
            <span>No Items Added</span>
            <p>Add items to the cart from the services bar</p>
          </div>
        </td>
        `;
        cartTableBody.appendChild(emptyRow);
      } else {
        cart.forEach((item, index) => {
          console.log("Rendering item:", item);
          const row = document.createElement('tr');
          row.dataset.service = item.serviceName; 
          row.innerHTML = `
          <td>
            <div class="t-body" >
              <span class="s-no">${index + 1}</span>
              <span class="service-name">${item.serviceName}</span>
              <span class="price">₹${item.price.toFixed(2)}</span>
            </div>
          </td>
          `;
          cartTableBody.appendChild(row);
        });
      }
      updateTotalAmount();
      updateBookButton();
}


function updateTotalAmount() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  console.log("Total amount calculated:", total);
  totalAmountSpan.textContent = `₹${total.toFixed(2)}`; 
}


function addToCart(serviceName, price) {
  if (!cart.some(item => item.serviceName === serviceName)) {
    cart.push({ serviceName, price });
    console.log("The service has been added", serviceName);
    renderservices();
  }
}


function removeFromCart(serviceName) {
  cart = cart.filter(item => item.serviceName !== serviceName);
  console.log("The service has been removed", serviceName);
  renderservices();
}


function togglecartitem(button, serviceName, price) {
  const isAdded = cart.some(item => item.serviceName === serviceName);
  if (isAdded) {
    removeFromCart(serviceName);
    button.innerHTML = 'Add Item <span>+</span>';
    button.style.color = '';
  } else {
    addToCart(serviceName, price);
    button.innerHTML = 'Remove Item <span>-</span>';
    button.style.color = 'red';
  }
}



function updateBookButton() {
  bookNowButton.disabled = cart.length === 0;
}


if (formMessage) {
  formMessage.style.display = 'none';
}


function showFormMessage() {
  if (cart.length === 0 && formMessage) {
    formMessage.style.display = 'block';
  }
}


function hideFormMessage() {
  if (formMessage) {
    formMessage.style.display = 'none';
  }
}


if (servicesList) {
  servicesList.addEventListener('click', (e) => {
    let button;
    if (e.target.tagName === 'BUTTON') {
      button = e.target;
    } else if (e.target.parentElement?.tagName === 'BUTTON') {
      button = e.target.parentElement;
    }


    if (button) {
      const serviceDiv = button.closest('.services');
      const spans = serviceDiv.querySelectorAll('div > span');
      const serviceName = spans[1].textContent.trim();
      const price = parseFloat(spans[2].textContent.replace('₹', '').trim());
      console.log("Button clicked for service:", serviceName, "with price:", price);
      togglecartitem(button, serviceName, price);
    }
});
}

// valaidation functions for name, email, phone number
function validateName (name) {
  const isValid = /^[A-Za-z\s]{3,}$/.test(name.trim());
  console.log("Name validated:", name, "Result:", isValid);
  return isValid;
}


function validateEmail (email) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  console.log("Email validated:", email, "Result:", isValid);
  return isValid;
}


function validatePhone (phone) {
  const isValid = /^[0-9]\d{9}$/.test(phone.trim());
  console.log("Phone validated:", phone, "Result:", isValid);
  return isValid;
}


formInputs.forEach(input => {
  input.addEventListener('focus', showFormMessage);
  input.addEventListener('blur', hideFormMessage);
});



renderservices();


bookingForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();


let errorMessages = [];
if (!validateName(fullName)) {
  errorMessages.push("Enter the valid name (with at least 3 characters).");
}
if (!validateEmail(email)) {
  errorMessages.push("Enter a valid email address.");
}
if (!validatePhone(phone)) {
  errorMessages.push("Enter a valid 10-digit phone number.");
}

if (errorMessages.length > 0) {
  console.error("Validation errors:", errorMessages);
  alert("Submission failed:\n" + errorMessages.join('\n'));
  return;}


if (cart.length === 0) {
  alert("Add atleast one service to the cart for booking.");
  return;
}


  const servicesNames = cart.map(item => item.serviceName).join("\n");
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);


  const templateParams = {
    user_name: fullNameInput.value,
    user_email: emailInput.value,
    user_phone: phoneInput.value,
    services_list: servicesNames,
    total_amount: `₹${totalPrice}`
  };


emailjs.send('service_g4n4sem', 'template_r9qqbyk', templateParams)
.then(() => {
  console.log('Email sent successfully.');
  const existingMsg = document.getElementById('thankYouMessage');
  if (existingMsg) {
    existingMsg.remove();
  }


  const thankYouMessage = document.createElement('div');
  thankYouMessage.id = 'thankYouMessage'; 
  thankYouMessage.textContent = "Thank you For Booking the Service We will get back to you soon!";
  thankYouMessage.style.color = 'green';
  thankYouMessage.style.marginTop = '10px';
  bookNowButton.insertAdjacentElement('afterend', thankYouMessage);


  alert('Booking successful! Visit us again.');


  cart = [];
  renderservices();
  bookingForm.reset();
  updateBookButton();


document.querySelectorAll('.services button').forEach(button => {
  button.innerHTML = 'Add Item <span>+</span>';
  button.style.color = '';
});


  setTimeout(() => {
    thankYouMessage.remove();
  }, 3000);

}, (error) => {
  alert("Booking Failed. Please try again.");
  console.error('EmailJS error:', error);
  });
}); 