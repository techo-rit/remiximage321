import React from 'react';
import { RemixLogoIcon } from './Icons';

type NavCategory = 'Home' | 'Marketing' | 'Creators';

interface HeaderProps {
    activeNav: NavCategory;
    onNavClick: (category: NavCategory) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeNav, onNavClick }) => {
    const navItems: NavCategory[] = ['Home', 'Marketing', 'Creators'];

    return (
        <header className="fixed top-0 left-0 right-0 h-[80px] bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
            <div className="w-full max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <RemixLogoIcon />
                        <span>Image Remix</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-4">
                        {navItems.map(item => (
                            <button
                                key={item}
                                onClick={() => onNavClick(item)}
                                aria-label={`Navigate to ${item} page`}
                                className={`px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                                    activeNav === item 
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};