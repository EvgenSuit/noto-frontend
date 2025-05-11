import React, { useEffect, useState } from 'react'
import './Auth.css'

import emailIcon from '../../assets/email.png'
import userIcon from '../../assets/person.png'
import passwordIcon from '../../assets/password.png'
import { Credentials, signIn, signUp } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../api/auth_context'
import { toast, ToastContainer } from 'react-toastify'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export const Auth = () => {
    const navigate = useNavigate()
    const { tokens, setTokens } = useAuth() 
    useEffect(() => {
        if (tokens.accessToken) {
            navigate('/dashboard')
        }
    }, [tokens.accessToken, navigate])

    const [action, setAction] = useState("Sign Up");
    const [credentials, setCredentials] = useState<Credentials>({
        name: '',
        email: '',
        password: ''
    })
    const [inputError, setInputError] = useState<Credentials>({
        name: '',
        email: '',
        password: ''
    })
    const isFormValid = (action === 'Sign Up' ? credentials.name.trim().length !== 0 : true)
     && credentials.email.trim().length !== 0 && credentials.password.trim().length !== 0

    function onCredentialsChange(e) {
        const {name, value} = e.target
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    function displayError(e) {
        const errorData = e?.response?.data
        const isValidationErrorArray = Array.isArray(errorData) &&
            errorData.every(item =>
                typeof item === 'object' &&
                typeof item.field === 'string' &&
                typeof item.message === 'string'
            )
        if (isValidationErrorArray) {
            const newErrors: Credentials = {
                name: '',
                email: '',
                password: ''
            };

            errorData.forEach(({ field, message }) => {
                if (field in newErrors) {
                    newErrors[field as keyof Credentials] = message;
                }
            });
            
    
            setInputError(newErrors);
        } else {
            toast.error(errorData ? errorData : 'Authentication could not be completed')
            setInputError({
                name: '',
                email: '',
                password: ''
            })
        }
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
            displayError(e)
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
            displayError(e)
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
                    inputError={inputError.name}
                    placeholder="Name"
                    name="name"
                    value={credentials.name}
                    onChange={onCredentialsChange}/> 
                }
            <Input
                src={emailIcon}
                type="email"
                inputError={inputError.email}
                placeholder="Email"
                name="email"
                value={credentials.email}
                onChange={onCredentialsChange}
            />
            <Input
                src={passwordIcon}
                type="password"
                inputError={inputError.password}
                placeholder="Password"
                name="password"
                value={credentials.password}
                onChange={onCredentialsChange}
            />
        </div>
        <div className="submit-container"
        >
            {
            action === 'Sign In' ? 
                (<div className={`submit submit${!isFormValid ? '-disabled' : ''}`}
                onClick={() => isFormValid ? handleSignIn() : {}}>Sign In</div>) : 
                (<div className={`submit submit${!isFormValid ? '-disabled' : ''}`}
                onClick={() => isFormValid ? handleSignUp() : {}}>Sign Up</div>)    
        }
        </div>
        <div className='go-to-prompt'
        onClick={() => {
            setCredentials({
                name: '',
                email: '',
                password: ''
            })
            setInputError({
                name: '',
                email: '',
                password: ''
            })
            setAction(prev => prev === 'Sign In' ? 'Sign Up' : 'Sign In')
        }}>
            Go to {action === 'Sign In' ? 'Sign Up' : 'Sign In'}
        </div>
        <ToastContainer position='bottom-center' autoClose={3300} hideProgressBar={true}
        pauseOnHover={false} />
    </div>
  )
}

function Input({src, type, inputError, placeholder, name, value, onChange}) {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev)
    }
    return (
        <div className='input-container'>
            <div className="input">
                <img src={src} alt="" />
                <input 
                type={isPassword && showPassword ? 'text' : type}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                />
            {isPassword && (
                <button onClick={togglePasswordVisibility}
                className='toggle-password'>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                </button>
            ) }
            </div>
        {inputError !== '' && (<div className='input-error'>{inputError}</div>)}
        </div>
    )
}