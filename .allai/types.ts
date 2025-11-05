export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: 'student' | 'club';
    clubName?: string; // e.g., 'MLSC', 'IEEE'
}

export interface Event {
    id: string;
    title: string;
    category: 'educational' | 'cultural';
    organizer: string; // This is the clubName
    date: string;
    description: string;
    seats: number;
    availableSeats: number;
    fee: number;
    completed: boolean;
}

export interface Registration {
    id: string;
    userId: string;
    eventId: string;
    registeredAt: string;
    certificateGenerated: boolean;
}

export interface FilterState {
    categories: string[];
    club: string;
}
