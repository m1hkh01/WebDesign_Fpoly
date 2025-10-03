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
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  let existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = count;
  }
}

// =======================
// Render Product Cards (Homepage)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container");

  if (container) {
    products.forEach((product) => {
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

      // mở chi tiết sản phẩm khi click card
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product-detail.html";
      });

      // chặn nổi bọt khi bấm nút Add
      const btnAdd = card.querySelector(".btn-add");
      btnAdd.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
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
const detailContainer = document.getElementById("product-detail");

if (detailContainer) {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (product) {
    detailContainer.innerHTML = `
      <div class="detail-img">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <div class="detail-info">
        <h2>${product.name}</h2>
        <p class="price">Price: ${product.price.toLocaleString("vi-VN")} VND</p>
        <button id="btn-add-detail">Add to Cart</button>
      </div>
    `;

    const btnDetail = document.getElementById("btn-add-detail");
    btnDetail.addEventListener("click", () => addToCart(product));
  } else {
    detailContainer.innerHTML = `<p>Không tìm thấy sản phẩm.</p>`;
  }
}

// =======================
// Render Cart Page
// =======================
function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const cartTotal = document.getElementById("cart-total");

  if (!cartContainer || !cartTotal) return;

  let cart = getCart();
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "0 VND";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
  <div class="cart-left">
  <img src="${item.img}" alt="${item.name}" class="cart-img">
  <div class="cart-info">
    <h4 class="cart-name">${item.name}</h4>
    <p class="cart-price">${item.price.toLocaleString("vi-VN")} VND</p>
    
    <div class="quantity">
      <button class="qty-btn decrease" aria-label="Decrease">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" 
             fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 11h14v2H5z"/>
        </svg>
      </button>
      <span class="qty-value">${item.qty}</span>
      <button class="qty-btn increase" aria-label="Increase">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" 
             fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/>
        </svg>
      </button>
    </div>
  </div>
</div>


  <div class="cart-right">
    <p class="subtotal">${(item.price * item.qty).toLocaleString("vi-VN")} VND</p>
    <button class="remove-btn" aria-label="Remove">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm2 3h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm5 3v7h2v-7h-2zm4 0v7h2v-7h-2z"/>
      </svg>
    </button>
  </div>
`;

    // tăng
    div.querySelector(".increase").addEventListener("click", () => {
      cart[index].qty++;
      saveCart(cart);
      renderCart();
    });

    // giảm
    div.querySelector(".decrease").addEventListener("click", () => {
      if (cart[index].qty > 1) {
        cart[index].qty--;
      } else {
        cart.splice(index, 1);
      }
      saveCart(cart);
      renderCart();
    });

    // xóa
    div.querySelector(".remove-btn").addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });

    cartContainer.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString("vi-VN") + " VND";
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      let cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Thank you for your purchase!");
        localStorage.removeItem("cart");
        renderCart();
      }
    });
  }
});

// =======================
// Toast Notification
// =======================
function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}
