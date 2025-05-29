if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

$.getJSON("data/products.json", function (data) {
  if (!data || !data.products) {
    console.error("Products data is not in the expected format or is missing.");
    return;
  }

  const PAGE_SIZE = 6;
  let currentPage = 1;
  let allProducts = data.products.slice(); // all products, never filtered
  let filteredProducts = allProducts.slice(); // filtered/sorted products

  // --- Sorting ---
  function sortProducts(products, sortValue) {
    let sorted = products.slice();
    if (sortValue === "price-asc") {
      sorted.sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortValue === "price-desc") {
      sorted.sort((a, b) => b.offerPrice - a.offerPrice);
    }
    // else default: no sorting
    return sorted;
  }

  // --- Filtering ---
  function filterProducts(products) {
    let checked = $(".category-filter:checked")
      .map(function () {
        return $(this).val();
      })
      .get();
    if (checked.length === 0) return products;
    return products.filter((p) => checked.includes(p.category));
  }

  // --- Clear Filters Button ---
  $("#clear-filters").on("click", function (e) {
    e.preventDefault();
    $(".category-filter").prop("checked", false);
    currentPage = 1;
    updateAndRender();
  });

  $.getJSON("data/products.json", function (data) {
    if (!data || !data.products) return;

    const topProducts = data.products
      .filter((p) => p.tags && p.tags.includes("top"))
      .slice(0, 5);

    let html = "";
    topProducts.forEach((product) => {
      const nameWords = product.name.split(" ");
      const shortName =
        nameWords.slice(0, 7).join(" ") + (nameWords.length > 7 ? "..." : "");
      html += `
      <li>
        <a href="product-desc.html?id=${product.id}">
          <div class="pr-box mb-3">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="pr-info">
              <p>${shortName}</p>
              <div class="pr-price">
                <div class="offer-price">$${product.offerPrice.toFixed(2)}</div>
                <div class="org-price"><strike>$${product.originalPrice.toFixed(
                  2
                )}</strike></div>
              </div>
            </div>
          </div>
        </a>
      </li>
    `;
    });

    $("#top-products").html(html);
  });

  // --- Results Text ---
  function renderResultsText(total, start, end) {
    $("#results-text").text(`Showing ${start}-${end} of ${total} results`);
  }

  // --- Render Products (same as home page card design) ---
  function renderProducts(products) {
    let container = $("#product-list");
    container.empty();

    if (!products.length) {
      container.append("<div>No products found.</div>");
      renderResultsText(0, 0, 0);
      return;
    }

    products.forEach((p) => {
      let nameWords = p.name.split(" ");
      let shortName =
        nameWords.slice(0, 10).join(" ") + (nameWords.length > 10 ? "..." : "");
      let cart = JSON.parse(localStorage.getItem("cart")) || {};
      let inCart = cart[p.id];
      let cartControl = inCart
        ? `
                <div class="quantity-box">
                  <button class="qty-btn minus" data-id="${
                    p.id
                  }"><span>-</span></button>
                  <input type="number" class="qty-input" value="${
                    cart[p.id].quantity
                  }" min="1" data-id="${p.id}">
                  <button class="qty-btn plus" data-id="${
                    p.id
                  }"><span>+</span></button>
                </div>
                `
        : `
                <a href="#" class="btn add-to-cart-btn" 
                   data-id="${p.id}" 
                   data-name="${shortName}" 
                   data-price="${p.offerPrice}" 
                   data-img="${p.images[0]}">
                  <img src="images/cart-white.svg" alt="cart"> add to cart
                </a>
                `;

      container.append(`
                <div class="col-lg-4 col-md-4 col-sm-6 col-6">
                    <div class="product-box">
                        <div class="product-img position-relative">
                            <img class="pr-img" src="${p.images[0]}" alt="${
        p.name
      }">
                            <div class="add-to-cart">
                                ${cartControl}
                            </div>
                            <div class="wishlist-box">
                                <a href="#" class="add-to-wishlist-btn"
                                    data-id="${p.id}"
                                    data-name="${shortName}"
                                    data-img="${p.images[0]}"
                                    data-price="${p.offerPrice}">
                                    <i class="bx bx-heart"></i>
                                </a>
                            </div>
                        </div>
                        <div class="product-info">
                            <a class="pr-title" href="product-desc.html?id=${
                              p.id
                            }">
                                <p>${shortName}</p>
                            </a>
                            <div class="pr-price">
                                <div class="offer-price">$${p.offerPrice.toFixed(
                                  2
                                )}</div>
                                <div class="org-price"><strike>$${p.originalPrice.toFixed(
                                  2
                                )}</strike></div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
    });

    // --- GSAP Animation for product-box-area (like trending area) ---
    if (window.gsap && window.ScrollTrigger) {
      gsap.from("#product-list .product-box", {
        opacity: 0,
        y: 40,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.12,
        scrollTrigger: {
          trigger: "#product-list",
          start: "top 90%",
        },
      });
    }
  }

  // --- Pagination ---
  function paginate(products, page, perPage) {
    let start = (page - 1) * perPage;
    return products.slice(start, start + perPage);
  }

  // --- Pagination UI ---
  function renderPagination(total, page, perPage) {
    let totalPages = Math.ceil(total / perPage);
    let $ul = $("#pagination");
    $ul.empty();
    if (totalPages <= 1) return;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      $ul.append(`
                <li class=" custom-page-item${i === page ? " active" : ""}">
                    <a class="pg-num custom-page-link" href="#">${i}</a>
                </li>
            `);
    }

    // Page click
    $ul.find("a:not(.prev):not(.next)").on("click", function (e) {
      e.preventDefault();
      let n = parseInt($(this).text());
      if (n !== currentPage) {
        currentPage = n;
        renderPage();
      }
    });
  }

  // --- Main renderPage ---
  function renderPage() {
    let total = filteredProducts.length;
    let pageProducts = paginate(filteredProducts, currentPage, PAGE_SIZE);
    let start = total === 0 ? 0 : PAGE_SIZE * (currentPage - 1) + 1;
    let end = Math.min(currentPage * PAGE_SIZE, total);
    renderResultsText(total, start, end);
    renderProducts(pageProducts);
    renderPagination(total, currentPage, PAGE_SIZE);
  }

  // --- Filter, Sort, and Render ---
  function updateAndRender() {
    // Filtering
    filteredProducts = filterProducts(allProducts);
    // Sorting
    let sortValue = $("#sort-select").val();
    filteredProducts = sortProducts(filteredProducts, sortValue);
    // Reset to page 1 if current page is out of range
    let totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    if (currentPage > totalPages) currentPage = 1;
    renderPage();
  }

  // --- Event Handlers ---
  $(".category-filter").on("change", function () {
    currentPage = 1;
    updateAndRender();
  });

  $("#sort-select").on("change", function () {
    updateAndRender();
  });

  // Initial render
  updateAndRender();
});
