export function prefixZero(num) {
  if (typeof num !== 'number') {
    return '';
  }
  return num < 10 ? `0${num}` : num;
}

export function dateFormat(date, format = 'YYYY-MM-DD') {
  if (!date || typeof date !== 'string' || typeof format !== 'string') {
    return '';
  }
  const isoDate = date.replace(' ', 'T');
  const newDate = new Date(isoDate);
  const newFormat = format.toUpperCase();
  const year = newDate.getFullYear();
  const month = prefixZero(newDate.getMonth() + 1);
  const day = prefixZero(newDate.getDate());
  const hour = prefixZero(newDate.getHours());
  const minute = prefixZero(newDate.getMinutes());

  switch (newFormat) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'YYYY-MM-DD HH:MM':
      return `${year}-${month}-${day} ${hour}:${minute}`;
    case 'HH:MM':
      return `${hour}:${minute}`;
    default:
      return '';
  }
}
