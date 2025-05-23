// Main SEO Management System
import Result from '../types/result.js';
import { updateMetaTags, getPageSEOConfig, SEO_CONFIG } from './meta-tags.js';
import { updatePageSchemas, generateOrganizationSchema, generateWebsiteSchema, generateServiceSchemas, generateFAQSchema, generateBreadcrumbSchema, generateOfferingSchema, generateLocalBusinessSchema, PAGE_SCHEMAS, validateSchema } from './schema.js';
import { initSitemapService, serveSitemap, serveRobotsTxt } from './sitemap.js';
import { initSEOUtils, AnalyticsUtils } from './utils.js';

/**
 * Initialize complete SEO system
 */
export const initSEO = () => {
    return Result.fromTry(() => {
        console.log('[SEO] Initializing SEO system...');
        
        // Initialize sitemap service
        const sitemapResult = initSitemapService();
        if (sitemapResult.type === 'Error') {
            throw new Error('Failed to initialize sitemap service');
        }
        
        // Initialize SEO utilities
        const utilsResult = initSEOUtils();
        if (utilsResult.type === 'Error') {
            console.warn('SEO utilities initialization failed:', utilsResult.error);
        }
        
        // Setup dynamic sitemap/robots.txt serving
        setupDynamicRoutes();
        
        console.log('[SEO] SEO system initialized successfully');
        
        // Track SEO initialization to Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'seo_initialized', {
                event_category: 'SEO Performance',
                event_label: 'system_init',
                value: 1
            });
        }
        
        return {
            sitemap: sitemapResult.value,
            routes: ['sitemap.xml', 'robots.txt']
        };
    });
};

/**
 * Update all SEO elements for a page
 */
export const updatePageSEO = (pageId) => {
    return Result.fromTry(() => {
        console.log(`[SEO] Updating SEO for page: ${pageId}`);
        
        // Update meta tags
        const metaResult = updateMetaTags(pageId);
        if (metaResult.type === 'Error') {
            throw new Error(`Failed to update meta tags: ${metaResult.error}`);
        }
        
        // Update structured data schemas
        const schemaResult = updatePageSchemas(pageId);
        if (schemaResult.type === 'Error') {
            throw new Error(`Failed to update schemas: ${schemaResult.error}`);
        }
        
        // Update browser history for proper canonical URLs
        updateBrowserHistory(pageId);
        
        // Track page view for analytics
        const analyticsResult = AnalyticsUtils.trackPageView(pageId, {
            seoMetaTags: metaResult.value,
            seoSchemas: schemaResult.value
        });
        
        console.log(`[SEO] Successfully updated SEO for page: ${pageId}`);
        console.log(`[SEO] Meta tags: ${metaResult.value}, Schemas: ${schemaResult.value}`);
        
        return {
            pageId,
            metaTags: metaResult.value,
            schemas: schemaResult.value,
            timestamp: new Date().toISOString()
        };
    });
};

/**
 * Update browser history for SEO-friendly URLs
 */
const updateBrowserHistory = (pageId) => {
    return Result.fromTry(() => {
        const pageConfig = getPageSEOConfig(pageId);
        const canonicalPath = pageConfig.canonical || '/';
        
        // Update URL without page reload
        if (window.history && window.history.pushState) {
            const currentPath = window.location.pathname;
            const newPath = canonicalPath === '/' ? '/' : canonicalPath;
            
            if (currentPath !== newPath) {
                window.history.pushState(
                    { pageId }, 
                    pageConfig.title, 
                    newPath
                );
            }
        }
        
        return canonicalPath;
    });
};

/**
 * Setup dynamic routes for sitemap.xml and robots.txt
 */
const setupDynamicRoutes = () => {
    // Since this is a client-side SPA, we'll provide these via service worker
    // or handle them in the navigation system
    
    // Register message handler for sitemap/robots requests
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SEO_REQUEST') {
                handleSEORequest(event.data.path, event.ports[0]);
            }
        });
    }
    
    // Also handle direct hash navigation for testing
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash === '#sitemap.xml') {
            downloadSitemap();
        } else if (hash === '#robots.txt') {
            downloadRobotsTxt();
        }
    });
};

/**
 * Handle SEO resource requests (sitemap.xml, robots.txt)
 */
const handleSEORequest = (path, port) => {
    let response;
    
    if (path === '/sitemap.xml') {
        const sitemapResult = serveSitemap();
        response = sitemapResult.type === 'Success' ? 
            { success: true, content: sitemapResult.value.content, mimeType: 'application/xml' } :
            { success: false, error: sitemapResult.error };
    } else if (path === '/robots.txt') {
        const robotsResult = serveRobotsTxt();
        response = robotsResult.type === 'Success' ? 
            { success: true, content: robotsResult.value.content, mimeType: 'text/plain' } :
            { success: false, error: robotsResult.error };
    } else {
        response = { success: false, error: 'Unknown SEO resource' };
    }
    
    if (port) {
        port.postMessage(response);
    }
};

/**
 * Download sitemap.xml file
 */
