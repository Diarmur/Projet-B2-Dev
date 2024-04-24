// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


form = document.getElementById('form')
usernameInput = document.getElementById('username')
passwordInput = document.getElementById('password')

usernameInput.addEventListener("focusout", (e) => {
    if (e.target.value == "") {
        console.log("can't be blank");
        addError(e.target)
    }
})

passwordInput.addEventListener("focusout", (e) => {

})


document.getElementById('form').addEventListener("submit", (e) => {
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value
    if (username == "" || password == "") {
        console.log("wrong");
    } else {
        window.connection.login(username, password)
    }
    // console.log('send data');
})

const addError = (input) => {
    input.classList.add("error")
}

