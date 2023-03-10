export const getSignatureAndPrice = async () => {
  const res = await fetch('https://option.btcta.io/api/trading/get_substance_option_prices_sign', {
    method: 'GET',
  });
  const text = await res.json();
  return text;
};
