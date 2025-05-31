$(function () {
  const order = JSON.parse(localStorage.getItem("order"));
  if (!order) return;
  const orderId = Math.floor(Math.random() * 900000000 + 100000000);
  $("#order-id").text(`#${orderId}`);

  $(".user-fname span").text(order.shippingAddress.firstName);

  const shipping = order.shippingAddress;
  const shippingHtml = `
    <p><b>${shipping.firstName} ${shipping.lastName}</b></p>
    <p>${shipping.address1}</p>
    <p>${shipping.city}, ${shipping.state} ${shipping.pincode}, ${shipping.country}</p>
    <p>${shipping.email}</p>
  `;
  $(".d-box-single:contains('Shipping Address')").html(
    `<p class="text-muted">Shipping Address</p>${shippingHtml}`
  );

  const billing = order.billing;
  const billingHtml = `
    <p><b>${billing.firstName} ${billing.lastName}</b></p>
    <p>${billing.address1}</p>
    <p>${billing.city}, ${billing.state} ${billing.pincode}, ${billing.country}</p>
  `;
  $(".d-box-single:contains('Billing Address')").html(
    `<p class="text-muted">Billing Address</p>${billingHtml}`
  );

  let itemsHtml = "";
  order.items.forEach((item) => {
    itemsHtml += `
      <div class="d-flex justify-content-between align-items-center mb-2">
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
      <span>${
        order.shipping === 0 ? "Free shipping" : `$${order.shipping.toFixed(2)}`
      }</span>
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

  function formatDate(date, withDay = false) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const d = new Date(date);
    const day = days[d.getDay()];
    const dateNum = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    if (withDay) {
      return `${day}, ${month} ${dateNum}`;
    }
    return `${dateNum}${getOrdinal(dateNum)} ${month}, ${year}`;
  }

  function getOrdinal(n) {
    return [
      "th",
      "st",
      "nd",
      "rd",
    ][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10 > 3 ? 0 : n % 10];
  }

  const now = new Date();
  const orderDateStr = formatDate(now);
  const arrivesBy = new Date(now);
  arrivesBy.setDate(now.getDate() + 7);
  const arrivesByStr = formatDate(arrivesBy, true);

  $(".d-box-single:contains('Order Date') b").text(orderDateStr);

  $(".d-box-single:contains('Arrives by') span").text(arrivesByStr);
});
