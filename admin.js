import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
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

window.addProduct = async function () {
  const name = document.getElementById("pname").value.trim();
  const price = Number(document.getElementById("pprice").value);
  const category = document.getElementById("pcat").value.trim();
  const image = document.getElementById("pimg").value.trim();

  if (!name || !price || !category || !image) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name,
      price,
      category,
      image,
      inStock: true,
      createdAt: serverTimestamp()
    });

    alert("✅ Product uploaded successfully!");

    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("pcat").value = "";
    document.getElementById("pimg").value = "";
  } catch (err) {
    console.log(err);
    alert("❌ Upload failed. Check Firestore Rules.");
  }
};
