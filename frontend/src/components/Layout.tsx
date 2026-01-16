import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, LayoutDashboard, BrainCircuit, MessageSquare } from 'lucide-react';

const Layout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/study', label: 'In-Depth Study', icon: MessageSquare },
        { path: '/quiz', label: 'Practice Quiz', icon: BrainCircuit },
    ];

    return (
        <div className="min-h-screen gradient-bg flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-18 py-3">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="flex-shrink-0 flex items-center group transition-transform duration-300 hover:scale-105">
                                <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                                    Study<span className="text-indigo-600">AI</span>
                                </span>
                            </Link>

                            <div className="hidden md:flex items-center space-x-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${isActive
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="premium-button flex items-center px-4 py-2 border-2 border-slate-200 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
