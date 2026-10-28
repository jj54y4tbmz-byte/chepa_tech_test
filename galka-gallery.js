(() => {
 'use strict';
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 if(!document.querySelector('#galka-gallery-style')){const style=el('style');style.id='galka-gallery-style';style.textContent='.drummer-gallery{display:grid;gap:18px}.drummer-gallery figure{margin:0;border:1px solid #ffffff1a;background:#0c131e;border-radius:16px;overflow:hidden}.drummer-gallery img,.drummer-gallery video{display:block;width:100%;max-height:75vh;object-fit:contain;background:#05080e}.drummer-gallery img{cursor:zoom-in}.drummer-gallery figcaption{padding:10px 14px;font-size:12px;color:#a6b4c7}.drummer-lightbox{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:#03060bf5;padding:64px 8px 12px}.drummer-lightbox img{max-width:100%;max-height:100%;object-fit:contain}.drummer-lightbox button{position:fixed;right:16px;top:16px;min-height:44px;border:1px solid #7e9ac0;border-radius:10px;background:#16253b;color:white;padding:8px 18px}';document.head.append(style);}
 window.renderDrummerAlbum=async(container,file)=>{
  container.replaceChildren(el('p','pdf-status','Загрузка фотографий…'));
  try{
   const response=await fetch('./'+file+'?v=drums-20261028');if(!response.ok)throw Error('Не удалось загрузить альбом.');const album=await response.json();if(!container.isConnected)return;
   const list=el('div','drummer-gallery');container.replaceChildren(list);
   for(const [i,item] of album.media.entries()){
    const figure=el('figure'),media=el(item.kind==='video'?'video':'img');media.src='./'+item.file;
    if(item.kind==='video'){media.controls=true;media.playsInline=true;media.preload='metadata';media.setAttribute('aria-label','Видео · '+album.name);}
    else{media.alt=album.name+' · Фото '+(i+1);media.loading='lazy';media.tabIndex=0;media.setAttribute('role','button');media.setAttribute('aria-label','Увеличить фото '+(i+1)+' · '+album.name);
     const zoom=()=>{const overlay=el('div','drummer-lightbox');overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Фото крупнее');const image=el('img');image.src=media.src;image.alt=media.alt;const close=el('button','','Закрыть');const dismiss=()=>{overlay.remove();media.focus();};close.addEventListener('click',dismiss);overlay.addEventListener('keydown',e=>{if(e.key==='Escape')dismiss();if(e.key==='Tab'){e.preventDefault();close.focus();}});overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss();});overlay.append(image,close);document.body.append(overlay);close.focus();};media.addEventListener('click',zoom);media.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();zoom();}});
    }
    media.addEventListener('error',()=>{figure.append(el('p','pdf-status',item.kind==='video'?'Видео не удалось воспроизвести. Попробуйте открыть приложение в Safari.':'Фото не загрузилось. Вернитесь назад и откройте альбом снова.'));});
    figure.append(media,el('figcaption','',(item.kind==='video'?'Видео':'Фото')+' · '+album.name));list.append(figure);
   }
  }catch(e){if(container.isConnected)container.replaceChildren(el('div','empty',e.message||'Не удалось открыть альбом.'));}
 };
})();
