const apiLink = "https://www.dnd5eapi.co/api/"

const getApi = async (data,dataType) => {
    let monsterInfo
    return await fetch(apiLink+data).then(res => {
        if (!res.ok){
            if (dataType === 'monster') {
                lobby.error();
                return
            }
        }
        return res.json()
    }).then(data => {
        monsterInfo = data
        return data
    })
}


module.exports = {getApi}