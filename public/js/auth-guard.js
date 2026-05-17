import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyApICU6wUb1dkvHhVDBhsDk9bwVMWAVKeo",
    authDomain: "matrixsphere-shop.firebaseapp.com",
    databaseURL: "https://matrixsphere-shop-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "matrixsphere-shop",
    storageBucket: "matrixsphere-shop.firebasestorage.app",
    messagingSenderId: "639761938336",
    appId: "1:639761938336:web:347c97b498ddb1efd156c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const ADMIN_EMAIL = "dani6385@gmail.com";

function detectAdminForButton() {
    onAuthStateChanged(auth, (user) => {
        if (user && user.email === ADMIN_EMAIL) {
            document.body.classList.add('is-admin-network');
        } else {
            document.body.classList.remove('is-admin-network');
        }
    });
}

// Jalankan fungsi saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', detectAdminForButton);