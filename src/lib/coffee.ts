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
 const base=choose((!batch.pot&&taste.boldness>=40)||!coffee.length?(espresso.length?espresso:coffee):coffee,1,random)[0];
 const ingredients:Recipe['ingredients']=[],steps:string[]=[];
 const perCup=batch.pot?' per cup':'';
 const measure=(n:number,unit:'tsp'|'tbsp'|'oz')=>`${Number(n.toFixed(2))} ${unit}`;
 const spoon=(tsp:number)=>tsp>=3&&tsp%3===0?measure(tsp/3,'tbsp'):measure(tsp,'tsp');
 const dairy=by('milk');
 const isHeavy=(i:Item)=>/heavy|whipping cream|double cream/i.test(i.name);
 const isCreamer=(i:Item)=>/creamer|sweet cream|sweet.*creamy|macchiato/i.test(i.name)&&!isHeavy(i);
 const heavy=dairy.find(isHeavy),creamer=dairy.find(isCreamer);
 const regular=dairy.filter(i=>!isHeavy(i)&&!isCreamer(i));
 const canFoam=taste.foam>20&&(equipment.frother||(actual==='hot'&&equipment.steamer));
 const daughterFoam=canFoam&&equipment.frother&&!!heavy&&!!creamer;
 const milk=taste.creaminess>5?choose(regular.length?regular:dairy,1,random)[0]:undefined;
 const syrups=taste.sweetness>5?choose(by('syrup'),1+Math.floor(taste.flavor/50),random):[];
 // One syrup budget per cup, allocated to either the drink or its foam.
 const syrupTsp=syrups.length?half(.5+2.5*taste.sweetness/100):0;
 const syrupInFoam=canFoam&&equipment.frother&&syrups.length>0;
 if(base.category==='espresso'){const shots=1+Math.round(taste.boldness/50);ingredients.push({label:base.name,amount:`${shots} shots (${shots} oz)`});steps.push(`Brew ${shots} espresso shots and set them aside.`);}
 else{const scoops=batch.pot?plan.scoops:Math.ceil(waterOz/6);const amount=`${scoops} ${scoops===1?'scoop':'scoops'}`;const special=/cold brew concentrate|instant/i.test(base.name);ingredients.push({label:base.name,amount:special?`${waterOz} oz prepared coffee (follow label ratio)`:`${amount} + ${waterOz} oz water`});steps.push(special?`Prepare ${waterOz} oz of ${base.name.toLowerCase()} following the package directions.`:`Brew ${amount} of ${base.name.toLowerCase()} with ${waterOz} oz water. Use level scoops (1 tablespoon each). A double scoop holds 2 scoops.`);}
 steps.push(actual==='iced'?'Grab a 16–20 oz glass for each drink. Leave room for ice, milk, and foam.':'Grab a 12–16 oz cup for each drink. Leave room for milk and foam.');
 for(const syrup of syrups)ingredients.push({label:`${syrup.name}${syrupInFoam?' (for foam)':''}`,amount:spoon(syrupTsp/syrups.length)+perCup});
 if(syrups.length&&!syrupInFoam)steps.push(`Add the measured ${syrups.map(s=>s.name.toLowerCase()).join(' + ')} to ${batch.pot?'each cup':'your cup'}.`);
 if(actual==='iced'){ingredients.push({label:'Ice',amount:'Fill cup halfway'+perCup});steps.push('Fill each glass halfway with ice. Pour in coffee, leaving room for the extras.');}
 else steps.push(batch.pot?`Divide the coffee between ${people} cups, leaving room for extras. Keep milk and syrup out of the coffee maker.`:'Pour in your coffee, leaving room for extras.');
 if(milk){const dense=isHeavy(milk)||isCreamer(milk);const amount=dense?half((isHeavy(milk)?.5:1)+taste.creaminess/100*(isHeavy(milk)?.5:2)):half(.5+taste.creaminess/100*1.5);const unit=dense?'tbsp':'oz';ingredients.push({label:`${milk.name} (in coffee)`,amount:measure(amount,unit)+perCup});steps.push(`${actual==='hot'?'Warm':'Measure'} ${measure(amount,unit)} of ${milk.name.toLowerCase()} for each cup, then stir it into the coffee.`);}
 if(canFoam){
  const foamBase=daughterFoam?heavy:regular[0]??heavy??creamer;
  if(foamBase){
   if(daughterFoam){ingredients.push({label:`${heavy!.name} (for foam)`,amount:'3 tbsp'+perCup},{label:`${creamer!.name} (for foam)`,amount:'2 tbsp'+perCup});steps.push(`For each cup, combine 3 tbsp ${heavy!.name.toLowerCase()} + 2 tbsp ${creamer!.name.toLowerCase()}${syrupInFoam?' + the measured syrup':''}. Froth together in a separate container. This makes a small foam batch; you do not need to use it all.`);}
   else{ingredients.push({label:`${foamBase.name} (for foam)`,amount:'2 tbsp'+perCup});steps.push(`${actual==='hot'&&!isHeavy(foamBase)?(equipment.steamer?'Steam':'Warm, then froth'):'Froth'} 2 tbsp ${foamBase.name.toLowerCase()}${syrupInFoam?' with the measured syrup':''} separately for each cup. Follow your equipment’s minimum fill level if making a larger batch.`);}
   steps.push(`Spoon ${taste.foam>70?'as much foam as you like':'a little foam'} onto each drink. Stop before the cup is full; any remaining foam is optional.`);
  }else if(syrupInFoam){steps.push('No milk or cream for foam? Stir the measured syrup into the coffee instead.');}
 }
 
 const toppings=taste.flavor>30?choose(by('topping'),taste.flavor>75?2:1,random):[];
 for(const topping of toppings)ingredients.push({label:topping.name,amount:(taste.flavor>75?'a generous pinch / swirl':'a light pinch / dollop')+perCup});
 if(toppings.length)steps.push(`Finish each cup with ${toppings.map(t=>t.name.toLowerCase()).join(' and ')}.`);
 if(batch.pot){ingredients.push({label:'Makes',amount:`${waterOz} oz coffee for ${people} people`});steps.push('Milk, syrup, foam, and topping amounts above are per cup. Dress each cup separately.');}
 else if(requestedPeople>1)steps.push(`This recipe makes one cup. Repeat separately for each of your ${requestedPeople} people.`);
 if(creamer&&syrups.length)steps.push('Creamer may already be sweet. Start with less syrup if yours is sweetened, then taste.');
 const mood=taste.sweetness>=65?'sweet':taste.boldness>=65?'bold':taste.creaminess>=65?'creamy':'chill';
 return{name:choose(names[mood],1,random)[0],temp:actual,ingredients,steps};
}
export const recipeText=(recipe:Recipe)=>`${recipe.name}\n${recipe.temp==='iced'?'🧊 Iced':'🔥 Hot'}\n☕ ${recipe.ingredients.map(i=>`${i.amount} ${i.label}`).join('\n☕ ')}\n\n${recipe.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\nMade with Pour Decisions\nhttps://kthamessr.github.io/pourdecisions/`;
export async function shareRecipe(recipe:Recipe,toast:(s:string)=>void){
 const text=recipeText(recipe);
 if(navigator.share){try{await navigator.share({title:recipe.name,text});return;}catch(e){if(e instanceof DOMException&&e.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(text);toast('Recipe copied to clipboard!');}catch{toast("Sharing isn't available here.");}
}
