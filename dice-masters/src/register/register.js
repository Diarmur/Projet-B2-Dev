form = document.getElementById('form')
usernameInput = document.getElementById('username')
passwordInput = document.getElementById('password')
emailInput = document.getElementById('email')
passwordConfirmationInput = document.getElementById('password_confirmation')


document.getElementById('form').addEventListener("submit", (e) => {
    console.log("submit");
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value
    const email = emailInput.value
    const password_confirmation = passwordConfirmationInput.value
    if (username == "" || password == "") {
        console.log("wrong");
    } else {
        window.com.register("register",username, email, password, password_confirmation);
    }
    // console.log('send data');
})