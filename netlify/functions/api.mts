import { getUser, verifyRequestOrigin } from '@netlify/identity';
import { eq, desc } from 'drizzle-orm';
import { database } from '../../db/index.js';
import { products, preferences, events, settings } from '../../db/schema.js';
import { initialProducts, contentFields } from '../../src/data.js';
export default async (req: Request) => {
 try {
 if(req.method==='POST'){try{verifyRequestOrigin(req);}catch{return Response.json({error:'Request origin is not allowed.'},{status:403});}}
 const db=database(); const url=new URL(req.url); const action=url.searchParams.get('action')||'catalog';
 const user=await getUser(); const admin=user?.roles?.includes('admin');
 if(req.method==='GET') {
  if(action==='heat') return Response.json(await getHeat(db));
  if(action==='catalog') { await db.insert(products).values(initialProducts.map(p=>({id:p.id,data:p}))).onConflictDoNothing(); const list=await db.select().from(products); const config=await db.select().from(settings); return Response.json({products:list.map(p=>p.data),settings:config.find(s=>s.id==='social')?.data||{},content:config.find(s=>s.id==='content')?.data||{},heat:await getHeat(db)}); }
  if(!user) return Response.json({error:'Please sign in first.'},{status:401});
  if(action==='preferences') {const rows=await db.select().from(preferences).where(eq(preferences.userId,user.id)); return Response.json(rows[0]?.data||{saved:[],alerts:[],votes:{},history:[],alertPrices:{}});}
  if(action==='admin'&&admin) return Response.json(await db.select().from(events).orderBy(desc(events.createdAt)).limit(1000));
  return Response.json({error:'Admin access is required.'},{status:403});
 }
 if(req.method!=='POST') return new Response('Method not allowed',{status:405});
 const body=await req.json();
 if(action==='click') {if(!platformValid(body.platform)) return Response.json({error:'Invalid platform'},{status:400}); await db.insert(events).values({id:crypto.randomUUID(),kind:'click',data:{product:String(body.product).slice(0,100),platform:body.platform}});return Response.json({ok:true});}
 if(!user) return Response.json({error:'Please sign in first.'},{status:401});
 if(action==='preferences') {const data={alertPrices:body.alertPrices||{},saved:body.saved?.slice(0,500)||[],alerts:body.alerts?.slice(0,500)||[],votes:body.votes||{},history:body.history?.slice(0,50)||[]};await db.insert(preferences).values({userId:user.id,data}).onConflictDoUpdate({target:preferences.userId,set:{data}});return Response.json(data);}
 if(action==='submit'||action==='report') {if(!body.title||String(body.title).length>1000) return Response.json({error:'Please enter a valid description.'},{status:400});await db.insert(events).values({id:crypto.randomUUID(),userId:user.id,kind:action,data:{...body,username:user.name||'Community member',status:'pending'}});return Response.json({ok:true});}
 if(!admin) return Response.json({error:'Admin access is required.'},{status:403});
 if(action==='product') {
  if(typeof body.id!=='string'||!body.id||body.id.length>100||typeof body.title!=='string'||!body.title.trim()||body.title.length>300||typeof body.image!=='string'||!body.image||!Array.isArray(body.prices)||body.prices.length!==3||body.prices.some((p:any)=>!Number.isFinite(p)||p<=0)||!Array.isArray(body.links)||body.links.length!==3||!Number.isFinite(body.rating)||body.rating<0||body.rating>5||!Number.isInteger(body.reviews)||body.reviews<0||!['Girls Kurtis','Boys Wear','Gadgets','Accessories'].includes(body.category)||!['Loot Price','Good Deal'].includes(body.badge)||!['peach','mint','lavender','cream'].includes(body.color)||typeof body.tip!=='string'||body.tip.length>1000||body.reelCode!==undefined&&(typeof body.reelCode!=='string'||!body.reelCode.trim()||body.reelCode.length>100)) return Response.json({error:'Check the product name, category, prices, rating, review count and Reel code.'},{status:400});
  if([body.image,...body.links,body.reel].filter(Boolean).some(link=>!validWebUrl(link)))return Response.json({error:'Use valid HTTP or HTTPS photo, video and affiliate URLs.'},{status:400});
  const data={id:body.id,title:body.title.trim(),image:body.image,category:body.category,prices:body.prices,links:body.links,tip:body.tip,rating:body.rating,reviews:body.reviews,badge:body.badge,reel:body.reel||'',reelCode:body.reelCode||body.id,color:body.color,viral:!!body.viral,sample:false};
  await db.insert(products).values({id:body.id,data}).onConflictDoUpdate({target:products.id,set:{data}});return Response.json({ok:true});
 }
 if(action==='content') {
  const data:Record<string,string>={};
  for(const [key,,fallback,type] of contentFields){const value=body[key];if(typeof value!=='string'||!value.trim()||value.length>(type==='url'?2000:1000)||type==='url'&&!validWebUrl(value,true))return Response.json({error:'Enter all website details and valid HTTPS photo URLs.'},{status:400});data[key]=value.trim();}
  await db.insert(settings).values({id:'content',data}).onConflictDoUpdate({target:settings.id,set:{data}});return Response.json({ok:true});
 }
 if(action==='settings'){const data={};for(const key of ['youtube','instagram','telegram','whatsapp']) {if(body[key]&&!validWebUrl(body[key],true))return Response.json({error:'Use HTTPS links.'},{status:400});data[key]=body[key]||'';}await db.insert(settings).values({id:'social',data}).onConflictDoUpdate({target:settings.id,set:{data}});return Response.json({ok:true});}
 if(action==='moderate'){const row=await db.select().from(events).where(eq(events.id,body.id));if(!row[0])return new Response('Not found',{status:404});await db.update(events).set({data:{...row[0].data as object,status:body.status==='approved'?'approved':'dismissed'}}).where(eq(events.id,body.id));return Response.json({ok:true});}
 return new Response('Not found',{status:404});
 }catch {return Response.json({error:'Unable to connect right now. Please try again shortly.'},{status:503});}
};
async function getHeat(db:ReturnType<typeof database>){const rows=await db.select().from(preferences);const heat:Record<string,{hot:number,not:number}>={};for(const row of rows){for(const [id,vote] of Object.entries((row.data as any).votes||{})){if(vote!=='hot'&&vote!=='not')continue;heat[id]??={hot:0,not:0};heat[id][vote]++;}}return heat;}
function platformValid(p:string){return ['Amazon','Flipkart','Meesho'].includes(p);}
export const config={path:'/api/store'};

function validWebUrl(value:unknown,httpsOnly=false){try{if(typeof value!=='string'||value.length>2000)return false;const url=new URL(value);return (httpsOnly?url.protocol==='https:':['https:','http:'].includes(url.protocol))&&!url.username&&!url.password;}catch{return false;}}
