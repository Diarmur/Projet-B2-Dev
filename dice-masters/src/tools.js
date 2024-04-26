
const pickPort = (minPort, maxPort) => {
    const random = Math.random()
    const diff = maxPort - minPort
    const randNum = Math.round(diff * random)
    const value = randNum + minPort
    return value
}

module.exports = {pickPort}



// charSheetExemples = {
//     "characters": [
//       {
//         "character_name": "Aldric",
//         "user_id": "123456",
//         "race": "Human",
//         "class": "Fighter",
//         "level": 5,
//         "background": "Noble",
//         "alignment": "Lawful Good",
//         "experience": 12000,
//         "strength": 16,
//         "dexterity": 12,
//         "constitution": 14,
//         "intelligence": 10,
//         "wisdom": 10,
//         "charisma": 13,
//         "hit_points": 45,
//         "armor_class": 18,
//         "speed": 30,
//         "spell_book": []
//       },
//       {
//         "character_name": "Lyra",
//         "user_id": "789012",
//         "race": "Elf",
//         "class": "Wizard",
//         "level": 3,
//         "background": "Sage",
//         "alignment": "Neutral Good",
//         "experience": 6000,
//         "strength": 8,
//         "dexterity": 14,
//         "constitution": 12,
//         "intelligence": 18,
//         "wisdom": 12,
//         "charisma": 10,
//         "hit_points": 22,
//         "armor_class": 13,
//         "speed": 30,
//         "spell_book": ["Fireball", "Mage Armor", "Magic Missile"]
//       }
//     ]
//   }