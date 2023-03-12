import { AllowancesEnum, BalancesEnum, TRADE_DIRECTION_ENUM } from '@/configs/common';
import { BigNumber } from 'ethers';

export interface BalancesInterface {
  [BalancesEnum.ETH_IN_WALLET]: string;
  [BalancesEnum.WETH_IN_WALLET]: string;
  [BalancesEnum.USDC_IN_WALLET]: string;
  [BalancesEnum.USDC_IN_ACCOUNT]: string;
  [BalancesEnum.WETH_IN_ACCOUNT]: string;
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

export interface OptionPositionItem {
  epochId: string;
  productId: string;
  isCall: boolean;
  strikePrice: string;
  isSettle: boolean;
  totalCost: string;
  totalCostOrigin: BigNumber;
  totalSize: string;
}

export interface Error {
  message: string;
  name: string;
  stack?: string;
}

export type USDCAmount = string;
export type WETHAmount = string;

export interface Position {
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
