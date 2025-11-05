import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getClubs } from '../services/dataService';

const AuthForm: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const { login, signup } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const user = login(email, password);
                if (!user) {
                    setError('Invalid email or password.');
                }
            } else {
                signup(name, email, password);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">College Event Manager</h2>
                <div className="flex border-b mb-6">
                    <button
                        className={`flex-1 py-2 text-center font-semibold ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-semibold ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Create Account
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="username@college.edu"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold">Demo Accounts:</p>
                    <div className="mt-2 text-left max-h-40 overflow-y-auto">
                        <p className="font-semibold">Clubs (email / password):</p>
                        <ul className="list-none pl-0 text-xs mt-2">
                            {getClubs().map(club => {
                                const slug = club.toLowerCase().replace(/[^a-z0-9]/g, '');
                                return (
                                    <li key={club} className="mb-1">
                                        <span className="font-mono">{`${slug}@college.edu`}</span> &nbsp;/&nbsp; <span className="font-mono">clubpassword</span> &nbsp; <span className="text-gray-500">({club})</span>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className="mt-2 font-semibold">Student:</p>
                        <p className="text-xs"><span className="font-mono">student1@college.edu</span> / <span className="font-mono">studentpass</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
