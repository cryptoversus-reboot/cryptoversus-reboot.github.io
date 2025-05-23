// SEO Meta Tags Management System
import Maybe from '../types/maybe.js';
import Result from '../types/result.js';
import { escape } from '../security/functions.js';

/**
 * Core SEO configuration for CryptoVersus.io
 */
export const SEO_CONFIG = {
    siteName: 'CryptoVersus.io',
    siteUrl: 'https://cryptoversus.io',
    defaultTitle: 'CryptoVersus.io - Enterprise Decentralized Infrastructure',
    defaultDescription: 'Leading provider of enterprise decentralized infrastructure solutions. AWS for the decentralized web with security, scalability, and innovation.',
    defaultKeywords: 'blockchain, decentralized infrastructure, enterprise web3, crypto solutions, decentralized web, blockchain development, enterprise blockchain',
    defaultImage: 'https://cryptoversus.io/images/og-image.jpg',
    twitterHandle: '@cryptoversus',
    author: 'CryptoVersus Team',
    language: 'en',
    locale: 'en_US'
};

/**
 * Page-specific SEO configurations
 */
export const PAGE_SEO_CONFIG = {
    home: {
        title: 'CryptoVersus.io - Enterprise Decentralized Infrastructure',
        description: 'Leading provider of enterprise decentralized infrastructure solutions. Transform your business with secure, scalable Web3 technology.',
        keywords: 'enterprise blockchain, decentralized infrastructure, web3 solutions, blockchain development, crypto enterprise',
        canonical: '/'
    },
    services: {
        title: 'Our Services - CryptoVersus.io',
        description: 'Comprehensive decentralized infrastructure services including blockchain development, smart contracts, DeFi solutions, and enterprise Web3 consulting.',
        keywords: 'blockchain services, smart contracts, DeFi, Web3 consulting, blockchain development services',
        canonical: '/services'
    },
    about: {
        title: 'About Us - CryptoVersus.io',
        description: 'Learn about CryptoVersus.io team and our mission to revolutionize enterprise infrastructure through decentralized technology.',
        keywords: 'about cryptoversus, blockchain company, decentralized technology team, web3 experts',
        canonical: '/about'
    },
    contact: {
        title: 'Contact Us - CryptoVersus.io',
        description: 'Get in touch with CryptoVersus.io experts for your enterprise decentralized infrastructure needs. Start your Web3 transformation today.',
        keywords: 'contact cryptoversus, blockchain consultation, web3 experts contact',
        canonical: '/contact'
    },
    faqs: {
        title: 'FAQs - CryptoVersus.io',
        description: 'Frequently asked questions about CryptoVersus.io services, decentralized infrastructure, and enterprise blockchain solutions.',
        keywords: 'blockchain FAQ, decentralized infrastructure questions, web3 FAQ',
        canonical: '/faqs'
    },
    mission: {
        title: 'Our Mission - CryptoVersus.io',
        description: 'Discover CryptoVersus.io mission to democratize enterprise access to decentralized infrastructure and drive Web3 adoption.',
        keywords: 'cryptoversus mission, web3 vision, decentralized infrastructure mission',
        canonical: '/mission'
    }
};

/**
 * Generate meta tag element
 */
const createMetaTag = (name, content, property = null) => {
    if (!content) return null;
    
    const attributes = property ? { property, content: escape(content) } : { name, content: escape(content) };
    
    const tag = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
        tag.setAttribute(key, value);
    });
    
    return tag;
};

/**
 * Generate link tag element
 */
const createLinkTag = (rel, href, attributes = {}) => {
    const tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    tag.setAttribute('href', href);
    
    Object.entries(attributes).forEach(([key, value]) => {
        tag.setAttribute(key, value);
    });
    
    return tag;
};

/**
 * Generate basic meta tags
 */
export const generateBasicMetaTags = (pageConfig) => {
    return Result.fromTry(() => {
        const config = { ...SEO_CONFIG, ...pageConfig };
        const tags = [];

        // Basic meta tags
        tags.push(createMetaTag('description', config.description));
        tags.push(createMetaTag('keywords', config.keywords));
        tags.push(createMetaTag('author', config.author));
        tags.push(createMetaTag('language', config.language));
        tags.push(createMetaTag('robots', 'index, follow'));
        
        // Canonical URL
        if (config.canonical) {
            tags.push(createLinkTag('canonical', `${config.siteUrl}${config.canonical}`));
        }

        return tags.filter(tag => tag !== null);
    });
};

/**
 * Generate Open Graph meta tags
 */
