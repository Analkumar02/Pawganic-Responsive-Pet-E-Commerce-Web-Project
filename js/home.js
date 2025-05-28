/*----------Hero slider----------*/
document.querySelectorAll(".slider-bg").forEach((el) => {
  const bg = el.getAttribute("data-background");
  if (bg) {
    el.style.backgroundImage = `url(${bg})`;
  }
});

const progressCircle = document.querySelector(".autoplay-progress svg");
const progressContent = document.querySelector(".autoplay-progress span");

const swiper = new Swiper(".hero-slider", {
  spaceBetween: 30,
  effect: "fade",
  fadeEffect: { crossFade: true },
  centeredSlides: true,
  autoplay: {
    delay: 7000,
    disableOnInteraction: false,
  },
  speed: 1000,
  on: {
    autoplayTimeLeft(swiperInstance, time, progress) {
      progressCircle.style.setProperty("--progress", 1 - progress);
    },
  },
});

// Animate only the .hero-slider div (not its children), once on page load
gsap.from('.hero-slider', { opacity: 0, y: 50, duration: 1 });

/*----------Hero slider----------*/

$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);

  /*----------Featured Products Carousel----------*/
  $.getJSON("data/products.json", function (data) {
    const featuredProducts = data.products.filter(
      (product) => product.tags && product.tags.includes("featured")
    );

    let html = "";
    featuredProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

      // Check if product is in cart
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      const inCart = cart[product.id];

      // Determine whether to show add to cart or quantity box
      const cartControl = inCart
        ? `
        <div class="quantity-box">
          <button class="qty-btn minus" data-id="${
            product.id
          }"><span>-</span></button>
          <input type="number" class="qty-input" value="${
            cart[product.id].quantity
          }" min="1" data-id="${product.id}">
          <button class="qty-btn plus" data-id="${
            product.id
          }"><span>+</span></button>
        </div>
      `
        : `
        <a href="#" class="btn add-to-cart-btn" 
           data-id="${product.id}" 
           data-name="${shortName}" 
           data-price="${product.offerPrice}" 
           data-img="${product.images[0]}">
          <img src="images/cart-white.svg" alt="cart"> add to cart
        </a>
      `;

      html += `
        <div class="swiper-slide product-slide">
            <div class="product-box">
                <div class="product-img position-relative">
                    <img class="pr-img" src="${product.images[0]}" alt="${
        product.name
      }">
                    <div class="add-to-cart">
                        ${cartControl}
                    </div>
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
                    <a class="pr-title" href="product-desc.html?id=${
                      product.id
                    }">
                        <p>${shortName}</p>
                    </a>
                    <div class="pr-price">
                        <div class="offer-price">$${product.offerPrice.toFixed(
                          2
                        )}</div>
                        <div class="org-price"><strike>$${product.originalPrice.toFixed(
                          2
                        )}</strike></div>
                    </div>
                </div>
            </div>
        </div>
      `;
    });

    $("#featured-products-wrapper").html(html);

    new Swiper(".feature-pr-slider", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
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

    // Animate product-boxes after DOM update
    gsap.from('.feature-pr-slider .product-box', {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.feature-pr-slider',
        start: 'top 85%',
      }
    });
  });
  /*----------Featured Products Carousel----------*/

  /*----------Trending Products----------*/
  $.getJSON("data/products.json", function (data) {
    const trendingProducts = data.products
      .filter((product) => product.tags && product.tags.includes("trending"))
      .slice(0, 6);

    let html = "";
    trendingProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

      // Check if product is in cart
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      const inCart = cart[product.id];

      // Determine whether to show add to cart or quantity box
      const cartControl = inCart
        ? `
        <div class="quantity-box">
          <button class="qty-btn minus" data-id="${
            product.id
          }"><span>-</span></button>
          <input type="number" class="qty-input" value="${
            cart[product.id].quantity
          }" min="1" data-id="${product.id}">
          <button class="qty-btn plus" data-id="${
            product.id
          }"><span>+</span></button>
        </div>
      `
        : `
        <a href="#" class="btn add-to-cart-btn"
           data-id="${product.id}"
           data-name="${shortName}"
           data-price="${product.offerPrice}"
           data-img="${product.images[0]}">
          <img src="images/cart-white.svg" alt="cart"> add to cart
        </a>
      `;

      html += `
        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
            <div class="product-box">
                <div class="product-img position-relative">
                    <img class="pr-img" src="${product.images[0]}" alt="${
        product.name
      }">
                    <div class="add-to-cart">
                        ${cartControl}
                    </div>
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
                    <a class="pr-title" href="product-desc.html?id=${
                      product.id
                    }">
                        <p>${shortName}</p>
                    </a>
                    <div class="pr-price">
                        <div class="offer-price">$${product.offerPrice.toFixed(
                          2
                        )}</div>
                        <div class="org-price"><strike>$${product.originalPrice.toFixed(
                          2
                        )}</strike></div>
                    </div>
                </div>
            </div>
        </div>
      `;
    });

    $("#trending-products-wrapper").html(html);

    // Animate product-boxes after DOM update
    gsap.from('#trending-products-wrapper .product-box', {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.12,
      scrollTrigger: {
        trigger: '#trending-products-wrapper',
        start: 'top 90%',
      }
    });
  });

  /*----------Top Rated Products----------*/
  $.getJSON("data/products.json", function (data) {
    const topratedProducts = data.products
      .filter((product) => product.tags && product.tags.includes("top"))
      .slice(0, 6);

    let html = "";
    topratedProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");

      // Check if product is in cart
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      const inCart = cart[product.id];

      // Determine whether to show add to cart or quantity box
      const cartControl = inCart
        ? `
        <div class="quantity-box">
          <button class="qty-btn minus" data-id="${
            product.id
          }"><span>-</span></button>
          <input type="number" class="qty-input" value="${
            cart[product.id].quantity
          }" min="1" data-id="${product.id}">
          <button class="qty-btn plus" data-id="${
            product.id
          }"><span>+</span></button>
        </div>
      `
        : `
        <a href="#" class="btn add-to-cart-btn"
           data-id="${product.id}"
           data-name="${shortName}"
           data-price="${product.offerPrice}"
           data-img="${product.images[0]}">
          <img src="images/cart-white.svg" alt="cart"> add to cart
        </a>
      `;

      html += `
        <div class="col-lg-4 col-md-4 col-sm-6 col-6">
            <div class="product-box">
                <div class="product-img position-relative">
                    <img class="pr-img" src="${product.images[0]}" alt="${
        product.name
      }">
                    <div class="add-to-cart">
                        ${cartControl}
                    </div>
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
                    <a class="pr-title" href="product-desc.html?id=${
                      product.id
                    }">
                        <p>${shortName}</p>
                    </a>
                    <div class="pr-price">
                        <div class="offer-price">$${product.offerPrice.toFixed(
                          2
                        )}</div>
                        <div class="org-price"><strike>$${product.originalPrice.toFixed(
                          2
                        )}</strike></div>
                    </div>
                </div>
            </div>
        </div>
      `;
    });

    $("#toprated-products-wrapper").html(html);

    // Animate product-boxes after DOM update
    gsap.from('#toprated-products-wrapper .product-box', {
      opacity: 0,
      y: 40,
      scale: 0.96,
      duration: 0.7,
      stagger: 0.12,
      scrollTrigger: {
        trigger: '#toprated-products-wrapper',
        start: 'top 90%',
      }
    });
  });

  /*----------Testimonial Carousel----------*/
  var swiper = new Swiper(".testimonial-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });
  /*----------Testimonial Carousel----------*/
  gsap.from(".hero-section", { opacity: 0, y: 50, duration: 1 });
  gsap.from('.hero-section .hero-slide .hero-content h1', { opacity: 0, y: 40, duration: 1 });
  gsap.from('.hero-section .hero-slide .hero-content p', { opacity: 0, y: 40, duration: 1, delay: 0.3 });
  gsap.from('.hero-right', { opacity: 0, x: 50, duration: 1, delay: 0.8 });

  gsap.from('.feature-area .ft-item', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.feature-area',
      start: 'top 80%',
    }
  });

  gsap.from('.about-img img', {
    opacity: 0,
    x: -60,
    duration: 1,
    scrollTrigger: {
      trigger: '.about-area',
      start: 'top 80%',
    }
  });
  gsap.from('.about-content', {
    opacity: 0,
    x: 60,
    duration: 1,
    delay: 0.2,
    scrollTrigger: {
      trigger: '.about-area',
      start: 'top 80%',
    }
  });

  gsap.from('.feature-product-area .heading', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    scrollTrigger: {
      trigger: '.feature-product-area',
      start: 'top 80%',
    }
  });


  gsap.from('.banner-area .img-box-1', {
    opacity: 0,
    x: -50,
    duration: 1,
    scrollTrigger: {
      trigger: '.banner-area',
      start: 'top 80%',
    }
  });
  gsap.from('.banner-area .banner-content', {
    opacity: 0,
    y: 40,
    duration: 1,
    delay: 0.2,
    scrollTrigger: {
      trigger: '.banner-area',
      start: 'top 80%',
    }
  });
  gsap.from('.banner-area .img-box-2', {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.4,
    scrollTrigger: {
      trigger: '.banner-area',
      start: 'top 80%',
    }
  });

  gsap.from('.trending-area .heading', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    scrollTrigger: {
      trigger: '.trending-area',
      start: 'top 85%',
    }
  });

  gsap.from('.small-banner-area .small-banner-1', {
    opacity: 0,
    scale: 0.95,
    x: -40,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.small-banner-area .small-banner-1',
      start: 'top 90%',
    }
  });
  gsap.from('.small-banner-area .small-banner-2', {
    opacity: 0,
    scale: 0.95,
    x: 40,
    duration: 0.8,
    delay: 0.2,
    scrollTrigger: {
      trigger: '.small-banner-area .small-banner-2',
      start: 'top 90%',
    }
  });

  gsap.from('.toprated-area .heading', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    scrollTrigger: {
      trigger: '.toprated-area',
      start: 'top 85%',
    }
  });

  gsap.from('.testimonial-area .testimonial-slide', {
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.testimonial-area',
      start: 'top 80%',
    }
  });
  gsap.from('.testimonial-img-box img', {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    scrollTrigger: {
      trigger: '.testimonial-area',
      start: 'top 80%',
    }
  });

  gsap.from('.footer', {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
    }
  });

  // Trending Banner Animation
  gsap.from('.trending-banner', {
    opacity: 0,
    x: 60,
    scale: 0.96,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.trending-banner',
      start: 'top 90%',
    }
  });

  // Top Rated Banner Animation
  gsap.from('.toprated-banner', {
    opacity: 0,
    x: -60,
    scale: 0.96,
    duration: 0.8,
    scrollTrigger: {
      trigger: '.toprated-banner',
      start: 'top 90%',
    }
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0.01); // Effectively disables animation
  }
});
