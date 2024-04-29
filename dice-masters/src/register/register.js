form = document.getElementById('form')
usernameInput = document.getElementById('username')
passwordInput = document.getElementById('password')
emailInput = document.getElementById('email')
passwordConfirmationInput = document.getElementById('password_confirmation')


document.getElementById('form').addEventListener("submit", (e) => {
    console.log("submit");
    e.preventDefault()
    const username = usernameInput.value
    const email = emailInput.value
    const password = passwordInput.value
    const password_confirmation = passwordConfirmationInput.value
    let regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    let canSubmit = true;
    if (username == "") {
        canSubmit = false;
        const errText = document.getElementById("errUsername")
        addError(usernameInput, errText, "Can't be blank")
    }
    if (email == "") {
        canSubmit = false;
        const errText = document.getElementById("errEmail")
        addError(e.target, errText, "Can't be blank")
    }
    if (regex.test(password) == false) {
        canSubmit = false;
        const errText = document.getElementById("errPassword")
        addError(passwordInput, errText, "Password must be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
    }
    if (password != password_confirmation) {
        canSubmit = false;
        const errText = document.getElementById("errPassword")
        const errText2 = document.getElementById("errPasswordConfirmation")
        addError(passwordInput, errText, "Password confirmation must match password")
        addError(passwordConfirmationInput, errText2, "Password confirmation must match password")    
    } 
    if (canSubmit)  {
        window.com.register("register",username, email, password, password_confirmation);
    }
    // console.log('send data');
})


usernameInput.addEventListener("focusout", (e) => {
    const errText = document.getElementById("errUsername")
    if (e.target.value == "") {
        console.log("can't be blank");
        addError(e.target, errText, "Can't be blank")
    } else {
        removeErr(e.target, errText)
    }
})

passwordInput.addEventListener("focusout", (e) => {
    const errText = document.getElementById("errPassword")
    if (e.target.value == "") {
        console.log("can't be blank");
        addError(e.target, errText, "Can't be blank")
    } else {
        removeErr(e.target, errText)
    }
})

const addError = (input, errText,error) => {
    //input.classList.add("error")
    errText.classList.remove("hidden")
    errText.innerText = error
}

const removeErr = (input, errText) => {
    input.classList.remove('error')
    errText.classList.add('hidden')
}