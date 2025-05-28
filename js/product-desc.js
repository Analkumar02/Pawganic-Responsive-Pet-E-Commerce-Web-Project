$(document).ready(function () {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) return;

  $.getJSON("data/products.json", function (data) {
    const product = data.products.find((p) => p.id === productId);
    if (!product) return;

    // Prepare images
    const images = product.images || [];
    const imageSlides = images
      .map(
        (img) =>
          `<div class="swiper-slide"><img src="${img}" alt="${product.name}"></div>`
      )
      .join("");
    const thumbSlides = images
      .map(
        (img) =>
          `<div class="swiper-slide"><img src="${img}" alt="${product.name}"></div>`
      )
      .join("");

    // Tabs
    let tabs = "";
    let tabContents = "";
    const description = product.description || "";
    const ingredients = product.ingredients || "";
    const keyBenefits = product.keyBenefits || [];

    if (description) {
      tabs += `<li class="nav-item"><button class="nav-link active" id="desc-tab" data-bs-toggle="tab" data-bs-target="#desc" type="button" role="tab">Description</button></li>`;
      tabContents += `<div class="tab-pane fade show active" id="desc" role="tabpanel"><p>${description}</p></div>`;
    }
    if (ingredients) {
      tabs += `<li class="nav-item"><button class="nav-link ${
        !description ? "active" : ""
      }" id="ingredients-tab" data-bs-toggle="tab" data-bs-target="#ingredients" type="button" role="tab">Ingredients</button></li>`;
      tabContents += `<div class="tab-pane fade ${
        !description ? "show active" : ""
      }" id="ingredients" role="tabpanel"><p>${ingredients}</p></div>`;
    }
    if (keyBenefits && keyBenefits.length) {
      tabs += `<li class="nav-item"><button class="nav-link ${
        !description && !ingredients ? "active" : ""
      }" id="benefits-tab" data-bs-toggle="tab" data-bs-target="#benefits" type="button" role="tab">Key Benefits</button></li>`;
      tabContents += `<div class="tab-pane fade ${
        !description && !ingredients ? "show active" : ""
      }" id="benefits" role="tabpanel"><ul class="list-style-disc benefit-list">${keyBenefits
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul></div>`;
    }

    function renderStars(rating) {
      let starsHtml = "";
      for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
          starsHtml += '<li><i class="bx bxs-star"></i></li>';
        } else if (rating >= i - 0.5) {
          starsHtml += '<li><i class="bx bxs-star-half"></i></li>';
        } else {
          starsHtml += '<li><i class="bx bx-star"></i></li>';
        }
      }
      return starsHtml;
    }

    // Cart logic
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const inCart = cart[product.id];
    const quantity = inCart ? cart[product.id].quantity : 1;

    // Cart box HTML: always show quantity box, button changes
    const cartBoxHtml = `
      <div class="cart-box d-flex align-items-center gap-3">
        <div class="quantity-box">
          <button class="qty-btn minus" data-id="${
            product.id
          }"><span>-</span></button>
          <input type="number" class="qty-input" value="${quantity}" min="1" data-id="${
      product.id
    }">
          <button class="qty-btn plus" data-id="${
            product.id
          }"><span>+</span></button>
        </div>
        ${
          inCart
            ? `<a href="cart.html" class="btn view-cart-btn" style="color: white;">View Cart</a>`
            : `<a href="#" class="btn add-to-cart-btn"
                  data-id="${product.id}"
                  data-name="${product.name}"
                  data-price="${product.offerPrice}"
                  data-img="${images[0]}">
                <img src="images/cart-white.svg" alt="cart"> Add to Cart
              </a>`
        }
      </div>
    `;

    // Main HTML
    const html = `
      <div class="container-xl">
        <div class="row">
          <div class="col-lg-6">
            <div class="single-img-box">
              <div class="swiper single-pr-slider">
                <div class="swiper-wrapper">${imageSlides}</div>
                <div class="swiper-button-next single-pr-btn"></div>
                <div class="swiper-button-prev single-pr-btn"></div>
              </div>
              <div class="swiper single-thumb-slider" thumbsSlider>
                <div class="swiper-wrapper">${thumbSlides}</div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="single-pr-content">
              <div class="pr-category"><p>${product.category.toUpperCase()}</p></div>
              <h2 class="single-pr-title">${product.name}</h2>
              <ul class="rw-stars">${renderStars(product.rating)}</ul>
              <div class="signle-pr-price">
                <div class="offer-price">$${product.offerPrice.toFixed(2)}</div>
                <div class="org-price"><strike>$${product.originalPrice.toFixed(
                  2
                )}</strike></div>
              </div>
              <div class="pr-divider"></div>
              <p class="short-desc">${product.shortDesc || ""}</p>
              ${cartBoxHtml}
              <div class="wishlist-box">
                <a href="#" class="add-to-wishlist-btn"
                  data-id="${product.id}"
                  data-name="${product.name}"
                  data-price="${product.offerPrice}"
                  data-img="${images[0]}">
                  <i class="bx bx-heart"></i> Add To Wishlist
                </a>
              </div>
              <div class="safe-checkout">
                <p>Guaranteed Safe Checkout</p>
                <img src="images/guarantee.png" alt="safe-checkout">
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="custom-tabs mt-5">
              <ul class="nav nav-tabs pr-details" id="productTabs" role="tablist">${tabs}</ul>
              <div class="tab-content pt-4">${tabContents}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    $(".pr-desc-area").html(html);

    // Swiper init
    new Swiper(".single-pr-slider", {
      loop: true,
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: new Swiper(".single-thumb-slider", {
          loop: true,
          spaceBetween: 10,
          slidesPerView: 4,
          freeMode: true,
          watchSlidesProgress: true,
        }),
      },
    });

    // GSAP animations for product details (after DOM update)
    gsap.from(".single-img-box", {
      opacity: 0,
      x: -60,
      duration: 1,
      scrollTrigger: {
        trigger: ".single-img-box",
        start: "top 85%",
      },
    });

    gsap.from(".single-pr-content > *:not(.rw-stars)", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      stagger: 0.12,
      scrollTrigger: {
        trigger: ".single-pr-content",
        start: "top 85%",
      },
    });

    gsap.fromTo(
      ".rw-stars li",
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".rw-stars",
          start: "top 90%",
        },
        clearProps: "opacity,scale"
      }
    );

    // Ensure parent is fully visible
    gsap.set(".rw-stars", { opacity: 1, clearProps: "opacity" });

    gsap.from(".custom-tabs", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".custom-tabs",
        start: "top 90%",
      },
    });
  });
});

$.getJSON("data/products.json", function (data) {
  const relatedProducts = data.products.filter((product) =>
    product.tags?.some((tag) =>
      ["featured", "top", "trending"].includes(tag.trim().toLowerCase())
    )
  );

  if (!relatedProducts.length) return;

  let html = "";
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  relatedProducts.forEach((product) => {
    const nameWords = product.name.split(" ");
    const shortName =
      nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

    const inCart = cart[product.id];
    const cartControl = inCart
      ? `
        <div class="quantity-box">
          <button class="qty-btn minus" data-id="${product.id}"><span>-</span></button>
          <input type="number" class="qty-input" value="${inCart.quantity}" min="1" data-id="${product.id}">
          <button class="qty-btn plus" data-id="${product.id}"><span>+</span></button>
        </div>`
      : `
        <a href="#" class="btn add-to-cart-btn" 
           data-id="${product.id}" 
           data-name="${shortName}" 
           data-price="${product.offerPrice}" 
           data-img="${product.images[0]}">
          <img src="images/cart-white.svg" alt="cart"> add to cart
        </a>`;

    html += `
      <div class="swiper-slide product-slide">
        <div class="product-box">
          <div class="product-img position-relative">
            <img class="pr-img" src="${product.images[0]}" alt="${
      product.name
    }">
            <div class="add-to-cart">${cartControl}</div>
            <div class="wishlist-box">
              <a href="#" class="add-to-wishlist-btn"
                 data-id="${product.id}"
                 data-name="${shortName}"
                 data-img="${product.images[0]}"
                 data-price="${product.offerPrice}">
                <i class="bx bx-heart"></i>
              </a>
            </div>
          </div>
          <div class="product-info">
            <a class="pr-title" href="product-desc.html?id=${product.id}">
              <p>${shortName}</p>
            </a>
            <div class="pr-price">
              <div class="offer-price">$${product.offerPrice.toFixed(2)}</div>
              <div class="org-price"><strike>$${product.originalPrice.toFixed(
                2
              )}</strike></div>
            </div>
          </div>
        </div>
      </div>`;
  });

  $("#related-products-wrapper").html(html);

  const totalSlides = relatedProducts.length;

  new Swiper(".related-pr-slider", {
    loop: totalSlides > 5,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".pr-slider-next",
      prevEl: ".pr-slider-prev",
    },
    breakpoints: {
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 5 },
    },
  });

  // GSAP animation for related product boxes (after DOM update)
  gsap.from(".related-pr-slider .product-box", {
    opacity: 0,
    y: 40,
    scale: 0.96,
    duration: 0.7,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".related-pr-slider",
      start: "top 90%",
    },
  });
});

$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  // Breadcrumb area animation
  gsap.from(".breadcrumb-area .breadcrumb-box", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".breadcrumb-area",
      start: "top 90%",
    },
  });
  gsap.from(".breadcrumb-area .br-img", {
    opacity: 0,
    x: 40,
    duration: 0.8,
    delay: 0.2,
    scrollTrigger: {
      trigger: ".breadcrumb-area",
      start: "top 90%",
    },
  });

  // Footer animation
  gsap.from(".footer", {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: {
      trigger: ".footer",
      start: "top 95%",
    },
  });

  // Accessibility: reduce motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.globalTimeline.timeScale(0.01);
  }
});
