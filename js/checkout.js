$(function () {
  // 1. Utility functions
  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart"));
      return cart && typeof cart === "object" ? cart : {};
    } catch {
      return {};
    }
  }
  function saveOrder(order) {
    localStorage.setItem("order", JSON.stringify(order));
  }
  function formatPrice(value) {
    return `$${parseFloat(value).toFixed(2)}`;
  }

  // 2. Render Order Summary
  function renderOrderSummary() {
    const cart = getCart();
    const items = Object.values(cart);
    if (!items.length) {
      $(".order-summary").html('<div class="text-center">Your cart is empty.</div>');
      return;
    }

    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    // Shipping logic
    let shipping = 0;
    let shippingText = "";
    if (subtotal < 50) {
      shipping = 1; // Changed from 10 to 1
      shippingText = formatPrice(shipping);
    } else {
      shipping = 0;
      shippingText = "Free shipping";
    }

    const tax = subtotal * 0.05;
    const platform = subtotal * 0.01;
    const total = subtotal + tax + platform + shipping;

    let summaryHtml = `
      <div class="d-flex justify-content-between ck-title">
        <strong>Cart Total</strong>
        <strong>${formatPrice(subtotal)}</strong>
      </div>
      <div class="ck-divider mb-4 mt-4"></div>
    `;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      summaryHtml += `
        <div class="d-flex justify-content-between mb-2">
          <span class="ck-pr-box d-flex align-items-center">
            <span><img src="${item.image}" alt=""></span>
            <span class="pr-title">${item.name} x ${item.quantity}</span>
          </span>
          <span>${formatPrice(itemTotal)}</span>
        </div>
      `;
    });

    summaryHtml += `
      <div class="ck-divider mb-4 mt-4"></div>
      <div class="d-flex justify-content-between mb-3">
        <span>Shipping</span>
        <span>${shippingText}</span>
      </div>
      ${subtotal < 50 && subtotal > 0 ? `<div class="free-shipping-msg">Free shipping for orders over $50</div>` : ""}
      <div class="d-flex justify-content-between mb-3">
        <span>TAX</span>
        <span>5%</span>
      </div>
      <div class="d-flex justify-content-between">
        <span>Platform Charges</span>
        <span>1%</span>
      </div>
      <div class="ck-divider mb-5 mt-4"></div>
      <div class="d-flex justify-content-between ck-title">
        <strong>Amount to pay</strong>
        <strong>${formatPrice(total)}</strong>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="payment" id="cod" checked>
        <label class="form-check-label" for="cod">
          <strong>Cash on delivery</strong><br><small>Pay with cash upon delivery.</small>
        </label>
      </div>
      <button type="submit" class="btn btn-pay w-100 mb-3">Proceed To Pay</button>
      <a href="cart.html" class="btn btn-cart w-100">Return To Cart</a>
    `;

    $(".order-summary").html(summaryHtml);
  }

  // 3. Show/hide billing address
  function toggleBillingAddress() {
    if ($("#diffBilling").is(":checked")) {
      $("#billing-address").hide();
    } else {
      $("#billing-address").show();
    }
  }
  $("#diffBilling").on("change", toggleBillingAddress);
  toggleBillingAddress();

  // 4. On page load, render order summary if coming from cart
  renderOrderSummary();

  // 5. Form validation and submit
  $("#checkout-form").on("submit", function (e) {
    e.preventDefault();
    let valid = true;
    let $form = $(this);
    let errorMsg = "";

    // Validate required fields in shipping
    $form.find("input[required], select[required]").each(function () {
      if (!$(this).val().trim()) {
        $(this).addClass("is-invalid");
        valid = false;
      } else {
        $(this).removeClass("is-invalid");
      }
    });

    // Email format
    const $email = $form.find('input[type="email"]');
    if ($email.length && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val())) {
      $email.addClass("is-invalid");
      errorMsg += "Please enter a valid email address.\n";
      valid = false;
    }

    // Pincode/Zipcode numeric check
    const $pincode = $form.find('input[placeholder*="Pincode"]');
    if ($pincode.length && !/^\d{4,10}$/.test($pincode.val())) {
      $pincode.addClass("is-invalid");
      errorMsg += "Please enter a valid pincode/zipcode.\n";
      valid = false;
    }

    // If billing address is shown, validate its fields
    if (!$("#diffBilling").is(":checked")) {
      $("#billing-address input, #billing-address select").each(function () {
        if ($(this).attr("required") && !$(this).val().trim()) {
          $(this).addClass("is-invalid");
          valid = false;
        } else {
          $(this).removeClass("is-invalid");
        }
      });
    }

    if (!valid) {
      if (errorMsg) alert(errorMsg);
      return;
    }

    // 6. Gather data
    const shipping = {
      firstName: $form.find('input[placeholder="First Name"]').eq(0).val(),
      lastName: $form.find('input[placeholder="Last Name"]').eq(0).val(),
      email: $form.find('input[type="email"]').val(),
      address1: $form.find('input[placeholder="Address 1"]').eq(0).val(),
      address2: $form.find('input[placeholder="Address 2"]').eq(0).val(),
      city: $form.find('input[placeholder="City"]').eq(0).val(),
      pincode: $form.find('input[placeholder*="Pincode"]').eq(0).val(),
      state: $form.find('select').eq(0).val(),
      country: $form.find('select').eq(1).val()
    };

    let billing;
    if ($("#diffBilling").is(":checked")) {
      billing = { ...shipping };
    } else {
      billing = {
        firstName: $form.find('#billing-address input[placeholder="First Name"]').val(),
        lastName: $form.find('#billing-address input[placeholder="Last Name"]').val(),
        address1: $form.find('#billing-address input[placeholder="Address 1"]').val(),
        address2: $form.find('#billing-address input[placeholder="Address 2"]').val(),
        city: $form.find('#billing-address input[placeholder="City"]').val(),
        pincode: $form.find('#billing-address input[placeholder*="Pincode"]').val(),
        state: $form.find('#billing-address select').eq(0).val(),
        country: $form.find('#billing-address select').eq(1).val()
      };
    }

    // 7. Order summary
    const cart = getCart();
    const items = Object.values(cart);
    let subtotal = 0;
    items.forEach(item => { subtotal += item.price * item.quantity; });

    // Shipping logic
    let shippingCharge = 0;
    if (subtotal < 50) {
      shippingCharge = 1; // Changed from 10 to 1
    } else {
      shippingCharge = 0;
    }
    const tax = subtotal * 0.05;
    const platform = subtotal * 0.01;
    const total = subtotal + tax + platform + shippingCharge;

    const order = {
      items,
      subtotal,
      tax,
      platform,
      shipping: shippingCharge,
      total,
      shippingAddress: shipping,
      billing
    };

    // 8. Store order and clear cart
    saveOrder(order);
    localStorage.removeItem("cart");

    // 9. Redirect to thank-you page
    window.location.href = "thank-you.html";
  });
});