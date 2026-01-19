import React, { useContext, useState } from 'react'
import AuthContext from '../../context/AuthContext'

const LoginPage = () => {
    const [currState, setCurrState] = useState("Sign up")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currState === 'Sign up' && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }

        login(currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio })

    }

    return (
        <div className='min-h-screen bg-slate-900 flex items-center justify-center p-4'>
            <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-2">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h2 className='text-3xl font-bold text-white tracking-tight'>
                        {currState === "Sign up" ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {currState === "Sign up" ? "Join our community today" : "Sign in to continue chatting"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    {currState === "Sign up" && !isDataSubmitted && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                            <input
                                onChange={(e) => setFullName(e.target.value)}
                                value={fullName}
                                type="text"
                                className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600'
                                placeholder='John Doe'
                                required
                            />
                        </div>
                    )}

                    {!isDataSubmitted && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="email"
                                    placeholder='john@example.com'
                                    required
                                    className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600'
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    type="password"
                                    placeholder='••••••••'
                                    required
                                    className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600'
                                />
                            </div>
                        </>
                    )}

                    {currState === 'Sign up' && isDataSubmitted && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                                <button type="button" onClick={() => setIsDataSubmitted(false)} className="text-xs text-indigo-400 hover:text-indigo-300">
                                    Edit Details
                                </button>
                            </div>
                            <textarea
                                rows={4}
                                onChange={(e) => setBio(e.target.value)}
                                value={bio}
                                className='w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 resize-none'
                                placeholder='Tell us a bit about yourself...'
                            ></textarea>
                            <button
                                type="button"
                                onClick={() => setIsDataSubmitted(false)}
                                className="w-full mt-2 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                ← Back to details
                            </button>
                        </div>
                    )}

                    <div className="pt-4">
                        <button type='submit' className='w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.98]'>
                            {currState === "Sign up"
                                ? (isDataSubmitted ? "Complete Signup" : "Continue")
                                : "Sign In"
                            }
                        </button>
                    </div>

                    {currState === "Sign up" ? (
                        <p className='text-center text-sm text-slate-400 mt-4'>
                            Already have an account?{' '}
                            <span
                                onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}
                                className='font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors'
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p className='text-center text-sm text-slate-400 mt-4'>
                            Don't have an account?{' '}
                            <span
                                onClick={() => { setCurrState("Sign up"); }}
                                className='font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors'
                            >
                                Create one
                            </span>
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default LoginPage