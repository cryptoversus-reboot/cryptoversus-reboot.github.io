// Homepage functions tests
import { 
    getHeroContent, 
    getDigitalTransformationContent,
    getWeb3Content,
    getCoreServicesContent,
    getWhyCryptoVersusContent,
    getCTAContent,
    handleCTAClick
} from '../../../src/features/homepage/functions.js';
import Maybe from '../../../src/core/types/maybe.js';
import Result from '../../../src/core/types/result.js';

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

// Test hero content
test('getHeroContent should return valid hero content', () => {
    const heroContent = getHeroContent();
    assertMaybe(heroContent, 'Hero content');
    
    const content = heroContent.value;
    assertEqual(content.siteName, 'CryptoVersus.io', 'Site name');
    assertEqual(content.tagline, 'Enterprise Decentralized Infrastructure', 'Tagline');
    assertTruthy(content.headline, 'Headline should exist');
    assertTruthy(content.description, 'Description should exist');
});

// Test digital transformation content
test('getDigitalTransformationContent should return valid content', () => {
    const content = getDigitalTransformationContent();
    assertMaybe(content, 'Digital transformation content');
    
    const data = content.value;
    assertTruthy(data.heading, 'Heading should exist');
    assertTruthy(data.content, 'Content should exist');
});

// Test Web3 content
test('getWeb3Content should return valid Web3 content', () => {
    const content = getWeb3Content();
    assertMaybe(content, 'Web3 content');
    
    const data = content.value;
    assertTruthy(data.heading, 'Heading should exist');
    assertTruthy(data.description, 'Description should exist');
    assertTruthy(Array.isArray(data.benefits), 'Benefits should be an array');
    assertEqual(data.benefits.length, 5, 'Should have 5 benefits');
});

// Test core services content
test('getCoreServicesContent should return valid services', () => {
    const content = getCoreServicesContent();
    assertMaybe(content, 'Core services content');
    
    const data = content.value;
    assertTruthy(data.heading, 'Heading should exist');
    assertTruthy(Array.isArray(data.services), 'Services should be an array');
    assertEqual(data.services.length, 7, 'Should have 7 services');
    
    // Test first service structure
    const firstService = data.services[0];
    assertTruthy(firstService.id, 'Service should have id');
    assertTruthy(firstService.title, 'Service should have title');
    assertTruthy(firstService.icon, 'Service should have icon');
    assertTruthy(firstService.description, 'Service should have description');
});

// Test why CryptoVersus content
test('getWhyCryptoVersusContent should return valid benefits', () => {
    const content = getWhyCryptoVersusContent();
    assertMaybe(content, 'Why CryptoVersus content');
    
    const data = content.value;
    assertTruthy(data.heading, 'Heading should exist');
    assertTruthy(Array.isArray(data.benefits), 'Benefits should be an array');
    assertEqual(data.benefits.length, 6, 'Should have 6 benefits');
    
    // Test first benefit structure
    const firstBenefit = data.benefits[0];
    assertTruthy(firstBenefit.title, 'Benefit should have title');
    assertTruthy(firstBenefit.description, 'Benefit should have description');
});

// Test CTA content
test('getCTAContent should return valid CTA content', () => {
    const content = getCTAContent();
    assertMaybe(content, 'CTA content');
    
    const data = content.value;
    assertTruthy(data.heading, 'Heading should exist');
    assertTruthy(data.description, 'Description should exist');
    assertTruthy(Array.isArray(data.buttons), 'Buttons should be an array');
    assertEqual(data.buttons.length, 3, 'Should have 3 buttons');
    
    // Test button structure
    const firstButton = data.buttons[0];
    assertTruthy(firstButton.text, 'Button should have text');
    assertTruthy(firstButton.action, 'Button should have action');
    assertTruthy(firstButton.type, 'Button should have type');
});

// Test CTA click handler
test('handleCTAClick should handle valid actions', () => {
    let navigatedTo = null;
    const mockNavigate = (page) => {
        navigatedTo = page;
        return page;
    };
    
    // Test contact action
    const contactResult = handleCTAClick('contact', mockNavigate);
    assertEqual(contactResult.type, 'Ok', 'Contact action should succeed');
    assertEqual(navigatedTo, 'contact', 'Should navigate to contact');
    
    // Test services action
    const servicesResult = handleCTAClick('services', mockNavigate);
    assertEqual(servicesResult.type, 'Ok', 'Services action should succeed');
    assertEqual(navigatedTo, 'services', 'Should navigate to services');
    
    // Test about action
    const aboutResult = handleCTAClick('about', mockNavigate);
    assertEqual(aboutResult.type, 'Ok', 'About action should succeed');
    assertEqual(navigatedTo, 'about', 'Should navigate to about');
});

test('handleCTAClick should handle invalid actions', () => {
    const mockNavigate = () => {};
    
    const result = handleCTAClick('invalid', mockNavigate);
    assertEqual(result.type, 'Error', 'Invalid action should return Error');
});

// Run all tests
console.log('🧪 Running homepage function tests...');
export { test, assertEqual, assertTruthy, assertMaybe }; 