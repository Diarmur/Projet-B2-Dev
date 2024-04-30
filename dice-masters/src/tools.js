const api = require('./dnd_api')
const axios = require('axios')
const {session} = require('electron')

const URL_API = "http://192.168.1.19:8000"

const pickPort = (minPort, maxPort) => {
    const random = Math.random()
    const diff = maxPort - minPort
    const randNum = Math.round(diff * random)
    const value = randNum + minPort
    return value
}

const formatMonsterData = (monsterData) => {
    formatData = {}
    formatData["id"] = monsterData.id
    formatData["index"] = monsterData.index
    formatData["name"] = monsterData.name
    formatData["armor_class"] = monsterData.armor_class[0].value
    formatData["hit_points"] = monsterData.hit_points
    formatData["hit_points_roll"] = monsterData.hit_points_roll
    formatData["strength"] = monsterData.strength
    formatData["dexterity"] = monsterData.dexterity
    formatData["constitution"] = monsterData.constitution
    formatData["intelligence"] = monsterData.intelligence
    formatData["wisdom"] = monsterData.wisdom
    formatData["charisma"] = monsterData.charisma
    formatData["vulnerabilities"] = monsterData.damage_vulnerabilities
    formatData["resistances"] = monsterData.damage_resistances
    formatData["immunities"] = monsterData.damage_immunities
    formatData["challenge_rating"] = monsterData.challenge_rating
    formatData["xp"] = monsterData.xp
    monsterData.special_abilities.forEach(ability => {
        if (ability.name == "Spellcasting") {
            formatData["spellcasting"] = ability.spellcasting
        }
    });
    formatData["actions"] = monsterData.actions
    formatData["image"] = monsterData.image
    return formatData
}

const formatSpell = (spell) => {
    newSpell = {}
    newSpell['index'] = spell.index
    newSpell['name'] = spell.name
    newSpell['ritual'] = spell.ritual
    newSpell['concentration'] = spell.concentration
    newSpell['casting_time'] = spell.casting_time
    newSpell['damage'] = {damage_type:spell.damage.damage_type.index, dice_hit:Object.values(spell.damage.damage_at_slot_level)[0]}
    return newSpell
}

const formatCharacterSheet = async (sheet) => {
    weapon = sheet.weapon.split(":")
    sheet.weapon = {damage_type:weapon[0], dice_hit:weapon[1]}
    if (sheet.spell_book != "none") val= await generateSpellBook(sheet.spell_book, sheet)
    return sheet
}

const getMyId = async () => {

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const me = await axios.get(
        URL_API+'/api/me',
      {
        headers: {
          'Authorization': 'Bearer ' + token
        } 
      }
    );

    return me.data.id
}

const getCharacterSheet = async (id) => {
    const cookies = await session.defaultSession.cookies.get({});
    const token = cookies[0].value;
    const response = await axios.get( 
        URL_API+'/api/characterSheets/'+id,
        {
          headers: {
            'Authorization': 'Bearer ' + token
          } 
        }
      );
    return response.data
}

const generateSpellBook = async (spells, sheet) => {
    const spellsFormat = spells.split(',')
    const spell_book = []
    for (let i=0;i<spellsFormat.length;i++) {
        const spellData = await api.getApi("spells/"+spellsFormat[i])
        let formatedSpell = formatSpell(spellData)
        spell_book.push(formatedSpell)
    }
    sheet.spell_book = spell_book
    return sheet
}

const DealDamages = (monsters,character, data) => {
    const target = monsters[data.target]
    let dice, type
    if (data.action == "attack") {
        const dice_check = RollDice("1d20", 1)
        if (dice_check < target.armor_class) return dice_check*-1;
        const attack = character.weapon
        type = attack.damage_type
        dice = attack.dice_hit

    } else {
        const spell = character.spell_book[data.action]
        type = spell.damage.damage_type
        dice = spell.damage.dice_hit
    }

    let damages = 0;
    if (target.immunities.includes(type)) {damages = 0}
    else if (target.resistances.includes(type)) {damages = RollDice(dice, 0.5)}
    else if (target.vulnerabilities.includes(type)) {damages = RollDice(dice, 2)}
    else {damages = RollDice(dice, 1)}
    return damages
}

