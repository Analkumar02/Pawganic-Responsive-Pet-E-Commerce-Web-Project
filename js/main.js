$(document).ready(function () {
  let singlePrTempQty = 1;

  $(document).on("click", ".single-pr-content .qty-btn.plus", function () {
    const $input = $(".single-pr-content .qty-input");
    const id = $input.data("id");
    let cart = getCart();
    if (cart[id]) {
      cart[id].quantity += 1;
      saveCart(cart);
      updateCartCount();
      $input.val(cart[id].quantity);
    } else {
      singlePrTempQty += 1;
      $input.val(singlePrTempQty);
    }
  });

  $(document).on("click", ".single-pr-content .qty-btn.minus", function () {
    const $input = $(".single-pr-content .qty-input");
    const id = $input.data("id");
    let cart = getCart();
    if (cart[id]) {
      cart[id].quantity = Math.max(1, cart[id].quantity - 1);
      saveCart(cart);
      updateCartCount();
      $input.val(cart[id].quantity);
    } else {
      singlePrTempQty = Math.max(1, singlePrTempQty - 1);
      $input.val(singlePrTempQty);
    }
  });

  $(document).on("change", ".single-pr-content .qty-input", function () {
    const $input = $(this);
    const id = $input.data("id");
    let val = Math.max(1, parseInt($input.val()) || 1);
    let cart = getCart();
    if (cart[id]) {
      cart[id].quantity = val;
      saveCart(cart);
      updateCartCount();
      $input.val(cart[id].quantity);
    } else {
      singlePrTempQty = val;
      $input.val(singlePrTempQty);
    }
  });

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || {};
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    const cart = getCart();
    const totalQty = Object.values(cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    $(".cart-count")
      .text(totalQty)
      .toggle(totalQty > 0);
  }

  function getWishlist() {
    try {
      const raw = JSON.parse(localStorage.getItem("wishlist"));
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  function updateWishlistCount() {
    const wishlist = getWishlist();
    $(".wishlist-count")
      .text(wishlist.length)
      .toggle(wishlist.length > 0);
  }

  function applyWishlistStatus() {
    const wishlist = getWishlist();

    $(".add-to-wishlist-btn").each(function () {
      const $btn = $(this);
      const id = $btn.data("id");

      const exists = wishlist.some((item) => item.id === id);
      $btn.toggleClass("active", exists);
      $btn.closest(".product-box").toggleClass("active", exists);
    });
  }

  function updateProductBoxes() {
    const cart = getCart();

    $(".product-box").each(function () {
      const $box = $(this);
      const id = $box.find(".add-to-cart-btn").data("id");

      if (id && cart[id]) {
        $box.find(".add-to-cart").html(`
          <div class="quantity-box">
            <button class="qty-btn minus" data-id="${id}"><span>-</span></button>
            <input type="number" class="qty-input" value="${cart[id].quantity}" min="1" data-id="${id}">
            <button class="qty-btn plus" data-id="${id}"><span>+</span></button>
          </div>
        `);
      } else if (id) {
        const name = $box.find(".pr-title p").text();
        const price = $box.find(".offer-price").text().replace("$", "");
        const img = $box.find(".pr-img").attr("src");

        $box.find(".add-to-cart").html(`
          <a href="#" class="btn add-to-cart-btn" 
             data-id="${id}" 
             data-name="${name}" 
             data-price="${price}" 
             data-img="${img}">
            <img src="images/cart-white.svg" alt="cart"> add to cart
          </a>
        `);
      }
    });

    applyWishlistStatus();
  }

  function updateAllQuantityBoxes() {
    const cart = getCart();

    $(".quantity-box .qty-input").each(function () {
      const id = $(this).data("id");
      if (cart[id]) $(this).val(cart[id].quantity);
    });

    const $single = $(".single-pr-content .qty-input");
    if ($single.length) {
      const id = $single.data("id");
      if (id && cart[id]) $single.val(cart[id].quantity);
    }
  }

  $(document).on("click", ".product-box .add-to-cart-btn", function (e) {
    e.preventDefault();
    const $btn = $(this);
    const id = $btn.data("id");
    const name = $btn.data("name");
    const price = parseFloat($btn.data("price"));
    const image = $btn.data("img");

    let cart = getCart();
    if (cart[id]) {
      cart[id].quantity += 1;
    } else {
      cart[id] = { id, name, price, image, quantity: 1 };
    }
    saveCart(cart);
    updateCartCount();
    updateProductBoxes();
    updateAllQuantityBoxes();

    window.showProductPopup({
      imageUrl: $btn.data("img"),
      productName: $btn.data("name"),
      message: "Added to cart",
    });
  });

  $(document).on("click", ".single-pr-content .add-to-cart-btn", function (e) {
    e.preventDefault();
    const $btn = $(this);
    const id = $btn.data("id");
    const name = $btn.data("name");
    const price = parseFloat($btn.data("price"));
    const image = $btn.data("img");
    let quantity = Math.max(
      1,
      parseInt($(".single-pr-content .qty-input").val()) || 1
    );

    let cart = getCart();
    cart[id] = { id, name, price, image, quantity };
    saveCart(cart);
    updateCartCount();
    updateProductBoxes();
    updateAllQuantityBoxes();
    location.reload();
  });

  $(document).on(
    "click",
    ".qty-btn.plus:not(.single-pr-content .qty-btn)",
    function () {
      const id = $(this).data("id");
      const cart = getCart();
      if (cart[id]) {
        cart[id].quantity += 1;
        saveCart(cart);
        updateCartCount();
        updateAllQuantityBoxes();
      }
    }
  );

  $(document).on(
    "click",
    ".qty-btn.minus:not(.single-pr-content .qty-btn)",
    function () {
      const id = $(this).data("id");
      const cart = getCart();
      if (cart[id]) {
        cart[id].quantity = Math.max(1, cart[id].quantity - 1);
        saveCart(cart);
        updateCartCount();
        updateAllQuantityBoxes();
      }
    }
  );

  $(document).on("click", ".add-to-wishlist-btn", function (e) {
    e.preventDefault();
    const $btn = $(this);
    const id = $btn.data("id");
    const name = $btn.data("name");
    const price = $btn.data("price");
    const img = $btn.data("img");

    let wishlist = getWishlist();
    const index = wishlist.findIndex((item) => item.id === id);

    if (index > -1) {
      wishlist.splice(index, 1);
      $btn.removeClass("active");
      $btn.closest(".product-box").removeClass("active");
    } else {
      wishlist.push({ id, name, price, img });
      $btn.addClass("active");
      $btn.closest(".product-box").addClass("active");
    }

    saveWishlist(wishlist);
    updateWishlistCount();

    const isAdding = !$btn.hasClass("active");
    window.showProductPopup({
      imageUrl: $btn.data("img"),
      productName: $btn.data("name"),
      message: isAdding ? "Removed from wishlist" : "Added to wishlist",
    });
  });

  updateCartCount();
  updateProductBoxes();
  updateAllQuantityBoxes();
  updateWishlistCount();
  applyWishlistStatus();

  const header = document.getElementById("header");
  const stickyOffset = header ? header.offsetTop : 0;

  window.addEventListener("scroll", () => {
    if (!header) return;
    if (window.pageYOffset > stickyOffset) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  document.addEventListener("click", (event) => {
    const navMenu = document.querySelector(".nav-menu");
    const menuBtn = document.getElementById("menu-btn");
    if (
      navMenu &&
      menuBtn &&
      !navMenu.contains(event.target) &&
      !menuBtn.contains(event.target) &&
      navMenu.classList.contains("active")
    ) {
      navMenu.classList.remove("active");
    }
  });

  const menuBtn = document.getElementById("menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(".nav-menu").classList.toggle("active");
    });
  }

  const $searchForm = $(".search-form");
  const $searchBtn = $("#search-btn");
  const $searchBox = $("#search-box");
  const $suggestionsBox = $("#suggestions");

  $searchBtn.on("click", function (e) {
    e.preventDefault();
    $searchForm.toggleClass("active");
    $suggestionsBox.hide().empty();
    $searchBox.val("");
  });

  $searchBox.on("input", function () {
    const query = $(this).val().toLowerCase().trim();

    if (!query) {
      $suggestionsBox.hide().empty();
      return;
    }

    $.getJSON("data/products.json", function (data) {
      const results = data.products
        .filter((product) => product.name.toLowerCase().includes(query))
        .slice(0, 4);

      if (results.length === 0) {
        $suggestionsBox
          .html('<div class="suggestion-item">No results found</div>')
          .show();
        return;
      }

      const html = results
        .map(
          (product) => `
    <div class="suggestion-item" data-id="${product.id}">
        <img src="${product.images[0]}" alt="${product.name}">
        <span>${product.name}</span>
    </div>
`
        )
        .join("");

      $suggestionsBox.html(html).css({ display: "block" });
    });
  });

  $(document).on("click", ".suggestion-item", function () {
    const id = $(this).data("id");
    if (id) {
      window.location.href = `product-desc.html?id=${id}`;
    }
  });

  $(document).on("click", function (e) {
    if (
      !$searchForm.is(e.target) &&
      $searchForm.has(e.target).length === 0 &&
      !$searchBtn.is(e.target) &&
      $searchBtn.has(e.target).length === 0 &&
      !$searchBox.is(e.target) &&
      $searchBox.has(e.target).length === 0 &&
      !$suggestionsBox.is(e.target) &&
      $suggestionsBox.has(e.target).length === 0
    ) {
      $searchForm.removeClass("active");
      $suggestionsBox.hide();
    }
  });

  window.showProductPopup = function ({ imageUrl, productName, message }) {
    const popup = document.getElementById("product-popup");
    if (!popup) return;
    popup.querySelector(".product-thumb").src = imageUrl;
    popup.querySelector(".product-name").textContent = productName;
    popup.querySelector(".popup-message").textContent = message;

    gsap.killTweensOf(popup);
    gsap.set(popup, { y: 0 });

    gsap.to(popup, {
      autoAlpha: 1,
      y: -20,
      duration: 0.5,
      pointerEvents: "auto",
      onComplete: () => {
        setTimeout(() => {
          gsap.to(popup, {
            autoAlpha: 0,
            y: 0,
            duration: 0.5,
            pointerEvents: "none",
          });
        }, 2000);
      },
    });
  };
});
