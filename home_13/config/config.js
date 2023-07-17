const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const jwtKey = 'hikikoi'

module.exports = {
    PORT, jwtKey
}