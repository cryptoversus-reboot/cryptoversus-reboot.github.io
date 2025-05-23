// Schema.org Structured Data Management
import Result from '../types/result.js';
import { escape } from '../security/functions.js';
import { SEO_CONFIG } from './meta-tags.js';

/**
 * Organization Schema for CryptoVersus.io
 */
export const generateOrganizationSchema = () => {
    return Result.fromTry(() => {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CryptoVersus.io",
            "url": "https://cryptoversus.io",
            "logo": "https://cryptoversus.io/images/logo.png",
            "description": "Leading provider of enterprise decentralized infrastructure solutions",
            "foundingDate": "2023",
            "sameAs": [
                "https://twitter.com/cryptoversus",
                "https://linkedin.com/company/cryptoversus",
                "https://github.com/cryptoversus"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "contact@cryptoversus.io",
                "url": "https://cryptoversus.io/contact"
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "Global"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "127",
                "bestRating": "5"
            }
        };
    });
};

/**
 * Website Schema for main site structure
 */
export const generateWebsiteSchema = () => {
    return Result.fromTry(() => {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CryptoVersus.io",
            "url": "https://cryptoversus.io",
            "description": "Enterprise decentralized infrastructure solutions and Web3 services",
            "publisher": {
                "@type": "Organization",
                "name": "CryptoVersus.io",
                "url": "https://cryptoversus.io"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cryptoversus.io/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        };
    });
};

/**
 * Service schemas for different pages
 */
export const generateServiceSchemas = () => {
    return Result.fromTry(() => {
        const services = [
            {
                "@type": "Service",
                "name": "Blockchain Development",
                "description": "Custom blockchain development and smart contract solutions for enterprises",
                "provider": {
                    "@type": "Organization",
                    "name": "CryptoVersus.io"
                },
                "serviceType": "Technology Consulting",
                "audience": {
                    "@type": "BusinessAudience",
                    "audienceType": "Enterprise"
                }
            },
            {
                "@type": "Service", 
                "name": "DeFi Solutions",
                "description": "Decentralized Finance solutions and protocol development",
                "provider": {
                    "@type": "Organization",
                    "name": "CryptoVersus.io"
                },
                "serviceType": "Financial Technology",
                "audience": {
                    "@type": "BusinessAudience",
                    "audienceType": "Enterprise"
                }
            },
            {
                "@type": "Service",
                "name": "Web3 Infrastructure",
                "description": "Scalable Web3 infrastructure and decentralized application hosting",
                "provider": {
                    "@type": "Organization",
                    "name": "CryptoVersus.io"
                },
                "serviceType": "Cloud Computing",
                "audience": {
                    "@type": "BusinessAudience",
                    "audienceType": "Enterprise"
                }
            }
        ];

        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": services.map((service, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": service
            }))
        };
    });
};

/**
 * FAQ Schema for FAQ page
 */
export const generateFAQSchema = () => {
    return Result.fromTry(() => {
        const faqs = [
            {
                question: "What is decentralized infrastructure?",
                answer: "Decentralized infrastructure refers to distributed computing systems that operate without a central authority, providing increased security, transparency, and resilience compared to traditional centralized systems."
            },
            {
                question: "How can enterprises benefit from Web3 technology?",
                answer: "Enterprises can benefit from Web3 through improved security, reduced intermediary costs, enhanced transparency, global accessibility, and innovative business models that weren't possible with traditional technology."
            },
            {
                question: "What services does CryptoVersus.io provide?",
                answer: "We provide comprehensive decentralized infrastructure services including blockchain development, smart contract creation, DeFi solutions, Web3 consulting, and enterprise blockchain integration."
            },
            {
                question: "Is blockchain technology secure for enterprise use?",
                answer: "Yes, when properly implemented, blockchain technology offers superior security through cryptographic protection, distributed consensus, and immutable record-keeping, making it ideal for enterprise applications."
            },
            {
                question: "How long does a typical blockchain project take?",
                answer: "Project timelines vary based on complexity, but typical enterprise blockchain implementations range from 3-12 months, including planning, development, testing, and deployment phases."
            }
        ];

        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        };
    });
};

/**
 * Breadcrumb Schema for navigation
 */
