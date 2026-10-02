const app = document.querySelector('#app');
const categories = ['Coffee', 'Espresso / pods', 'Syrups', 'Creamers / milk', 'Toppings'];
// In-memory state keeps this first foundation free of accounts and storage dependencies.
const state = { ingredients: [], editing: null };
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
  mood: () => intro('A taste of what’s next', 'What’s Your Mood?', 'Your ingredients are ready. Mood controls and drink suggestions are the next step.') + `<div class="note"><strong>Drink suggestions are coming next.</strong><p>This foundation stops at your ingredient list.</p></div>${items()}<div class="actions">${link('Edit ingredients', 'inventory')}${link('Back home', 'home', true)}</div>`
};
function render() {
  const route = location.hash.slice(1) || 'home';
  if (!screens[route]) { location.replace('#home'); return; }
  app.innerHTML = screens[route]();
  app.querySelector('h1').focus({ preventScroll: true });
  document.querySelectorAll('nav a').forEach(anchor => {
    if (anchor.hash === `#${route}`) anchor.setAttribute('aria-current', 'page');
    else anchor.removeAttribute('aria-current');
  });
}
app.addEventListener('submit', event => {
  if (event.target.id === 'edit-form') {
    event.preventDefault();
    const data = new FormData(event.target);
    const name = data.get('ingredient').trim();
    if (!name) { document.querySelector('#edit-feedback').textContent = 'Enter an ingredient name.'; return; }
    const index = state.editing;
    state.ingredients[index] = { name, category: data.get('category') };
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
  state.editing = null;
  render();
});
window.addEventListener('hashchange', () => { state.editing = null; render(); });
render();
