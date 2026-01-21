import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

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
const storage = getStorage(app);

window.addProduct = async function () {
  const name = document.getElementById("pname").value.trim();
  const price = Number(document.getElementById("pprice").value);
  const category = document.getElementById("pcat").value.trim();

  const fileInput = document.getElementById("pimgFile");
  const file = fileInput.files[0];

  if (!name || !price || !category || !file) {
    alert("Please fill all fields and choose an image.");
    return;
  }

  try {
    // ✅ Upload image to Firebase Storage
    const fileName = `products/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    // ✅ Save product to Firestore
    await addDoc(collection(db, "products"), {
      name,
      price,
      category,
      image: imageUrl,
      inStock: true,
      createdAt: serverTimestamp()
    });

    alert("✅ Product uploaded successfully!");

    // Clear fields
    document.getElementById("pname").value = "";
    document.getElementById("pprice").value = "";
    document.getElementById("pcat").value = "";
    fileInput.value = "";
  } catch (err) {
    console.log(err);
    alert("❌ Upload failed. Check Firebase Storage / Rules.");
  }
};
