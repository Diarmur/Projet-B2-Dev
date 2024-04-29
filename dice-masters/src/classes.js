
class Being {

    


}

class Monster {
    constructor(infos) {
        this.name = infos.name
        this.hp = infos.hp
        this.dice_hit = infos.hit_points_roll
        this.spell_book = infos.spellcasting
        this.resistances = infos.damage_resistances
        this.immunities = infos.damage_immunities
        this.vulnerabilities = infos.damage_vulnerabilities
    }

    CastSpell(spellId, target) {
        spell = this.spell_book[spellId]
        dice = spell.damage.dice_hit
        type = spell.damage.damage_type
        let damages
        if (target.immunities.includes(type)) damages = 0;
        else if (target.resistances.includes(type)) damages = RollDice(dice, ResistanceLevel.resistance);
        else if (target.vulnerability.includes(type)) damages = RollDice(dice, ResistanceLevel.vulnerable);
        return damages
    }

    TakeDamages(damages) {
        this.hp = this.hp-damages
        return this.hp>0
    }
}

class Character {
    constructor(infos) {
        this.id = infos.id
        this.name = infos.name
        this.dice_hit = infos.dice_hit
        this.spell_book = infos.spell_book
        this.weapon = infos.weapon
        this.resistances = []
        this.immunities = []
        this.vulnerabilities = []
    }

    CastSpell(spellId, target) {
        spell = this.spell_book[spellId]
        dice = spell.damage.dice_hit
        type = spell.damage.damage_type
        let damages
        if (target.immunities.includes(type)) damages = 0;
        else if (target.resistances.includes(type)) damages = RollDice(dice, ResistanceLevel.resistance);
        else if (target.vulnerability.includes(type)) damages = RollDice(dice, ResistanceLevel.vulnerable);
        return damages
    }

    TakeDamages(damages) {
        this.hp = this.hp-damages
        return this.hp>0
    }
}

const ResistanceLevel = {
    immune:0,
    resistance:0.5,
    vulnerable:2
}

module.exports = {Monster, Character}