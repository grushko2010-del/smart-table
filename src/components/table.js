import { cloneTemplate } from '../lib/cloneTemplate.js';

/**
 * @param {{
 *   container: HTMLElement,
 *   rowTemplate: HTMLElement,
 *   before: Array<string>,
 *   after: Array<string>
 * }} settings
 */
export function initTable(settings) {
  const { container, rowTemplate, before, after } = settings;

  const root = {
    container,
    templates: new Map(),
  };

  root.before = before ?? [];
  root.after = after ?? [];
  root.rowTemplate = rowTemplate;

  /** @param {Array<unknown>} data */
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

  // @todo: #1.2
  root.before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  root.after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // @todo: #1.3
  root.container.addEventListener('change', () => {
    onAction();
  });

  root.container.addEventListener('reset', () => {
    setTimeout(onAction);
  });

  root.container.addEventListener('submit', (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  return updateTable;
}