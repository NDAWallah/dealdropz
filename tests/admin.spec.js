import {test,expect} from '@playwright/test';
import {initialProducts,defaultContent} from '../src/data.js';

test('owner edits website and product details, retains Reel links, and sees save failures',async({page})=>{
 let content={...defaultContent},products=structuredClone(initialProducts),fail=false;
 await page.route('**/@netlify_identity.js*',route=>route.fulfill({contentType:'text/javascript',body:`
 const owner={id:'test-owner',name:'Owner',roles:['admin']};
 export const getUser=async()=>owner,getSettings=async()=>({}),handleAuthCallback=async()=>null,onAuthChange=()=>()=>{};
 export const login=async()=>owner,signup=async()=>owner,logout=async()=>{},oauthLogin=()=>{},requestPasswordRecovery=async()=>{},updateUser=async()=>{},acceptInvite=async()=>owner;
 `}));
 await page.route('**/api/store?*',route=>{
  const action=new URL(route.request().url()).searchParams.get('action');
  const body=route.request().postDataJSON();
  if(body&&fail)return route.fulfill({status:503,json:{error:'Save unavailable. Try again.'}});
  if(action==='content'&&body)content=body;
  if(action==='product'&&body)products=products.map(p=>p.id===body.id?body:p);
  return route.fulfill({json:action==='catalog'?{products,settings:{},content}:action==='admin'?[]:action==='preferences'?{saved:[],alerts:[],votes:{},history:[],alertPrices:{}}:{ok:true}});
 });
 await page.goto('http://localhost:8889');
 await page.getByLabel('Admin dashboard').click();
 await page.getByRole('button',{name:'website',exact:true}).click();
 await page.getByLabel('Store name',{exact:true}).fill('DealDropz Studio');
 await page.getByLabel('Banner heading',{exact:true}).fill('Fresh fashion finds.');
 await page.getByRole('button',{name:'Save & publish website content'}).click();
 await expect(page.getByRole('status')).toContainText('published');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('heading',{level:1})).toContainText('Fresh fashion finds.');
 await page.reload();await expect(page.locator('header .brand')).toContainText('DealDropz Studio');
 await page.getByLabel('Admin dashboard').click();
 await page.getByRole('button',{name:'Edit',exact:false}).first().click();
 await page.getByLabel('Reel code',{exact:true}).fill('CUSTOM105');
 await page.getByLabel('Star rating').fill('4.8');
 await page.getByLabel('Review count').fill('123');
 await page.getByRole('button',{name:'Save product',exact:true}).click();
 await page.keyboard.press('Escape');
 await page.locator('.search input').fill('#CUSTOM105');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.locator('.search input').fill('#105');await expect(page.locator('.product-card')).toHaveCount(1);
 await page.getByLabel('Admin dashboard').click();await page.getByRole('button',{name:'website',exact:true}).click();
 fail=true;await page.getByRole('button',{name:'Save & publish website content'}).click();await expect(page.getByRole('alert')).toContainText('Save unavailable');
});

test('website publishing rejects signed-out users',async({request})=>{
 const result=await request.post('http://localhost:8889/api/store?action=content',{headers:{Origin:'http://localhost:8889'},data:defaultContent});
 expect(result.status()).toBe(401);
});
