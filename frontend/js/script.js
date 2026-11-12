// =============================
// Mobile Menu Functionality
// =============================

const menuToggle = document.getElementById("menu-toggle");

const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {

menuToggle.addEventListener("click", function () {

    navbar.classList.toggle("active");

    // Change menu icon
    if (navbar.classList.contains("active")) {
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }

});

};


// =============================
// Product Data
// =============================

const products = [

    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        image: "images/product1.png"
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        image: "images/product2.png"
    },

    {
        id: 3,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1999,
        image: "images/product3.png"
    },

    {
        id: 4,
        name: "Casual T-Shirt",
        category: "Fashion",
        price: 599,
        image: "images/product4.png"
    },

    {
        id: 5,
        name: "Stylish Jacket",
        category: "Fashion",
        price: 1999,
        image: "images/product5.png"
    },

    {
        id: 6,
        name: "Running Sneakers",
        category: "Shoes",
        price: 1799,
        image: "images/product6.png"
    },

    {
        id: 7,
        name: "Sports Shoes",
        category: "Shoes",
        price: 2199,
        image: "images/product7.png"
    },

    {
        id: 8,
        name: "Casual Shoes",
        category: "Shoes",
        price: 1299,
        image: "images/product8.png"
    }

];


// =============================
// Get HTML Elements
// =============================

const productContainer = document.getElementById("product-container");

const searchInput = document.getElementById("search-input");

const filterButtons = document.querySelectorAll(".filter-btn");

const noProducts = document.getElementById("no-products");

const cartCount = document.querySelector(".cart-icon span");


// =============================
// Display Products
// =============================

function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        noProducts.style.display = "block";

        return;

    }

    noProducts.style.display = "none";

    productList.forEach(function (product) {

        const productCard = document.createElement("div");

        productCard.classList.add("product-card");

        productCard.setAttribute("data-category", product.category);

     productCard.innerHTML = `

    <div class="product-image">

        <img src="${product.image}" alt="${product.name}">

    </div>

    <div class="product-info">

        <h3>${product.name}</h3>

        <p class="product-price">
            ₹${product.price.toLocaleString("en-IN")}
        </p>

        <a href="pages/product.html?id=${product.id}"
        class="view-details-btn">
            View Details
        </a>

        <button class="add-cart-btn" data-id="${product.id}">
            Add To Cart
        </button>

    </div>

`;
        productContainer.appendChild(productCard);

    });

}

// =============================
// Category Filter
// =============================

let selectedCategory = "all";

function filterProducts() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(function (product) {

       const matchesCategory =
    selectedCategory === "all" ||
    product.category.toLowerCase() === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;

    });

    displayProducts(filteredProducts);

}


// Filter Button Click

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        filterProducts();

    });

});


// =============================
// Search Functionality
// =============================

if (searchInput) {

    searchInput.addEventListener("input", function () {

        filterProducts();

    });

}

// =============================
// Add To Cart Functionality
// =============================

let cartItems = 0;

if (productContainer) {

    productContainer.addEventListener("click", function (event) {

        if (event.target.classList.contains("add-cart-btn")) {

            cartItems++;

            if (cartCount) {
                cartCount.textContent = cartItems;
            }

            event.target.textContent = "Added!";

            setTimeout(function () {

                event.target.textContent = "Add To Cart";

            }, 1000);

        }

    });

}

// =============================
// Initial Product Display
// =============================

if (productContainer) {
    displayProducts(products);
}

// =============================
// Product Details Page Functionality
// =============================

const quantityInput = document.getElementById("quantity");

const detailsAddCartBtn = document.querySelector(
    ".product-details-info .add-cart-btn"
);

if (detailsAddCartBtn && quantityInput) {

    detailsAddCartBtn.addEventListener("click", function () {

        const quantity = Number(quantityInput.value);

        if (quantity < 1 || quantity > 10 || !Number.isInteger(quantity)) {
            alert("Please enter a quantity between 1 and 10.");
            return;
        }

        alert(quantity + " Wireless Headphones added to cart!");

    });

}


// =============================
// Register Form Validation
// =============================

const registerForm = document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("register-name").value.trim();

        const email = document.getElementById("register-email").value.trim();

        const password = document.getElementById("register-password").value;

        const confirmPassword = document.getElementById("confirm-password").value;

        if (name === "") {
            alert("Please enter your full name.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Registration form validated successfully!");

    });

}


// =============================
// Login Form Validation
// =============================

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();

        const password = document.getElementById("login-password").value;

        if (email === "") {
            alert("Please enter your email.");
            return;
        }

        if (password === "") {
            alert("Please enter your password.");
            return;
        }

        alert("Login form validated successfully!");

    });

}