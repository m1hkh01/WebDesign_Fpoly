// =======================
// Product Data (global)
// =======================
const products = [
  { name: "Nike Air Max", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png", price: 2500000 },
  { name: "Nike Zoom", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5783.png", price: 2800000 },
  { name: "Nike Free", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5784.png", price: 2200000 },
  { name: "Nike Revolution", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5785.png", price: 2600000 },
  { name: "Nike Pegasus", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5786.png", price: 3000000 },
  { name: "Nike Epic React", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5787.png", price: 3200000 },
  { name: "Nike Air Force", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5788.png", price: 3500000 },
  { name: "Nike VaporMax", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5789.png", price: 4000000 },
  { name: "Nike Infinity Run", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5790.png", price: 2700000 },
  { name: "Nike Metcon", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5791.png", price: 2900000 },
  { name: "Nike Dunk", img: "https://pngimg.com/uploads/running_shoes/running_shoes_PNG5795.png", price: 3100000 }
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
  if (container) {
    products.forEach(product => {
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
        addToCart(product);
      });
      container.appendChild(card);
    });
  }
  updateCartCount();
});

// =======================
// Product Detail Page
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const detailContainer = document.getElementById("product-detail");
  if (detailContainer) {
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

    document.getElementById("btn-add-detail").addEventListener("click", () => {
      addToCart(selectedProduct);
    });

    // Render Other Products (exclude current product)
    renderRelatedProducts(selectedProduct.name);
  }
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