const GetDamages = (character, monster) => {
    let attackData
    for (let i = 0; i < monster.actions.length; i++) {
        const action = monster.actions[i];
        if ("damage" in action) {
            attackData = action.damage[0]
            break;
        }
    }
    // attackData = monster.actions[0].damage[0]
    const dice_check = RollDice(`1d20 + ${attackData.attack_bonus}`, 1)
    if (dice_check < character.armor_class) return dice_check*-1;
    const damages = RollDice(attackData.damage_dice, 1)
    return damages

}

const RollDice = (dice, coef) => {
    const data = dice.split(" + ") 
    dice = data[0]
    let add = 0
    if (data.length > 1) add = parseInt(data[1])
    const diceData = dice.split("d")
    nbDices = parseInt(diceData[0])
    nbFaces = parseInt(diceData[1])
    let damages = 0
    for (let i = 0; i < nbDices; i++) {
        damages += Math.floor(Math.random() * (nbFaces - 1) + 1);
    }
    damages = Math.floor((damages+add)*coef)
    return damages
}



module.exports = {pickPort, formatMonsterData, formatCharacterSheet, getMyId, getCharacterSheet, generateSpellBook, DealDamages, GetDamages}

// {
//     index: 'acid-arrow',
//     name: 'Acid Arrow',
//     ritual: false,
//     duration: 'Instantaneous',
//     concentration: false,
//     casting_time: '1 action',
//     level: 2,
//     attack_type: 'ranged',
//     damage: {
//       damage_type: { index: 'acid', name: 'Acid', url: '/api/damage-types/acid' },
//       damage_at_slot_level: {
//         '2': '4d4',
//         '3': '5d4',
//         '4': '6d4',
//         '5': '7d4',
//         '6': '8d4',
//         '7': '9d4',
//         '8': '10d4',
//         '9': '11d4'
//       }
//     },
//   }

