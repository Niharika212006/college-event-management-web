import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-800">College Event Manager</h1>
                    </div>
                    <div className="flex items-center">
                        {currentUser && (
                            <>
                                <div className="text-right mr-4">
                                    <p className="font-semibold text-gray-700">{currentUser.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">{currentUser.role} {currentUser.clubName && `(${currentUser.clubName})`}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
