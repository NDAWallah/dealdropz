# DealDropz

A responsive React and Tailwind storefront for discovering fashion and viral finds, comparing three retailers, and sharing deals with a community.

## Development

Install dependencies with `npm install`, then start `netlify dev --port 8889`. Run `npm run check` for server type checks and `npm test` for browser and access-control checks with the development server running. Browser tests require Playwright Chromium (`npx playwright install chromium`).

## Store owner setup

Email authentication uses Netlify Identity. Invite the first owner through the site's Identity dashboard, accept the invitation, then assign that user the `admin` role. The dashboard button is visible to visitors, but all product changes, analytics and moderation are protected on the server.

Enable Google in Identity's external provider settings to display the Google sign-in button. The application reads provider settings rather than displaying an unavailable sign-in option.

Use the owner dashboard to replace the eight sample products with actual product images, checked retailer prices, affiliate URLs and optional direct MP4 Reel URLs. Prices are owner-maintained comparisons; the application does not scrape retailers. The lowest-price highlight and savings comparison are calculated from the three entered prices. Sample products have disabled purchase redirects and clearly labeled sample pricing. Real store redirects open in a new tab and record retailer click analytics.

Add official YouTube, Instagram, Telegram and WhatsApp destinations in the dashboard's Community tab. Until configured, community buttons explain that the destination is coming soon.

Community deal submissions and reports enter the moderation queue. Approved finds can be curated into the storefront with the product editor. Saved items, browsing history, votes, price watchlists, products, community links, reports and clicks persist in Netlify Database. The schema and generated migration are included; Netlify applies migrations on deploy. No local-storage database or external database is used.

Price alerts are in-app watchlists. When owners update prices, returning shoppers can see the amount dropped from their saved watch price under Account → My price alerts. Email, SMS and push notification delivery are not configured.

## Validation

Three Playwright checks cover desktop shopping interactions, mobile viewport overflow and category filtering, and rejection of signed-out or cross-origin protected writes. Server code passes TypeScript checks. Authenticated persistence and database-backed catalog operations require deployment with the generated migration; those end-to-end flows were not verified locally.
