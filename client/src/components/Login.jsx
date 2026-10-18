import React, { useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../services/authService'
import { useForm } from 'react-hook-form'

function Login() {
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const login = async(data) => {
        setError("")
        setLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
              dispatch(authLogin({userData: session}));
              navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='flex items-center justify-center w-full min-h-[calc(100vh-160px)] px-4 py-12'>
      <div className='w-full max-w-md bg-gradient-to-b from-gray-900/90 to-gray-950/90 rounded-2xl p-8 border border-gray-800 shadow-2xl backdrop-blur-sm'>
        <div className='mb-4 flex flex-col items-center justify-center'>
          <div className='p-2 rounded-2xl bg-red-600/10 border border-red-500/20 mb-2'>
            <Logo width='42px'/>
          </div>
          <h2 className='text-2xl font-extrabold text-white tracking-tight'>
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Sign in to your CineBlog account
          </p>
        </div>

        {error && (
          <div className='mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(login)} className='space-y-4'>
            <Input
              label='Email'
              type='email'
              placeholder='yourname@example.com'
              {...register('email', {
                  required: true,
                  validate: {
                      matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Invalid email address'
                  }
              })}
            />
            <Input
              label='Password'
              type='password'
              placeholder='••••••••'
              {...register('password', { required: true })}
            />

            <Button type='submit' disabled={loading} className='w-full mt-2'>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
