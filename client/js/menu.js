console.log("Food Menu Loaded");

// Category Button Active Effect

const categoryButtons = document.querySelectorAll(".food-category button");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active-category");
        });

        button.classList.add("active-category");

    });

});

// Add To Cart Button

const cartButtons = document.querySelectorAll(".food-info button");

cartButtons.forEach(button => {

    button.addEventListener("click", () => {

        alert("Item Added To Cart!");

    });

});