$(function () {
  // Get checkout and cart data
  const checkoutData = JSON.parse(localStorage.getItem("checkoutData") || "{}");
  const cart = JSON.parse(localStorage.getItem("cart") || "{}");
  const items = Object.values(cart);

  // Format date
  function formatDate(date) {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  // Build order details table rows
  let productRows = "";
  let total = 0;
  items.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    productRows += `
      <div class="d-flex justify-content-between">
        <span>${item.name} x ${item.quantity}</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
    `;
  });

  // Payment method
  let paymentMethod = "Cash on delivery";
  if (checkoutData.payment && checkoutData.payment !== "cod") {
    paymentMethod = checkoutData.payment;
  }

  // Build order details table
  $("#order-details-body").html(`
    ${productRows}
    <tr>
      <td>Date:</td>
      <td>${formatDate(new Date())}</td>
    </tr>
    <tr>
      <td>Payment method:</td>
      <td>${paymentMethod}</td>
    </tr>
    <tr>
      <td>Total:</td>
      <td>$${total.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Shipping:</td>
      <td>Free</td>
    </tr>
  `);

  // Helper to render address
  function renderAddress(address) {
    if (!address) return "<em>Not provided</em>";
    return `
      Name: ${address["First Name"] || ""} ${address["Last Name"] || ""}<br>
      <strong>Street Address:</strong> ${address["Address 1"] || ""}<br>
      <strong>Apartment/Suite:</strong> ${address["Address 2"] || ""}<br>
      <strong>City:</strong> ${address["City"] || ""}<br>
      <strong>State/Province:</strong> ${address["State"] || ""}<br>
      <strong>ZIP/Postal Code:</strong> ${address["Pincode / Zipcode"] || ""}<br>
      <strong>Country:</strong> ${address["Country"] || ""}<br>
      <strong>Email:</strong> ${address["Email Address"] || ""}
    `;
  }

  // Render addresses
  $("#shipping-address-box").html(renderAddress(checkoutData.shipping));
  $("#billing-address-box").html(renderAddress(checkoutData.billing || checkoutData.shipping));

  // Clear cart and update cart count in header
  localStorage.removeItem("cart");
  $(".cart-count").text("0").hide();
});