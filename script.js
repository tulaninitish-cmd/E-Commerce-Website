// Simple e-commerce script - college project

// Product list (mock data)
const products = [
  { id: 1, name: "Banarasi Saree", price: 1499, category: "clothing", img: "images/saree.jpg" },
  { id: 2, name: "Kurta Pajama", price: 899, category: "clothing", img: "images/kurta.jpg" },
  { id: 3, name: "Kundan Necklace", price: 2499, category: "jewellery", img: "images/necklace.jpg" },
  { id: 4, name: "Silver Jhumka Earrings", price: 599, category: "jewellery", img: "images/earrings.jpg" },
  { id: 5, name: "Garam Masala 200g", price: 99, category: "grocery", img: "images/masala.jpg" },
  { id: 6, name: "Basmati Rice 5kg", price: 549, category: "grocery", img: "images/rice.jpg" },
  { id: 7, name: "Bluetooth Earbuds", price: 1299, category: "electronics", img: "images/earbuds.jpg" },
  { id: 8, name: "Smart Watch", price: 1999, category: "electronics", img: "images/watch.jpg" },
];

// Cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM elements
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const searchBox = document.getElementById("searchBox");
const catBtns = document.querySelectorAll(".cat-btn");

let currentCategory = "all";

// Display products
function displayProducts() {
  const search = searchBox.value.toLowerCase();
  const filtered = products.filter(p => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  productGrid.innerHTML = "";
  if (filtered.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h4>${p.name}</h4>
      <p class="price">₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    productGrid.appendChild(card);
  });
}

// Add to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  alert(product.name + " added to cart!");
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);

  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = "<p style='text-align:center;color:#888;margin-top:20px;'>Cart is empty</p>";
  } else {
    cart.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <span>${item.name} × ${item.qty}</span>
        <span>₹${item.price * item.qty}</span>
        <button onclick="removeFromCart(${item.id})">x</button>
      `;
      cartItems.appendChild(div);
    });
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotal.textContent = total;
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("Order placed successfully! Thank you for shopping with DesiCart 🎉");
  cart = [];
  saveCart();
  updateCartUI();
  cartDrawer.classList.remove("open");
}

// Cart drawer toggle
cartBtn.addEventListener("click", e => {
  e.preventDefault();
  cartDrawer.classList.add("open");
});
closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

// Search
searchBox.addEventListener("input", displayProducts);

// Category filter
catBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    catBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    displayProducts();
  });
});

// Contact form
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("formMsg").textContent = "Thanks! Your message has been sent.";
  e.target.reset();
});

// Init
displayProducts();
updateCartUI();
