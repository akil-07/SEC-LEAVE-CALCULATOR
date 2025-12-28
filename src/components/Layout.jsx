import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Settings, LogOut } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-layout">
            {/* Navigation */}
            <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center font-bold text-white text-xl">
                        {user?.username?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-pink-400 hidden sm:block">
                        Attendance<span className="text-slate-200">Guard</span>
                    </h1>
                </div>

                <div className="flex items-center bg-slate-800/50 rounded-full p-1 border border-slate-700">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/calendar"
                        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Calendar size={18} />
                        <span className="hidden sm:inline">Daily</span>
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Settings size={18} />
                        <span className="hidden sm:inline">Settings</span>
                    </NavLink>
                </div>

                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut size={20} />
                </button>
            </nav>

            {/* Main Content */}
            <main className="flex-1 container py-8 animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
}
