import React, { useState, useEffect } from 'react';
import { Registration, Event } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getRegistrations, getEvents, setEvents, setRegistrations } from '../services/dataService';
import CertificateCanvas from './CertificateCanvas';

interface MyRegistrationsProps {
    refreshEvents: () => void;
}

const MyRegistrations: React.FC<MyRegistrationsProps> = ({ refreshEvents }) => {
    const { currentUser } = useAuth();
    const [myRegistrations, setMyRegistrations] = useState<(Registration & { event?: Event })[]>([]);
    const [generatingCert, setGeneratingCert] = useState<{ event: Event, user: any } | null>(null);

    useEffect(() => {
        if (!currentUser) return;
        const allRegs = getRegistrations();
        const allEvents = getEvents();
        const userRegs = allRegs
            .filter(reg => reg.userId === currentUser.id)
            .map(reg => ({
                ...reg,
                event: allEvents.find(e => e.id === reg.eventId)
            }))
            .filter(reg => reg.event); // Ensure event exists
        setMyRegistrations(userRegs);
    }, [currentUser, refreshEvents]);
    
    const markEventCompleted = (eventId: string) => {
        const events = getEvents();
        const event = events.find(e => e.id === eventId);
        if (event) {
            event.completed = true;
            setEvents(events);
            
            const registrations = getRegistrations();
            registrations.forEach(reg => {
                if(reg.eventId === eventId) {
                    reg.certificateGenerated = true;
                }
            });
            setRegistrations(registrations);
            refreshEvents();
            alert('Event marked as completed! Certificates are now available.');
        }
    };
    
    const handleDownloadCertificate = (event: Event) => {
        setGeneratingCert({ event, user: currentUser });
    };

    if (myRegistrations.length === 0) {
        return null; // Don't show the section if there are no registrations
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-green-500">My Registrations</h2>
            <div className="space-y-4">
                {myRegistrations.map(reg => reg.event && (
                    <div key={reg.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg bg-gray-50">
                        <div>
                            <h4 className="font-bold text-gray-800">{reg.event.title}</h4>
                            <p className="text-sm text-gray-600">
                                Organizer: {reg.event.organizer} | Date: {new Date(reg.event.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            {reg.event.completed && reg.certificateGenerated ? (
                                <button onClick={() => handleDownloadCertificate(reg.event!)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                                    Download Certificate
                                </button>
                            ) : reg.event.completed ? (
                                <span className="text-gray-500 font-semibold">Event Completed</span>
                            ) : (
                                <button onClick={() => markEventCompleted(reg.eventId)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                    (Dev) Mark Completed
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {generatingCert && 
                <CertificateCanvas 
                    event={generatingCert.event} 
                    user={generatingCert.user} 
                    onDone={() => setGeneratingCert(null)} 
                />}
        </div>
    );
};

export default MyRegistrations;
