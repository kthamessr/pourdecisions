import { createRecipe } from './recipes.js';
const app = document.querySelector('#app');
const categories = ['Coffee', 'Espresso / pods', 'Syrups', 'Creamers / milk', 'Toppings'];
const storageKey = 'pourdecisions.ingredients.v1';
function loadIngredients() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved.filter(i => i && typeof i.name === 'string' && i.name.trim() && i.name.length <= 80 && categories.includes(i.category)) : [];
  } catch { return []; }
}
const state = { ingredients: loadIngredients(), editing: null, mood: {temperature:'hot',sweetness:'light',strength:'regular'}, recipe:null, storageError:false };
function saveIngredients() {
  try { localStorage.setItem(storageKey, JSON.stringify(state.ingredients)); state.storageError=false; }
  catch { state.storageError=true; }
  state.recipe=null;
}
const link = (label, route, secondary = false) => `<a class="button ${secondary ? 'secondary' : ''}" href="#${route}">${label}</a>`;
const intro = (eyebrow, title, text) => `<p class="eyebrow">${eyebrow}</p><h1 tabindex="-1">${title}</h1><p class="lede">${text}</p>`;
const items = () => {
  if (!state.ingredients.length) return '<p class="empty">Your ingredient list is empty. Add what you have to get started.</p>';
  return '<ul class="ingredients">' + state.ingredients.map((item, index) => state.editing === index
    ? `<li class="editing"><form id="edit-form"><label for="edit-ingredient">Ingredient</label><input id="edit-ingredient" name="ingredient" maxlength="80" value="${escapeHtml(item.name)}" required><label for="edit-category">Category</label><select id="edit-category" name="category">${categories.map(category => `<option${category === item.category ? ' selected' : ''}>${category}</option>`).join('')}</select><div class="edit-actions"><button class="button" type="submit">Save changes</button><button class="button secondary" type="button" data-cancel>Cancel</button></div><p id="edit-feedback" role="status"></p></form></li>`
    : `<li><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.category)}</span></div><div class="edit-actions"><button class="remove" data-edit="${index}" aria-label="Edit ${escapeHtml(item.name)}">Edit</button><button class="remove" data-remove="${index}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button></div></li>`).join('') + '</ul>';
};
function escapeHtml(text) {
  return text.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}
