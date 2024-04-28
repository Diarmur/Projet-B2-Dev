
const signUp = () => {

}

const logIn = async (username, password) => {
try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", {
        username: username,
        password: password
    });
    console.log(response.data);
    } catch (error) {
    console.log(`Error: ${error.response.status}`);
    }
}

const register = async (username, email, password, password_confirmation) => {   
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/register", {
            username: username,
            email: email,
            password: password,
            password_confirmation: password_confirmation
        });
            console.log(response.data);
        } catch (error) {
            console.log(`Error: ${error.response.status}`);
        }
    
}

const post = () => {

}

module.exports = {signUp, logIn}