const downloadSitemap = () => {
    const sitemapResult = serveSitemap();
    if (sitemapResult.type === 'Success') {
        downloadFile(sitemapResult.value.content, 'sitemap.xml', 'application/xml');
    }
};

/**
 * Download robots.txt file
 */
const downloadRobotsTxt = () => {
    const robotsResult = serveRobotsTxt();
    if (robotsResult.type === 'Success') {
        downloadFile(robotsResult.value.content, 'robots.txt', 'text/plain');
    }
};

/**
 * Utility function to download files
 */
const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Get SEO status and health check
 */
export const getSEOHealth = () => {
    return Result.fromTry(() => {
        const health = {
            metaTags: {
                status: 'healthy',
                count: document.querySelectorAll('meta').length,
                hasDescription: !!document.querySelector('meta[name="description"]'),
                hasKeywords: !!document.querySelector('meta[name="keywords"]'),
                hasOG: !!document.querySelector('meta[property^="og:"]'),
                hasTwitter: !!document.querySelector('meta[name^="twitter:"]')
            },
            schemas: {
                status: 'healthy',
                count: document.querySelectorAll('script[type="application/ld+json"]').length,
                types: Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                    .map(script => {
                        try {
                            const data = JSON.parse(script.textContent);
                            return data['@type'] || 'Unknown';
                        } catch {
                            return 'Invalid';
                        }
                    })
            },
            navigation: {
                status: 'healthy',
                currentPage: window.location.pathname,
                canonicalUrl: document.querySelector('link[rel="canonical"]')?.href || 'Not set',
                title: document.title
            },
            performance: {
                loadTime: performance.now(),
                navigationTiming: performance.getEntriesByType('navigation')[0] || null
            }
        };
        
        // Determine overall health
        const issues = [];
        if (!health.metaTags.hasDescription) issues.push('Missing meta description');
        if (!health.metaTags.hasOG) issues.push('Missing Open Graph tags');
        if (health.schemas.count === 0) issues.push('No structured data found');
        if (health.navigation.canonicalUrl === 'Not set') issues.push('Missing canonical URL');
        
        health.overall = {
            status: issues.length === 0 ? 'healthy' : issues.length <= 2 ? 'warning' : 'critical',
            issues,
            score: Math.max(0, 100 - (issues.length * 20))
        };
        
        return health;
    });
};

/**
 * Validate current page SEO
 */
export const validatePageSEO = (pageId) => {
    return Result.fromTry(() => {
        const pageConfig = getPageSEOConfig(pageId);
        const validation = {
            title: {
                value: document.title,
                isValid: document.title.length > 0 && document.title.length <= 60,
                recommendation: 'Title should be 30-60 characters'
            },
            description: {
                value: document.querySelector('meta[name="description"]')?.content || '',
                isValid: false,
                recommendation: 'Description should be 120-160 characters'
            },
            keywords: {
                value: document.querySelector('meta[name="keywords"]')?.content || '',
                isValid: false,
                recommendation: 'Include 5-10 relevant keywords'
            },
            canonical: {
                value: document.querySelector('link[rel="canonical"]')?.href || '',
                isValid: false,
                recommendation: 'Every page should have a canonical URL'
            },
            openGraph: {
                title: document.querySelector('meta[property="og:title"]')?.content || '',
                description: document.querySelector('meta[property="og:description"]')?.content || '',
                image: document.querySelector('meta[property="og:image"]')?.content || '',
                isValid: false,
                recommendation: 'Include complete Open Graph tags'
            }
        };
        
        // Validate description
        const desc = validation.description.value;
        validation.description.isValid = desc.length >= 120 && desc.length <= 160;
        
        // Validate keywords
        const keywords = validation.keywords.value;
        validation.keywords.isValid = keywords.length > 0 && keywords.split(',').length >= 3;
        
        // Validate canonical
        validation.canonical.isValid = validation.canonical.value.length > 0;
        
        // Validate Open Graph
        validation.openGraph.isValid = 
            validation.openGraph.title.length > 0 &&
            validation.openGraph.description.length > 0 &&
            validation.openGraph.image.length > 0;
        
        // Calculate overall score
        const validationKeys = ['title', 'description', 'keywords', 'canonical', 'openGraph'];
        const validCount = validationKeys.filter(key => validation[key].isValid).length;
        const score = Math.round((validCount / validationKeys.length) * 100);
        
        validation.overall = {
            score,
            status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'needs-improvement' : 'poor',
            validCount,
            totalChecks: validationKeys.length
        };
        
        return validation;
    });
};

/**
 * Export all SEO functions for external use
 */
export {
    updateMetaTags,
    getPageSEOConfig,
    SEO_CONFIG
} from './meta-tags.js';

export {
    generateSitemapXML,
    generateRobotsTxt,
    serveSitemap,
    serveRobotsTxt
} from './sitemap.js';

export * from './schema.js';

export {
    PerformanceUtils,
    ContentUtils,
    AnalyticsUtils,
    SocialUtils,
    initSEOUtils
} from './utils.js';

// Initialize SEO system when module loads
console.log('[SEO] Loading SEO management system...'); 