import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (isLogin) {
            if (login(formData.username, formData.password)) {
                navigate('/');
            } else {
                setError('Invalid credentials');
            }
        } else {
            if (signup(formData.username, formData.password)) {
                navigate('/settings'); // Send to settings on first signup
            } else {
                setError('Username already exists');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-md p-8 glass-card animate-fade-in mx-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
                        Attendance<span className="text-white">Guard</span>
                    </h1>
                    <p className="text-slate-400">
                        {isLogin ? 'Welcome back, student!' : 'Start your journey today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="label">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                className="input-base pl-10"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="password"
                                className="input-base pl-10"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="w-full btn btn-primary">
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 w-full"
                    >
                        {isLogin ? (
                            <>Don't have an account? <span className="text-violet-400 font-medium">Sign Up</span></>
                        ) : (
                            <>Already have an account? <span className="text-violet-400 font-medium">Log In</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
