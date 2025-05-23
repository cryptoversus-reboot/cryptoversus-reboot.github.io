// SEO Utility Functions
import Result from '../types/result.js';
import Maybe from '../types/maybe.js';

/**
 * Performance optimization utilities for SEO
 */
export const PerformanceUtils = {
    
    /**
     * Lazy load images for better page speed
     */
    lazyLoadImages: () => {
        return Result.fromTry(() => {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });

                return 'Lazy loading initialized';
            } else {
                // Fallback for browsers without IntersectionObserver
                document.querySelectorAll('img[data-src]').forEach(img => {
                    img.src = img.dataset.src;
                });
                return 'Lazy loading fallback applied';
            }
        });
    },

    /**
     * Preload critical resources
     */
    preloadCriticalResources: (resources = []) => {
        return Result.fromTry(() => {
            const defaultResources = [
                { href: 'https://cdn.tailwindcss.com', as: 'style' },
                { href: '/cryptoversus-reboot_logo.png', as: 'image' }
            ];

            const allResources = [...defaultResources, ...resources];
            let preloadedCount = 0;

            allResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                
                if (resource.type) {
                    link.type = resource.type;
                }
                
                document.head.appendChild(link);
                preloadedCount++;
            });

            return `Preloaded ${preloadedCount} resources`;
        });
    },

    /**
     * Monitor Core Web Vitals
     */
    monitorCoreWebVitals: () => {
        return Result.fromTry(() => {
            const vitals = {
                FCP: null, // First Contentful Paint
                LCP: null, // Largest Contentful Paint
                CLS: null, // Cumulative Layout Shift
                FID: null  // First Input Delay
            };

                         // Monitor with Performance Observer if available
             if ('PerformanceObserver' in window) {
                 // LCP
                 new PerformanceObserver((entryList) => {
                     const entries = entryList.getEntries();
                     vitals.LCP = entries[entries.length - 1].startTime;
                     
                     // Track to Google Analytics
                     if (typeof gtag === 'function') {
                         gtag('event', 'web_vital', {
                             event_category: 'Web Vitals',
                             event_label: 'LCP',
                             value: Math.round(vitals.LCP)
                         });
                     }
                 }).observe({ entryTypes: ['largest-contentful-paint'] });

                 // FID
                 new PerformanceObserver((entryList) => {
                     const entries = entryList.getEntries();
                     vitals.FID = entries[0].processingStart - entries[0].startTime;
                     
                     // Track to Google Analytics
                     if (typeof gtag === 'function') {
                         gtag('event', 'web_vital', {
                             event_category: 'Web Vitals',
                             event_label: 'FID',
                             value: Math.round(vitals.FID)
                         });
                     }
                 }).observe({ entryTypes: ['first-input'] });

                 // CLS
                 new PerformanceObserver((entryList) => {
                     let cls = 0;
                     entryList.getEntries().forEach(entry => {
                         if (!entry.hadRecentInput) {
                             cls += entry.value;
                         }
                     });
                     vitals.CLS = cls;
                     
                     // Track to Google Analytics
                     if (typeof gtag === 'function') {
                         gtag('event', 'web_vital', {
                             event_category: 'Web Vitals',
                             event_label: 'CLS',
                             value: Math.round(vitals.CLS * 1000) // Convert to integer
                         });
                     }
                 }).observe({ entryTypes: ['layout-shift'] });
             }

            // FCP from navigation timing
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                vitals.FCP = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            });

            return vitals;
        });
    }
};

/**
 * Content optimization utilities
 */