export const generateOpenGraphTags = (pageConfig) => {
    return Result.fromTry(() => {
        const config = { ...SEO_CONFIG, ...pageConfig };
        const tags = [];

        tags.push(createMetaTag('og:title', config.title, 'og:title'));
        tags.push(createMetaTag('og:description', config.description, 'og:description'));
        tags.push(createMetaTag('og:type', config.type || 'website', 'og:type'));
        tags.push(createMetaTag('og:url', `${config.siteUrl}${config.canonical || '/'}`, 'og:url'));
        tags.push(createMetaTag('og:site_name', config.siteName, 'og:site_name'));
        tags.push(createMetaTag('og:image', config.image || config.defaultImage, 'og:image'));
        tags.push(createMetaTag('og:image:width', '1200', 'og:image:width'));
        tags.push(createMetaTag('og:image:height', '630', 'og:image:height'));
        tags.push(createMetaTag('og:locale', config.locale, 'og:locale'));

        return tags.filter(tag => tag !== null);
    });
};

/**
 * Generate Twitter Card meta tags
 */
export const generateTwitterTags = (pageConfig) => {
    return Result.fromTry(() => {
        const config = { ...SEO_CONFIG, ...pageConfig };
        const tags = [];

        tags.push(createMetaTag('twitter:card', 'summary_large_image'));
        tags.push(createMetaTag('twitter:site', config.twitterHandle));
        tags.push(createMetaTag('twitter:creator', config.twitterHandle));
        tags.push(createMetaTag('twitter:title', config.title));
        tags.push(createMetaTag('twitter:description', config.description));
        tags.push(createMetaTag('twitter:image', config.image || config.defaultImage));

        return tags.filter(tag => tag !== null);
    });
};

/**
 * Generate additional SEO meta tags
 */
export const generateAdditionalMetaTags = (pageConfig) => {
    return Result.fromTry(() => {
        const config = { ...SEO_CONFIG, ...pageConfig };
        const tags = [];

        // Theme color for mobile browsers
        tags.push(createMetaTag('theme-color', '#667eea'));
        
        // Mobile app meta tags
        tags.push(createMetaTag('apple-mobile-web-app-capable', 'yes'));
        tags.push(createMetaTag('apple-mobile-web-app-status-bar-style', 'default'));
        tags.push(createMetaTag('apple-mobile-web-app-title', config.siteName));
        
        // Microsoft specific
        tags.push(createMetaTag('msapplication-TileColor', '#667eea'));
        tags.push(createMetaTag('msapplication-config', '/browserconfig.xml'));
        
        // Security headers
        tags.push(createMetaTag('referrer', 'strict-origin-when-cross-origin'));
        
        return tags.filter(tag => tag !== null);
    });
};

/**
 * Main function to update all meta tags for a page
 */
export const updateMetaTags = (pageId) => {
    return Result.fromTry(() => {
        const pageConfig = PAGE_SEO_CONFIG[pageId] || PAGE_SEO_CONFIG.home;
        
        // Update document title
        document.title = pageConfig.title;
        
        // Remove existing meta tags (except viewport and charset)
        const existingMetas = document.querySelectorAll('meta:not([charset]):not([name="viewport"]):not([http-equiv])');
        existingMetas.forEach(meta => meta.remove());
        
        // Remove existing links (except stylesheets)
        const existingLinks = document.querySelectorAll('link:not([rel="stylesheet"]):not([rel="icon"])');
        existingLinks.forEach(link => link.remove());
        
        // Generate all meta tags
        const basicResult = generateBasicMetaTags(pageConfig);
        const ogResult = generateOpenGraphTags(pageConfig);
        const twitterResult = generateTwitterTags(pageConfig);
        const additionalResult = generateAdditionalMetaTags(pageConfig);
        
        if (basicResult.type === 'Error' || ogResult.type === 'Error' || 
            twitterResult.type === 'Error' || additionalResult.type === 'Error') {
            throw new Error('Failed to generate meta tags');
        }
        
        // Combine all tags
        const allTags = [
            ...basicResult.value,
            ...ogResult.value,
            ...twitterResult.value,
            ...additionalResult.value
        ];
        
        // Append to head
        const head = document.head;
        allTags.forEach(tag => {
            if (tag) head.appendChild(tag);
        });
        
        console.log(`[SEO] Updated meta tags for page: ${pageId}`);
        return allTags.length;
    });
};

/**
 * Get page configuration for external use
 */
export const getPageSEOConfig = (pageId) => {
    return Maybe.fromNullable(PAGE_SEO_CONFIG[pageId])
        .map(config => ({ ...SEO_CONFIG, ...config }))
        .getOrElse({ ...SEO_CONFIG, ...PAGE_SEO_CONFIG.home });
}; 