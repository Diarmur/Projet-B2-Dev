
const pickPort = (minPort, maxPort) => {
    const random = Math.random()
    const diff = maxPort - minPort
    const randNum = Math.round(diff * random)
    const value = randNum + minPort
    return value
}

module.exports = {pickPort}