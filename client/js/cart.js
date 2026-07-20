
// ===============================
// FoodNest Cart JavaScript
// ===============================

console.log("Cart Page Loaded");

// Get all quantity containers
const quantityContainers = document.querySelectorAll(".quantity");

let itemPrices = [199, 299];

// Update Order Summary
function updateSummary() {

    let quantities = document.querySelectorAll(".quantity span");

    let subtotal = 0;

    quantities.forEach((item, index) => {

        subtotal += parseInt(item.innerText) * itemPrices[index];

    });

    const delivery = 40;

    document.querySelector(".summary p:nth-child(2)").innerHTML =
        `Items : <span>₹${subtotal}</span>`;

    document.querySelector(".summary p:nth-child(3)").innerHTML =
        `Delivery : <span>₹${delivery}</span>`;

    document.querySelector(".summary h3").innerHTML =
        `Total : ₹${subtotal + delivery}`;
}

quantityContainers.forEach((container) => {

    let minus = container.children[0];
    let quantity = container.children[1];
    let plus = container.children[2];

    plus.addEventListener("click", () => {

        quantity.innerText = Number(quantity.innerText) + 1;

        updateSummary();

    });

    minus.addEventListener("click", () => {

        if (Number(quantity.innerText) > 1) {

            quantity.innerText = Number(quantity.innerText) - 1;

            updateSummary();

        }

    });

});

// Checkout Button
document.querySelector(".checkout-btn").addEventListener("click", () => {

    alert("Proceeding to Checkout...");

    window.location.href = "checkout.html";

});
const removeButtons = document.querySelectorAll(".remove-btn");

removeButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.closest(".cart-card").remove();

        alert("Item Removed!");

        updateSummary();

    });

});