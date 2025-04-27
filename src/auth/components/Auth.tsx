import React, { useState } from 'react'
import './Auth.css'

import emailIcon from '../../assets/email.png'
import userIcon from '../../assets/person.png'
import passwordIcon from '../../assets/password.png'
import { Credentials, signIn, signUp } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../api/auth_context'
import { ref } from 'process'

export const Auth = () => {
    const navigate = useNavigate()
    const { tokens, setTokens } = useAuth() 
    if (tokens.accessToken) {
        navigate('/dashboard')
    }

    const [action, setAction] = useState("Sign Up");
    const [credentials, setCredentials] = useState<Credentials>({
        name: '',
        email: '',
        password: ''
    })

    function onCredentialsChange(e) {
        const {name, value} = e.target
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSignIn = async () => {
        try {
            const { accessToken, refreshToken } = await signIn(credentials)
            setTokens({
                accessToken: accessToken,
                refreshToken: refreshToken
            })
            navigate('/dashboard')
        } catch(e) {
            console.error(e)
        }
    }
    const handleSignUp = async () => {
        try {
            const { accessToken, refreshToken } = await signUp(credentials)
            setTokens({
                accessToken: accessToken,
                refreshToken: refreshToken
            })
            navigate('/dashboard')
        } catch(e) {
            console.error(e)
        }
    }

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {action === 'Sign Up' && 
            <Input
                src={userIcon}
                type="text"
                placeholder="Name"
                name="name"
                value={credentials.name}
                onChange={onCredentialsChange}
            />}
            <Input
                src={emailIcon}
                type="email"
                placeholder="Email"
                name="email"
                value={credentials.email}
                onChange={onCredentialsChange}
            />
            <Input
                src={passwordIcon}
                type="password"
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={onCredentialsChange}
            />
        </div>
        <div className="submit-container">
            {
            action === 'Sign In' ? 
                (<div className='submit'
                onClick={() => handleSignIn()}>Sign In</div>) : 
                (<div className='submit'
                onClick={() => handleSignUp()}>Sign Up</div>)    
        }
        </div>
        <div className='go-to-prompt'
        onClick={() => action === 'Sign In' ? setAction('Sign Up') : setAction('Sign In')}>
            Go to {action === 'Sign In' ? 'Sign Up' : 'Sign In'}
        </div>
    </div>
  )
}

function Input({src, type, placeholder, name, value, onChange}) {
    return (
        <div className="input">
            <img src={src} alt="" />
            <input 
            type={type}
             placeholder={placeholder}
             name={name}
             value={value}
             onChange={onChange}
              />
        </div>
    )
}