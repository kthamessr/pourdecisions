import {addItems,CATEGORIES,DEMO,DEFAULT_TASTE,newId,type Item,type Decision,type Taste,type Temp,type Recipe} from './coffee';
export function read<T>(key:string,fallback:T):T{try{const data=localStorage.getItem(key);return data===null?fallback:JSON.parse(data);}catch{return fallback;}}
export function write(key:string,value:unknown):boolean{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function inventory():Item[]{
 try{
 const value=localStorage.getItem('pd-inv');
 if(value!==null){const data=JSON.parse(value);return Array.isArray(data)?data.filter(i=>i&&typeof i.id==='string'&&typeof i.name==='string'&&i.name.trim()&&CATEGORIES.some(c=>c.id===i.category)):[];}
 const old=read<{name:string;category:string}[]>('pourdecisions.ingredients.v1',[]);
 const categoryMap:Record<string,Item['category']>={'Coffee':'coffee','Espresso / pods':'espresso','Syrups':'syrup','Creamers / milk':'milk','Toppings':'topping'};
 const result=Array.isArray(old)&&old.length?old.filter(i=>categoryMap[i.category]&&typeof i.name==='string').map(i=>({id:newId(),name:i.name,category:categoryMap[i.category]})):addItems([],DEMO);
 write('pd-inv',result);return result;
 }catch{return addItems([],DEMO);}
}
export const validTaste=(t:unknown):t is Taste=>!!t&&typeof t==='object'&&Object.keys(DEFAULT_TASTE).every(k=>typeof (t as Taste)[k as keyof Taste]==='number'&&(t as Taste)[k as keyof Taste]>=0&&(t as Taste)[k as keyof Taste]<=100);
export const validRecipe=(r:unknown):r is Recipe=>!!r&&typeof r==='object'&&typeof (r as Recipe).name==='string'&&['hot','iced'].includes((r as Recipe).temp)&&Array.isArray((r as Recipe).ingredients)&&(r as Recipe).ingredients.every(i=>i&&typeof i.label==='string'&&typeof i.amount==='string')&&Array.isArray((r as Recipe).steps)&&(r as Recipe).steps.every(s=>typeof s==='string');
export function decisions():Decision[]{const data=read<unknown>('pd-decisions',[]);return Array.isArray(data)?data.filter(d=>d&&typeof d.id==='string'&&typeof d.date==='string'&&validRecipe(d.recipe)&&validTaste(d.taste)&&['hot','iced','surprise'].includes(d.temp)&&(!d.photo||typeof d.photo==='string'&&d.photo.startsWith('data:image/jpeg;base64,'))):[];}
export type Draft={taste:Taste;temp:Temp;recipe:Recipe|null;photo?:string;savedId?:string;evaluation?:Taste;step:string};
export function draft():Draft{const d=read<Partial<Draft>>('pd-draft',{});return{taste:validTaste(d?.taste)?d.taste:DEFAULT_TASTE,temp:['hot','iced','surprise'].includes(d?.temp||'')?d.temp as Temp:'hot',recipe:validRecipe(d?.recipe)?d.recipe:null,photo:typeof d?.photo==='string'&&d.photo.startsWith('data:image/jpeg;base64,')?d.photo:undefined,savedId:typeof d?.savedId==='string'?d.savedId:undefined,evaluation:validTaste(d?.evaluation)?d.evaluation:undefined,step:typeof d?.step==='string'?d.step:'home'};}
