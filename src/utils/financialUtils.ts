export function formatCurrency(amount: number, currency: string = 'USD ($)', includeUnit: boolean = true): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let symbol = '$';
  if (currency.includes('EUR') || currency.includes('€')) symbol = '€';
  if (currency.includes('GBP') || currency.includes('£')) symbol = '£';

  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (isNegative) {
    return includeUnit ? `(${symbol}${formatted}k)` : `(${symbol}${formatted})`;
  }
  return includeUnit ? `${symbol}${formatted}k` : `${symbol}${formatted}`;
}

export function formatVariance(variance: number, accountType: string, currency: string = 'USD ($)'): { text: string; isFavorable: boolean; isNeutral: boolean } {
  if (variance === 0) {
    return { text: '$0k', isFavorable: true, isNeutral: true };
  }

  // For costs (cogs, opex, cash_out, liability increase), a positive variance (actual < budget) is favorable
  // For revenue, assets, cash_in, equity, actual > budget (positive variance) is favorable
  const isCost = ['cogs', 'opex', 'cash_out'].includes(accountType);
  const isFavorable = isCost ? variance > 0 : variance > 0;
  
  let symbol = '$';
  if (currency.includes('EUR') || currency.includes('€')) symbol = '€';
  if (currency.includes('GBP') || currency.includes('£')) symbol = '£';

  const abs = Math.abs(variance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const sign = variance > 0 ? '+' : '-';

  return {
    text: `${sign}${symbol}${abs}k`,
    isFavorable,
    isNeutral: false,
  };
}

export function formatPercent(pct: number): string {
  if (pct === 0) return '0.0%';
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        let str = String(val ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          str = `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(',');
  };

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(processRow).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
