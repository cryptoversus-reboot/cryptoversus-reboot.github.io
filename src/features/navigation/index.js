import { jsx } from '../../core/runtime/jsx.js';
import { getMenuItems, handleNavigation, getCurrentPage } from './functions.js';
import { escape } from '../../core/security/functions.js';
import Maybe from '../../core/types/maybe.js';
import Result from '../../core/types/result.js';

// Safe click handler with better logging
const safeOnClick = (callback, context = '') => {
    return (e) => {
        try {
            e.preventDefault();
            console.log(`[Navigation] Click event triggered${context ? ` for ${context}` : ''}`);
            const result = Result.fromTry(callback);
            if (result && result.type === 'Error') {
                console.error(`[Navigation] Navigation error${context ? ` for ${context}` : ''}:`, result.error);
            } else {
                console.log(`[Navigation] Navigation successful${context ? ` for ${context}` : ''}`);
            }
        } catch (error) {
            console.error(`[Navigation] Critical navigation error${context ? ` for ${context}` : ''}:`, error);
        }
    };
};

// Add helper to toggle mobile menu visibility
const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-nav-items');
    const overlay = document.getElementById('mobile-nav-overlay');
    if (menu) {
        menu.classList.toggle('hidden');
    }
    if (overlay) {
        overlay.classList.toggle('hidden');
    }
};

// Navigation component as pure function
const Navigation = ({ currentPage, onNavigate }) => {
    console.log(`[Navigation] Rendering navigation for current page: ${currentPage}`);
    const menuItems = getMenuItems().getOrElse([]);
    console.log(`[Navigation] Menu items loaded:`, menuItems.map(item => item.id));
    
    const headerStyle = {
        backgroundColor: 'hsl(240 10% 3.9%)', // --background (matches body)
        color: 'hsl(0 0% 98%)', // --foreground
        borderBottom: '1px solid hsl(240 3.7% 15.9%)' // --border
    };

    const navLinkStyle = {
        color: 'hsl(0 0% 98%)' // --foreground
    };

    const activeButtonStyle = {
        backgroundColor: 'hsl(240 3.7% 15.9%)', // --accent
        color: 'hsl(0 0% 98%)' // --accent-foreground
    };

    const inactiveButtonStyle = {
        color: 'hsl(0 0% 98%)' // --foreground (changed from hsl(240 5% 64.9%))
    };
    
    // Note: Tailwind classes like 'fixed', 'shadow-md', 'container', 'flex', etc., are kept for layout.
    return jsx('header', { 
        className: 'fixed top-0 left-0 right-0 shadow-md z-50 max-w-full',
        style: headerStyle
    }, [
        jsx('nav', { 
            className: 'container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 overflow-x-hidden max-w-full'
        }, [
            jsx('a', {
                href: '/public/',
                className: 'flex items-center space-x-3 text-xl font-bold transition-colors min-w-0', // Added flex and spacing for logo
                style: navLinkStyle, // Explicit color
                onClick: safeOnClick(() => onNavigate('home'))
            }, [
                jsx('img', {
                    src: './cryptoversus-reboot_icon.png',
                    alt: 'CryptoVersus.io Logo',
                    className: 'h-8 w-8', // 32px height and width
                    style: { objectFit: 'contain' }
                }),
                jsx('span', {}, 'CryptoVersus.io')
            ]),
            // Hamburger button for mobile
            jsx('button', {
                onClick: safeOnClick(() => toggleMobileMenu(), 'hamburger'),
                className: 'md:hidden inline-flex flex-col justify-center items-center space-y-1 p-2 rounded-md text-white border border-white hover:text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
            }, [
                jsx('span', { className: 'block w-6 h-0.5 bg-white' }),
                jsx('span', { className: 'block w-6 h-0.5 bg-white' }),
                jsx('span', { className: 'block w-6 h-0.5 bg-white' })
            ]),
            // Desktop menu hidden on mobile
            jsx('ul', {
                className: 'hidden md:flex space-x-4'
            }, menuItems.map(item => 
                jsx('li', { key: item.id }, [
                    jsx('button', {
                        onClick: safeOnClick(() => onNavigate(item.id)),
                        className: 'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                        style: currentPage === item.id ? activeButtonStyle : inactiveButtonStyle
                        // Consider adding hover styles directly via JS if Tailwind's hover:bg-zinc-800 etc. is not precise enough
                    }, item.label)
                ])
            ))
        ]),
        // Mobile menu items
        jsx('div', {
            id: 'mobile-nav-items',
            className: 'md:hidden hidden absolute top-full left-0 w-full max-w-screen px-4 pt-2 pb-3 space-y-1 border-l border-r border-b rounded-b-md overflow-x-hidden z-50',
            style: {
                backgroundColor: 'hsla(240, 10%, 3.9%, 0.98)' // Less transparent dark background
            }
        }, menuItems.map(item =>
            jsx('button', {
                onClick: safeOnClick(() => { toggleMobileMenu(); onNavigate(item.id); }, `mobile-${item.id}`),
                className: 'block px-3 py-2 rounded-md text-base font-medium',
                style: currentPage === item.id ? activeButtonStyle : inactiveButtonStyle
            }, item.label)
        ))
    ]);
};

export default Navigation; 