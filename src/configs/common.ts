import { erc20ABI } from '@wagmi/core';

export const isProd = import.meta.env.MODE === 'production';

export const {
  VITE_APP_USDC: USDC,
  VITE_APP_WETH: WETH,
  VITE_APP_SubstanceExchange: SubstanceExchange,
  VITE_APP_LeverageLong: LeverageLong,
  VITE_APP_LeverageShort: LeverageShort,
  VITE_APP_LiquidityPool: LiquidityPool,
} = import.meta.env;

export const USDCContract = { address: USDC, abi: erc20ABI };

export const WETHContract = { address: WETH, abi: erc20ABI };

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
