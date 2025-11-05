import React from 'react';
import { FilterState } from '../types';

interface SidebarProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    allClubs: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, allClubs }) => {

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFilters(prev => {
            const newCategories = checked
                ? [...prev.categories, value]
                : prev.categories.filter(cat => cat !== value);
            return { ...prev, categories: newCategories };
        });
    };

    const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, club: e.target.value }));
    };
    
    const clearFilters = () => {
        setFilters({ categories: ['educational', 'cultural'], club: '' });
    };

    return (
        <aside className="lg:w-64 xl:w-72">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>
                <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-2">Category</label>
                    <div className="space-y-2">
                        <div>
                            <label className="inline-flex items-center">
                                <input type="checkbox" value="educational" checked={filters.categories.includes('educational')} onChange={handleCategoryChange} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                                <span className="ml-2 text-gray-700">Educational</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                                <input type="checkbox" value="cultural" checked={filters.categories.includes('cultural')} onChange={handleCategoryChange} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                                <span className="ml-2 text-gray-700">Cultural</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="clubFilter" className="block font-semibold text-gray-700 mb-2">Club</label>
                    <select id="clubFilter" value={filters.club} onChange={handleClubChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option value="">All Clubs</option>
                        {allClubs.map(club => (
                            <option key={club} value={club}>{club}</option>
                        ))}
                    </select>
                </div>
                
                <button onClick={clearFilters} className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300">
                    Clear Filters
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