function entry(missing) {
  return intro('Your cupboard, your call', missing ? 'Something’s missing' : 'I Got it', missing ? 'Fill in anything your ingredient list needs.' : 'Tell us what’s already in your kitchen.') + `
  <form id="ingredient-form"><label for="ingredient">Ingredient</label><input id="ingredient" name="ingredient" maxlength="80" placeholder="e.g., Vanilla syrup" required>
  <label for="category">Category</label><select id="category" name="category">${categories.map(category => `<option>${category}</option>`).join('')}</select><button class="button" type="submit">Add ingredient</button></form>
  <p id="feedback" role="status"></p>${items()}<div class="actions">${link('Look Right?', 'inventory')}${link('Back home', 'home', true)}</div>`;
}
const screens = {
  home: () => intro('A little curiosity. A better cup.', 'Pour Decisions', 'It’s what’s inside that counts.') + `<img class="coffee-art" src="assets/coffee-cup.webp" alt="Creamy coffee with heart-shaped milk foam in a ceramic cup" width="640" height="593"><h2>What’s the scoop?</h2><p>Start with what you have. See where it takes you.</p><div class="actions">${link('What’s the scoop?', 'scoop')}${link('I Got it', 'manual', true)}</div>`,
  scoop: () => intro('Take a look inside', 'What’s the scoop?', 'Gather your coffee, syrups, creamers, and toppings.') + `<div class="note"><strong>Photo scanning is coming next.</strong><p>For now, enter your ingredients yourself. No photo is uploaded or analyzed.</p></div><div class="actions">${link('I Got it', 'manual')}${link('Look Right?', 'inventory', true)}</div>`,
  manual: () => entry(false),
  missing: () => entry(true),
  inventory: () => intro('Your starting lineup', 'Look Right?', 'Check what’s in your cupboard before choosing your next cup.') + items() + `<div class="actions">${link('Something’s missing', 'missing', true)}${state.ingredients.length ? link('That’s It', 'mood') : ''}</div>`,
  mood: () => moodScreen(),
  recipe: () => recipeScreen()
};
const moodSliderOptions = {
  temperature: [['hot','Hot'],['iced','Iced']],
  sweetness: [['none','No added syrup'],['light','Lightly sweet'],['sweet','Sweet']],
  strength: [['regular','Regular'],['bold','Bold']]
};
app.addEventListener('input', event => {
  const name=event.target.dataset.moodSlider;
  if (!name || !moodSliderOptions[name]) return;
  const [value,label]=moodSliderOptions[name][Number(event.target.value)];
  state.mood[name]=value;
  event.target.setAttribute('aria-valuetext',label);
  document.querySelector('#'+name+'-value').textContent=label;
});
function ingredientSelect(label, name, allowed, optional=true) {
  return `<label for="${name}">${label}</label><select id="${name}" name="${name}">${optional?'<option value="">None</option>':''}${state.ingredients.filter(i=>allowed.includes(i.category)).map(i=>`<option value="${escapeHtml(i.name)}"${state.mood[name]===i.name?' selected':''}>${escapeHtml(i.name)} (${escapeHtml(i.category)})</option>`).join('')}</select>`;
}
function moodScreen() {
  const heading=intro('Your cup, your way','What’s Your Mood?','Choose how you want your next cup to feel.');
  if(!state.ingredients.some(i=>['Coffee','Espresso / pods'].includes(i.category))) return heading+'<p class="empty">Add coffee or espresso to make your first pour decision.</p>'+link('Something’s missing','missing');
  const choice=(label,name,options)=>{
    const selected=Math.max(0,options.findIndex(([value])=>state.mood[name]===value));
    return `<div class="mood-slider"><div class="slider-heading"><label for="${name}">${label}</label><output for="${name}" id="${name}-value">${options[selected][1]}</output></div><input type="range" id="${name}" name="${name}" min="0" max="${options.length-1}" step="1" value="${selected}" data-mood-slider="${name}" aria-valuetext="${options[selected][1]}"><div class="slider-labels" aria-hidden="true">${options.map(([,text])=>`<span>${text}</span>`).join('')}</div></div>`;
  };
  return heading+`<form id="mood-form">${choice('Temperature','temperature',[['hot','Hot'],['iced','Iced']])}${choice('Sweetness','sweetness',[['none','No added syrup'],['light','Lightly sweet'],['sweet','Sweet']])}${choice('Coffee strength','strength',[['regular','Regular'],['bold','Bold']])}${ingredientSelect('Start with','base',['Coffee','Espresso / pods'],false)}${ingredientSelect('Syrup','syrup',['Syrups'])}${ingredientSelect('Creamer or milk','milk',['Creamers / milk'])}${ingredientSelect('Topping','topping',['Toppings'])}<button class="button" type="submit">Make a Pour Decision</button></form><p class="small-note">No added syrup skips syrup. Creamers and toppings may already contain sugar. Choose None for any ingredient you don’t want.</p><div class="actions">${link('Edit ingredients','inventory',true)}</div>`;
}
function recipeScreen() {
  if(!state.recipe) return intro('Your next cup awaits','Make a Pour Decision','Choose your mood to create a recipe with your ingredients.')+link('Choose my mood','mood');
  const r=state.recipe;
  return intro('Your pour decision',escapeHtml(r.title),'A little something made from what you’ve got.')+`<h2>What goes in</h2><ul class="recipe-amounts">${r.amounts.map(i=>`<li><strong>${escapeHtml(i.amount)}</strong> — ${escapeHtml(i.name)}</li>`).join('')}</ul><h2>Make it yours</h2><ol class="recipe-steps">${r.steps.map(step=>`<li>${escapeHtml(step)}</li>`).join('')}</ol><p class="small-note">${escapeHtml(r.note)}</p><div class="actions">${link('Try another mood','mood')}${link('My ingredients','inventory',true)}</div>`;
}
function render() {
  const route = location.hash.slice(1) || 'home';
  if (!screens[route]) { location.replace('#home'); return; }
  app.innerHTML = screens[route]() + (state.storageError ? '<p role="status" class="small-note">Your browser couldn’t save ingredients. They stay available until this page closes.</p>' : '');
  app.querySelector('h1').focus({ preventScroll: true });
  document.querySelectorAll('nav a').forEach(anchor => {
    if (anchor.hash === `#${route}`) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
}
app.addEventListener('submit', event => {
  if(event.target.id==='mood-form') {
    event.preventDefault();
    state.mood=Object.fromEntries(new FormData(event.target));
    for (const [name, options] of Object.entries(moodSliderOptions)) state.mood[name]=options[Number(state.mood[name])][0];
    state.recipe=createRecipe(state.ingredients,state.mood);
    location.hash=state.recipe?'#recipe':'#missing';
    return;
  }
  if (event.target.id === 'edit-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    const name = data.get('ingredient').trim();
    if (!name) { document.querySelector('#edit-feedback').textContent = 'Enter an ingredient name.'; return; }
    const index = state.editing;
    state.ingredients[index] = { name, category: data.get('category') };
    saveIngredients();
    state.editing = null;
    render();
    app.querySelector(`[data-edit="${index}"]`).focus();
    return;
  }
  if (event.target.id !== 'ingredient-form') return;
  event.preventDefault();
  const data = new FormData(event.target);
  const name = data.get('ingredient').trim();
  if (!name) { document.querySelector('#feedback').textContent = 'Enter an ingredient name.'; return; }
  state.ingredients.push({ name, category: data.get('category') });
  saveIngredients();
  render();
  document.querySelector('#feedback').textContent = `${name} added.`;
  document.querySelector('#ingredient').focus();
});
app.addEventListener('click', event => {
  const edit = event.target.closest('[data-edit]');
  if (edit) {
    state.editing = Number(edit.dataset.edit);
    render();
    document.querySelector('#edit-ingredient').focus();
    return;
  }
  if (event.target.closest('[data-cancel]')) {
    const index = state.editing;
    state.editing = null;
    render();
    app.querySelector(`[data-edit="${index}"]`).focus();
    return;
  }
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  state.ingredients.splice(Number(button.dataset.remove), 1);
  saveIngredients();
  state.editing = null;
  render();
});
window.addEventListener('hashchange', () => { state.editing = null; render(); });
render();
