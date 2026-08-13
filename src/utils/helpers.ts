/**
 * Centralized utility helpers for Nexus Cobranças
 */

// 1. Currency Formatter (Intl.NumberFormat) BRL
export const formatCurrency = (value: number | string): string => {
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (isNaN(numeric)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numeric);
};

// 2. Date Formatter from ISO/DB (YYYY-MM-DD or TIMESTAMPTZ) to pt-BR (DD/MM/YYYY)
export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/D';
  try {
    const cleanDate = dateString.split('T')[0]; // handle timestamp formats
    const [year, month, day] = cleanDate.split('-');
    if (!year || !month || !day) return dateString;
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

// 3. Normalizer to strip masks from documents (CPF/CNPJ) or phone numbers
export const normalizeDigits = (val: string): string => {
  return val.replace(/\D/g, '');
};

// 4. Phone formater (e.g. 79998476431 -> (79) 99847-6431)
export const formatPhone = (phoneStr: string): string => {
  const cleaned = normalizeDigits(phoneStr);
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phoneStr;
};

// 5. Document mask formatter (CPF or CNPJ)
export const formatDocument = (docStr: string): string => {
  const cleaned = normalizeDigits(docStr);
  if (cleaned.length === 11) {
    // CPF: 000.000.000-00
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  } else if (cleaned.length === 14) {
    // CNPJ: 00.000.000/0001-00
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
  }
  return docStr;
};
