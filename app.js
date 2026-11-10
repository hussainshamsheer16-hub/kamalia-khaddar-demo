const products=KKStore.products();
let checkoutAfterAdd=false;
let activeFilter="All",cart=JSON.parse(localStorage.getItem("kk_cart")||"[]");
const money=n=>"PKR "+Number(n).toLocaleString("en-PK");
const $=id=>document.getElementById(id);
function renderProducts(){
 let list=products.filter(p=>p.active!==false&&(activeFilter==="All"||p.category===activeFilter));
 const q=($("searchInput")?.value||"").toLowerCase(); if(q)list=list.filter(p=>(p.name+" "+p.category+" "+p.desc).toLowerCase().includes(q));
 const sort=$("sortSelect").value;if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);
 $("productGrid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80'"><span class="product-tag">${p.label}</span><button class="quick-add" onclick="openProduct(${p.id})">Quick view +</button></div><div class="product-info"><h3>${p.name}</h3><p>${p.category}</p><div class="mt-3 flex gap-2 items-center"><b class="text-sm">${money(p.price)}</b>${p.old?`<del class="text-xs text-stone-400">${money(p.old)}</del>`:""}</div><div class="product-actions"><button class="buy-now" onclick="buyNow(${p.id})">Buy now</button><button class="add-cart" onclick="addProductToCart(${p.id})" aria-label="Add ${p.name} to cart">Add to cart</button></div></div></article>`).join("")||'<p class="col-span-full text-center py-10 text-sm">No products found. Try another search.</p>';
}
function saveCart(){localStorage.setItem("kk_cart",JSON.stringify(cart));renderCart()}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(i=>`<div class="flex gap-3"><img src="${i.image}" class="w-20 h-24 object-cover"><div class="flex-1"><b class="font-display">${i.name}</b><p class="text-xs text-stone-500 mt-1">${i.size} · ${i.color}</p><p class="text-xs mt-2">${money(i.price)}</p><div class="flex items-center gap-3 mt-2 text-xs"><button onclick="changeQty(${i.key},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${i.key},1)">+</button><button class="ml-auto underline" onclick="removeItem(${i.key})">Remove</button></div></div></div>`).join(""):'<p class="text-sm text-stone-500">Your bag is waiting for something special.</p>';
 $("cartSubtotal").textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
function openProduct(id){const p=products.find(x=>x.id===id);$("productModalContent").innerHTML=`<div class="grid md:grid-cols-2 gap-6 pt-4"><img class="w-full aspect-[4/5] object-cover" src="${p.image}" alt="${p.name}"><div class="py-3"><p class="eyebrow">${p.category}</p><h2 class="font-display text-3xl mt-3">${p.name}</h2><p class="text-lg mt-4">${money(p.price)}</p><p class="text-sm text-stone-600 leading-6 mt-5">${p.desc}</p><label class="block text-xs uppercase tracking-widest mt-7 mb-2">Choose size</label><div class="flex flex-wrap gap-2" id="sizeOptions">${p.sizes.map((s,i)=>`<button class="size-choice ${i===1?'selected':''}" data-size="${s}">${s}</button>`).join("")}</div><label class="block text-xs uppercase tracking-widest mt-5 mb-2">Choose colour</label><select id="colorOption" class="field w-full">${p.colors.map(c=>`<option>${c}</option>`).join("")}</select><button id="addToBag" class="btn-dark w-full mt-7">Add to bag · ${money(p.price)}</button><p class="text-[10px] text-stone-500 mt-3">Demo product. Actual availability should be confirmed by the store.</p></div></div>`;
 $("productModal").classList.remove("hidden");let size=p.sizes[1]||p.sizes[0];document.querySelectorAll(".size-choice").forEach(b=>b.onclick=()=>{document.querySelectorAll(".size-choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");size=b.dataset.size});
 $("addToBag").onclick=()=>{const color=$("colorOption").value;const key=p.id+"-"+size+"-"+color;let item=cart.find(x=>x.key===key);if(item)item.qty++;else cart.push({key,id:p.id,name:p.name,category:p.category,price:p.price,cost:p.cost,image:p.image,size,color,qty:1});saveCart();$("productModal").classList.add("hidden");if(checkoutAfterAdd){checkoutAfterAdd=false;$("checkoutModal").classList.remove("hidden")}else{openCart()}};
}
function addProductToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const size=p.sizes?.[1]||p.sizes?.[0]||'One size',color=p.colors?.[0]||'Default',key=p.id+'-'+size+'-'+color;let item=cart.find(x=>x.key===key);if(item)item.qty++;else cart.push({key,id:p.id,name:p.name,category:p.category,price:p.price,cost:p.cost,image:p.image,size,color,qty:1});saveCart();const btn=document.getElementById('cartBtn');if(btn){btn.setAttribute('aria-label','Shopping cart, '+cart.reduce((s,x)=>s+x.qty,0)+' items');} }
function buyNow(id){addProductToCart(id);window.location.href='checkout.html'}
function openCart(){$("overlay").classList.remove("hidden");$("cartDrawer").classList.add("open")}
function closeCart(){$("overlay").classList.add("hidden");$("cartDrawer").classList.remove("open")}
function changeQty(key,n){let i=cart.find(x=>x.key===key);if(i){i.qty+=n;if(i.qty<1)cart=cart.filter(x=>x.key!==key);saveCart()}}
function removeItem(key){cart=cart.filter(x=>x.key!==key);saveCart()}
document.querySelectorAll("#filters .filter").forEach(b=>b.onclick=()=>{document.querySelectorAll("#filters .filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()});
$("sortSelect").onchange=renderProducts;$("cartBtn").onclick=()=>{window.location.href="checkout.html"};$("overlay").onclick=closeCart;document.querySelectorAll(".closeDrawer").forEach(b=>b.onclick=closeCart);
$("searchToggle").onclick=()=>$("searchPanel").classList.toggle("hidden");$("searchGo").onclick=()=>{activeFilter="All";document.querySelectorAll("#filters .filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="All"));renderProducts();$("shop").scrollIntoView()};
$("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("searchGo").click()});
document.querySelectorAll(".category-card").forEach(a=>a.onclick=()=>{activeFilter=a.dataset.category;document.querySelectorAll("#filters .filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));renderProducts()});
$("closeProduct").onclick=()=>$("productModal").classList.add("hidden");
$("checkoutBtn").onclick=()=>{if(!cart.length){alert("Your bag is empty.");return}window.location.href="checkout.html"};
document.querySelectorAll(".closeCheckout").forEach(b=>b.onclick=()=>$("checkoutModal").classList.add("hidden"));
$("checkoutForm").onsubmit=e=>{e.preventDefault();const f=e.target;const fields=[...f.querySelectorAll('input')];const customer={name:fields[0].value,phone:fields[1].value,email:fields[2].value,city:fields[3].value,address:fields[4].value};let orders=JSON.parse(localStorage.getItem("kk_orders")||"[]");const order={id:"KK"+Date.now().toString().slice(-6),date:new Date().toLocaleString(),customer,items:cart.map(x=>({...x})),total:cart.reduce((s,i)=>s+i.price*i.qty,0),status:"Pending"};orders.unshift(order);localStorage.setItem("kk_orders",JSON.stringify(orders));let customers=JSON.parse(localStorage.getItem("kk_customers")||"[]");if(!customers.some(c=>c.phone===customer.phone))customers.unshift(customer);localStorage.setItem("kk_customers",JSON.stringify(customers));cart=[];saveCart();$("checkoutMsg").innerHTML='Order saved. <button type="button" class="underline font-bold" id="printLatestBill">Print thermal bill</button>';$("printLatestBill").onclick=()=>printThermalBill(order);f.reset()};
function printThermalBill(order){const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])),money=n=>"PKR "+Number(n||0).toLocaleString("en-PK"),items=order.items||[],rows=items.map(i=>`<tr class="item"><td><strong>${esc(i.name)}</strong><small>${esc(i.size||"")} ${i.color?`/ ${esc(i.color)}`:""}</small><small>${Number(i.qty||1)} × ${money(i.price)}</small></td><td class="amount">${money(i.price*(i.qty||1))}</td></tr>`).join(""),customer=order.customer||{},w=window.open("","_blank","width=440,height=760");if(!w){alert("Please allow pop-ups to print the receipt.");return}w.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Receipt ${esc(order.id)}</title><style>@page{size:80mm auto;margin:4mm}*{box-sizing:border-box}body{width:72mm;margin:0 auto;padding:2mm 0;color:#17130f;font:11px/1.45 Arial,sans-serif}.brand{text-align:center;border-bottom:2px solid #493326;padding-bottom:9px}.brand h1{font:700 19px/1.15 Georgia,serif;letter-spacing:1.6px;color:#493326;margin:0}.brand p{text-align:center;margin:4px 0 0;color:#65584c;font-size:10px}.title{text-align:center;font-size:13px;font-weight:700;letter-spacing:1.4px;margin:10px 0 2px}.muted{color:#65584c}.meta,.customer{display:grid;grid-template-columns:1fr auto;gap:3px 8px;padding:8px 0;border-bottom:1px dashed #a79a89}.customer{grid-template-columns:1fr}.customer strong{font-size:12px}.customer span{overflow-wrap:anywhere}table{width:100%;border-collapse:collapse;margin:8px 0}th{font-size:9px;text-transform:uppercase;letter-spacing:.7px;text-align:left;border-bottom:1px solid #493326;padding:5px 0}th:last-child,.amount{text-align:right;white-space:nowrap}td{vertical-align:top;padding:7px 0}.item{border-bottom:1px dotted #c7bcae}.item small{display:block;color:#65584c;font-size:9px;margin-top:2px}.totals{display:grid;grid-template-columns:1fr auto;gap:5px;padding:8px 0}.grand-total{border-top:1px solid #493326;border-bottom:2px double #493326;padding:8px 0;font-size:14px;font-weight:700}.footer{text-align:center;border-top:1px dashed #a79a89;margin-top:10px;padding-top:8px;color:#493326}.footer strong{display:block;font:600 14px Georgia,serif;margin-bottom:3px}@media screen{body{margin:12px auto;padding:5mm;background:#fff;box-shadow:0 2px 18px #0002}}</style></head><body><header class="brand"><h1>KAMALIA KHADDAR</h1><p>Tradition woven in every thread</p><p>Sheikhupura, Punjab, Pakistan</p></header><div class="title">SALES RECEIPT</div><section class="meta"><span class="muted">Bill number</span><strong>${esc(order.id)}</strong><span class="muted">Date</span><span>${esc(order.date)}</span><span class="muted">Payment</span><span>${esc(order.payment||"Cash on Delivery")}</span><span class="muted">Status</span><span>${esc(order.status||"Completed")}</span></section><section class="customer"><strong>${esc(customer.name||"Customer")}</strong>${customer.phone?`<span>Phone: ${esc(customer.phone)}</span>`:""}${customer.email?`<span>Email: ${esc(customer.email)}</span>`:""}${customer.city||customer.address?`<span>Address: ${esc([customer.address,customer.city].filter(Boolean).join(", "))}</span>`:""}</section><table><thead><tr><th>Product / details</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><section class="totals"><span>Items</span><span>${items.reduce((sum,item)=>sum+Number(item.qty||1),0)}</span><span>Subtotal</span><span>${money(order.total)}</span><span>Delivery</span><span>${money(0)}</span></section><section class="totals grand-total"><span>TOTAL</span><span>${money(order.total)}</span></section><footer class="footer"><strong>Thank you for shopping with us!</strong><span>Please keep this receipt for your records.</span></footer><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}

$("newsletterForm").onsubmit=e=>{e.preventDefault();const form=e.currentTarget;if(!(form instanceof HTMLFormElement)||!form.reportValidity())return;const input=form.querySelector('input[type="email"]'),email=input.value.trim().toLowerCase(),subscribers=JSON.parse(localStorage.getItem("kk_newsletter")||"[]");if(subscribers.some(subscriber=>subscriber.email===email)){$("newsletterMsg").textContent="This email is already subscribed.";return}subscribers.unshift({email,date:new Date().toISOString()});localStorage.setItem("kk_newsletter",JSON.stringify(subscribers));$("newsletterMsg").textContent="Thank you for subscribing to the Kamalia Khaddar newsletter.";form.reset()};


$("menuToggle").onclick=()=>$("mobileNav").classList.toggle("hidden");
const heroCarousel=$("heroCarousel");
if(heroCarousel){
 const slides=[...heroCarousel.querySelectorAll(".hero-slide")];
 const dots=[...heroCarousel.querySelectorAll(".hero-carousel-dot")];
 let activeSlide=0;
 const showSlide=index=>{
  activeSlide=(index+slides.length)%slides.length;
   slides.forEach((slide,i)=>{
    slide.setAttribute("aria-hidden",String(i!==activeSlide));
    slide.inert=i!==activeSlide;
   });
  slides.forEach((slide,i)=>slide.classList.toggle("is-active",i===activeSlide));
  dots.forEach((dot,i)=>{
   dot.classList.toggle("is-active",i===activeSlide);
   dot.setAttribute("aria-current",String(i===activeSlide));
  });
 };
 heroCarousel.querySelector(".hero-carousel-prev").addEventListener("click",()=>showSlide(activeSlide-1));
 heroCarousel.querySelector(".hero-carousel-next").addEventListener("click",()=>showSlide(activeSlide+1));
 dots.forEach((dot,i)=>dot.addEventListener("click",()=>showSlide(i)));
 showSlide(activeSlide);
 if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  let autoAdvance=setInterval(()=>showSlide(activeSlide+1),5000);
  const restartAutoAdvance=()=>{
   clearInterval(autoAdvance);
   autoAdvance=setInterval(()=>showSlide(activeSlide+1),5000);
  };
  heroCarousel.addEventListener("mouseenter",()=>clearInterval(autoAdvance));
  heroCarousel.addEventListener("mouseleave",restartAutoAdvance);
  heroCarousel.addEventListener("focusin",()=>clearInterval(autoAdvance));
  heroCarousel.addEventListener("focusout",event=>{
   if(!heroCarousel.contains(event.relatedTarget))restartAutoAdvance();
  });
 }
}
renderProducts();renderCart();

$("contactForm")?.addEventListener("submit",e=>{e.preventDefault();const form=e.currentTarget;if(!(form instanceof HTMLFormElement)||!form.reportValidity())return;const data=new FormData(form),enquiries=JSON.parse(localStorage.getItem("kk_enquiries")||"[]"),enquiry={id:"ENQ-"+Date.now(),date:new Date().toISOString(),name:String(data.get("name")).trim(),phone:String(data.get("phone")).trim(),email:String(data.get("email")).trim(),message:String(data.get("message")).trim()};enquiries.unshift(enquiry);localStorage.setItem("kk_enquiries",JSON.stringify(enquiries));$("contactMsg").textContent="Thank you. Your message has been saved in this browser. Our team will be in touch.";form.reset()});
