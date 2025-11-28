export const typeHandler = (types) => {
  if (!types || types.length === 0) return 'unknown';
  if (types[1]) {
    return types[0].type.name + ' | ' + types[1].type.name;
  }
  return types[0].type.name;
};

export default { typeHandler };
