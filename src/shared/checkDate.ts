export const checkDate = (value: string): Date => {
  const regex = /^\d{2}.\d{2}.\d{4}$/;
  if (!regex.test(value)) {
    return null;
  }

  const [day, month, year] = value.split('.');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}
