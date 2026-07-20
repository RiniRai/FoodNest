console.log("Checkout Page Loaded");

// Place Order Button

const placeOrder = document.querySelector(".place-order");

placeOrder.addEventListener("click", () => {

    const name = document.querySelector("input[type='text']").value;
    const email = document.querySelector("input[type='email']").value;
    const phone = document.querySelector("input[type='tel']").value;
    const address = document.querySelector("textarea").value;

    if(name==="" || email==="" || phone==="" || address===""){

        alert("Please fill all the details.");

        return;

    }

    alert("🎉 Order Placed Successfully!");

    window.location.href="success.html";

});