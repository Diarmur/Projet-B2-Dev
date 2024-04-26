const code = document.getElementById("code")
const username = document.getElementById("username")
const leave = document.getElementById("leave")
const start = document.getElementById("start")
const usersDiv = document.getElementById("users")


window.com.sendToMain('lobby-ready', {})


com.getFromMain('init-lobby', (data) => {
    username.innerText = data.username
    code.innerText = data.code
})

leave.addEventListener("click", (e) => {
    console.log('clicked');
    com.sendToMain('lobby-leave', {})
})

start.addEventListener("click", (e) => {
    com.sendToMain('lobby-start', {})
})

com.getFromMain('ready', (data) => {
    console.log("stargin");
})

com.getFromMain('new-player', (data) => {
    while(usersDiv.firstChild){
        usersDiv.removeChild(usersDiv.firstChild);
    }
    data.forEach(username => {
        createUser(username)
    });
})

window.addEventListener("load", () => {
    com.sendToMain('refresh-list-players', (data) => {
        data.usernames.forEach(username => {
            createUser(username)
        });
    })
})

const createUser = (username) => {
    let div = document.createElement("div")
    let name = document.createElement("span")
    name.innerHTML = username
    div.appendChild(name)
    usersDiv.appendChild(div)
}