export const generateBreadcrumbSchema = (currentPage, navigationPath = []) => {
    return Result.fromTry(() => {
        const breadcrumbs = [
            { name: "Home", url: "https://cryptoversus.io" },
            ...navigationPath
        ];

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };
    });
};

/**
 * Product/Service offering schema
 */
export const generateOfferingSchema = () => {
    return Result.fromTry(() => {
        return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Enterprise Decentralized Infrastructure",
            "description": "Comprehensive Web3 and blockchain infrastructure solutions for enterprises",
            "brand": {
                "@type": "Brand",
                "name": "CryptoVersus.io"
            },
            "category": "Business Software",
            "manufacturer": {
                "@type": "Organization",
                "name": "CryptoVersus.io"
            },
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "Contact for pricing",
                "priceCurrency": "USD",
                "priceValidUntil": "2025-12-31",
                "seller": {
                    "@type": "Organization",
                    "name": "CryptoVersus.io"
                }
            }
        };
    });
};

/**
 * LocalBusiness schema for contact/about pages
 */
export const generateLocalBusinessSchema = () => {
    return Result.fromTry(() => {
        return {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "CryptoVersus.io",
            "image": "https://cryptoversus.io/images/logo.png",
            "description": "Professional decentralized infrastructure and blockchain development services",
            "url": "https://cryptoversus.io",
            "telephone": "+1-555-CRYPTO",
            "email": "contact@cryptoversus.io",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "US",
                "addressRegion": "Global"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.7128",
                "longitude": "-74.0060"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
            },
            "priceRange": "$$$$"
        };
    });
};

/**
 * Page-specific schema generators
 */
export const PAGE_SCHEMAS = {
    home: () => [
        generateOrganizationSchema(),
        generateWebsiteSchema(),
        generateOfferingSchema()
    ],
    services: () => [
        generateOrganizationSchema(),
        generateServiceSchemas(),
        generateOfferingSchema()
    ],
    about: () => [
        generateOrganizationSchema(),
        generateLocalBusinessSchema()
    ],
    contact: () => [
        generateOrganizationSchema(),
        generateLocalBusinessSchema()
    ],
    faqs: () => [
        generateOrganizationSchema(),
        generateFAQSchema()
    ],
    mission: () => [
        generateOrganizationSchema()
    ]
};

/**
 * Insert schema into page head
 */
const insertSchemaScript = (schemaData) => {
    return Result.fromTry(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaData, null, 2);
        
        // Add schema identifier for later removal
        script.setAttribute('data-schema', 'true');
        
        document.head.appendChild(script);
        return script;
    });
};

/**
 * Remove existing schema scripts
 */
const removeExistingSchemas = () => {
    return Result.fromTry(() => {
        const existingSchemas = document.querySelectorAll('script[data-schema="true"]');
        existingSchemas.forEach(script => script.remove());
        return existingSchemas.length;
    });
};

/**
 * Main function to update all schemas for a page
 */
export const updatePageSchemas = (pageId) => {
    return Result.fromTry(() => {
        // Remove existing schemas
        const removeResult = removeExistingSchemas();
        if (removeResult.type === 'Error') {
            throw new Error('Failed to remove existing schemas');
        }

        // Get schema generators for this page
        const schemaGenerators = PAGE_SCHEMAS[pageId] || PAGE_SCHEMAS.home;
        const schemas = schemaGenerators();
        
        let insertedCount = 0;
        
        // Insert each schema
        for (const schemaResult of schemas) {
            if (schemaResult.type === 'Error') {
                console.warn('Schema generation failed:', schemaResult.error);
                continue;
            }
            
            const insertResult = insertSchemaScript(schemaResult.value);
            if (insertResult.type === 'Success') {
                insertedCount++;
            } else {
                console.warn('Schema insertion failed:', insertResult.error);
            }
        }
        
        console.log(`[SEO] Updated ${insertedCount} schemas for page: ${pageId}`);
        return insertedCount;
    });
};

/**
 * Validate schema data (basic validation)
 */
export const validateSchema = (schemaData) => {
    return Result.fromTry(() => {
        if (!schemaData || typeof schemaData !== 'object') {
            throw new Error('Schema data must be an object');
        }
        
        if (!schemaData['@context'] || !schemaData['@type']) {
            throw new Error('Schema must have @context and @type properties');
        }
        
        // Basic validation passed
        return true;
    });
}; 