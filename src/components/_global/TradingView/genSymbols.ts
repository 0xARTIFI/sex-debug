interface SymbolProps {
  ticker: string;
  symbol: string;
  name: string;
  description: string;
  type: string;
  session: string;
  timezone: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  has_weekly_and_monthly: boolean;
  exchange: string;
}

interface Symbols {
  [key: string]: SymbolProps;
}

export async function getSymbols() {
  const symbols: Symbols = {
    ETH: {
      ticker: 'ETH',
      symbol: 'ETH',
      name: 'ETH-USD',
      description: 'ETH',
      type: '.ETH',
      session: '24x7',
      timezone: 'UTC',
      minmov: 1, // 最小波动
      pricescale: 10, // 价格精度
      has_intraday: true, // 是否提供日内分钟数据
      has_weekly_and_monthly: true,
      exchange: '',
    },
  };

  return symbols;
}
