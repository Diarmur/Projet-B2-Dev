const apiLink = "https://www.dnd5eapi.co/api/"

const getApi = async (data,dataType) => {
    let monsterInfo
    return await fetch(apiLink+data).then(res => {
        if (!res.ok){
            throw new Error("Monster not found")   
        }
        return res.json()
    }).then(data => {
        monsterInfo = data
        return data
    })
}


module.exports = {getApi}