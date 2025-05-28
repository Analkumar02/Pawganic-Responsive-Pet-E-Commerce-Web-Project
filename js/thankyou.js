$(function () {
  // 1. Get order data from localStorage
  const order = JSON.parse(localStorage.getItem("order"));
  if (!order) return;

  // 2. Generate a random order ID (or use a real one if you have it)
  const orderId = Math.floor(Math.random() * 900000000 + 100000000);
  $("#order-id").text(`#${orderId}`);

  // 3. Update user name
  $(".user-fname span").text(order.shippingAddress.firstName);

  // 4. Update shipping address
  const shipping = order.shippingAddress;
  const shippingHtml = `
    <p><b>${shipping.firstName} ${shipping.lastName}</b></p>
    <p>${shipping.address1}</p>
    <p>${shipping.city}, ${shipping.state} ${shipping.pincode}, ${shipping.country}</p>
    <p>${shipping.email}</p>
  `;
  $(".d-box-single:contains('Shipping Address')").html(`<p class="text-muted">Shipping Address</p>${shippingHtml}`);

  // 5. Update billing address
  const billing = order.billing;
  const billingHtml = `
    <p><b>${billing.firstName} ${billing.lastName}</b></p>
    <p>${billing.address1}</p>
    <p>${billing.city}, ${billing.state} ${billing.pincode}, ${billing.country}</p>
  `;
  $(".d-box-single:contains('Billing Address')").html(`<p class="text-muted">Billing Address</p>${billingHtml}`);

  // 6. Update order summary (items, totals, etc.)
  let itemsHtml = "";
  order.items.forEach(item => {
    itemsHtml += `
      <div class="d-flex justify-content-between align-items-center">
        <span class="ck-pr-box d-flex align-items-center">
          <span><img src="${item.image}" alt=""></span>
          <span class="pr-title">${item.name} x ${item.quantity}</span>
        </span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });
  itemsHtml += `
    <div class="ck-divider mb-4 mt-4"></div>
    <div class="d-flex justify-content-between mb-3">
      <span>Shipping</span>
      <span>${order.shipping === 0 ? "Free shipping" : `$${order.shipping.toFixed(2)}`}</span>
    </div>
    <div class="d-flex justify-content-between mb-3">
      <span>TAX</span>
      <span>$${order.tax.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between">
      <span>Platform Charges</span>
      <span>$${order.platform.toFixed(2)}</span>
    </div>
    <div class="ck-divider mb-5 mt-4"></div>
    <div class="d-flex justify-content-between ck-title">
      <strong>Total</strong>
      <strong>$${order.total.toFixed(2)}</strong>
    </div>
  `;
  $(".order-summary").html(itemsHtml);
});