// =============================
// MyShop Cart System
// =============================

// Get existing cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =============================
// Save Cart
// =============================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// =============================
// Update Cart Count
// =============================

function updateCartCount() {

    const cartCounts = document.querySelectorAll(".cart-icon span");

    let totalItems = cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);

    cartCounts.forEach(function (count) {
        count.textContent = totalItems;
    });

}

// =============================
// Dynamic Product Details
// =============================

const productCatalog = [

    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        image: "../images/product1.png",
        description: "Premium wireless headphones with amazing sound quality."
    },

    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        image: "../images/product2.png",
        description: "Smart watch with modern design and useful features."
    },

    {
        id: 3,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1999,
        image: "../images/product3.png",
        description: "Enjoy powerful sound with this portable speaker."
    },

    {
        id: 4,
        name: "Casual T-Shirt",
        category: "Fashion",
        price: 599,
        image: "../images/product4.png",
        description: "Comfortable and stylish casual T-shirt."
    },

    {
        id: 5,
        name: "Stylish Jacket",
        category: "Fashion",
        price: 1999,
        image: "../images/product5.png",
        description: "A stylish jacket for your everyday look."
    },

    {
        id: 6,
        name: "Running Sneakers",
        category: "Shoes",
        price: 1799,
        image: "../images/product6.png",
        description: "Comfortable sneakers for running and daily use."
    },

    {
        id: 7,
        name: "Sports Shoes",
        category: "Shoes",
        price: 2199,
        image: "../images/product7.png",
        description: "Lightweight sports shoes for active lifestyle."
    },

    {
        id: 8,
        name: "Casual Shoes",
        category: "Shoes",
        price: 1299,
        image: "../images/product8.png",
        description: "Stylish casual shoes for everyday wear."
    }

];

const params = new URLSearchParams(window.location.search);

const selectedProductId = Number(params.get("id"));

const selectedProduct = productCatalog.find(function(product) {
    return product.id === selectedProductId;
});

if (selectedProduct) {

    document.querySelector(".product-details-image img").src =
        selectedProduct.image;

    document.querySelector(".product-details-image img").alt =
        selectedProduct.name;

    const details = document.querySelector(".product-details-info");

    details.querySelector("p").textContent = selectedProduct.category;

    details.querySelector("h1").textContent = selectedProduct.name;

    details.querySelector("h2").textContent =
        "₹" + selectedProduct.price.toLocaleString("en-IN");

    details.querySelectorAll("p")[1].textContent =
        selectedProduct.description;

}

// =============================
// Add Product To Cart
// =============================

const addButton = document.querySelector(
    ".product-details-info .add-cart-btn"
);

if (addButton) {

    addButton.addEventListener("click", function () {

        const quantityInput = document.getElementById("quantity");
        const quantity = Number(quantityInput.value);

        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
            alert("Please enter quantity between 1 and 10.");
            return;
        }

        if (!selectedProduct) {
            alert("Product not found!");
            return;
        }

        const existingProduct = cart.find(function (item) {
            return item.id === selectedProduct.id;
        });

        if (existingProduct) {

            existingProduct.quantity += quantity;

        } else {

            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                quantity: quantity
            });

        }

        saveCart();
        updateCartCount();

        alert(selectedProduct.name + " successfully added to cart!");

    });

}


// =============================
// Display Cart Products
// =============================

function displayCart() {

    const cartContainer = document.getElementById("cart-container");

    if (!cartContainer) return;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <h2>Your Cart is Empty!</h2>
            <a href="../index.html#products">Continue Shopping</a>
        `;

        updateCartCount();
        return;
    }

    let total = 0;

    cartContainer.innerHTML = cart.map(function (item) {

        total += item.price * item.quantity;

        return `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}" width="100">

                <h3>${item.name}</h3>

                <p>Price: ₹${item.price.toLocaleString("en-IN")}</p>

                <div class="quantity-controls">

                    <button class="decrease-btn" data-id="${item.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button class="increase-btn" data-id="${item.id}">
                        +
                    </button>

                </div>

                <p>
                    Subtotal: ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                </p>

                <button class="remove-btn" data-id="${item.id}">
                    Remove
                </button>

            </div>
        `;

    }).join("");

    
cartContainer.innerHTML += `
    <h2>Total Amount: ₹${total.toLocaleString("en-IN")}</h2>

    <a href="../index.html#products">Continue Shopping</a>

    <a href="checkout.html" style="
        display: inline-block;
        margin: 15px;
        padding: 14px 26px;
        background: #ff6b35;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
    ">
        Proceed to Checkout
    </a>
`;


}


// =============================
// Cart Button Functionality
// =============================

const cartContainer = document.getElementById("cart-container");

if (cartContainer) {

    cartContainer.addEventListener("click", function (event) {

        const productId = Number(event.target.dataset.id);

        if (event.target.classList.contains("increase-btn")) {

            const item = cart.find(function (product) {
                return product.id === productId;
            });

            if (item && item.quantity < 10) {
                item.quantity++;
            } else if (item) {
                alert("Maximum quantity is 10.");
            }

        }

        else if (event.target.classList.contains("decrease-btn")) {

            const item = cart.find(function (product) {
                return product.id === productId;
            });

            if (item && item.quantity > 1) {
                item.quantity--;
            }

        }

        else if (event.target.classList.contains("remove-btn")) {

            cart = cart.filter(function (product) {
                return product.id !== productId;
            });

        }

        else {
            return;
        }

        saveCart();
        displayCart();
        updateCartCount();

    });

}


// =============================
// Initialize Cart
// =============================

updateCartCount();
displayCart();


// =============================
// Checkout Order Summary
// =============================

function displayCheckoutSummary() {

    const summary = document.getElementById("checkout-summary");

    if (!summary) return;

    if (cart.length === 0) {

        summary.innerHTML = `
            <h3>Your Cart is Empty!</h3>
            <a href="../index.html#products">Continue Shopping</a>
        `;

        return;
    }

    let total = 0;

    summary.innerHTML = cart.map(function (item) {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        return `
            <div class="checkout-item">

                <h3>${item.name}</h3>

                <p>Price: ₹${item.price.toLocaleString("en-IN")}</p>

                <p>Quantity: ${item.quantity}</p>

                <p>Subtotal: ₹${subtotal.toLocaleString("en-IN")}</p>

            </div>
        `;

    }).join("");

    summary.innerHTML += `
        <h3>Grand Total: ₹${total.toLocaleString("en-IN")}</h3>
    `;

}


// =============================
// Checkout Initialization
// =============================

displayCheckoutSummary();


// =============================
// Place Order Functionality
// =============================

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Clear Cart
        cart = [];

        // Update localStorage
        saveCart();

        // Update Cart Count
        updateCartCount();

        // Update Checkout Summary
        displayCheckoutSummary();

        // Success Message
alert("Order placed successfully!");

// Redirect to Success Page
window.location.href = "order-success.html";

    });

}