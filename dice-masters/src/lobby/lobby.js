// const code = document.getElementById("code")
// const username = document.getElementById("username")
// const leave = document.getElementById("leave")
// const start = document.getElementById("start")
// const usersDiv = document.getElementById("users")


// Wait for multi to be working

// com.getFromMain('init-lobby', (data) => {
//     username.innerText = data.username
//     code.innerText = data.code
// })

// leave.addEventListener("click", (e) => {
//     console.log('clicked');
//     com.sendToMain('lobby-leave', {})
// })

// start.addEventListener("click", (e) => {
//     com.sendToMain('lobby-start', {})
// })

// com.getFromMain('ready', (data) => {
//     console.log("stargin");
// })

// com.getFromMain('new-player', (data) => {
//     while(usersDiv.firstChild){
//         usersDiv.removeChild(usersDiv.firstChild);
//     }
//     data.forEach(username => {
//         createUser(username)
//     });
// })

// window.addEventListener("load", () => {
//     com.sendToMain('refresh-list-players', (data) => {
//         data.usernames.forEach(username => {
//             createUser(username)
//         });
//     })
// })

// const createUser = (username) => {
//     let div = document.createElement("div")
//     let name = document.createElement("span")
//     name.innerHTML = username
//     div.appendChild(name)
//     usersDiv.appendChild(div)
// }


const charSheetDiv = document.getElementById("characterSheets")
const addEnemy = document.getElementById("enemyAdd")
const start = document.getElementById("start")

com.sendToMain('lobby-ready', {})

com.getFromMain('init-lobby', (data) => {
    console.log(data.characterSheets);
    data.characterSheets.characters.forEach(characterSheet => {
        createCharSheet(characterSheet)
    });
})

addEnemy.addEventListener("click", (e) => {
    const monsterName = document.getElementById("monsterName")
    console.log(monsterName.value);
    com.sendToMain('request-monster', {name:monsterName.value})
})

com.getFromMain('get-monster', (data) => {
    createMonster(data)
})


const createCharSheet = (charSheet) => {
    const div = document.createElement('div')
    div.classList.add('charSheet')
    const lvl = document.createElement('span')
    const name = document.createElement('span')
    const className = document.createElement('span')
    const id = document.createElement('span')

    div.className = "charSheet"

    lvl.setAttribute('id', 'lvl')
    name.setAttribute('id', 'name')
    className.setAttribute('id', 'className')
    id.style.display = 'none'

    lvl.innerText = charSheet.level
    name.innerText = charSheet.character_name
    className.innerText = charSheet.class
    id.innerText = charSheet.id

    div.appendChild(name)
    div.appendChild(className)
    div.appendChild(lvl)
    div.appendChild(id)

    charSheetDiv.appendChild(div)
}

const disconnect = () => {
    console.log("disconnecting");
    com.sendToMain('disconnect', {})
}

const createMonster = (monster) => {
    const div = document.createElement('div')
    const name = document.createElement('span')
    const dangerLvl = document.createElement('span')

    name.innerText = monster.name
    dangerLvl.innerText = monster.challenge_rating

    div.appendChild(name)
    div.appendChild(dangerLvl)

    document.getElementById("monsters").appendChild(div)
}

start.addEventListener('click', (e) => {
    console.log('start');
    com.sendToMain('start')
})
  