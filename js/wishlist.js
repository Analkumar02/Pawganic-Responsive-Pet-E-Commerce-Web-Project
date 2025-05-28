$(document).ready(function() {
    function updateCartCount() {
        const cart = getCart();
        const totalQty = Object.values(cart).reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
        );
        $(".cart-count")
            .text(totalQty)
            .toggle(totalQty > 0);
    }

    function getWishlist() {
        const raw = JSON.parse(localStorage.getItem("wishlist"));
        return Array.isArray(raw) ? raw : [];
    }

    function saveWishlist(wishlist) {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }

    function getCart() {
        const raw = JSON.parse(localStorage.getItem("cart"));
        return raw && typeof raw === "object" ? raw : {};
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function formatPrice(price) {
        return `$${parseFloat(price).toFixed(2)}`;
    }

    function renderWishlist() {
        const wishlist = getWishlist();
        const cart = getCart();
        const $tbody = $(".wishlist-area tbody");
        const $title = $(".wishlist-area h2");
        const $table = $(".wishlist-table"); // Get the table container

        $tbody.empty();

        if (!wishlist.length) {
            $title.html(`
        <div class="empty-msg text-center" aria-live="polite">
          <dotlottie-player
            src="https://lottie.host/26450161-f0de-40c3-aa25-f85f88ad54b1/SQ1SNuMLEJ.lottie"
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px"
            loop
            autoplay
          ></dotlottie-player>
          <p>Your wishlist is empty.</p>
          <a href="shop.html" class="btn shop-now-btn">Shop Now</a>
        </div>
      `);
            $table.hide(); // Hide the table if empty
            return;
        }

        $title.text("Your wishlist items");
        $table.show(); // Show the table if not empty

        wishlist.forEach((item) => {
            const qty = item.quantity ? Number(item.quantity) : 1;
            const subtotal = item.price * qty;

            const $row = $(`
        <tr class="cart-row">
          <td class="wl-img-cell" data-label="Product Image">
            <a href="product-desc.html?id=${item.id}">
              <img src="${item.img}" alt="${item.name}">
            </a>
          </td>
          <td class="wl-title-cell" data-label="Product Name">
            <a href="product-desc.html?id=${item.id}">
              <span class="pr-name">${item.name}</span> × 
              <span class="pr-qty" data-id="${item.id}">${qty}</span>
            </a>
          </td>
          <td class="wl-text-cell" data-label="Product Price">
            <span class="pr-price">${formatPrice(item.price)}</span>
          </td>
          <td class="wl-text-cell text-center" data-label="Quantity">
            <div class="quantity-box">
              <button class="qty-btn minus" data-id="${
                item.id
              }"><span>-</span></button>
              <input type="number" class="qty-input" value="${qty}" min="1" data-id="${
        item.id
      }">
              <button class="qty-btn plus" data-id="${
                item.id
              }"><span>+</span></button>
            </div>
          </td>
          <td class="wl-text-cell" data-label="Subtotal">
            <span class="pr-subtotal-price">${formatPrice(subtotal)}</span>
          </td>
          <td class="text-center wl-img-cell" data-label="Action">
            <div class="wish-act">
              <a href="#" class="pr-cart btn" data-id="${
                item.id
              }">Add To Cart</a>
              <a href="#" class="pr-del" data-id="${
                item.id
              }"><img src="images/trash.svg" alt="trash"></a>
            </div>
          </td>
        </tr>
      `);

            $tbody.append($row);
        });
    }

    // Quantity +
    $(document).on("click", ".qty-btn.plus", function() {
        const id = $(this).data("id");
        let wishlist = getWishlist();
        wishlist = wishlist.map((item) => {
            if (item.id === id) {
                item.quantity = Math.max(1, (parseInt(item.quantity) || 1) + 1);
            }
            return item;
        });
        saveWishlist(wishlist);
        renderWishlist();
        updateWishlistCount();
    });

    // Quantity -
    $(document).on("click", ".qty-btn.minus", function() {
        const id = $(this).data("id");
        let wishlist = getWishlist();
        wishlist = wishlist.map((item) => {
            if (item.id === id) {
                item.quantity = Math.max(1, (parseInt(item.quantity) || 1) - 1);
            }
            return item;
        });
        saveWishlist(wishlist);
        renderWishlist();
        updateWishlistCount();
    });

    // Manual Quantity Input
    $(document).on("change", ".qty-input", function() {
        const id = $(this).data("id");
        const val = Math.max(1, parseInt($(this).val()) || 1);
        let wishlist = getWishlist();
        wishlist = wishlist.map((item) => {
            if (item.id === id) {
                item.quantity = val;
            }
            return item;
        });
        saveWishlist(wishlist);
        renderWishlist();
        updateWishlistCount();
    });

    // Remove item from wishlist
    $(document).on("click", ".pr-del", function(e) {
        e.preventDefault();
        const id = $(this).data("id");
        const updated = getWishlist().filter((item) => item.id !== id);
        saveWishlist(updated);
        renderWishlist();
    });

    // Move to cart
    $(document).on("click", ".pr-cart", function(e) {
        e.preventDefault();
        const id = $(this).data("id");
        let wishlist = getWishlist();
        const product = wishlist.find((item) => item.id === id);

        if (product) {
            const cart = getCart();
            const quantity = product.quantity ?
                Math.max(1, parseInt(product.quantity) || 1) :
                1;
            const name = product.name || "Unnamed Product";
            const price = parseFloat(product.price) || 0;
            const image = product.img || "images/default.png";

            cart[id] = {
                id: product.id,
                name,
                price,
                image,
                quantity,
            };

            saveCart(cart);

            // Remove from wishlist
            const updatedWishlist = wishlist.filter((item) => item.id !== id);
            saveWishlist(updatedWishlist);

            renderWishlist();
            updateCartCount();
            updateWishlistCount();
        }
    });

    renderWishlist();
});