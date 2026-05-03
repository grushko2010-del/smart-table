import { initTable } from './components/table.js';
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

import { data as sourceData } from './data/dataset_1.js';
import { initData } from './data/initData.js';
import { cloneTemplate } from './lib/cloneTemplate.js';
import { processFormData } from './lib/utils.js';

const { data, indexes } = initData(sourceData);

// Инициализируем шаблоны, опираясь на их ID в index.html
const sampleTable = {
  container: cloneTemplate('table').container,
  pagination: cloneTemplate('pagination'),
  header: cloneTemplate('header'),
  filter: cloneTemplate('filter'),
  search: cloneTemplate('search'),
};

function collectState(fields) {
  const state = processFormData(fields);
  return {
    ...state,
    rowsPerPage: parseInt(state.rowsPerPage || 10),
    page: parseInt(state.page || 1),
  };
}

function onAction(action) {
  const fields = sampleTable.container.querySelectorAll('input, select');
  const state = collectState(fields);
  let result = [...data];

  // Цепочка модулей
  result = initSearching('search')(result, state, action);
  result = initFiltering(sampleTable.filter.elements, { searchBySeller: indexes.sellers })(result, state, action);
  result = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal,
  ])(result, state, action);
  
  result = initPagination(sampleTable.pagination.elements, (el, page, isCurrent) => {
    const input = el.querySelector('input');
    const label = el.querySelector('span');
    if (input) { input.value = page; input.checked = isCurrent; }
    if (label) { label.textContent = page; }
    return el;
  })(result, state, action);

  tableUpdator(result, state, action);
}

const tableUpdator = initTable({
  container: sampleTable.container,
  rowTemplate: document.getElementById('row'), // Используем верный ID из index.html
  before: ['search', 'header', 'filter'],
  after: ['pagination'],
  onAction,
});

onAction();

// Вставляем таблицу в div с id="app"
const rootElement = document.getElementById('app');
if (rootElement) {
    rootElement.append(sampleTable.container);
}