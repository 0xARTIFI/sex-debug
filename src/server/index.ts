import { Address } from 'wagmi';

// todo 处理成3分钟缓存  避免多次发接口
export const getSignatureAndPrice = async () => {
  const res = await fetch('https://option.btcta.io/api/trading/get_substance_option_prices_sign', {
    method: 'GET',
  });
  const text = await res.json();
  return text;
};

// option当期产品价格查询
// get_substance_option_price_map
export const getOptionPriceMap = async () => {
  const res = await fetch('https://option.btcta.io/api/trading/get_substance_option_price_map', {
    method: 'GET',
  });
  const text = await res.json();
  return text;
};

// option购买价格查询接口
// /api/trading/get_substance_option_buy_price
export const getOptionByPrice = async (epoch_id: any, product_id: any) => {
  const res = await fetch(
    `https://option.btcta.io/api/trading/get_substance_option_buy_price?epoch_id=${epoch_id}&product_id=${product_id}`,
    {
      method: 'GET',
    },
  );
  const text = await res.json();
  return text;
};

// https://option.btcta.io/api/trading/send_substance_token?address
export const getFaucet = async (address: Address) => {
  const res = await fetch(`https://option.btcta.io/api/trading/send_substance_token?address=${address}`, {
    method: 'GET',
  });
  const text = await res.json();
  return text;
};
