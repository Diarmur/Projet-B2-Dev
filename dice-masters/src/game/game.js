

window.com.sendToMain('game-ready', {})

com.getFromMain('setup-game', (data) => {
    console.log(data);
    SetupPlayer(data.sheet)
    SetupMonsters(data.monsters)
})

const SetupMonsters = (monsters) => {
    for (let i=0;i<monsters.length;i++) {
        CreateMonster(monsters[i])
    }
}

const SetupPlayer = (sheet) => {

}

const CreateMonster = (monster) => {
    const name = document.createElement("span")

    name.innerText = monster.name

    document.getElementById("monsters").appendChild(name)
}