export const ContentUtils = {
    
    /**
     * Generate meta description from content
     */
    generateMetaDescription: (content, maxLength = 155) => {
        return Result.fromTry(() => {
            if (!content || typeof content !== 'string') {
                throw new Error('Content must be a non-empty string');
            }

            // Clean HTML tags
            const cleanContent = content.replace(/<[^>]*>/g, ' ');
            
            // Remove extra whitespace
            const normalizedContent = cleanContent.replace(/\s+/g, ' ').trim();
            
            // Truncate to max length
            if (normalizedContent.length <= maxLength) {
                return normalizedContent;
            }
            
            // Find the last complete sentence within limit
            const truncated = normalizedContent.substring(0, maxLength);
            const lastSentence = truncated.lastIndexOf('.');
            const lastSpace = truncated.lastIndexOf(' ');
            
            const cutPoint = lastSentence > 0 ? lastSentence + 1 : lastSpace;
            
            return cutPoint > 0 ? 
                normalizedContent.substring(0, cutPoint).trim() + '...' :
                truncated.trim() + '...';
        });
    },

    /**
     * Extract keywords from content
     */
    extractKeywords: (content, maxKeywords = 10) => {
        return Result.fromTry(() => {
            if (!content || typeof content !== 'string') {
                throw new Error('Content must be a non-empty string');
            }

            // Common stop words to filter out
            const stopWords = new Set([
                'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
                'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
                'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'
            ]);

            // Clean and normalize content
            const cleanContent = content
                .replace(/<[^>]*>/g, ' ')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Count word frequency
            const wordCount = {};
            cleanContent.split(' ').forEach(word => {
                if (word.length > 2 && !stopWords.has(word)) {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                }
            });

            // Sort by frequency and return top keywords
            const keywords = Object.entries(wordCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, maxKeywords)
                .map(([word]) => word);

            return keywords;
        });
    },

    /**
     * Validate content for SEO best practices
     */
    validateContent: (content) => {
        return Result.fromTry(() => {
            const validation = {
                wordCount: 0,
                headings: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
                images: { total: 0, withAlt: 0, withoutAlt: 0 },
                links: { internal: 0, external: 0 },
                issues: [],
                score: 0
            };

            if (!content) {
                validation.issues.push('Content is empty');
                return validation;
            }

            // Word count
            const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            validation.wordCount = textContent.split(' ').length;

            // Check word count
            if (validation.wordCount < 300) {
                validation.issues.push('Content is too short (< 300 words)');
            } else if (validation.wordCount > 2000) {
                validation.issues.push('Content might be too long (> 2000 words)');
            }

            // Count headings
            const headingMatches = content.match(/<h[1-6][^>]*>/gi) || [];
            headingMatches.forEach(heading => {
                const level = heading.match(/h([1-6])/i)[1];
                validation.headings[`h${level}`]++;
            });

            // Check heading structure
            if (validation.headings.h1 === 0) {
                validation.issues.push('Missing H1 heading');
            } else if (validation.headings.h1 > 1) {
                validation.issues.push('Multiple H1 headings found');
            }

            // Count images and alt text
            const imageMatches = content.match(/<img[^>]*>/gi) || [];
            validation.images.total = imageMatches.length;
            
            imageMatches.forEach(img => {
                if (img.includes('alt=')) {
                    validation.images.withAlt++;
                } else {
                    validation.images.withoutAlt++;
                }
            });

            if (validation.images.withoutAlt > 0) {
                validation.issues.push(`${validation.images.withoutAlt} images missing alt text`);
            }

            // Calculate score
            let score = 100;
            score -= validation.issues.length * 10;
            score = Math.max(0, score);
            validation.score = score;

            return validation;
        });
    }
};

/**
 * Analytics and tracking utilities
 */
