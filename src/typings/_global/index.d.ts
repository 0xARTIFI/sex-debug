import { BalancesEnum, AllowancesEnum } from '@/configs/common';

export interface BalancesInterface {
  [BalancesEnum.ETH_IN_WALLET]: string;
  [BalancesEnum.WETH_IN_WALLET]: string;
  [BalancesEnum.USDC_IN_WALLET]: string;
  [BalancesEnum.USDC_IN_OPTION_ACCOUNT]: string;
  [BalancesEnum.ETH_IN_PERPETUAL_ACCOUNT]: string;
  [BalancesEnum.UDSC_IN_PERPETUAL_ACCOUNT]: string;
  loading: boolean;
}

export interface AllowancesInterface {
  [AllowancesEnum.WETH_IN_WALLET_ALLOWANCE]: string;
  [AllowancesEnum.USDC_IN_WALLET_ALLOWANCE]: string;
}