// monsterExemple = {
// 	"index": "aboleth",
// 	"name": "Aboleth",
// 	"armor_class": [
// 		{
// 			"type": "natural",
// 			"value": 17
// 		}
// 	],
// 	"hit_points": 135,
// 	"hit_dice": "18d10",
// 	"hit_points_roll": "18d10+36",
// 	"strength": 21,
// 	"dexterity": 9,
// 	"constitution": 15,
// 	"intelligence": 18,
// 	"wisdom": 15,
// 	"charisma": 18,
// 	"proficiencies": [
// 		{
// 			"value": 6,
// 			"proficiency": {
// 				"index": "saving-throw-con",
// 				"name": "Saving Throw: CON",
// 				"url": "/api/proficiencies/saving-throw-con"
// 			}
// 		},
// 		{
// 			"value": 8,
// 			"proficiency": {
// 				"index": "saving-throw-int",
// 				"name": "Saving Throw: INT",
// 				"url": "/api/proficiencies/saving-throw-int"
// 			}
// 		},
// 		{
// 			"value": 6,
// 			"proficiency": {
// 				"index": "saving-throw-wis",
// 				"name": "Saving Throw: WIS",
// 				"url": "/api/proficiencies/saving-throw-wis"
// 			}
// 		},
// 		{
// 			"value": 12,
// 			"proficiency": {
// 				"index": "skill-history",
// 				"name": "Skill: History",
// 				"url": "/api/proficiencies/skill-history"
// 			}
// 		},
// 		{
// 			"value": 10,
// 			"proficiency": {
// 				"index": "skill-perception",
// 				"name": "Skill: Perception",
// 				"url": "/api/proficiencies/skill-perception"
// 			}
// 		}
// 	],
// 	"damage_vulnerabilities": [],
// 	"damage_resistances": [],
// 	"damage_immunities": [],
// 	"condition_immunities": [],
// 	"challenge_rating": 10,
// 	"proficiency_bonus": 4,
// 	"xp": 5900,
// 	"special_abilities": [
// 		{
// 			"name": "Amphibious",
// 			"desc": "The aboleth can breathe air and water."
// 		},
// 		{
// 			"name": "Mucous Cloud",
// 			"desc": "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.",
// 			"dc": {
// 				"dc_type": {
// 					"index": "con",
// 					"name": "CON",
// 					"url": "/api/ability-scores/con"
// 				},
// 				"dc_value": 14,
// 				"success_type": "none"
// 			}
// 		},
// 		{
// 			"name": "Probing Telepathy",
// 			"desc": "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature."
// 		}
// 	],
// 	"actions": [
// 		{
// 			"name": "Multiattack",
// 			"multiattack_type": "actions",
// 			"desc": "The aboleth makes three tentacle attacks.",
// 			"actions": [
// 				{
// 					"action_name": "Tentacle",
// 					"count": 3,
// 					"type": "melee"
// 				}
// 			]
// 		},
// 		{
// 			"name": "Tentacle",
// 			"desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased. The disease has no effect for 1 minute and can be removed by any magic that cures disease. After 1 minute, the diseased creature's skin becomes translucent and slimy, the creature can't regain hit points unless it is underwater, and the disease can be removed only by heal or another disease-curing spell of 6th level or higher. When the creature is outside a body of water, it takes 6 (1d12) acid damage every 10 minutes unless moisture is applied to the skin before 10 minutes have passed.",
// 			"attack_bonus": 9,
// 			"dc": {
// 				"dc_type": {
// 					"index": "con",
// 					"name": "CON",
// 					"url": "/api/ability-scores/con"
// 				},
// 				"dc_value": 14,
// 				"success_type": "none"
// 			},
// 			"damage": [
// 				{
// 					"damage_type": {
// 						"index": "bludgeoning",
// 						"name": "Bludgeoning",
// 						"url": "/api/damage-types/bludgeoning"
// 					},
// 					"damage_dice": "2d6+5"
// 				},
// 				{
// 					"damage_type": {
// 						"index": "acid",
// 						"name": "Acid",
// 						"url": "/api/damage-types/acid"
// 					},
// 					"damage_dice": "1d12"
// 				}
// 			],
// 			"actions": []
// 		},
// 		{
// 			"name": "Tail",
// 			"desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage.",
// 			"attack_bonus": 9,
// 			"damage": [
// 				{
// 					"damage_type": {
// 						"index": "bludgeoning",
// 						"name": "Bludgeoning",
// 						"url": "/api/damage-types/bludgeoning"
// 					},
// 					"damage_dice": "3d6+5"
// 				}
// 			],
// 			"actions": []
// 		},
// 		{
// 			"name": "Enslave",
// 			"desc": "The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance.\nWhenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.",
// 			"usage": {
// 				"type": "per day",
// 				"times": 3
// 			},
// 			"dc": {
// 				"dc_type": {
// 					"index": "wis",
// 					"name": "WIS",
// 					"url": "/api/ability-scores/wis"
// 				},
// 				"dc_value": 14,
// 				"success_type": "none"
// 			},
// 			"actions": []
// 		}
// 	],
// 	"legendary_actions": [
// 		{
// 			"name": "Detect",
// 			"desc": "The aboleth makes a Wisdom (Perception) check."
// 		},
// 		{
// 			"name": "Tail Swipe",
// 			"desc": "The aboleth makes one tail attack."
// 		},
// 		{
// 			"name": "Psychic Drain (Costs 2 Actions)",
// 			"desc": "One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes.",
// 			"attack_bonus": 0,
// 			"damage": [
// 				{
// 					"damage_type": {
// 						"index": "psychic",
// 						"name": "Psychic",
// 						"url": "/api/damage-types/psychic"
// 					},
// 					"damage_dice": "3d6"
// 				}
// 			]
// 		}
// 	],
// 	"image": "/api/images/monsters/aboleth.png",
// 	"url": "/api/monsters/aboleth"
// }



// charSheetExemples = {
//     "characters": [
//       {
//         "id": 1
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
//         "spell_book": "fireball,acid-arrow"
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