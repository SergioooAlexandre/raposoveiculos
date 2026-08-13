export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatKm(mileage: number | undefined | null): string {
  if (mileage === undefined || mileage === null || isNaN(mileage)) return '0 km';
  return `${new Intl.NumberFormat('pt-BR').format(mileage)} km`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return phone;
}

export function cleanPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export function calculateFinancing(
  vehiclePrice: number,
  downPayment: number,
  installmentsCount: number,
  monthlyInterestRatePercent: number = 1.49
) {
  const financedAmount = Math.max(0, vehiclePrice - downPayment);
  if (financedAmount === 0 || installmentsCount <= 0) {
    return {
      vehiclePrice,
      downPayment,
      financedAmount: 0,
      installmentsCount,
      monthlyInterestRate: monthlyInterestRatePercent,
      monthlyPayment: 0,
      totalFinanced: downPayment,
      totalInterest: 0,
    };
  }

  const i = (monthlyInterestRatePercent || 1.49) / 100;
  // PMT Formula: P = (r * PV) / (1 - (1 + r)^(-n))
  const monthlyPayment = (i * financedAmount) / (1 - Math.pow(1 + i, -installmentsCount));
  const totalFinanced = monthlyPayment * installmentsCount + downPayment;
  const totalInterest = (monthlyPayment * installmentsCount) - financedAmount;

  return {
    vehiclePrice,
    downPayment,
    financedAmount,
    installmentsCount,
    monthlyInterestRate: monthlyInterestRatePercent,
    monthlyPayment,
    totalFinanced,
    totalInterest,
  };
}
