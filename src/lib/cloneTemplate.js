export function cloneTemplate(templateOrName) {
  const tmpl = typeof templateOrName === 'string'
    ? document.getElementById(templateOrName)
    : templateOrName;

  if (!tmpl) {
    console.warn(`Template ${templateOrName} not found!`);
    const emptyDiv = document.createElement('div');
    return { container: emptyDiv, elements: {} };
  }

  const clone = tmpl.content.cloneNode(true);
  const container = document.createElement('div');
  container.append(clone);

  const elements = {};
  const findElements = (el) => {
    const name = el.dataset.name;
    if (name) elements[name] = el;
    Array.from(el.children).forEach(findElements);
  };
  findElements(container);

  return { container, elements };
}