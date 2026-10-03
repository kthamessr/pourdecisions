export type Category = 'coffee'|'espresso'|'syrup'|'milk'|'topping';
export const CATEGORIES: {id:Category;label:string;emoji:string;ideas:string[]}[]=[
{id:'coffee',label:'Coffee',emoji:'☕',ideas:['Medium roast','Dark roast','Cold brew concentrate','Decaf']},
{id:'espresso',label:'Espresso / Pods',emoji:'⚡',ideas:['Espresso beans','Espresso pods','Instant espresso']},
{id:'syrup',label:'Syrups',emoji:'🍯',ideas:['Vanilla syrup','Caramel syrup','Hazelnut syrup','Maple syrup']},
{id:'milk',label:'Creamers / Milk',emoji:'🥛',ideas:['Whole milk','Oat milk','Almond milk','Sweet cream']},
{id:'topping',label:'Toppings',emoji:'✨',ideas:['Whipped cream','Cinnamon','Cocoa powder','Caramel drizzle']}];
export type Item={id:string;name:string;category:Category};
export type Taste={boldness:number;sweetness:number;creaminess:number;flavor:number;foam:number};
export type Temp='hot'|'iced'|'surprise';
export type Recipe={name:string;temp:'hot'|'iced';ingredients:{label:string;amount:string}[];steps:string[]};
export type Decision={id:string;date:string;recipe:Recipe;taste:Taste;temp:Temp;photo?:string};
export const DEFAULT_TASTE:Taste={boldness:50,sweetness:40,creaminess:50,flavor:40,foam:30};
export const DEMO:[string,Category][]=[['Espresso pods','espresso'],['Medium roast','coffee'],['Vanilla syrup','syrup'],['Caramel syrup','syrup'],['Oat milk','milk'],['Cinnamon','topping'],['Whipped cream','topping']];
export const SCAN:[string,Category][]=[['Dark roast','coffee'],['Hazelnut syrup','syrup'],['Whole milk','milk'],['Cocoa powder','topping']];
export const newId=()=>crypto.randomUUID();
export const normalize=(name:string)=>name.trim().toLocaleLowerCase();
export function addItems(inventory:Item[],entries:[string,Category][]):Item[]{
 const next=[...inventory];for(const [raw,category]of entries){const name=raw.trim().slice(0,80);if(name&&!next.some(i=>normalize(i.name)===normalize(name)))next.push({id:newId(),name,category});}return next;
}
const names={sweet:['Dessert With Responsibilities','Treat Yo Cup',"Sugar, We're Goin' Down",'Cake Was Busy'],bold:['I Said What I Said','Monday Has Been Cancelled','No Notes','Unbothered & Caffeinated'],creamy:['Smooth Operator','Velvet Hug','Soft Launch','Cloud Nine-ish'],chill:["Tomorrow's Problem",'Low Effort, High Reward','Just Vibing','Inbox Zero (Emotionally)']};
const half=(n:number)=>Math.round(n*2)/2;
function choose<T>(items:T[],count:number,random:()=>number):T[]{const pool=[...items],out:T[]=[];while(pool.length&&out.length<count)out.push(pool.splice(Math.floor(random()*pool.length),1)[0]);return out;}
export function potPlan(people:number){const n=Math.max(1,Math.min(6,Math.round(people)||1));const units=n>=5?6:n===4?4.5:n;return {scoops:units*2,waterOz:Math.round(units*11),low:units*10,high:units*12,label:n>=5?'Full pot':n===4?'¾ pot':n===3?'Half a pot':'Your pot'};}
export function makeRecipe(inv:Item[],taste:Taste,temp:Temp,random= Math.random,equipment={steamer:true,frother:true},batch={people:1,pot:false,waterOz:8}):Recipe|null{
 const by=(category:Category)=>inv.filter(i=>i.category===category);
 const coffee=by('coffee'),espresso=by('espresso');if(!coffee.length&&!espresso.length)return null;
 const actual=temp==='surprise'?(random()<.5?'hot':'iced'):temp;
 const requestedPeople=Math.max(1,Math.min(6,Math.round(batch.people)||1));
 const people=batch.pot?requestedPeople:1;
 const plan=potPlan(requestedPeople);
 const waterOz=batch.pot?Math.max(6,Math.min(72,Math.round(batch.waterOz)||plan.waterOz)):8;
 const scale=batch.pot?waterOz/8:1;
 const base=choose(!batch.pot&&taste.boldness>=40||!coffee.length? (espresso.length?espresso:coffee):coffee,1,random)[0];
 const ingredients:Recipe['ingredients']=[],steps:string[]=[];
 const syrups=taste.sweetness>5?choose(by('syrup'),1+Math.floor(taste.flavor/50),random):[];
 if(syrups.length){const pumps=half((.5+(taste.sweetness/100)*3.5)*scale);for(const s of syrups)ingredients.push({label:s.name,amount:`${pumps/syrups.length} pump${pumps/syrups.length===1?'':'s'}`});steps.push(`Add ${syrups.map(s=>s.name.toLowerCase()).join(' + ')} to your ${actual==='iced'?'glass':'mug'}.`);}
 if(base.category==='espresso'){const shots=Math.round((1+Math.round(taste.boldness/50))*scale);ingredients.unshift({label:base.name,amount:`${shots} shots (${shots} oz)`});steps.push(`Brew ${shots} espresso shots${actual==='iced'?' and set them aside':' and pour them in'}.`);}
 else{const scoops=batch.pot?plan.scoops:Math.ceil(waterOz/6);const measure=`${scoops} ${scoops===1?'scoop':'scoops'}`;ingredients.unshift({label:base.name,amount:`${measure} + ${waterOz} oz water`});steps.push(/cold brew concentrate/i.test(base.name)?`Prepare ${waterOz} oz of cold brew using the concentrate’s label ratio.`:/instant/i.test(base.name)?`Prepare ${waterOz} oz of coffee following the package directions.`:`Brew ${measure} of ${base.name.toLowerCase()} with ${waterOz} oz water. Use level scoops (1 tablespoon each). A double scoop holds 2 scoops.`);}
 const milk=taste.creaminess>5?choose(by('milk'),1,random)[0]:undefined;
 if(actual==='iced'){ingredients.push({label:'Ice',amount:`${people} full ${people===1?'glass':'glasses'}`});steps.push('Fill each glass with ice and divide the coffee between them.');}
 if(milk){const oz=half((1+(taste.creaminess/100)*7)*scale);ingredients.push({label:milk.name,amount:`${oz} oz`});steps.push(taste.foam>20&&(equipment.frother||(actual==='hot'&&equipment.steamer))?(actual==='hot'?`${equipment.steamer?'Steam':'Warm, then froth'} ${oz} oz of ${milk.name.toLowerCase()} until ${taste.foam>70?'big and fluffy':'lightly foamy'}, then pour it in.`:`Froth ${oz} oz of ${milk.name.toLowerCase()} into ${taste.foam>70?'a tall cold foam':'a light cold foam'} and float it on top.`):(actual==='hot'?`Warm ${oz} oz of ${milk.name.toLowerCase()} and pour it in.`:`Pour in ${oz} oz of cold ${milk.name.toLowerCase()}.`));}
 if(actual==='hot')steps.push('Give it a gentle swirl.');
 const toppings=taste.flavor>30?choose(by('topping'),taste.flavor>75?2:1,random):[];
 for(const topping of toppings)ingredients.push({label:topping.name,amount:(taste.flavor>75?'a generous pinch / swirl':'a light pinch / dollop')+(people>1?' per cup':'')});
 if(people>1||batch.pot){ingredients.push({label:'Makes',amount:batch.pot?`${waterOz} oz coffee for ${people} people`:`${people} drinks`});steps.push(`Divide between ${people} ${people===1?'cup':'cups'}. Add syrup, milk, and toppings to the cups, not the coffee maker.`);}
 if(toppings.length)steps.push(`Finish with ${toppings.map(t=>t.name.toLowerCase()).join(' and ')}.`);
 if(!batch.pot&&requestedPeople>1)steps.push(`This recipe makes one cup. Repeat separately for each of your ${requestedPeople} people.`);
 const mood=taste.sweetness>=65?'sweet':taste.boldness>=65?'bold':taste.creaminess>=65?'creamy':'chill';
 return{name:choose(names[mood],1,random)[0],temp:actual,ingredients,steps};
}
export const recipeText=(recipe:Recipe)=>`${recipe.name}\n${recipe.temp==='iced'?'🧊 Iced':'🔥 Hot'}\n☕ ${recipe.ingredients.map(i=>`${i.amount} ${i.label}`).join('\n☕ ')}\n\n${recipe.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\nMade with Pour Decisions\nhttps://kthamessr.github.io/pourdecisions/`;
export async function shareRecipe(recipe:Recipe,toast:(s:string)=>void){
 const text=recipeText(recipe);
 if(navigator.share){try{await navigator.share({title:recipe.name,text});return;}catch(e){if(e instanceof DOMException&&e.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(text);toast('Recipe copied to clipboard!');}catch{toast("Sharing isn't available here.");}
}
