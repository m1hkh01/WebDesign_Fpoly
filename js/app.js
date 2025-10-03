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
  { name: "Nike Metcon", img: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5791.png", price: 2900000 }
];

document.addEventListener("DOMContentLoaded", () => {
  // =======================
  // Toggle Mobile Menu
  // =======================
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // =======================
  // Render Product Cards (homepage)
  // =======================
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

      // Chuyển sang trang chi tiết
      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "product-detail.html";
      });

      // Nút Add to cart riêng
      const btnAdd = card.querySelector(".btn-add");
      btnAdd.style.cursor = "pointer";
      btnAdd.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        alert(`${product.name} Added to cart!`);
      });

      container.appendChild(card);
    });
  }

  // =======================
  // Dropdown menu
  // =======================
  const dropBtn = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content");

  if (dropBtn && dropdownContent) {
    dropBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dropdownContent.classList.toggle("show");
    });

    window.addEventListener("click", (e) => {
      if (!e.target.matches(".dropbtn")) {
        dropdownContent.classList.remove("show");
      }
    });
  }
});

// =======================
// Render Product Detail Page
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
    btnDetail.addEventListener("click", () => {
      alert(`${product.name} Added to cart!`);
    });
  } else {
    detailContainer.innerHTML = `<p>Không tìm thấy sản phẩm.</p>`;
  }
}
