const phoneNumber = "2349069087347"; 
let cart = [];

const products = [
  { id: 1, name: "Classic Black Hoodie", price: 12000, image: "https://images.pexels.com/photos/634785/pexels-photo-634785.jpeg" },
  { id: 2, name: "Elegant White Shirt", price: 8500, image: "https://images.pexels.com/photos/769732/pexels-photo-769732.jpeg" },
  { id: 3, name: "Luxury Sneakers", price: 18000, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" },
  { id: 4, name: "Premium Handbag", price: 15000, image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg" }
];

function loadProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((product) => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>High quality fashion product for your daily drip.</p>
        <p class="price">₦${product.price.toLocaleString()}</p>
        <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  cart.push(product);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br/>
          <small>₦${item.price.toLocaleString()}</small>
        </div>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  cartTotal.innerText = total.toLocaleString();
  cartCount.innerText = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p style='color:#aaa;'>Your cart is empty.</p>";
  }
}

function placeOrder() {
  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();

  if (!name || !address || !phone) {
    alert("Please fill in your details before placing an order.");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = `🛍️ *New Order - Elegance Avenue*%0A%0A`;
  message += `👤 Name: ${name}%0A`;
  message += `📞 Phone: ${phone}%0A`;
  message += `🏠 Address: ${address}%0A%0A`;
  message += `🧾 *Order Items:*%0A`;

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    message += `${i + 1}. ${item.name} - ₦${item.price.toLocaleString()}%0A`;
  });

  message += `%0A✅ *Total:* ₦${total.toLocaleString()}%0A%0A`;
  message += `Please confirm availability & delivery fee 🙏`;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, "_blank");
}

document.getElementById("year").innerText = new Date().getFullYear();

loadProducts();
updateCart();