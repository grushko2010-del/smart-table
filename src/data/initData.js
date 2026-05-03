export function initData(sourceData) {
  const data = Array.isArray(sourceData) ? sourceData : (sourceData.data || []);
  
  const sellersSet = new Set();
  data.forEach((row) => {
    if (row.seller) sellersSet.add(row.seller);
  });

  return {
    data: data,
    indexes: {
      sellers: Array.from(sellersSet).sort(),
    },
  };
}