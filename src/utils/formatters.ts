export function formatMoneyNum(val: number): string {
  if (isNaN(val)) return "R$ 0,00";
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val);
}

export function formatPercentage(val: number): string {
  return `${(val * 100).toFixed(2).replace('.', ',')}%`;
}

export function parseValue(val: string | number): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = val.toString().replace(/[R$\s]/g, '').trim();
  if (!str) return 0;

  // If string contains comma, it is Brazilian format (e.g. 767.897,50 or 767897,50)
  if (str.includes(',')) {
    const cleaned = str.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  // If string has dots: check if it's thousands separator (e.g. 767.897 or 1.500.000) or raw float (767897.50)
  if (str.includes('.')) {
    const dotCount = (str.match(/\./g) || []).length;
    if (dotCount > 1) {
      return parseFloat(str.replace(/\./g, '')) || 0;
    }
    const parts = str.split('.');
    if (parts[1].length === 3) {
      // Thousands separator, e.g. 250.000
      return parseFloat(parts.join('')) || 0;
    } else {
      return parseFloat(str) || 0;
    }
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
}

export function parsePercentage(val: string | number): number {
  if (typeof val === 'number') return val;
  if (!val && val !== '0' && val !== '0%') return 0.0032;
  const cleaned = val.toString().replace('%', '').replace(',', '.').trim();
  if (cleaned === '' || cleaned === ',') return 0.0032;
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || parsed < 0) return 0.0032;
  return parsed / 100;
}

export function gerarMesesDinamicos(quantidade: number): string[] {
  const meses = [];
  const hoje = new Date();
  
  for (let i = 0; i < quantidade; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice(-2);
    meses.push(`${mes}/${ano}`);
  }
  
  return meses;
}

export function exportToCSV(filename: string, rows: (string | number)[][]): void {
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
    + rows.map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
