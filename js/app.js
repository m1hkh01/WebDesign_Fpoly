// =======================
// Product Data (global)
// =======================
const products = [
  { name: "Nike Air Max", img: "images/s1.png", price: 2500000 },
  { name: "Nike Zoom", img: "images/s2.png", price: 2800000 },
  { name: "Nike Free", img: "images/s3.png", price: 2200000 },
  { name: "Nike Revolution", img: "images/s4.png", price: 2600000 },
  { name: "Nike Pegasus", img: "images/s5.png", price: 3000000 },
  { name: "Nike Epic React", img: "images/s6.png", price: 3200000 },
  { name: "Nike Air Force", img: "images/s7.png", price: 3500000 },
  { name: "Nike VaporMax", img: "images/s8.png", price: 4000000 },
  { name: "Nike Infinity Run", img: "images/s9.png", price: 2700000 },
  { name: "Nike Metcon", img: "images/s10.png", price: 2900000 },
  { name: "Nike Dunk", img: "images/s11.png", price: 3100000 }
];

// =======================
// Cart Helpers
// =======================
const CART_KEY = "cartItems";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const index = cart.findIndex(p => p.name === product.name);

  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart!`);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

// =======================
// Render Product Cards (Homepage)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container");
  const loadMoreBtn = document.getElementById("load-more");
  const productsPerLoad = 6; // mỗi lần load thêm 6 sp
  let currentIndex = productsPerLoad; // 👉 bắt đầu từ 6 (đã hiển thị 6 cái đầu)
  let expanded = false; // 👉 trạng thái: false = chưa mở hết, true = đã mở hết

  const CURRENT_KEY = "ss_currentUser";

  function getCurrentUser() {
    const userData = localStorage.getItem(CURRENT_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  function renderProducts(limit) {
    container.innerHTML = ""; // xoá cũ trước khi render lại
    const visibleProducts = products.slice(0, limit);

    visibleProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="imgBx">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="contentBx">
          <h2>${product.name}</h2>
          <div class="price">
            <h3>Price:</h3>
            <span>${product.price.toLocaleString("vi-VN")} VND</span>
          </div>
          <a href="#" class="btn-add">Add to cart</a>
        </div>
      `;

      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product-detail.html";
      });

      const btn = card.querySelector(".btn-add");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const user = getCurrentUser();
        if (!user) {
          alert("⚠️ You need to log in to add products to cart!");
          window.location.href = "login.html";
          return;
        }
        addToCart(product);
      });

      container.appendChild(card);
    });
  }

 // 👉 Hàm cập nhật text và trạng thái nút
  function updateButton() {
    if (currentIndex >= products.length) {
      // Đã xem hết → Hiện nút "Thu gọn"
      loadMoreBtn.textContent = "Hide";
      expanded = true;
    } else {
      // Chưa xem hết → Hiện nút "Xem thêm"
      loadMoreBtn.textContent = "See More";
      expanded = false;
    }
  }

  // Mặc định hiển thị 6 sản phẩm đầu tiên
  if (container && products.length > 0) {
    renderProducts(currentIndex);
    updateButton();
  }

  // 👉 Khi nhấn nút
  loadMoreBtn.addEventListener("click", () => {
    if (expanded) {
      // Nếu đang mở hết → Thu gọn về 6 sản phẩm đầu
      currentIndex = productsPerLoad;
      renderProducts(currentIndex);
      expanded = false;
      loadMoreBtn.textContent = "See More";
      
      // 👉 Cuộn mượt lên đầu section sản phẩm
      document.getElementById("product").scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    } else {
      // Nếu chưa mở hết → Tăng thêm 6 sản phẩm
      currentIndex += productsPerLoad;
      if (currentIndex > products.length) {
        currentIndex = products.length;
      }
      renderProducts(currentIndex);
      updateButton();
    }
  });

  updateCartCount();
});


// =======================
// Product Detail Page
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("product-detail");
  if (!detailContainer) return;

  const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!selectedProduct) {
    detailContainer.innerHTML = "<p>No product selected.</p>";
    return;
  }

  detailContainer.innerHTML = `
    <div class="detail-img">
      <img src="${selectedProduct.img}" alt="${selectedProduct.name}">
    </div>
    <div class="detail-info">
      <h2>${selectedProduct.name}</h2>
      <p class="price">${selectedProduct.price.toLocaleString("vi-VN")} VND</p>
      <button id="btn-add-detail">Add to Cart</button>
    </div>
  `;

  // ✅ Lấy người dùng hiện tại
  const CURRENT_KEY = "ss_currentUser";
  function getCurrentUser() {
    const userData = localStorage.getItem(CURRENT_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // ✅ Gán sự kiện cho nút Add to Cart
  document.getElementById("btn-add-detail").addEventListener("click", () => {
    const currentUser = getCurrentUser();

    // Nếu chưa đăng nhập thì chặn + chuyển hướng
    if (!currentUser) {
      alert("⚠️ Please login to add products to cart!");
      window.location.href = "login.html";
      return;
    }

    // Nếu đã đăng nhập => thêm vào giỏ hàng
    addToCart(selectedProduct);
  });
});

