import { useState } from "react"

const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const[password, setPassword] = useState('')

    const register = async (event) => {
        event.preventDefault()
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        if(response.status === 200){
            alert('registration successful!')
        }else{
            alert('registration failed!')
        }
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={event=> setUsername(event.target.value)}
            />
            <input 
                type="text" 
                placeholder="Password"
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            <button>Register</button>
        </form>
    )
}

export default RegisterPage
