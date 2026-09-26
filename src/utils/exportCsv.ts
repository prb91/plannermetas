/**
 * Utilitário de exportação para Excel / CSV compatível com acentuação e formato pt-BR
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  // Adiciona BOM para o Excel no Windows reconhecer UTF-8 corretamente
  const BOM = '\uFEFF';
  
  const csvContent = rows.map(row => 
    row.map(cell => {
      const cellStr = String(cell ?? '');
      // Se contiver vírgula, aspas ou ponto e vírgula, envelopa em aspas
      if (cellStr.includes(';') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(';')
  );

  const fullContent = BOM + [headers.join(';'), ...csvContent].join('\r\n');
  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