export const AnalyticsUtils = {
    
         /**
      * Track page views for SEO analytics
      */
     trackPageView: (pageId, additionalData = {}) => {
         return Result.fromTry(() => {
             const pageViewData = {
                 pageId,
                 url: window.location.href,
                 title: document.title,
                 timestamp: new Date().toISOString(),
                 userAgent: navigator.userAgent,
                 referrer: document.referrer,
                 viewport: {
                     width: window.innerWidth,
                     height: window.innerHeight
                 },
                 ...additionalData
             };

             // Send to Google Analytics if available
             if (typeof gtag === 'function') {
                 gtag('event', 'page_view', {
                     page_title: pageViewData.title,
                     page_location: pageViewData.url,
                     page_id: pageViewData.pageId,
                     custom_parameter_1: additionalData.seoMetaTags || 0,
                     custom_parameter_2: additionalData.seoSchemas || 0
                 });
                 
                 // Also send a custom SEO event
                 gtag('event', 'seo_page_change', {
                     event_category: 'SEO',
                     event_label: pageId,
                     value: (additionalData.seoMetaTags || 0) + (additionalData.seoSchemas || 0)
                 });
             }

             // Store in session storage for analytics
             const existingData = JSON.parse(sessionStorage.getItem('seo_analytics') || '[]');
             existingData.push(pageViewData);
             
             // Keep only last 50 page views
             const recentData = existingData.slice(-50);
             sessionStorage.setItem('seo_analytics', JSON.stringify(recentData));

             console.log('[SEO Analytics] Page view tracked:', pageViewData);
             return pageViewData;
         });
     },

    /**
     * Get analytics data
     */
    getAnalyticsData: () => {
        return Result.fromTry(() => {
            const data = JSON.parse(sessionStorage.getItem('seo_analytics') || '[]');
            
            const stats = {
                totalPageViews: data.length,
                uniquePages: [...new Set(data.map(item => item.pageId))].length,
                mostViewedPage: null,
                averageSessionDuration: 0,
                topReferrers: {}
            };

            if (data.length > 0) {
                // Most viewed page
                const pageCounts = {};
                data.forEach(item => {
                    pageCounts[item.pageId] = (pageCounts[item.pageId] || 0) + 1;
                });
                stats.mostViewedPage = Object.entries(pageCounts)
                    .sort(([,a], [,b]) => b - a)[0][0];

                // Top referrers
                data.forEach(item => {
                    if (item.referrer) {
                        const domain = new URL(item.referrer).hostname;
                        stats.topReferrers[domain] = (stats.topReferrers[domain] || 0) + 1;
                    }
                });

                // Average session duration (simplified)
                if (data.length > 1) {
                    const firstView = new Date(data[0].timestamp);
                    const lastView = new Date(data[data.length - 1].timestamp);
                    stats.averageSessionDuration = (lastView - firstView) / data.length;
                }
            }

                         return { rawData: data, stats };
         });
     },

     /**
      * Track SEO performance events to Google Analytics
      */
     trackSEOEvent: (eventName, eventData = {}) => {
         return Result.fromTry(() => {
             if (typeof gtag === 'function') {
                 gtag('event', eventName, {
                     event_category: 'SEO Performance',
                     event_label: eventData.pageId || 'unknown',
                     value: eventData.value || 1,
                     custom_parameter_1: eventData.metaTags || 0,
                     custom_parameter_2: eventData.schemas || 0,
                     custom_parameter_3: eventData.performanceScore || 0
                 });
                 
                 console.log('[SEO Analytics] Event tracked to GA:', eventName, eventData);
                 return { eventName, eventData, sent: true };
             } else {
                 console.warn('[SEO Analytics] Google Analytics not available');
                 return { eventName, eventData, sent: false };
             }
         });
     },

     /**
      * Track Core Web Vitals to Google Analytics
      */
     trackWebVitals: (vitalsData) => {
         return Result.fromTry(() => {
             if (typeof gtag === 'function' && vitalsData) {
                 // Track individual vitals
                 Object.entries(vitalsData).forEach(([metric, value]) => {
                     if (value !== null && value !== undefined) {
                         gtag('event', 'web_vital', {
                             event_category: 'Web Vitals',
                             event_label: metric,
                             value: Math.round(value),
                             custom_parameter_1: metric
                         });
                     }
                 });
                 
                 console.log('[SEO Analytics] Web Vitals tracked to GA:', vitalsData);
                 return { vitalsData, sent: true };
             } else {
                 return { vitalsData, sent: false };
             }
         });
     }
 };

/**
 * Social media integration utilities
 */
export const SocialUtils = {
    
    /**
     * Generate social sharing URLs
     */
    generateSharingUrls: (pageConfig) => {
        return Result.fromTry(() => {
            const { title, description, url, image } = pageConfig;
            const encodedUrl = encodeURIComponent(url);
            const encodedTitle = encodeURIComponent(title);
            const encodedDescription = encodeURIComponent(description);

            return {
                twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=cryptoversus`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
                reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
                email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
            };
        });
    },

    /**
     * Add social sharing buttons to page
     */
    addSharingButtons: (containerId, pageConfig) => {
        return Result.fromTry(() => {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container with id ${containerId} not found`);
            }

            const sharingUrlsResult = SocialUtils.generateSharingUrls(pageConfig);
            if (sharingUrlsResult.type === 'Error') {
                throw sharingUrlsResult.error;
            }

            const urls = sharingUrlsResult.value;
            const socialButtons = Object.entries(urls).map(([platform, url]) => {
                const button = document.createElement('a');
                button.href = url;
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
                button.className = `social-share-${platform}`;
                button.textContent = `Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
                return button;
            });

            socialButtons.forEach(button => container.appendChild(button));
            return `Added ${socialButtons.length} sharing buttons`;
        });
    }
};

/**
 * Main utility initialization
 */
export const initSEOUtils = () => {
    return Result.fromTry(() => {
        console.log('[SEO Utils] Initializing SEO utilities...');
        
        // Initialize performance monitoring
        const vitalsResult = PerformanceUtils.monitorCoreWebVitals();
        
        // Initialize lazy loading
        PerformanceUtils.lazyLoadImages();
        
        // Preload critical resources
        PerformanceUtils.preloadCriticalResources();
        
        console.log('[SEO Utils] SEO utilities initialized successfully');
        return {
            performance: vitalsResult.value,
            features: ['lazy-loading', 'preloading', 'analytics', 'social-sharing']
        };
    });
}; 