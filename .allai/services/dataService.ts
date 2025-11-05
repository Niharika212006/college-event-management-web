import { User, Event, Registration } from '../types';
import { STORAGE_KEYS } from '../Constants';

const CLUBS = {
    educational: ['MLSC', 'IEEE', 'ACM', 'Geeks for Geeks', 'IT Department', 'ECE Department'],
    cultural: ['Vishaka', 'Pyros', 'Tamilmandram']
};

export const getClubs = (): string[] => {
    return [...CLUBS.educational, ...CLUBS.cultural];
};


const initializeDemoData = () => {
    // Ensure accounts contain demo club accounts (merge with existing accounts if any)
    const slugify = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, '');
    const clubs = getClubs();

    const existingAccountsRaw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    let existingAccounts: User[] = existingAccountsRaw ? JSON.parse(existingAccountsRaw) : [];

    // Build required club accounts
    const requiredClubAccounts: User[] = clubs.map(club => {
        const slug = slugify(club);
        return {
            id: `club_${slug}`,
            email: `${slug}@college.edu`,
            password: 'clubpassword',
            name: `${club} Admin`,
            role: 'club',
            clubName: club
        } as User;
    });

    // Merge any missing club accounts into existingAccounts
    const emails = new Set(existingAccounts.map(a => a.email));
    requiredClubAccounts.forEach(acc => {
        if (!emails.has(acc.email)) {
            existingAccounts.push(acc);
            emails.add(acc.email);
        }
    });

    // Ensure at least one demo student exists
    if (!existingAccounts.some(a => a.role === 'student')) {
        existingAccounts.push({ id: 'student1', email: 'student1@college.edu', password: 'studentpass', name: 'John Student', role: 'student' });
    }

    // Persist merged accounts
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(existingAccounts));

    // Initialize events
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
        const now = new Date();
        const demoEvents: Event[] = [
            { id: 'evt1', title: 'Machine Learning Workshop', category: 'educational', organizer: 'MLSC', date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), description: 'Learn the fundamentals of ML.', seats: 50, availableSeats: 50, fee: 100, completed: false },
            { id: 'evt2', title: 'IEEE Tech Talk: IoT', category: 'educational', organizer: 'IEEE', date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), description: 'Explore the latest trends in IoT.', seats: 100, availableSeats: 100, fee: 0, completed: false },
            { id: 'evt3', title: 'ACM Coding Competition', category: 'educational', organizer: 'ACM', date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), description: 'Test your coding skills!', seats: 200, availableSeats: 200, fee: 50, completed: false },
            { id: 'evt4', title: 'Vishaka Cultural Night', category: 'cultural', organizer: 'Vishaka', date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), description: 'An evening of music and dance.', seats: 300, availableSeats: 300, fee: 150, completed: false },
        ];
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(demoEvents));
    }

    // Initialize registrations
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    }
};

// Initialize on load
initializeDemoData();

export const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    initializeDemoData();
};

// Generic getter/setter for local storage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
};

const setInStorage = <T,>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Accounts
export const getAccounts = (): User[] => getFromStorage(STORAGE_KEYS.ACCOUNTS, []);
export const setAccounts = (accounts: User[]) => setInStorage(STORAGE_KEYS.ACCOUNTS, accounts);

// Events
export const getEvents = (): Event[] => getFromStorage(STORAGE_KEYS.EVENTS, []);
export const setEvents = (events: Event[]) => setInStorage(STORAGE_KEYS.EVENTS, events);

// Registrations
export const getRegistrations = (): Registration[] => getFromStorage(STORAGE_KEYS.REGISTRATIONS, []);
export const setRegistrations = (registrations: Registration[]) => setInStorage(STORAGE_KEYS.REGISTRATIONS, registrations);
