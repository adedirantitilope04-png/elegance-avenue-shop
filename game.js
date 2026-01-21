import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUC0qI37aNZdYI-CAnVQBw7dkJmQ36SXw",
  authDomain: "elegance-avenue-shop.firebaseapp.com",
  projectId: "elegance-avenue-shop",
  storageBucket: "elegance-avenue-shop.firebasestorage.app",
  messagingSenderId: "892970281368",
  appId: "1:892970281368:web:0a8605a7282929a628e3ed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let cart = [];

// ✅ Load products from Firestore
async function loadProductsFromFirestore() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "<p style='color:#aaa;'>Loading products...</p>";

  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      grid.innerHTML = "<p style='color:#aaa;'>No products yet. Admin should add products.</p>";
      return;
    }

    grid.innerHTML = "";
    snapshot.forEach((doc) => {
      const product = { id: doc.id, ...doc.data() };

      grid.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>High quality fashion product for your daily drip.</p>
          <p class="price">₦${Number(product.price).toLocaleString()}</p>
          <button class="btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
            Add to Cart
          </button>
        </div>
      `;
    });
  } catch (err) {
    grid.innerHTML = "<p style='color:#f88;'>Failed to load products. Check Firestore rules.</p>";
    console.log(err);
  }
}

// ✅ Add to cart
window.addToCart = function (id, name, price) {
  cart.push({ id, name, price });
  updateCart();
};

// ✅ Remove from cart
window.removeFromCart = function (index) {
  cart.splice(index, 1);
  updateCart();
};

// ✅ Update cart UI
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
          <small>₦${Number(item.price).toLocaleString()}</small>
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

// ✅ Place Order (Save to Firestore)
window.placeOrder = async function () {
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

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  try {
    await addDoc(collection(db, "orders"), {
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      items: cart,
      totalAmount: total,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("✅ Order placed successfully! We will contact you shortly.");

    cart = [];
    updateCart();

    document.getElementById("customerName").value = "";
    document.getElementById("customerAddress").value = "";
    document.getElementById("customerPhone").value = "";
  } catch (err) {
    console.log(err);
    alert("❌ Failed to place order. Please try again.");
  }
};

loadProductsFromFirestore();
updateCart();
