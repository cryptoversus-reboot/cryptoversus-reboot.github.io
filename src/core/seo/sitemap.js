// XML Sitemap Generator
import Result from '../types/result.js';
import { SEO_CONFIG, PAGE_SEO_CONFIG } from './meta-tags.js';

/**
 * Site structure definition for sitemap generation
 */
export const SITE_STRUCTURE = {
    pages: [
        {
            url: '/',
            priority: 1.0,
            changefreq: 'daily',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: '/services',
            priority: 0.9,
            changefreq: 'weekly',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: '/about',
            priority: 0.8,
            changefreq: 'monthly',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: '/contact',
            priority: 0.8,
            changefreq: 'monthly',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: '/faqs',
            priority: 0.7,
            changefreq: 'weekly',
            lastmod: new Date().toISOString().split('T')[0]
        },
        {
            url: '/mission',
            priority: 0.6,
            changefreq: 'monthly',
            lastmod: new Date().toISOString().split('T')[0]
        }
    ],
    // Future: Add blog posts, case studies, etc.
    dynamicPages: [
        // Example: Blog posts, service detail pages, etc.
        // These would be populated dynamically in a real application
    ]
};

/**
 * Generate XML sitemap content
 */
export const generateSitemapXML = () => {
    return Result.fromTry(() => {
        const baseUrl = SEO_CONFIG.siteUrl;
        const allPages = [...SITE_STRUCTURE.pages, ...SITE_STRUCTURE.dynamicPages];
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        allPages.forEach(page => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
            xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        });
        
        xml += '</urlset>';
        
        return xml;
    });
};

/**
 * Generate robots.txt content
 */
export const generateRobotsTxt = () => {
    return Result.fromTry(() => {
        const baseUrl = SEO_CONFIG.siteUrl;
        
        let robotsTxt = 'User-agent: *\n';
        robotsTxt += 'Allow: /\n\n';
        
        // Disallow certain paths if needed
        robotsTxt += '# Disallow development and admin paths\n';
        robotsTxt += 'Disallow: /admin/\n';
        robotsTxt += 'Disallow: /dev/\n';
        robotsTxt += 'Disallow: /tests/\n';
        robotsTxt += 'Disallow: *.js$\n';
        robotsTxt += 'Disallow: /src/\n\n';
        
        // Add sitemap location
        robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
        
        return robotsTxt;
    });
};

/**
 * Create and serve sitemap.xml dynamically
 */
