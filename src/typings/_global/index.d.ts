import { AllowancesEnum, BalancesEnum, TRADE_DIRECTION_ENUM } from '@/configs/common';

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

export interface SinglePositionInterface {
  leverage: string;
  netValue: string;
  earnings: string;
  earningRates: string;
  collateral: string;
  originEntryPrice: string;
  entryPrice: string;
  size: string;
  sizeValue: string;
  liqPrice: string;
  totalPositionValue: string;
  direction: string;
}
export interface PositionsInterface {
  [TRADE_DIRECTION_ENUM.LONG]: SinglePositionInterface;
  [TRADE_DIRECTION_ENUM.SHORT]: SinglePositionInterface;
}

export interface Error {
  message: string;
  name: string;
  stack?: string;
}
