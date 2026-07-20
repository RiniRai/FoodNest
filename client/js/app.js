document.querySelector(".order-btn").addEventListener("click",()=>{
    alert("Order feature coming soon!");
});
document.querySelector(".menu-btn").addEventListener("click",()=>{
    document.querySelector(".restaurants").scrollIntoView({
        behavior:"smooth"
    });
});