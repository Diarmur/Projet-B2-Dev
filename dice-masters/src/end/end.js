com.sendToMain("end-ready", {status:document.getElementById("status").innerText})

const back = document.getElementById("back")

back.addEventListener("click", (e) => {
    com.sendToMain("redirect", "lobby")
})

com.getFromMain("get-stats", data => {
    console.log(data);
    document.getElementById("title").innerText = data.title
    document.getElementById("nbHit").innerText = `you made ${data.hitNumber} hit`
    document.getElementById("maxDmgD").innerText = `you inflicted ${data.maxDamagesDeal} damages`
    document.getElementById("maxDmgT").innerText = `you received ${data.maxDamagesTake} damages`
    document.getElementById("xp").innerText = `you won ${data.xp} experience points`
})