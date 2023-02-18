import { useContext } from "react";
import { useState } from "react"
import { Navigate } from "react-router";
import { UserContext } from "../components/UserContext";

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const { setUserInfo } = useContext(UserContext)

    const login = async (event) => {
        event.preventDefault()
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username, 
                password
            })
        })

        if(response.status === 200){
            response.json().then(userInfo => {
                alert('Login success!')
                setUserInfo(userInfo)
                setRedirect(true)
            })
        }else{
            alert('Wrong credentials!')
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={event => setUsername(event.target.value)}
            />
            <input 
                type="text" 
                placeholder="Password"
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            <button>Login</button>
        </form>
    )
}

export default LoginPage
