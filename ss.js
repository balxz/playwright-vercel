import express from 'express';
import { chromium } from 'playwright';

const app = express();
app.use(express.json());

app.get('/api/screenshot', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing url query param');

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    const screenshot = await page.screenshot();

    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error taking screenshot');
  } finally {
    if (browser) await browser.close();
  }
});

export default app;
