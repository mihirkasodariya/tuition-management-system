const getInitials = (fullName) => {
  const names = fullName.split(' ');
  const initials = names
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  return initials;
};

export default getInitials;

export const getNumberFromPx = (px = '0px') => {
  if (typeof px === 'string' && px.includes('px')) {
    return Number(px.replace('px', ''));
  } else if (typeof px === 'string' && px.includes('%')) {
    return Number(px.replace('%', ''));
  }
  return Number(px);
};
