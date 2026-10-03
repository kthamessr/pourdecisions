export async function compressPhoto(file:File):Promise<string>{
 if(!file.type.startsWith('image/'))throw Error('Choose an image, please.');
 const url=URL.createObjectURL(file);
 try{const image=await new Promise<HTMLImageElement>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('That photo couldn’t open. Try a JPEG or PNG.'));img.src=url;});const scale=Math.min(1,640/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);const ctx=canvas.getContext('2d');if(!ctx)throw Error('Photo processing isn’t available here.');ctx.fillStyle='#faf2e6';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);return canvas.toDataURL('image/jpeg',.7);}finally{URL.revokeObjectURL(url);}
}
