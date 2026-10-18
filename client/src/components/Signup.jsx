import React, { useState } from 'react'
import authService from '../services/authService'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from './index'
import { login } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const create = async(data) => {
        setError("")
        setLoading(true)
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                dispatch(login({userData}))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-160px)] px-4 py-12">
        <div className="w-full max-w-md bg-gradient-to-b from-gray-900/90 to-gray-950/90 rounded-2xl p-8 border border-gray-800 shadow-2xl backdrop-blur-sm">
            <div className="mb-4 flex flex-col items-center justify-center">
                <div className='p-2 rounded-2xl bg-red-600/10 border border-red-500/20 mb-2'>
                    <Logo width="42px" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Create Account
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                    Join the CineBlog community today
                </p>
            </div>

            {error && (
              <div className='mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(create)} className='space-y-4'>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  {...register("name", {
                      required: true,
                  })}
                />
                <Input
                  label="Email"
                  placeholder="yourname@example.com"
                  type="email"
                  {...register("email", {
                      required: true,
                      validate: {
                          matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                          "Email address must be a valid address",
                      }
                  })}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                      required: true
                  })}
                />

                <Button type="submit" disabled={loading} className="w-full mt-2">
                    {loading ? 'Creating account...' : 'Create Account'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-red-400 hover:text-red-300 transition-colors"
                >
                    Sign in here
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Signup