// =======================
// Related Products with Swiper
// =======================
function renderRelatedProducts(currentProductName) {
  const relatedContainer = document.getElementById("related-container");
  if (!relatedContainer) return;

  // Filter out current product
  const otherProducts = products.filter(p => p.name !== currentProductName);

  relatedContainer.innerHTML = "";
  otherProducts.forEach(product => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price.toLocaleString("vi-VN")} VND</p>
    `;

    slide.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "product-detail.html";
    });

    relatedContainer.appendChild(slide);
  });

  // Initialize Swiper
  new Swiper(".related-swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 45,
      stretch: 0,
      depth: 10,
      modifier: 1,
      slideShadows: true,
    },
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
}

// =======================
// Cart Page Renderer
// =======================
function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const cartTotal = document.getElementById("cart-total");
  if (!cartContainer || !cartTotal) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0 VND";
    return;
  }

  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item glass";
    div.innerHTML = `
      <div class="cart-left">
        <img src="${item.img}" alt="${item.name}" class="cart-img">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>${item.price.toLocaleString("vi-VN")} VND</p>
          <div class="quantity">
            <button class="qty-btn decrease">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn increase">+</button>
          </div>
        </div>
      </div>
      <div class="cart-right">
        <p class="subtotal">${subtotal.toLocaleString("vi-VN")} VND</p>
        <button class="remove-btn" title="Remove">🗑️</button>
      </div>
    `;

    div.querySelector(".increase").addEventListener("click", () => {
      item.quantity++;
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    div.querySelector(".decrease").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    div.querySelector(".remove-btn").addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString("vi-VN") + " VND";
  updateCartCount();
}

// =======================
// Toast Notification
// =======================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

// =======================
// Checkout Navigation
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      localStorage.setItem("checkoutCart", JSON.stringify(cart));
      window.location.href = "checkout.html";
    });
  }

  renderCart();
});
    const CURRENT_KEY = 'ss_currentUser';

    async function loadHTML(id, file) {
        const response = await fetch(file);
        document.getElementById(id).innerHTML = await response.text();

        // 👉 Sau khi load header xong, setup UI ngay
        if (id === "header") {
            setTimeout(() => {
                setupHeaderAuthUI();
                setupSmartHeader();
            }, 100);
        }
    }

    // =============================
    // 🔹 Setup Header Auth UI
    // =============================
    function setupHeaderAuthUI() {
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_KEY));
        const accountDropdown = document.getElementById("account-dropdown");
        const accountLink = document.getElementById("account-link");
        const mobileAccountLink = document.getElementById("mobile-account-link");

        console.log("🔍 Setup Header Auth UI");
        console.log("Current User:", currentUser);
        console.log("Account Link Element:", accountLink);

        if (!accountDropdown) {
            console.error("❌ Account dropdown not found!");
            return;
        }

        const dropContent = accountDropdown.querySelector(".dropdown-content");

        if (currentUser) {
            // ✅ Đã đăng nhập → Hiện nút Account
            if (accountLink) {
                accountLink.style.display = "block";
                console.log("✅ Desktop Account link shown");
            } else {
                console.error("❌ Account link element not found!");
            }

            if (mobileAccountLink) {
                mobileAccountLink.style.display = "block";
                console.log("✅ Mobile Account link shown");
            }

            dropContent.innerHTML = `
                <div style="padding:10px 15px; border-bottom:1px solid rgba(255,255,255,0.2); color:white;">
                    Welcome, <b>${currentUser.fullName || currentUser.email.split("@")[0]}</b>
                </div>
                <button id="logoutBtn" style="width:100%; padding:8px 0; background:#dc3545; color:white; border:none; cursor:pointer; border-radius:0 0 6px 6px;">
                    Logout
                </button>
            `;
        } else {
            // ❌ Chưa đăng nhập → Ẩn nút Account
            if (accountLink) {
                accountLink.style.display = "none";
                console.log("❌ Desktop Account link hidden");
            }
            if (mobileAccountLink) {
                mobileAccountLink.style.display = "none";
                console.log("❌ Mobile Account link hidden");
            }

            dropContent.innerHTML = `
                <a href="login.html" style="display:block; padding:10px 15px;">Login</a>
                <a href="login.html?mode=signup" style="display:block; padding:10px 15px;">Sign Up</a>
            `;
        }

        dropContent.style.display = "none";

        // Hover events
        accountDropdown.addEventListener("mouseenter", () => {
            dropContent.style.display = "block";
        });

        accountDropdown.addEventListener("mouseleave", () => {
            dropContent.style.display = "none";
        });

        // Logout button
        const logoutBtn = dropContent.querySelector("#logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                if (confirm("Logout?")) {
                    localStorage.removeItem(CURRENT_KEY);
                    location.reload();
                }
            });
        }
    }

    // =============================
    // 🔹 Smart Header (ẩn/hiện khi scroll)
    // =============================
    function setupSmartHeader() {
        const headerElement = document.querySelector('header.glass');
        if (!headerElement) return;

        let lastScrollY = window.scrollY;
        const scrollThreshold = 100;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                headerElement.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
                headerElement.classList.remove('header-hidden');
            }

            lastScrollY = currentScrollY;
        });
    }

    // ✅ Load header và footer
    loadHTML("header", "header.html");
    loadHTML("footer", "footer.html");
