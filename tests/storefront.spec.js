import {test,expect} from '@playwright/test';
test('search, categories, sorting, saved finds and sample product actions',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8889');
 await expect(page.getByRole('heading',{level:1})).toContainText('Big on style.');
 await expect(page.locator('.product-card')).toHaveCount(8);
 await page.locator('.search input').fill('#105');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.locator('.search input').fill('');
 await page.locator('.deal-tabs').getByRole('button',{name:'Girls Kurtis',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(2);
 await page.locator('.deal-tabs').getByRole('button',{name:'All drops',exact:true}).click();
 await page.getByLabel('Sort products').selectOption('Price: low to high');
 await expect(page.locator('.product-card').first()).toContainText('Minimal Gold');
 await page.locator('.product-card').first().getByLabel('Save to wishlist').click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('.product-card').first().getByRole('button',{name:'Grab this deal'}).click();await expect(page.getByRole('status')).toContainText('sample find');
 await page.locator('.product-card').first().getByRole('button',{name:'Watch Reel'}).click();await expect(page.getByRole('dialog')).toContainText('Reel preview coming soon');await page.keyboard.press('Escape');
 await page.screenshot({path:'/tmp/dealdropz-desktop.png',fullPage:true});
 expect(errors).toEqual([]);
});
test('mobile layout stays within viewport and navigation filters',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:8889');await expect(page.locator('.product-card')).toHaveCount(8);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'/tmp/dealdropz-mobile.png',fullPage:true});
 await page.locator('nav').getByRole('button',{name:'Under ₹199',exact:true}).click();await expect(page.locator('.product-card')).toHaveCount(2);
});
test('protected writes require login and reject other origins',async({request})=>{
 const denied=await request.post('http://localhost:8889/api/store?action=product',{headers:{Origin:'https://untrusted.example'},data:{title:'Test'}});expect(denied.status()).toBe(403);
 const signedOut=await request.post('http://localhost:8889/api/store?action=preferences',{headers:{Origin:'http://localhost:8889'},data:{saved:['105']}});expect(signedOut.status()).toBe(401);
});
