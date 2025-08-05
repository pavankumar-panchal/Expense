// ---------- State ----------
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
const form  = document.getElementById('expenseForm');
const list  = document.getElementById('expenseList');
const totalEl = document.getElementById('total');
const filterCat = document.getElementById('filterCategory');

// ---------- Utility ----------
const save = () => localStorage.setItem('expenses', JSON.stringify(expenses));
const fmt  = (n) => '₹' + (+n).toFixed(2);
const today = () => new Date().toISOString().substr(0, 10);

// Default date
document.getElementById('date').value = today();

// ---------- Render ----------
function render() {
  const category = filterCat.value;
  const filtered = category === 'All' ? expenses : expenses.filter(e => e.category === category);

  list.innerHTML = '';
  let total = 0;

  filtered.forEach((exp, i) => {
    total += parseFloat(exp.amount);
    const tr = document.createElement('tr');
    tr.className = 'border-t hover:bg-gray-50';
    tr.innerHTML = `
      <td class="px-4 py-3">${exp.date}</td>
      <td class="px-4 py-3">${exp.title}</td>
      <td class="px-4 py-3">
        <span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">${exp.category}</span>
      </td>
      <td class="px-4 py-3 text-right font-medium">${fmt(exp.amount)}</td>
      <td class="px-4 py-3 text-center">
        <button data-index="${i}" class="deleteBtn text-red-600 hover:text-red-800 font-semibold">✕</button>
      </td>
    `;
    list.appendChild(tr);
  });

  totalEl.textContent = fmt(total);
}

// ---------- Add ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newExp = {
    date: form.date.value,
    title: form.title.value.trim(),
    amount: parseFloat(form.amount.value),
    category: form.category.value
  };
  expenses.push(newExp);
  save();
  render();
  form.reset();
  form.date.value = today();
});

// ---------- Delete ----------
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteBtn')) {
    const idx = parseInt(e.target.dataset.index, 10);
    expenses.splice(idx, 1);
    save();
    render();
  }
});

// ---------- Filter ----------
filterCat.addEventListener('change', render);

// ---------- Initialize ----------
render();
