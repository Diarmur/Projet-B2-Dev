
const create = document.getElementById("create")
const connect = document.getElementById("connect")
const send = document.getElementById("send")

create.addEventListener("click", (e) => {
    window.com.startServer()
})

connect.addEventListener("click", (e) => {
    port = document.getElementById("join").value
    console.log(document.getElementById("join").value);
    window.com.connect(port)
})

// send.addEventListener("click", (e) => {
//     text = document.getElementById("text").value
//     window.Renderer.send(text)
// })


