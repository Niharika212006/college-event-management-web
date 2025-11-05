import React, { useState, useEffect } from 'react';
import { Event } from '../../types';
import { getEvents, setEvents } from '../../services/dataService';
import { useAuth } from '../../contexts/AuthContext';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    event: Event | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event }) => {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<'educational' | 'cultural'>('educational');
    const [dateTime, setDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [seats, setSeats] = useState(50);
    const [fee, setFee] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setCategory(event.category);
            setDescription(event.description);
            setSeats(event.seats);
            setFee(event.fee);
            // Format date for datetime-local input
            const eventDate = new Date(event.date);
            // Adjust for timezone offset
            const timezoneOffset = eventDate.getTimezoneOffset() * 60000;
            const localISOTime = new Date(eventDate.getTime() - timezoneOffset).toISOString().slice(0, 16);
            setDateTime(localISOTime);
        } else {
            setTitle('');
            setCategory('educational');
            setDescription('');
            setSeats(50);
            setFee(0);
            setDateTime('');
        }
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (currentUser?.role !== 'club' || !currentUser.clubName) {
            setError('You do not have permission to create or edit events.');
            return;
        }

        const events = getEvents();

        if (event) { // Editing
             if (event.organizer !== currentUser.clubName) {
                setError('You can only edit events for your own club.');
                return;
            }
            const eventIndex = events.findIndex(e => e.id === event.id);
            if (eventIndex !== -1) {
                const oldSeats = events[eventIndex].seats;
                const seatsDiff = seats - oldSeats;
                
                events[eventIndex] = {
                    ...events[eventIndex],
                    title,
                    category,
                    date: new Date(dateTime).toISOString(),
                    description,
                    seats,
                    availableSeats: Math.max(0, events[eventIndex].availableSeats + seatsDiff),
                    fee,
                };
            }
        } else { // Creating
            const newEvent: Event = {
                id: `evt_${Date.now()}`,
                title,
                category,
                organizer: currentUser.clubName,
                date: new Date(dateTime).toISOString(),
                description,
                seats,
                availableSeats: seats,
                fee,
                completed: false,
            };
            events.push(newEvent);
        }

        setEvents(events);
        onSave();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{event ? 'Edit Event' : 'Add Event'}</h2>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Event Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded-md" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                           <label className="block text-gray-700 font-medium mb-2">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value as any)} required className="w-full p-2 border rounded-md">
                                <option value="educational">Educational</option>
                                <option value="cultural">Cultural</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-gray-700 font-medium mb-2">Organizer (Club)</label>
                            <input type="text" value={currentUser?.clubName || ''} readOnly disabled className="w-full p-2 border rounded-md bg-gray-100" />
                        </div>
                    </div>

                     <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Date & Time</label>
                        <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required className="w-full p-2 border rounded-md" />
                    </div>

                     <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded-md h-24"></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Total Seats</label>
                            <input type="number" min="1" value={seats} onChange={e => setSeats(parseInt(e.target.value))} required className="w-full p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-gray-700 font-medium mb-2">Registration Fee (₹)</label>
                            <input type="number" min="0" value={fee} onChange={e => setFee(parseFloat(e.target.value))} required className="w-full p-2 border rounded-md" />
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{event ? 'Save Changes' : 'Create Event'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
