const apiLink = "https://www.dnd5eapi.co/api/"

const getApi = async (data) => {
    let monsterInfo
    return await fetch(apiLink+data).then(res => {
        if (!res.ok) throw new Error('Response not ok')
        return res.json()
    }).then(data => {
        monsterInfo = data
        return data
    })
}


module.exports = {getApi}