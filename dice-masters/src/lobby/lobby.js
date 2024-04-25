const code = document.getElementById("code")
const username = document.getElementById("username")
const leave = document.getElementById("leave")


window.com.sendToMain('lobby-ready', {})


com.getFromMain('init-lobby', (data) => {
    username.innerText = data.username
    code.innerText = data.code
})

leave.addEventListener("click", (e) => {
    console.log('clicked');
    com.sendToMain('lobby-leave', {})
})