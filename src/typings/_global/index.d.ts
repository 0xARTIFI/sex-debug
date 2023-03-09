export enum BalancesEnum {
  ETH_IN_WALLET = 'ETH_IN_WALLET',
  WETH_IN_WALLET = 'WETH_IN_WALLET',
  USDC_IN_WALLET = 'USDC_IN_WALLET',
  USDC_IN_OPTION_ACCOUNT = 'USDC_IN_OPTION_ACCOUNT',
  ETH_IN_PERPETUAL_ACCOUNT = 'ETH_IN_PERPETUAL_ACCOUNT',
  UDSC_IN_PERPETUAL_ACCOUNT = 'UDSC_IN_PERPETUAL_ACCOUNT',
}

export enum AllowancesEnum {
  WETH_IN_WALLET_ALLOWANCE = 'WETH_IN_WALLET_ALLOWANCE',
  USDC_IN_WALLET_ALLOWANCE = 'USDC_IN_WALLET_ALLOWANCE',
}

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
