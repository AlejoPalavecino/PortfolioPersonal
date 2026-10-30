"use strict";
(() => {
  const catalog = window.CAMP_CATALOG || {assets:[]};
  const assets = Array.isArray(catalog.assets) ? catalog.assets : [];
  const byId = new Map(assets.map(a => [a.id, a]));
  const scenes = catalog.scenes?.length ? catalog.scenes : (catalog.scene ? [catalog.scene] : []);
  const imageCache = new Map();
  const players = [];
  let running = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeScene = 0;
  let sceneToken = 0;
  let galleryToken = 0;
  const hiddenLayers = new Set();
  const $ = id => document.getElementById(id);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function loadImage(src) {
    if (!imageCache.has(src)) imageCache.set(src, new Promise((resolve,reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("No se pudo abrir " + src));
      image.src = src;
    }));
    return imageCache.get(src);
  }
  function framesFor(asset, name) {
    if (!asset.animations || !asset.animations[name]) return asset.frames || [];
    return asset.animations[name].map(i => typeof i === "number" ? asset.frames[i] : asset.frames.find(f => f.name === i)).filter(Boolean);
  }
  function frameDimensions(frames) {
    let left=0,right=0,above=0,below=0;
    for (const f of frames) {
      const ax=f.anchorX ?? f.w/2, ay=f.anchorY ?? f.h;
      left=Math.max(left,ax);right=Math.max(right,f.w-ax);
      above=Math.max(above,ay);below=Math.max(below,f.h-ay);
    }
    return {left,right,above,below};
  }
  function drawFrame(player, index) {
    const {canvas,image,frames,extent}=player;
    if (!frames.length) return;
    const f=frames[index % frames.length];
    const ctx=canvas.getContext("2d");
    ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const ax=f.anchorX ?? f.w/2,ay=f.anchorY ?? f.h;
    ctx.drawImage(image,f.x,f.y,f.w,f.h,extent.left-ax+8,extent.above-ay+8,f.w,f.h);
  }
  function setSequence(player,name) {
    player.frames=framesFor(player.asset,name);
    player.extent=frameDimensions(player.frames);
    const e=player.extent;
    player.canvas.width=Math.ceil(e.left+e.right+16);
    player.canvas.height=Math.ceil(e.above+e.below+16);
    player.started=performance.now();
    drawFrame(player,0);
  }
  async function attachPlayer(asset,surface,controls,token) {
    const canvas=element("canvas");
    canvas.setAttribute("aria-label", "Animación: " + (asset.name || asset.id));
    surface.append(canvas);
    const select=element("select");
    select.setAttribute("aria-label","Secuencia de " + (asset.name || asset.id));
    const sequences=Object.keys(asset.animations || {});
    if (!sequences.length) sequences.push("Todos los cuadros");
    for (const name of sequences) select.add(new Option(name,name));
    controls.append(select);
    const localPause=element("button",null,"Pausar");
    controls.append(localPause);
    try {
      const image=await loadImage(asset.src);
      if(token!==galleryToken)return;
      const invalid=(asset.frames || []).some(f => f.x<0 || f.y<0 || f.w<=0 || f.h<=0 || f.x+f.w>image.width || f.y+f.h>image.height);
      if (invalid) throw new Error("Hay cuadros fuera de los límites de la imagen.");
      const player={asset,canvas,image,frames:[],extent:{},started:performance.now(),paused:false};
      setSequence(player,sequences[0]);players.push(player);
      select.addEventListener("change",()=>setSequence(player,select.value));
      localPause.addEventListener("click",()=>{player.paused=!player.paused;localPause.textContent=player.paused?"Reproducir":"Pausar";player.started=performance.now();});
    } catch(error) {surface.replaceChildren(element("p","error",error.message));}
  }
  function renderGallery() {
    const token=++galleryToken;
    const selected=$("category").value;
    const shown=assets.filter(a => selected==="all" || (a.category || "Otros")===selected);
    players.splice(0);
    $("gallery").replaceChildren();
    $("status").textContent=`${shown.length} piezas visibles · ${assets.length} en el catálogo`;
    if (!shown.length) {$("gallery").append(element("p","empty",assets.length?"Esta categoría no tiene piezas.":"El catálogo todavía no contiene assets. Añadilos a catalog.js para revisarlos aquí."));return;}
    for (const asset of shown) {
      const card=element("article","asset-card" + (asset.wide?" wide":"") + (asset.kind==="icon"?" icon":""));
      const surface=element("div","thumb asset-surface");
      const meta=element("div","meta");
      meta.append(element("div","kind",asset.category || asset.kind || "Asset"),element("h2",null,asset.name || asset.id));
      if (asset.notes) meta.append(element("p","notes",asset.notes));
      meta.append(element("div","asset-path",asset.src));
      const controls=element("div","card-controls");
      if (asset.frames?.length) attachPlayer(asset,surface,controls,token);
      else if (asset.kind === "audio") {
        const audio=element("audio");audio.controls=true;audio.preload="metadata";audio.src=asset.src;surface.append(audio);
      } else {
        const image=element("img");image.src=asset.src;image.alt=asset.name || asset.id;image.loading="lazy";
        image.addEventListener("error",()=>surface.replaceChildren(element("p","error","No se pudo abrir esta pieza.")));
        surface.append(image);
      }
      const open=element("a",null,"Abrir original");open.href=asset.src;open.target="_blank";open.rel="noopener";
      const download=element("a",null,"Descargar");download.href=asset.src;download.download=asset.src.split("/").pop();
      controls.append(open,download);meta.append(controls);card.append(surface,meta);$("gallery").append(card);
    }
  }
  function setupLayers() {
    $("layers").replaceChildren();hiddenLayers.clear();
    const scene=scenes[activeScene];if(!scene)return;
    (scene.layers || []).forEach((layer,i)=>{
      const label=element("label");const input=element("input");input.type="checkbox";input.checked=layer.visible!==false;
      if(!input.checked)hiddenLayers.add(i);
      input.addEventListener("change",()=>{input.checked?hiddenLayers.delete(i):hiddenLayers.add(i);renderScene();});
      label.append(input,document.createTextNode(layer.name || byId.get(layer.asset)?.name || layer.asset || `Capa ${i+1}`));$("layers").append(label);
    });
    $("scene-notes").textContent=scene.notes || "";
  }
  async function renderScene() {
    const scene=scenes[activeScene];if(!scene)return;
    const token=++sceneToken;const canvas=$("scene-canvas");
    canvas.width=scene.width || 1536;canvas.height=scene.height || 1024;
    const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,canvas.width,canvas.height);
    const layers=(scene.layers || []).map((layer,index)=>({layer,index})).sort((a,b)=>(a.layer.z || 0)-(b.layer.z || 0));
    const loaded=await Promise.all(layers.map(async entry=>{const asset=byId.get(entry.layer.asset);try{return {...entry,asset,image:await loadImage(entry.layer.src || asset?.src)};}catch(error){return {...entry,error};}}));
    if(token!==sceneToken)return;
    for(const {layer,index,asset,image,error} of loaded){
      if(hiddenLayers.has(index))continue;
      if(error){$("scene-notes").textContent=error.message;continue;}
      let frame=null;
      if(layer.frame!==undefined && asset?.frames)frame=typeof layer.frame==="number"?asset.frames[layer.frame]:asset.frames.find(f=>f.name===layer.frame);
      const sw=frame?.w || image.width,sh=frame?.h || image.height;
      const dw=layer.width ?? sw*(layer.scale ?? 1),dh=layer.height ?? (layer.width?sh*dw/sw:sh*(layer.scale ?? 1));
      const ax=layer.anchorX ?? 0,ay=layer.anchorY ?? 0;
      const x=(layer.x || 0)-ax*dw/sw,y=(layer.y || 0)-ay*dh/sh;
      ctx.save();ctx.globalAlpha=layer.opacity ?? 1;
      if(layer.flipX){ctx.translate(x+dw,y);ctx.scale(-1,1);ctx.drawImage(image,frame?.x || 0,frame?.y || 0,sw,sh,0,0,dw,dh);}
      else ctx.drawImage(image,frame?.x || 0,frame?.y || 0,sw,sh,x,y,dw,dh);
      ctx.restore();
      if($("scene-bounds").checked){ctx.strokeStyle="#f54f54";ctx.lineWidth=2;ctx.strokeRect(x,y,dw,dh);ctx.fillStyle="#102a30";ctx.font="18px sans-serif";ctx.fillText(layer.name || asset?.name || "",x+5,y+22);}
    }
  }
  function changeTab(which) {
    const gallery=which==="gallery";$("gallery").hidden=!gallery;$("composition").hidden=gallery;
    for(const [name,on] of [["gallery",gallery],["scene",!gallery]]){$("tab-"+name).classList.toggle("active",on);$("tab-"+name).setAttribute("aria-pressed",String(on));}
    $("category").parentElement.hidden=!gallery;
    if(!gallery)renderScene();
  }
  function syncMotion(){ $("motion").textContent=running?"Pausar animaciones":"Reproducir animaciones"; }
  $("title").textContent=catalog.title || "Campamento creativo";document.title=$("title").textContent;
  if(catalog.subtitle)$("subtitle").textContent=catalog.subtitle;
  for(const category of [...new Set(assets.map(a=>a.category || "Otros"))])$("category").add(new Option(category,category));
  $("surface").addEventListener("change",e=>document.body.dataset.surface=e.target.value);
  $("category").addEventListener("change",renderGallery);
  $("motion").addEventListener("click",()=>{running=!running;syncMotion();players.forEach(p=>p.started=performance.now());});
  $("tab-gallery").addEventListener("click",()=>changeTab("gallery"));
  $("tab-scene").addEventListener("click",()=>changeTab("scene"));
  $("tab-scene").disabled=!scenes.length;
  scenes.forEach((scene,i)=>$("scene-select").add(new Option(scene.name || `Composición ${i+1}`,String(i))));
  $("scene-select").addEventListener("change",()=>{activeScene=Number($("scene-select").value);setupLayers();renderScene();});
  $("scene-bounds").addEventListener("change",renderScene);
  function tick(time){if(running && !document.hidden && !$("gallery").hidden){for(const player of players){if(!player.paused)drawFrame(player,Math.floor((time-player.started)/1000*(player.asset.fps || 6)));}}requestAnimationFrame(tick);}
  syncMotion();renderGallery();setupLayers();requestAnimationFrame(tick);
})();
