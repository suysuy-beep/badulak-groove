import {PRODUCTS,calculate,money,quantity,price} from './core.js';
import {art} from './art.js';
const $=s=>document.querySelector(s);
const STORAGE='badulak-suy-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORAGE)||'{}')||{};}catch{}
let products=PRODUCTS.map(p=>({...p,price:price(saved.prices?.[p.id],p.price)}));
let quantities=Object.fromEntries(products.map(p=>[p.id,quantity(saved.quantities?.[p.id])]));
let category='all';let query='';let installPrompt=null;let toastTimer;
$('#include-total').checked=saved.includeTotal===true;
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify({prices:Object.fromEntries(products.map(p=>[p.id,p.price])),quantities,includeTotal:$('#include-total').checked,theme:document.documentElement.dataset.theme}));}catch{toast('No pudimos guardar los cambios en este navegador.');}}
function applyTheme(theme){
 const dark=theme==='dark';document.documentElement.dataset.theme=dark?'dark':'light';
 $('#theme-toggle').setAttribute('aria-pressed',String(dark));
 $('#theme-toggle').title=dark?'Activar modo claro':'Activar modo oscuro';
 $('meta[name="theme-color"]').content=dark?'#211c1a':'#f4ede4';
}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function renderCatalog(){
 $('#products').innerHTML=products.map(p=>`<article class="product-card" data-id="${p.id}"><button type="button" class="product-art" data-delta="1" style="--art-bg:${p.bg}" title="Agregar un ${p.name}" aria-label="Agregar un ${p.name} tocando la imagen">${p.tag?`<span class="product-tag">${p.tag}</span>`:''}${art(p.art,p.id)}<span class="art-add" aria-hidden="true">+</span></button><div class="product-meta"><h3 class="product-name">${p.name}</h3><p class="product-price" data-price="${p.id}">${money(p.price)}<small>/ unidad</small></p></div><div class="quantity-control"><button class="qty-button minus" data-delta="-1" aria-label="Quitar un ${p.name}">−</button><input class="qty-input" type="number" min="0" max="999" step="1" inputmode="numeric" value="${quantities[p.id]}" aria-label="Cantidad de ${p.name}"><button class="qty-button plus" data-delta="1" aria-label="Agregar un ${p.name}">+</button></div></article>`).join('');
 filter();update();
}
function filter(){let visible=0;for(const p of products){const show=(category==='all'||p.category===category)&&p.name.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query);$(`[data-id="${p.id}"]`).hidden=!show;if(show)visible++;}$('#no-results').hidden=visible>0;}
function update(){
 const order=calculate(products,quantities,$('#include-total').checked);
 for(const p of products){const card=$(`[data-id="${p.id}"]`);card.classList.toggle('active',quantities[p.id]>0);const input=card.querySelector('input');if(document.activeElement!==input)input.value=quantities[p.id];card.querySelector('.minus').disabled=quantities[p.id]===0;card.querySelectorAll('[data-delta="1"]').forEach(button=>button.disabled=quantities[p.id]===999);}
 $('#count').textContent=order.count;$('#count').setAttribute('aria-label',`${order.count} artículos`);$('#total').textContent=money(order.total);$('#summary').value=order.summary;
 $('#order-lines').innerHTML=order.lines.length?order.lines.map(p=>`<div class="order-row"><span class="line-qty">${p.qty}x</span><div><span class="line-name">${p.name}</span><span class="line-price">${money(p.price)} / unidad</span></div><div class="line-end">${money(p.qty*p.price)}<button class="remove-line" data-remove="${p.id}" aria-label="Quitar ${p.name} del pedido">×</button></div></div>`).join(''):`<div class="empty-order"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 15h26l-3 17H17L11 8H6m12 31h1m14 0h1M23 11v9m-4-4h9"/><circle cx="18" cy="39" r="2"/><circle cx="33" cy="39" r="2"/></svg><strong>Aquí empieza tu pedido</strong><p>Agrega algo bonito con el botón +</p></div>`;
 $('#clean-benefit').classList.toggle('unlocked',order.clean);$('#repair-benefit').classList.toggle('unlocked',order.repair);
 $('#clean-text').textContent=order.clean?'Incluida en tu compra':'En compras de más de $5,000';$('#repair-text').textContent=order.repair?'Incluida en tu compra':'En compras de más de $10,000';
 $('#copy').disabled=!order.lines.length;$('#copy-total').disabled=!order.lines.length;$('#clear').disabled=!order.lines.length;persist();
}
$('#products').addEventListener('click',e=>{const button=e.target.closest('[data-delta]');if(!button)return;const id=button.closest('[data-id]').dataset.id;quantities[id]=quantity(quantities[id]+Number(button.dataset.delta));update();});
$('#products').addEventListener('input',e=>{if(!e.target.matches('.qty-input'))return;const id=e.target.closest('[data-id]').dataset.id;quantities[id]=quantity(e.target.value);update();});
$('#products').addEventListener('change',e=>{if(e.target.matches('.qty-input'))e.target.value=quantities[e.target.closest('[data-id]').dataset.id];});
$('#order-lines').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b){quantities[b.dataset.remove]=0;update();}});
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{category=tab.dataset.category;document.querySelectorAll('.tab').forEach(t=>{t.classList.toggle('selected',t===tab);t.setAttribute('aria-pressed',t===tab?'true':'false');});filter();}));
$('#search').addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');filter();});
$('#include-total').addEventListener('change',update);
$('#theme-toggle').addEventListener('click',()=>{applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');persist();});
$('#clear').addEventListener('click',()=>{quantities=Object.fromEntries(products.map(p=>[p.id,0]));update();toast('Pedido vacío. Empezamos de nuevo ♡');});
$('#copy').addEventListener('click',async()=>{if(!$('#summary').value)return;try{await navigator.clipboard.writeText($('#summary').value);toast('Pedido copiado ♡');}catch{$('#summary').focus();$('#summary').select();try{if(document.execCommand('copy')){toast('Pedido copiado ♡');return;}}catch{}toast('Texto seleccionado. Presiona Ctrl+C para copiar.');}});
$('#copy-total').addEventListener('click',async()=>{
 const order=calculate(products,quantities);
 if(!order.lines.length)return;
 const text=String(Math.round(order.total));
 try{await navigator.clipboard.writeText(text);toast('Total copiado: '+text);}
 catch{
  const field=document.createElement('textarea');field.value=text;field.readOnly=true;
  field.style.cssText='position:fixed;left:0;top:0;opacity:0;pointer-events:none';
  document.body.appendChild(field);field.select();
  let copied=false;try{copied=document.execCommand('copy');}catch{}
  field.remove();$('#copy-total').focus();
  if(copied)toast('Total copiado: '+text);
  else window.prompt('Copia el total con Ctrl+C:',text);
 }
});
$('#settings').addEventListener('click',()=>{$('#price-fields').innerHTML=products.map(p=>`<label class="price-field"><span>${p.name}</span><div>$ <input type="number" min="0" max="999999999" step="0.01" required data-edit="${p.id}" value="${p.price}" aria-label="Precio de ${p.name}"></div></label>`).join('');$('#price-dialog').showModal();});
$('#price-dialog form').addEventListener('submit',e=>{if(e.submitter?.value!=='save')return;products=products.map(p=>({...p,price:price($(`[data-edit="${p.id}"]`).value,p.price)}));renderCatalog();toast('Precios guardados');});
$('#restore-prices').addEventListener('click',()=>PRODUCTS.forEach(p=>$(`[data-edit="${p.id}"]`).value=p.price));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
$('#install').addEventListener('click',async()=>{if(installPrompt){const prompt=installPrompt;await prompt.prompt();await prompt.userChoice;installPrompt=null;}else $('#install-dialog').showModal();});
window.addEventListener('appinstalled',()=>{installPrompt=null;$('#install').hidden=true;toast('Badulak instalada ♡');});
if(window.matchMedia('(display-mode: standalone)').matches)$('#install').hidden=true;
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
applyTheme(saved.theme);
renderCatalog();
