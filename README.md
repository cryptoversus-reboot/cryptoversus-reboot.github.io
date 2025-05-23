# CryptoVersus.io Website

A modern enterprise website built with the FlexNet JSX framework, showcasing CryptoVersus.io's enterprise decentralized infrastructure services.

> **Note**: This project has been moved to its own repository. The FlexNet JSX framework documentation and core implementation can be found at [flexnet-jsx-docs](https://github.com/seandinwiddie/flexnet-jsx-docs).

## Overview

This website demonstrates the complete implementation of a multi-page business website using FlexNet JSX framework principles:

- **Security-first design** with XSS prevention and input validation
- **Functional programming** with pure functions and immutable state
- **Zero dependencies** - browser-native implementation
- **Comprehensive error handling** with functional error boundaries
- **Type-safe operations** using Maybe, Either, and Result types

## Features

### 🔒 Security Features
- **XSS Prevention**: Automatic input sanitization and escaping
- **Content Security Policy**: CSP headers implemented
- **Input Validation**: Either type-based validation system
- **Safe DOM Operations**: Result type-wrapped DOM manipulation
- **Secure Event Handling**: Protected event listeners

### 🏗️ Architecture
- **Modular Component Structure**: Separated by features (homepage, navigation, etc.)
- **Pure Functional Components**: No side effects in component logic
- **Immutable State Management**: FlexNet JSX state store
- **Error Boundaries**: Comprehensive error handling with graceful fallbacks
- **Type System**: Maybe, Either, Result types for safe operations

### 📱 Pages
- **Homepage**: Complete landing page with hero, services, benefits sections
- **Services/Offer**: Detailed service offerings (placeholder)
- **About Us**: Company information and team (placeholder)
- **Contact**: Contact forms and information (placeholder)
- **FAQs**: Frequently asked questions (placeholder)
- **Mission Statement**: Company mission and values (placeholder)

## Getting Started

### Prerequisites
- Modern web browser with ES6 module support
- HTTP server (Python recommended)

### Running the Website

1. **Start the development server** from the project directory:
   ```bash
   # Recommended: Python HTTP server
   python -m http.server 3000
   ```

2. **Open your browser** to:
   - **http://localhost:3000/**
   
   > **Note**: After moving to the GitHub organization, the live site will be available at: **https://cryptoversus-reboot.github.io/**

### Project Structure

```
starter-project-website/
├── src/
│   ├── core/                    # FlexNet JSX framework core
│   │   ├── runtime/            # JSX runtime implementation
│   │   ├── types/              # Type system (Maybe, Either, Result)
│   │   ├── functions/          # Core functional utilities
│   │   └── security/           # Security functions and validation
│   │
│   ├── systems/                # Framework systems
│   │   ├── state/             # State management
│   │   ├── errors/            # Error handling and boundaries
│   │   ├── effects/           # Side effect management
│   │   ├── events/            # Event handling
│   │   └── render/            # Rendering system
│   │
│   ├── utils/                  # Utility functions
│   │   └── array.js           # Safe array operations
│   │
│   └── features/               # Website features
│       ├── navigation/         # Navigation component and logic
│       ├── homepage/           # Homepage sections and content
│       ├── services/           # Services page (placeholder)
│       ├── about/              # About page (placeholder)
│       ├── contact/            # Contact page (placeholder)
│       ├── faqs/               # FAQs page (placeholder)
│       └── mission/            # Mission page (placeholder)
│
├── index.html                  # Main entry point
│
└── tests/                     # Test suite
    ├── features/              # Feature-specific tests
    │   ├── homepage/          # Homepage function tests
    │   └── navigation/        # Navigation function tests
    └── test-runner.html       # Browser-based test runner
```

## Content Implementation

### Homepage Sections

1. **Hero Section**
   - Company branding and value proposition
   - Call-to-action buttons with secure navigation

2. **Digital Transformation Section**
   - Positioning as "AWS for decentralized web"
   - Enterprise focus messaging

3. **Web3 Explanation**
   - Benefits of Web3 for enterprises
   - Clear value propositions

4. **Core Services**
   - 7 key service offerings with icons
   - Service cards with hover effects

5. **Why CryptoVersus**
   - 6 key differentiators
   - Detailed benefit explanations

6. **Call-to-Action**
   - Multiple action buttons
   - Secure navigation handling

### Security Implementation

All content is processed through the FlexNet JSX security layer:

```javascript
// Automatic escaping of user content
import { escape } from './src/core/security/functions.js';
const safeContent = escape(userInput);

// Input validation with Either type
const validation = validateInput(userInput);
validation.fold(
  error => console.error('Invalid input:', error),
  validInput => processInput(validInput)
);
```

### Error Handling

Comprehensive error boundaries protect against failures:

```javascript
// Functional error boundaries
const ErrorFallback = (error) => jsx('div', null, `Error: ${error.message}`);
const SafeComponent = createErrorBoundary(ErrorFallback);
```

## Development

### Adding New Pages

1. Create feature directory: `src/features/new-page/`
2. Add functions file: `functions.js` with pure functions
3. Add component file: `index.js` with JSX components
4. Update navigation in `src/features/navigation/functions.js`

### Security Best Practices

1. **Always escape user content** using the `escape()` function
2. **Validate inputs** with Either type before processing
3. **Wrap components** in error boundaries
4. **Use Result type** for operations that might fail
5. **Handle both success and error cases** explicitly

## Testing

The project includes comprehensive tests for all feature functions using the FlexNet JSX testing framework.

### Running Tests

1. **Start the development server**:
   ```bash
   python -m http.server 3000
   ```

2. **Open the test runner** in your browser:
   - **Local**: http://localhost:3000/tests/test-runner.html
   - **Live site**: https://cryptoversus-reboot.github.io/tests/test-runner.html

3. **Run tests**:
   - Click "Run All Tests" for the complete test suite
   - Or run individual feature tests separately

### Test Structure

- **Homepage Tests**: Test all content getter functions and CTA handlers
- **Navigation Tests**: Test routing, state management, and URL parsing
- **Type Safety**: All tests verify proper Maybe, Either, and Result type usage
- **Error Handling**: Tests cover both success and failure scenarios

### Adding New Tests

When adding new features:

1. Create test directory: `tests/features/your-feature/`
2. Add test file: `your-feature.test.js`
3. Import and test all pure functions from `src/features/your-feature/functions.js`
4. Follow the existing test patterns for consistency

## Branding & Logo Design

### Brand Identity Guidelines

CryptoVersus.io represents enterprise-grade Web3 infrastructure with a focus on reliability, security, and professional implementation.

#### Logo Design Specifications

**Theme/Concept**: Enterprise Technology & Decentralized Web
- **Primary theme**: Enterprise-grade Web3/blockchain infrastructure 
- **Secondary themes**: Digital transformation, decentralized computing, cybersecurity
- **Concept**: "AWS for the decentralized web" - enterprise reliability meets cutting-edge blockchain technology

**Target Audience**: Enterprise Decision Makers & Developers
- **Primary**: C-level executives, CTOs, enterprise architects at medium to large corporations
- **Secondary**: Developers, IT teams, and blockchain engineers
- **Tertiary**: Crypto/Web3 enthusiasts in enterprise contexts

**Preferred Style**: Modern, Professional, Tech-Forward
- **Style**: Clean, minimal, modern corporate design
- **Feel**: Professional yet innovative, trustworthy but cutting-edge
- **Inspiration**: Enterprise cloud platforms (AWS, Azure) with Web3/crypto elements

**Color Scheme**: Enterprise Blues with Crypto Accents
- **Primary**: Professional blues (#0066CC or similar enterprise blue)
- **Secondary**: Dark grays/charcoal for stability and trust
- **Accent**: Crypto-inspired colors like electric blue, teal, or subtle gold
- **Avoid**: Overly bright "meme coin" colors - keep it professional

**Symbols/Elements**:
- **Geometric patterns**: Circuit patterns, network nodes, interconnected hexagons
- **Abstract elements**: Data flow visualization, cloud infrastructure symbols
- **Professional symbols**: Shield (security), arrows (transformation), connected dots (network)
- **Subtle crypto elements**: Abstract blockchain visualization or decentralized network nodes
- **Text treatment**: "CryptoVersus.io" with possible tagline "Enterprise Decentralized Infrastructure"

#### Brand Values
- **Trust**: Enterprise-grade reliability and security
- **Innovation**: Cutting-edge Web3 technology implementation
- **Accessibility**: Making complex technology approachable for enterprises
- **Interoperability**: Seamless integration with existing systems
- **Compliance**: Regulatory adherence and enterprise governance

#### Company Context
- **Company**: CryptoVersus.io (division of ACMEWERX)
- **Founder**: Dr. Robert Whetsel
- **Key differentiator**: Patent-based "Trusted client-centric application architecture"
- **Value proposition**: Making Web3 technology accessible and reliable for enterprises

The logo should convey **trust, innovation, enterprise-grade reliability, and cutting-edge technology** while avoiding flashy aesthetics often associated with consumer crypto projects. Think "IBM Watson meets Ethereum" rather than "GameFi token."

## Technologies Used

- **FlexNet JSX Framework**: Modern functional reactive framework
- **ES6 Modules**: Native browser module system
- **CSS3**: Modern styling with gradients and animations
- **HTML5**: Semantic markup with CSP headers

## License

This project demonstrates the FlexNet JSX framework implementation for enterprise websites.

## Resources

- [FlexNet JSX Documentation](https://github.com/seandinwiddie/flexnet-jsx-docs/blob/main/README.md)
- [Architecture Overview](https://github.com/seandinwiddie/flexnet-jsx-docs/blob/main/ARCHITECTUREOVERVIEW.md)
- [Security Practices](https://github.com/seandinwiddie/flexnet-jsx-docs/blob/main/security-practices.md)
- [API Reference](https://github.com/seandinwiddie/flexnet-jsx-docs/blob/main/api-reference.md)
- [Getting Started Guide](https://github.com/seandinwiddie/flexnet-jsx-docs/blob/main/getting-started-guide.md)
- [HTTP System Documentation](https://github.com/seandinwiddie/flexnet-jsx-docs/blob/main/http-system.md) 