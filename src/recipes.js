export function createRecipe(ingredients, mood) {
  const find = (category, name) => ingredients.find(i => i.category === category && i.name === name);
  const base = ingredients.find(i => ['Coffee','Espresso / pods'].includes(i.category) && i.name === mood.base);
  if (!base) return null;
  const espresso = base.category === 'Espresso / pods', iced = mood.temperature === 'iced', bold = mood.strength === 'bold';
  const syrup = find('Syrups',mood.syrup), milk = find('Creamers / milk',mood.milk), topping = find('Toppings',mood.topping);
  const tsp = {none:0,light:1,sweet:2}[mood.sweetness] ?? 0;
  const amounts = [{name:base.name,amount:espresso ? `${bold ? 2 : 1} espresso shot${bold ? 's' : ''}` : `${iced ? 6 : 8} fl oz brewed coffee`}];
  const steps = [espresso ? `Brew ${bold ? 'two espresso shots' : 'one espresso shot'} with ${base.name}, following your machine instructions.` : `Brew ${iced ? 6 : 8} fl oz of ${base.name}${bold ? ' using your machine’s strong setting, if available' : ''}.`];
  if(syrup && tsp){amounts.push({name:syrup.name,amount:`${tsp} tsp`});steps.push(`Stir in ${tsp} tsp of ${syrup.name}.`);}
  if(milk){const amount=espresso?'4 fl oz':'2 tbsp';amounts.push({name:milk.name,amount});steps.push(iced?`Add ${amount} of cold ${milk.name}.`:`Warm ${amount} of ${milk.name} and stir it in. Froth it if suitable and desired.`);}
  if(espresso && !milk){amounts.push({name:'Water',amount:'4 fl oz'});steps.push(`Add 4 fl oz of ${iced?'cold':'hot'} water.`);}
  if(iced){amounts.push({name:'Ice',amount:'½–1 cup'});steps.push('Let the coffee cool briefly, then pour into a heat-safe glass over ½–1 cup of ice.');}
  if(topping){amounts.push({name:topping.name,amount:'A small sprinkle or drizzle'});steps.push(`Finish with a small sprinkle or drizzle of ${topping.name}, as appropriate.`);}
  steps.push('Stir, taste, and adjust to your preference.');
  return {title:`${iced?'Iced':'Hot'} ${syrup && tsp?syrup.name+' ':''}${espresso?(milk?'Latte':'Americano'):(milk?'Creamy Coffee':'Coffee')}`,amounts,steps,note:'A starting recipe using your ingredients. Water and ice are assumed kitchen basics. Creamers and toppings may already be sweetened. Strength and sweetness vary by product; adjust after tasting.'};
}
