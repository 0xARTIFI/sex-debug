import { atom } from 'recoil';
import { BalancesEnum, BalancesInterface } from './types';

export const recoilBalances = atom<BalancesInterface>({
  key: 'balances',
  default: {
    [BalancesEnum.ETH_IN_WALLET]: '0',
    [BalancesEnum.WETH_IN_WALLET]: '0',
    [BalancesEnum.USDC_IN_WALLET]: '0',
    [BalancesEnum.USDC_IN_OPTION_ACCOUNT]: '0',
    [BalancesEnum.ETH_IN_PERPETUAL_ACCOUNT]: '0',
    [BalancesEnum.UDSC_IN_PERPETUAL_ACCOUNT]: '0',
    loading: false,
  },
});
