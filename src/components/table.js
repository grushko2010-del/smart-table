  const updateTable = (data, state, action) => {
    // 1. Очищаем только строки, оставляя before/after (шапку и пагинацию)
    const rows = root.container.querySelectorAll('.table-row'); // Предположим, строки имеют класс .table-row
    rows.forEach(r => r.remove());

    // 2. Создаем строки
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);
      // Добавим класс для удобного удаления в будущем
      row.container.classList.add('table-row'); 

      Object.keys(item).forEach((key) => {
        if (key in row.elements) {
          row.elements[key].textContent = item[key];
        }
      });
      return row.container;
    });

    // 3. Вставляем строки перед 'after' блоками
    const afterContainer = root.after.length > 0 ? root[root.after[0]].container : null;
    nextRows.forEach(row => {
      if (afterContainer) {
        root.container.insertBefore(row, afterContainer);
      } else {
        root.container.append(row);
      }
    });
  };