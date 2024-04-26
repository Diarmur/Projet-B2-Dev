

form = document.getElementById('form')
usernameInput = document.getElementById('username')
passwordInput = document.getElementById('password')

usernameInput.addEventListener("focusout", (e) => {
    const errText = document.getElementById("errUsername")
    if (e.target.value == "") {
        console.log("can't be blank");
        addError(e.target, errText)
    } else {
        removeErr(e.target, errText)
    }
})

passwordInput.addEventListener("focusout", (e) => {
    const errText = document.getElementById("errPassword")
    if (e.target.value == "") {
        console.log("can't be blank");
        addError(e.target, errText)
    } else {
        removeErr(e.target, errText)
    }
})


document.getElementById('form').addEventListener("submit", (e) => {
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value
    if (username == "" || password == "") {
        console.log("wrong");
    } else {
        window.com.redirect('home')
        window.com.login("log-in",username, password)
    }
    // console.log('send data');
})

const addError = (input, errText) => {
    input.classList.add("error")
    errText.classList.remove("hidden")
    errText.innerText = "Can't be blank"
}

const removeErr = (input, errText) => {
    input.classList.remove('error')
    errText.classList.add('hidden')
}
