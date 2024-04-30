
const back = document.getElementById("return")
const text = document.getElementById("text")

window.com.sendToMain('game-ready', {})

let action

back.addEventListener("click", (e) => {
    console.log("go back");
    com.sendToMain("redirect", "lobby")
})

com.getFromMain('setup-game', (data) => {
    console.log(data);
    SetupPlayer(data.sheet)
    SetupMonsters(data.monsters)
})

com.getFromMain('attack', (data) => {
    console.log(data);
    const div = document.createElement("div")
    const info = document.createElement("span")
    div.classList.add("message")
    div.classList.add("me")
    info.innerText = data.msg
    div.appendChild(info)
    text.appendChild(div)
})

com.getFromMain('kill', (data) => {
    console.log(data);
    const div = document.createElement("div")
    const info = document.createElement("span")
    div.classList.add("message")
    info.innerText = data.msg
    div.appendChild(info)
    text.appendChild(div)
    monster = document.getElementById(data.target)
    monster.remove()
})

com.getFromMain('get-attacked', (data) => {
    console.log(data);
    document.getElementById("hp").innerText = data.hp
    const div = document.createElement("div")
    const info = document.createElement("span")
    div.classList.add("message")
    div.classList.add("them")
    info.innerText = data.msg
    div.appendChild(info)
    text.appendChild(div)
})

const SetupMonsters = (monsters) => {
    for (let i=0;i<monsters.length;i++) {
        CreateMonster(monsters[i], i)
    }
}

const SetupPlayer = (sheet) => {
    const stat = document.createElement("div")
    const spells = document.createElement("div")
    const spellLabel = document.createElement("label")
    const name = document.createElement("span")
    const hp = document.createElement("span")
    const attack = document.createElement("button")

    spells.classList.add("spells")
    stat.classList.add("stats")
    hp.setAttribute("id", "hp")
    spellLabel.innerText = "Spells"
    name.innerText = sheet.character_name
    hp.innerText = sheet.hit_points
    attack.innerText = "Attack"

    if (sheet.spell_book != 'none') {
        for (let i=0; i<sheet.spell_book.length;i++) {
            spells.appendChild(CreateSpell(sheet.spell_book[i], i))
        }
    }
    const container = document.getElementById("player")
    stat.appendChild(name)
    stat.appendChild(hp)
    stat.appendChild(attack)
    container.appendChild(stat)
    container.appendChild(spellLabel)
    container.appendChild(spells)

    attack.addEventListener("click", (e) => {
        action = "attack"
    })
}

const CreateMonster = (monster, index) => {
    const div = document.createElement("div")
    const name = document.createElement("span")
    const id = document.createElement("span")

    div.setAttribute("id", monster.name+monster.id)
    id.style.display = "none"
    id.innerText = index
    name.innerText = monster.name
    div.appendChild(name)
    div.appendChild(id)


    document.getElementById("monsters").appendChild(div)

    div.addEventListener("click", (e) => {
        console.log("select :",monster.index, "action : ", action);
        if (action != undefined) com.sendToMain("attack", {action:action, target:monster.id});
    })
}

const CreateSpell = (spell, index) => {
    const div = document.createElement("div");
    const name = document.createElement("span");
    const button = document.createElement("button");
    const dices = document.createElement("span");
    const type = document.createElement("span");
    const id = document.createElement("span");

    id.style.display = "none"
    div.classList.add("spell")


    name.innerText = spell.name
    button.innerText = "Select"
    dices.innerText = spell.damage.dice_hit
    type.innerText = spell.damage.damage_type
    id.innerText = index 

    div.appendChild(name)
    div.appendChild(dices)
    div.appendChild(type)
    div.appendChild(button)
    div.appendChild(id)

    button.addEventListener("click", (e) => {
        action = id.innerText
        // console.log(id);
    })
    return div
}