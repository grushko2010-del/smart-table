import { cloneTemplate } from '../lib/cloneTemplate.js';

export function initTable(settings) {
  const { container, rowTemplate, before, after, onAction } = settings;

  const root = {
    container,
    before: before ?? [],
    after: after ?? [],
  };

  const updateTable = (data, state, action) => {
    const rows = root.container.querySelectorAll('.table-row');
    rows.forEach(r => r.remove());

    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      row.container.classList.add('table-row');

      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });

    const afterEl = root.after.length > 0 ? root[root.after[0]].container : null;
    nextRows.forEach(row => {
      if (afterEl) root.container.insertBefore(row, afterEl);
      else root.container.append(row);
    });
  };

  root.before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  root.after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  root.container.addEventListener('change', () => onAction());
  root.container.addEventListener('reset', () => setTimeout(() => onAction()));
  root.container.addEventListener('submit', (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  return updateTable;
}