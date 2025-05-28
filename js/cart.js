// ===== Utility =====
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    return cart && typeof cart === "object" ? cart : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(value) {
  return `$${parseFloat(value).toFixed(2)}`;
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = Object.values(cart).reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );
  $(".cart-count")
    .text(totalQty)
    .toggle(totalQty > 0);
}

function updateTotalPrice() {
  const cart = getCart();
  let total = 0;
  Object.values(cart).forEach((item) => {
    total += item.price * item.quantity;
  });
  $(".pr-total-price").text(formatPrice(total));
  $(".grand-total h3:last-child").text(formatPrice(total));
}

// ===== Render Cart Table =====
function renderCart() {
  const cart = getCart();
  const items = Object.values(cart);
  const $tbody = $(".cart-table tbody");
  const $cartTable = $(".cart-table");
  const $cartTotal = $(".cart-total");
  const $cartButtons = $(".cart-btn-box");
  const $cartTitle = $(".cart-area h2");

  $tbody.empty();

  if (items.length === 0) {
    $cartTable.hide();
    $cartTotal.hide();
    $cartButtons.hide();
    $cartTitle.html(`
      <div class="empty-msg text-center" aria-live="polite">
        <dotlottie-player
          src="https://lottie.host/26450161-f0de-40c3-aa25-f85f88ad54b1/SQ1SNuMLEJ.lottie"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          loop
          autoplay
        ></dotlottie-player>
        <p>Your cart is empty. <br>Start your shopping now.</p>
        <a href="shop.html" class="btn shop-now-btn">Shop Now</a>
      </div>
    `);
    updateCartCount();
    return;
  }

  $cartTable.show();
  $cartTotal.show();
  $cartButtons.show();
  $cartTitle.text("Your cart items");

  let total = 0;

  items.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const $row = $(`
      <tr class="cart-row">
        <td class="img-cell" data-label="Product Image">
          <a href="product-desc.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}">
          </a>
        </td>
        <td class="title-cell" data-label="Product Name">
          <a href="product-desc.html?id=${item.id}">
            <span class="pr-name">${item.name}</span> × 
            <span class="pr-qty" data-id="${item.id}">${item.quantity}</span>
          </a>
        </td>
        <td class="text-cell" data-label="Product Price">
          <span class="pr-price">${formatPrice(item.price)}</span>
        </td>
        <td class="text-cell text-center" data-label="Quantity">
          <div class="quantity-box">
            <button class="qty-btn minus" data-id="${item.id}"><span>-</span></button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" data-id="${item.id}">
            <button class="qty-btn plus" data-id="${item.id}"><span>+</span></button>
          </div>
        </td>
        <td class="text-cell" data-label="Subtotal">
          <span class="pr-subtotal-price">${formatPrice(subtotal)}</span>
        </td>
        <td class="text-center img-cell" data-label="Action">
          <a href="#" class="pr-del" data-id="${item.id}">
            <img src="images/trash.svg" alt="Delete">
          </a>
        </td>
      </tr>
    `);

    $tbody.append($row);
  });

  $(".pr-total-price").text(formatPrice(total));
  $(".grand-total h3:last-child").text(formatPrice(total));
  updateCartCount();
}

// ===== Quantity Update Handlers =====
function updateQuantity(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;

  saveCart(cart);
  renderCart();
}

function changeQuantity(id, value) {
  const cart = getCart();
  if (!cart[id]) return;

  saveCart(cart);
  renderCart();
}

function deleteCartItem(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

// ===== Bind Events =====
$(document).ready(function () {
  renderCart();

  $(document).on("click", ".qty-btn.plus", function () {
    const id = $(this).data("id");
    updateQuantity(id, 1);
  });

  $(document).on("click", ".qty-btn.minus", function () {
    const id = $(this).data("id");
    updateQuantity(id, -1);
  });

  $(document).on("change", ".qty-input", function () {
    const id = $(this).data("id");
    const value = parseInt($(this).val()) || 1;
    changeQuantity(id, value);
  });

  $(document).on("click", ".pr-del", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    deleteCartItem(id);
  });

  $(document).on("click", ".clear-btn", function (e) {
    e.preventDefault();
    clearCart();
  });
});
