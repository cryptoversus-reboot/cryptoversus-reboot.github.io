// Navigation functions tests
import { 
    getCurrentPage, 
    setCurrentPage,
    toggleMenu,
    getMenuItems,
    handleNavigation,
    getPageFromPath,
    navigationState
} from '../../../src/features/navigation/functions.js';
import Maybe from '../../../src/core/types/maybe.js';
import Either from '../../../src/core/types/either.js';

// Simple test runner for browser environment
const test = (name, testFn) => {
    try {
        testFn();
        console.log(`✅ ${name}`);
    } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
    }
};

const assertEqual = (actual, expected, message) => {
    if (actual !== expected) {
        throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
};

const assertTruthy = (actual, message) => {
    if (!actual) {
        throw new Error(`${message}: expected truthy value, got ${actual}`);
    }
};

const assertMaybe = (maybeValue, message) => {
    assertEqual(maybeValue.type, 'Just', `${message} should be a Maybe.Just`);
    assertTruthy(maybeValue.value, `${message} should have a value`);
};

const assertEither = (eitherValue, expectedType, message) => {
    assertEqual(eitherValue.type, expectedType, `${message} should be Either.${expectedType}`);
};

// Reset navigation state before each test
const resetNavigationState = () => {
    navigationState.currentPage = 'home';
    navigationState.isMenuOpen = false;
};

// Test getCurrentPage
test('getCurrentPage should return current page', () => {
    resetNavigationState();
    const currentPage = getCurrentPage();
    assertMaybe(currentPage, 'Current page');
    assertEqual(currentPage.value, 'home', 'Default current page should be home');
});

// Test setCurrentPage with valid pages
test('setCurrentPage should handle valid pages', () => {
    resetNavigationState();
    
    const result = setCurrentPage('services');
    assertEither(result, 'Right', 'Valid page setting');
    assertEqual(result.value, 'services', 'Should return the set page');
    assertEqual(navigationState.currentPage, 'services', 'Should update navigation state');
});

// Test setCurrentPage with invalid pages
test('setCurrentPage should handle invalid pages', () => {
    resetNavigationState();
    
    const result = setCurrentPage('invalid-page');
    assertEither(result, 'Left', 'Invalid page setting');
    assertTruthy(result.value.includes('Invalid page'), 'Should return error message');
    assertEqual(navigationState.currentPage, 'home', 'Should not change state for invalid page');
});

// Test toggleMenu
test('toggleMenu should toggle menu state', () => {
    resetNavigationState();
    
    // First toggle should open menu
    const firstToggle = toggleMenu();
    assertMaybe(firstToggle, 'First toggle');
    assertEqual(firstToggle.value, true, 'Menu should be open after first toggle');
    assertEqual(navigationState.isMenuOpen, true, 'Navigation state should reflect open menu');
    
    // Second toggle should close menu
    const secondToggle = toggleMenu();
    assertMaybe(secondToggle, 'Second toggle');
    assertEqual(secondToggle.value, false, 'Menu should be closed after second toggle');
    assertEqual(navigationState.isMenuOpen, false, 'Navigation state should reflect closed menu');
});

// Test getMenuItems
test('getMenuItems should return valid menu items', () => {
    const menuItems = getMenuItems();
    assertMaybe(menuItems, 'Menu items');
    
    const items = menuItems.value;
    assertTruthy(Array.isArray(items), 'Menu items should be an array');
    assertEqual(items.length, 6, 'Should have 6 menu items');
    
    // Test first menu item structure
    const firstItem = items[0];
    assertEqual(firstItem.id, 'home', 'First item should be home');
    assertEqual(firstItem.label, 'Home', 'First item should have correct label');
    assertTruthy(firstItem.href, 'First item should have href');
    
    // Verify all required pages are present
    const expectedPages = ['home', 'services', 'about', 'contact', 'faqs', 'mission'];
    const itemIds = items.map(item => item.id);
    expectedPages.forEach(page => {
        assertTruthy(itemIds.includes(page), `Menu should include ${page} page`);
    });
});

// Test handleNavigation with valid pages
test('handleNavigation should handle valid pages', () => {
    resetNavigationState();
    
    // Mock window.scrollTo and history.pushState
    const originalScrollTo = window.scrollTo;
    const originalPushState = window.history?.pushState;
    
    let scrollCalled = false;
    let pushStateCalled = false;
    let pushedPath = null;
    
    window.scrollTo = () => { scrollCalled = true; };
    if (window.history) {
        window.history.pushState = (state, title, path) => {
            pushStateCalled = true;
            pushedPath = path;
        };
    }
    
    try {
        const result = handleNavigation('services');
        assertEither(result, 'Right', 'Valid navigation');
        assertEqual(result.value, 'services', 'Should return navigated page');
        assertEqual(navigationState.currentPage, 'services', 'Should update current page');
        assertEqual(scrollCalled, true, 'Should call scrollTo');
        
        if (window.history) {
            assertEqual(pushStateCalled, true, 'Should call pushState');
            assertEqual(pushedPath, '/services', 'Should push correct path');
        }
    } finally {
        // Restore original functions
        window.scrollTo = originalScrollTo;
        if (window.history && originalPushState) {
            window.history.pushState = originalPushState;
        }
    }
});

// Test handleNavigation with invalid pages
test('handleNavigation should handle invalid pages', () => {
    resetNavigationState();
    
    const result = handleNavigation('invalid-page');
    assertEither(result, 'Left', 'Invalid navigation');
    assertTruthy(result.value.includes('Invalid page'), 'Should return error message');
    assertEqual(navigationState.currentPage, 'home', 'Should not change current page');
});

// Test getPageFromPath
test('getPageFromPath should parse URL paths correctly', () => {
    // Mock window.location.pathname
    const originalPathname = window.location.pathname;
    
    try {
        // Test home path
        Object.defineProperty(window.location, 'pathname', {
            value: '/',
            configurable: true
        });
        
        let page = getPageFromPath();
        assertMaybe(page, 'Home path parsing');
        assertEqual(page.value, 'home', 'Should return home for /');
        
        // Test services path
        Object.defineProperty(window.location, 'pathname', {
            value: '/services',
            configurable: true
        });
        
        page = getPageFromPath();
        assertMaybe(page, 'Services path parsing');
        assertEqual(page.value, 'services', 'Should return services for /services');
        
        // Test invalid path
        Object.defineProperty(window.location, 'pathname', {
            value: '/invalid',
            configurable: true
        });
        
        page = getPageFromPath();
        assertMaybe(page, 'Invalid path parsing');
        assertEqual(page.value, 'home', 'Should default to home for invalid paths');
        
    } finally {
        // Restore original pathname
        Object.defineProperty(window.location, 'pathname', {
            value: originalPathname,
            configurable: true
        });
    }
});

// Test navigation state consistency
test('Navigation state should remain consistent', () => {
    resetNavigationState();
    
    // Test multiple page changes
    setCurrentPage('about');
    assertEqual(getCurrentPage().value, 'about', 'State should be consistent after page change');
    
    setCurrentPage('contact');
    assertEqual(getCurrentPage().value, 'contact', 'State should update correctly');
    
    // Test menu state
    toggleMenu();
    assertEqual(navigationState.isMenuOpen, true, 'Menu state should be tracked');
    
    toggleMenu();
    assertEqual(navigationState.isMenuOpen, false, 'Menu state should toggle correctly');
});

// Run all tests
console.log('🧪 Running navigation function tests...');
export { test, assertEqual, assertTruthy, assertMaybe, assertEither }; 