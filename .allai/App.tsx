import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EventGrid from './components/EventGrid';
import MyRegistrations from './components/MyRegistrations';
import EventModal from './components/modals/EventModal';
import { getEvents, resetDemoData as resetData, getClubs } from './services/dataService';
import { FilterState, Event } from './types';

const AppContent: React.FC = () => {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        categories: ['educational', 'cultural'],
        club: '',
    });

    const refreshEvents = useCallback(() => {
        setEvents(getEvents());
    }, []);

    useEffect(() => {
        if (currentUser) {
            refreshEvents();
        }
    }, [currentUser, refreshEvents]);
    
    const handleAddEvent = () => {
        setEditingEvent(null);
        setIsEventModalOpen(true);
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        setIsEventModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEventModalOpen(false);
        setEditingEvent(null);
    };

    const handleEventSaved = () => {
        handleCloseModal();
        refreshEvents();
    };

    const resetDemoData = () => {
        resetData();
        refreshEvents();
        alert('Demo data has been reset!');
    };

    if (!currentUser) {
        return <AuthForm />;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <Sidebar filters={filters} setFilters={setFilters} allClubs={getClubs()} />
                    <main className="flex-1">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-700">All Events</h2>
                            <div>
                                {currentUser.role === 'club' && (
                                    <button
                                        onClick={handleAddEvent}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mr-2"
                                    >
                                        + Add Event
                                    </button>
                                )}
                                <button onClick={resetDemoData} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300">
                                    Reset Demo Data
                                </button>
                            </div>
                        </div>

                        {currentUser.role === 'student' && <MyRegistrations refreshEvents={refreshEvents} />}
                        
                        <EventGrid
                            title="Educational Events"
                            category="educational"
                            events={events}
                            filters={filters}
                            onEdit={handleEditEvent}
                            onRefresh={refreshEvents}
                        />
                        <EventGrid
                            title="Cultural Events"
                            category="cultural"
                            events={events}
                            filters={filters}
                            onEdit={handleEditEvent}
                            onRefresh={refreshEvents}
                        />
                    </main>
                </div>
            </div>
            {isEventModalOpen && (
                <EventModal
                    isOpen={isEventModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleEventSaved}
                    event={editingEvent}
                />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;