export const serveSitemap = () => {
    return Result.fromTry(() => {
        const sitemapResult = generateSitemapXML();
        
        if (sitemapResult.type === 'Error') {
            throw new Error('Failed to generate sitemap');
        }
        
        // Create a blob URL for the sitemap
        const blob = new Blob([sitemapResult.value], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        return {
            content: sitemapResult.value,
            url: url,
            mimeType: 'application/xml'
        };
    });
};

/**
 * Create and serve robots.txt dynamically
 */
export const serveRobotsTxt = () => {
    return Result.fromTry(() => {
        const robotsResult = generateRobotsTxt();
        
        if (robotsResult.type === 'Error') {
            throw new Error('Failed to generate robots.txt');
        }
        
        // Create a blob URL for robots.txt
        const blob = new Blob([robotsResult.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        return {
            content: robotsResult.value,
            url: url,
            mimeType: 'text/plain'
        };
    });
};

/**
 * Add page to sitemap (for dynamic content)
 */
export const addPageToSitemap = (pageInfo) => {
    return Result.fromTry(() => {
        if (!pageInfo.url) {
            throw new Error('Page URL is required');
        }
        
        const newPage = {
            url: pageInfo.url,
            priority: pageInfo.priority || 0.5,
            changefreq: pageInfo.changefreq || 'monthly',
            lastmod: pageInfo.lastmod || new Date().toISOString().split('T')[0]
        };
        
        // Check if page already exists
        const existingIndex = SITE_STRUCTURE.dynamicPages.findIndex(page => page.url === newPage.url);
        
        if (existingIndex >= 0) {
            // Update existing page
            SITE_STRUCTURE.dynamicPages[existingIndex] = newPage;
        } else {
            // Add new page
            SITE_STRUCTURE.dynamicPages.push(newPage);
        }
        
        return newPage;
    });
};

/**
 * Remove page from sitemap
 */
export const removePageFromSitemap = (url) => {
    return Result.fromTry(() => {
        const index = SITE_STRUCTURE.dynamicPages.findIndex(page => page.url === url);
        
        if (index >= 0) {
            const removedPage = SITE_STRUCTURE.dynamicPages.splice(index, 1)[0];
            return removedPage;
        }
        
        throw new Error(`Page with URL ${url} not found in sitemap`);
    });
};

/**
 * Get sitemap statistics
 */
export const getSitemapStats = () => {
    return Result.fromTry(() => {
        const totalPages = SITE_STRUCTURE.pages.length + SITE_STRUCTURE.dynamicPages.length;
        const staticPages = SITE_STRUCTURE.pages.length;
        const dynamicPages = SITE_STRUCTURE.dynamicPages.length;
        
        const priorityDistribution = {};
        const changefreqDistribution = {};
        
        [...SITE_STRUCTURE.pages, ...SITE_STRUCTURE.dynamicPages].forEach(page => {
            // Priority distribution
            const priority = page.priority.toString();
            priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1;
            
            // Change frequency distribution
            changefreqDistribution[page.changefreq] = (changefreqDistribution[page.changefreq] || 0) + 1;
        });
        
        return {
            totalPages,
            staticPages,
            dynamicPages,
            priorityDistribution,
            changefreqDistribution,
            lastGenerated: new Date().toISOString()
        };
    });
};

/**
 * Validate sitemap structure
 */
export const validateSitemap = () => {
    return Result.fromTry(() => {
        const allPages = [...SITE_STRUCTURE.pages, ...SITE_STRUCTURE.dynamicPages];
        const errors = [];
        const warnings = [];
        
        // Check for duplicate URLs
        const urls = allPages.map(page => page.url);
        const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
        if (duplicates.length > 0) {
            errors.push(`Duplicate URLs found: ${duplicates.join(', ')}`);
        }
        
        // Validate each page
        allPages.forEach((page, index) => {
            if (!page.url) {
                errors.push(`Page ${index}: Missing URL`);
            }
            
            if (!page.url.startsWith('/')) {
                warnings.push(`Page ${index}: URL should start with /`);
            }
            
            if (page.priority < 0 || page.priority > 1) {
                errors.push(`Page ${index}: Priority must be between 0 and 1`);
            }
            
            const validChangeFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
            if (!validChangeFreqs.includes(page.changefreq)) {
                errors.push(`Page ${index}: Invalid changefreq value`);
            }
            
            // Validate lastmod date format
            if (page.lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(page.lastmod)) {
                warnings.push(`Page ${index}: lastmod should be in YYYY-MM-DD format`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            totalPages: allPages.length
        };
    });
};

/**
 * Initialize sitemap service
 */
export const initSitemapService = () => {
    return Result.fromTry(() => {
        // Validate sitemap on initialization
        const validationResult = validateSitemap();
        
        if (validationResult.type === 'Error') {
            throw new Error('Sitemap service initialization failed');
        }
        
        if (!validationResult.value.isValid) {
            console.warn('[Sitemap] Validation warnings:', validationResult.value);
        }
        
        console.log('[Sitemap] Service initialized successfully');
        console.log('[Sitemap] Stats:', getSitemapStats().value);
        
        return {
            stats: getSitemapStats().value,
            validation: validationResult.value
        };
    });
};

/**
 * Export sitemap as downloadable file
 */
export const downloadSitemap = () => {
    return Result.fromTry(() => {
        const sitemapResult = generateSitemapXML();
        
        if (sitemapResult.type === 'Error') {
            throw new Error('Failed to generate sitemap for download');
        }
        
        const blob = new Blob([sitemapResult.value], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sitemap.xml';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return 'Sitemap downloaded successfully';
    });
}; 