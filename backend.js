/* Demo data layer. Uses localStorage as a browser-only mock backend. Replace with API/database for production. */
const KKStore={
 get(k){try{return JSON.parse(localStorage.getItem('kk_'+k)||'null')}catch{return null}},
 set(k,v){localStorage.setItem('kk_'+k,JSON.stringify(v));return v},
 products(){return this.get('products')||[]}, orders(){return this.get('orders')||[]}, customers(){return this.get('customers')||[]}, transactions(){return this.get('transactions')||[]},
 seed(){
  const catalog=[
   [1,'Classic Brown Khaddar Suit','Kurta Shalwar',6850,4400,'assets/classic-brown-khaddar-suit.png','Bestseller','S,M,L,XL','Brown,Sand'],
   [2,'Ivory Textured Kurta','Kurta Shalwar',4250,2600,'assets/ivory-textured-kurta.png','New arrival','S,M,L,XL','Ivory,White'],
   [3,'Heritage Sand Fabric','Unstitched',5900,3500,'assets/heritage-sand-fabric.png','Premium fabric','4.5m,5m','Sand'],
   [4,'Olive Waistcoat','Waistcoats',7800,4900,'assets/olive-waistcoat.png','Limited edit','S,M,L,XL','Olive'],
   [5,'Midnight Charcoal Kurta','Kurta Shalwar',4950,3000,'assets/midnight-charcoal-kurta.png','New arrival','S,M,L,XL','Charcoal'],
   [6,'Natural Khaddar Suit','Unstitched',6200,3800,'assets/natural-khaddar-suit.png','Khaddar edit','4.5m,5m','Natural'],
   [7,'Classic Black Waistcoat','Waistcoats',8200,5200,'assets/classic-black-waistcoat.png','Occasion wear','S,M,L,XL','Black'],
   [8,'Everyday Essential Kurta','Kurta Shalwar',3850,2300,'assets/everyday-essential-kurta.png','Everyday','S,M,L,XL','Beige,White']
  ].map(([id,name,category,price,cost,image,label,sizes,colors],i)=>({id,name,category,price,cost,stock:[18,24,12,8,15,20,6,30][i],image,label,desc:'Premium Kamalia Khaddar collection.',sizes:sizes.split(','),colors:colors.split(','),active:true}));
  if(!this.get('products'))this.set('products',catalog);
  if(!this.get('orders')){
   const demos=[
    ['KK-DEMO-1001','Ayesha Malik','03001234567','Sheikhupura','Cash on Delivery',1,2,'2026-11-02T11:20:00',13700],
    ['KK-DEMO-1002','Usman Raza','03011234567','Lahore','Bank Transfer',2,1,'2026-11-04T14:10:00',4250],
    ['KK-DEMO-1003','Hira Ahmed','03021234567','Sheikhupura','Cash on Delivery',4,1,'2026-11-06T16:45:00',7800],
    ['KK-DEMO-1004','Hamza Ali','03031234567','Faisalabad','JazzCash',5,2,'2026-11-08T12:30:00',9900]
   ];
   const orders=demos.map(([id,name,phone,city,payment,pid,qty,date,total])=>{const p=catalog.find(x=>x.id===pid);return{id,date:new Date(date).toLocaleString(),customer:{name,phone,email:'demo@example.com',city,address:'Demo address'},items:[{id:p.id,name:p.name,category:p.category,price:p.price,cost:p.cost,image:p.image,size:p.sizes[1]||p.sizes[0],color:p.colors[0],qty}],total,payment,status:'Completed',demo:true}});
   this.set('orders',orders);
   this.set('customers',orders.map(o=>o.customer));
   this.set('transactions',orders.map((o,i)=>({id:'TXN-DEMO-'+(2001+i),orderId:o.id,date:o.date,customer:o.customer.name,method:o.payment,amount:o.total,status:i===1?'Pending':'Successful',demo:true})));
  }
  if(!this.get('customers'))this.set('customers',[]);if(!this.get('transactions'))this.set('transactions',[]);
 },
 addOrder(order){const orders=this.orders();orders.unshift(order);this.set('orders',orders);const customers=this.customers(),customerIndex=customers.findIndex(c=>c.phone===order.customer.phone);if(customerIndex<0)customers.unshift(order.customer);else customers[customerIndex]={...customers[customerIndex],...order.customer};this.set('customers',customers);const tx=this.transactions();tx.unshift({id:'TXN-'+Date.now(),orderId:order.id,date:order.date,customer:order.customer.name,method:order.payment,amount:order.total,status:order.payment==='Cash on Delivery'?'Pending':'Successful'});this.set('transactions',tx);return order}
};KKStore.seed();
