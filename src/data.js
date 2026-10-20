export const photo = (id,w=700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
export const initialProducts = [
{id:'105',title:'Floral Cotton Kurti & Palazzo Set',category:'Girls Kurtis',image:photo('photo-1617627143750-d86bc21e42bb'),prices:[699,549,399],rating:4.6,reviews:1284,badge:'Loot Price',tip:'Extra ₹50 off with first order coupon',color:'peach',viral:true},
{id:'108',title:'Oversized Korean Streetwear Tee',category:'Boys Wear',image:photo('photo-1521572163474-6864f9cf17ab'),prices:[499,349,279],rating:4.4,reviews:862,badge:'Good Deal',tip:'Free delivery on Meesho',color:'mint',viral:true},
{id:'112',title:'Aesthetic Sunset Projection Lamp',category:'Gadgets',image:photo('photo-1507473885765-e6ed057f782c'),prices:[599,449,349],rating:4.5,reviews:2163,badge:'Loot Price',tip:'Check the ₹50 coupon on Amazon',color:'lavender',viral:true},
{id:'116',title:'Everyday Mini Shoulder Bag',category:'Accessories',image:photo('photo-1548036328-c9fa89d128fa'),prices:[399,299,189],rating:4.3,reviews:746,badge:'Loot Price',tip:'Under ₹199? Yes, you read that right.',color:'cream',viral:true},
{id:'120',title:'Sage Green Everyday Cotton Kurti',category:'Girls Kurtis',image:photo('photo-1610030469983-98e550d6193c'),prices:[899,749,499],rating:4.7,reviews:439,badge:'Good Deal',tip:'A little ethnic, a lot of everyday comfort',color:'mint'},
{id:'124',title:'Wireless Over-Ear Headphones',category:'Gadgets',image:photo('photo-1505740420928-5e560c06d30e'),prices:[1299,999,899],rating:4.6,reviews:931,badge:'Good Deal',tip:'Compare delivery charges before checkout',color:'cream',viral:true},
{id:'128',title:'Classic Everyday White Sneakers',category:'Boys Wear',image:photo('photo-1549298916-b41d501d3772'),prices:[899,699,599],rating:4.5,reviews:618,badge:'Good Deal',tip:'Your new go-with-everything pair',color:'peach'},
{id:'132',title:'Minimal Gold Layered Necklace',category:'Accessories',image:photo('photo-1611652022419-a9419f74343d'),prices:[349,249,149],rating:4.4,reviews:328,badge:'Loot Price',tip:'Style your whole outfit for less',color:'lavender'}
].map(p=>({...p,links:['','',''],reel:'',sample:true}));
export const platforms=['Amazon','Flipkart','Meesho'];
export const categories=[{name:'Girls Kurtis',label:'Girls Kurtis',image:'photo-1617627143750-d86bc21e42bb',color:'#fae8e1'},{name:'Boys Wear',label:'Boys Wear',image:'photo-1488161628813-04466f872be2',color:'#e6efeb'},{name:'Viral Reels',label:'Viral Reels',image:'photo-1548036328-c9fa89d128fa',color:'#ede5f4'},{name:'Gadgets',label:'Cool Gadgets',image:'photo-1505740420928-5e560c06d30e',color:'#f7edcb'},{name:'Accessories',label:'Accessories',image:'photo-1611652022419-a9419f74343d',color:'#f5e2e4'},{name:'Under ₹199',label:'Under ₹199',image:'photo-1523275335684-37898b6baf30',color:'#e2edf0'}];

export const contentFields = [
 ['brandName','Store name','DealDropz'],
 ['announcement','Top announcement','Good finds. Better prices. That’s the DealDropz way.'],
 ['heroEyebrow','Banner eyebrow','YOUR NEXT OBSESSION IS HERE'],
 ['heroTitle','Banner heading','Big on style.'],
 ['heroSubtitle','Banner second line','Small on price.'],
 ['heroDescription','Banner description','Reel-worthy fashion. Scroll-stopping finds. Compare prices. Grab the best deal. Repeat.'],
 ['heroButton','Banner button','Explore today’s drops'],
 ['heroImageOne','First banner photo URL',photo('photo-1617627143750-d86bc21e42bb',800),'url'],
 ['heroCaptionOne','First photo caption','The ethnic edit'],
 ['heroImageTwo','Second banner photo URL',photo('photo-1488161628813-04466f872be2',600),'url'],
 ['heroCaptionTwo','Second photo caption','Off-duty essentials'],
 ['heroPrice','Banner price label','Starting at ₹199'],
 ['categoryHeading','Categories heading','A little something for every vibe'],
 ['dealsHeading','Products heading','Today’s hottest drops'],
 ['dealsDescription','Products description','We find the deals. You take the credit.'],
 ['communityHeading','Community heading','The best deals don’t wait. Neither should you.'],
 ['communityDescription','Community description','Join the DealDropz circle. Fresh finds, secret coupons & first dibs on every drop.'],
 ['communityButton','Community button','Get in on the good stuff'],
 ['footerDescription','Footer description','Less scrolling. More saving. A whole lot of good finds.'],
 ['footerDisclosure','Affiliate disclosure','Some links earn us a small commission, at no extra cost to you.'],
 ['stickyText','Bottom banner text','Your next favorite find is one message away.'],
 ...categories.flatMap((c,i)=>[[`categoryLabel${i}`,`${c.label} label`,c.label],[`categoryImage${i}`,`${c.label} photo URL`,photo(c.image,350),'url']])
];
export const defaultContent = Object.fromEntries(contentFields.map(([key,,value])=>[key,value]));
