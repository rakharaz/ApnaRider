export function normalizeMobile(input = '') {
  let m = String(input).replace(/[\s-]/g, '');
  if (m.startsWith('+92')) m = '0' + m.slice(3);
  else if (m.startsWith('92') && m.length === 12) m = '0' + m.slice(2);
  return m;
}
export const isValidMobile = (m) => /^03\d{9}$/.test(m);

export const normalizeCnic = (c = '') => String(c).replace(/\D/g, '');
export const isValidCnic = (c) => /^\d{13}$/.test(c);

export const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export const VEHICLE_TYPES = ['Motorcycle', 'Bicycle', 'Car', 'Rickshaw / Loader'];
