// Restaurant Page Loaded
console.log("Restaurants Page Loaded");

// Highlight selected filter button
const filterButtons = document.querySelectorAll(".filter-section button");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active-filter");
        });

        button.classList.add("active-filter");

    });
});

// View Menu button click
const menuButtons = document.querySelectorAll(".restaurant-info button");

menuButtons.forEach(button => {
    button.addEventListener("click", () => {
        alert("Menu page will be available soon!");
    });
});