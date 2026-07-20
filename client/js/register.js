console.log("Register Page Loaded");

document.querySelector("form").addEventListener("submit",(e)=>{

    e.preventDefault();

    const password=document.querySelectorAll("input")[3].value;
    const confirm=document.querySelectorAll("input")[4].value;

    if(password!==confirm){

        alert("Passwords do not match!");

        return;

    }

    alert("Registration Successful! Firebase integration coming next.");

    window.location.href="login.html";

});