#!/usr/bin/env node
/**
 * Automated Sitemap Generator
 * Generates sitemap.xml based on routes configuration
 * Runs automatically during build process
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  hostname: 'https://passportphotomaker.com',
  outDir: path.join(__dirname, '../build'),
  routes: [
    {
      path: '/',
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    },
    // Add more routes here as you create them:
    // {
    //   path: '/privacy',
    //   changefreq: 'monthly',
    //   priority: 0.5,
    //   lastmod: new Date().toISOString().split('T')[0],
    // },
    // {
    //   path: '/terms',
    //   changefreq: 'monthly',
    //   priority: 0.5,
    //   lastmod: new Date().toISOString().split('T')[0],
    // },
  ],
};

/**
 * Generate sitemap XML
 */
function generateSitemapXML(routes, hostname) {
  const urlEntries = routes
    .map((route) => {
      return `  <url>
    <loc>${hostname}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🗺️  Generating automated sitemap...');

    // Ensure build directory exists
    if (!fs.existsSync(config.outDir)) {
      fs.mkdirSync(config.outDir, { recursive: true });
    }

    // Generate sitemap XML
    const sitemapContent = generateSitemapXML(config.routes, config.hostname);

    // Write sitemap to build directory
    const sitemapPath = path.join(config.outDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📍 Location: ${sitemapPath}`);
    console.log(`   📄 Routes: ${config.routes.length}`);
    console.log(`   🌐 Hostname: ${config.hostname}`);
    console.log('');

    // Show routes
    console.log('   Routes included:');
    config.routes.forEach((route) => {
      console.log(`   - ${route.path} (priority: ${route.priority}, changefreq: ${route.changefreq})`);
    });

    return true;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateSitemapXML, config };
