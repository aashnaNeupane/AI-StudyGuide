import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { client } from '../api/client';
import { Mail, Lock, LogIn, Sparkles, BookOpen } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            params.append('username', email);
            params.append('password', password);

            const response = await client.post('/login/access-token', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            login(response.data.access_token);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-slate-950">
            {/* Left Side: Hero Image (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="/auth-hero.png"
                    alt="AI Study Assistant"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950"></div>

                <div className="relative z-10 flex flex-col justify-center px-20">
                    <div className="inline-flex items-center space-x-3 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-bold uppercase tracking-widest backdrop-blur-md mb-6 w-fit animate-in fade-in slide-in-from-left-4 duration-1000">
                        <Sparkles className="h-4 w-4" />
                        <span>Empower Your Learning</span>
                    </div>
                    <h1 className="text-6xl font-black text-white leading-tight mb-6 animate-in fade-in slide-in-from-left-8 duration-1000">
                        AI-Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Study Guide</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-md leading-relaxed animate-in fade-in slide-in-from-left-12 duration-1000">
                        Master any topic with intelligent document insights and automated practice sessions tailored just for you.
                    </p>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>

                <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="glass-card bg-white/5 border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
                        <div className="text-center mb-10">
                            <div className="lg:hidden inline-flex p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl shadow-xl shadow-indigo-500/20 mb-6 transition-transform duration-300">
                                <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                            <p className="mt-3 text-slate-400 font-medium">
                                Don't have an account? {' '}
                                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-bold">
                                    Create one
                                </Link>
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="block w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center animate-in shake duration-500">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="premium-button w-full flex justify-center items-center py-4 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <LogIn className="h-5 w-5" />
                                        <span>Sign In</span>
                                    </div>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <div className="inline-flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                <Sparkles className="h-3 w-3" />
                                <span>AI-Powered Learning</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
