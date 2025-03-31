'use client'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import './styles.scss'

const LoginView = () => {
  const loginWith = (provider: string) => {
    signIn(provider, { redirectTo: '/admin' })
  }
  return (
    <div className="login">
      <div className="login__content">
        <button onClick={() => loginWith('github')} className="login__button">
          <FaGithub className="login__button-icon" />
          Sign up with Github
        </button>
        <button onClick={() => loginWith('google')} className="login__button">
          <FcGoogle className="login__button-icon" />
          Sign up with Google
        </button>
      </div>
    </div>
  )
}

export default LoginView
