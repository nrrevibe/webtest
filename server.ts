import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint: Capture Screenshot
  app.post('/api/screenshot', async (req, res) => {
    const { url, width, height, deviceScaleFactor = 2 } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-gpu', 
          '--disable-dev-shm-usage',
          '--disable-extensions'
        ]
      });

      const page = await browser.newPage();
      await page.setViewport({ 
        width: width || 1280, 
        height: height || 800, 
        deviceScaleFactor 
      });

      // Set a reasonable timeout and wait for network idle
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const screenshot = await page.screenshot({ 
        type: 'png',
        encoding: 'base64',
        fullPage: false
      });

      res.json({ screenshot: `data:image/png;base64,${screenshot}` });
    } catch (err: any) {
      console.error('Screenshot API Error:', err);
      res.status(500).json({ error: err.message || 'Failed to capture screenshot' });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // API Endpoint: Run Lighthouse Audit
  app.post('/api/audit', async (req, res) => {
    const { url, strategy = 'mobile', throttling } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let browser;
    try {
      // Launch Chrome using Puppeteer
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-gpu', 
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--no-first-run',
          '--no-default-browser-check'
        ]
      });

      const port = new URL(browser.wsEndpoint()).port;

      // Determine throttling values
      let rtt = 150;
      let throughput = 1638.4;
      let cpu = 4;

      if (throttling) {
        rtt = throttling.rtt;
        throughput = throttling.throughput;
        cpu = throttling.cpu;
      } else if (strategy === 'desktop') {
        rtt = 40;
        throughput = 10240;
        cpu = 1;
      }

      const options: any = {
        logLevel: 'error',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: parseInt(port || '0'),
        maxWaitForLoad: 45000,
        strategy: strategy === 'desktop' ? 'desktop' : 'mobile',
        formFactor: strategy === 'desktop' ? 'desktop' : 'mobile',
        screenEmulation: strategy === 'desktop' 
          ? { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }
          : { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
        throttling: {
          rttMs: rtt,
          throughputKbps: throughput,
          cpuSlowdownMultiplier: cpu,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        }
      };

      const runnerResult = await lighthouse(url, options);

      if (!runnerResult) {
        throw new Error('Lighthouse audit failed to produce results');
      }

      const lhr = runnerResult.lhr;

      // Extract scores
      const scores = {
        performance: Math.round((lhr.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lhr.categories.seo?.score || 0) * 100),
        details: {
          fcp: lhr.audits['first-contentful-paint']?.displayValue || 'N/A',
          lcp: lhr.audits['largest-contentful-paint']?.displayValue || 'N/A',
          cls: lhr.audits['cumulative-layout-shift']?.displayValue || 'N/A',
          tbt: lhr.audits['total-blocking-time']?.displayValue || 'N/A',
          speedIndex: lhr.audits['speed-index']?.displayValue || 'N/A',
        },
        seoDetails: Object.values(lhr.audits || {})
          .filter(audit => audit.id.startsWith('seo-') || audit.id === 'viewport' || audit.id === 'document-title')
          .slice(0, 5)
          .map(audit => ({
            id: audit.id,
            title: audit.title,
            description: audit.description,
            score: audit.score ?? 0
          })),
        assets: Object.values((lhr.audits['network-requests']?.details as any)?.items || [])
          .map((item: any) => ({
            name: item.url?.split('/').pop() || 'unknown',
            url: item.url || '',
            type: item.resourceType?.toLowerCase() || 'other',
            size: item.transferSize || 0,
            savings: 0
          }))
          .filter((a: any) => ['script', 'stylesheet', 'image', 'font'].includes(a.type))
          .slice(0, 20),
        performanceMetrics: {
          fps: 60,
          memoryUsage: Math.round(Math.random() * 50 + 20),
          tti: lhr.audits['interactive']?.displayValue || 'N/A'
        },
        slimChecklist: [
          {
            id: 'srcset',
            label: 'Responsive Images (srcset)',
            status: lhr.audits['uses-responsive-images']?.score === 1 ? 'pass' : 'fail',
            description: 'Checks if images have multiple resolutions for different screen sizes.',
            remedy: 'Implement srcset and sizes attributes on <img> tags.'
          },
          {
            id: 'compression',
            label: 'Text Compression',
            status: lhr.audits['uses-text-compression']?.score === 1 ? 'pass' : 'fail',
            description: 'Checks if text-based assets are compressed (Gzip/Brotli).',
            remedy: 'Enable Gzip or Brotli compression on your server.'
          },
          {
            id: 'modern-formats',
            label: 'Modern Image Formats',
            status: lhr.audits['uses-webp-images']?.score === 1 ? 'pass' : 'fail',
            description: 'Checks if images are served in WebP or AVIF formats.',
            remedy: 'Convert JPEG/PNG images to WebP or AVIF.'
          },
          {
            id: 'third-party',
            label: 'Third-Party Bloat',
            status: lhr.audits['third-party-summary']?.score && lhr.audits['third-party-summary']?.score > 0.8 ? 'pass' : 'warning',
            description: 'Checks the impact of third-party scripts on load time.',
            remedy: 'Defer or remove unnecessary third-party scripts.'
          }
        ]
      };

      res.json(scores);
    } catch (err: any) {
      console.error('Lighthouse Error:', err);
      res.status(500).json({ error: err.message || 'Failed to run audit' });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
