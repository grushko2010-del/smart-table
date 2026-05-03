import { cloneTemplate } from '../lib/cloneTemplate.js';

export function initTable(settings) {
  const { container, rowTemplate, before, after } = settings;

  const root = {
    container,
  };

  root.before = before ?? [];
  root.after = after ?? [];

  const updateTable = (data, state, action) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (key in row.elements) {
          row.elements[key].textContent = item[key];
        }
      });

      return row.container;
    });

    root.container.replaceChildren(
      ...root.before.map((name) => root[name].container),
      ...nextRows,
      ...root.after.map((name) => root[name].container)
    );
  };

  root.before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  root.after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  root.container.addEventListener('change', () => {
    settings.onAction();
  });

  root.container.addEventListener('reset', () => {
    setTimeout(() => settings.onAction());
  });

  root.container.addEventListener('submit', (e) => {
    e.preventDefault();
    settings.onAction(e.submitter);
  });

  return updateTable;
}