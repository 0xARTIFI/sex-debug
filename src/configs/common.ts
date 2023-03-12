import exchangeAbi from '@/configs/abi/exchange.json';
import leverageLongAbi from '@/configs/abi/leverageLong.json';
import leverageShortAbi from '@/configs/abi/leverageShort.json';
import lpPoolAbi from '@/configs/abi/lpPool.json';
import optionAbi from '@/configs/abi/option.json';
import { erc20ABI } from '@wagmi/core';

export const MAX_ALLOWANCE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const isProd = import.meta.env.MODE === 'production';

export const {
  VITE_APP_USDC: USDCAddress,
  VITE_APP_WETH: WETHAddress,
  VITE_APP_SubstanceExchange: SubstanceExchange,
  VITE_APP_LeverageLong: LeverageLong,
  VITE_APP_LeverageShort: LeverageShort,
  VITE_APP_LiquidityPool: LiquidityPool,
  VITE_APP_Option: Option,
} = import.meta.env;

export const USDCContract = { address: USDCAddress, abi: erc20ABI };

export const WETHContract = { address: WETHAddress, abi: erc20ABI };

export const LeverageLongContaact = { address: LeverageLong, abi: leverageLongAbi };

export const LeverageShortContract = { address: LeverageShort, abi: leverageShortAbi };

export const exchangeContract = { address: SubstanceExchange, abi: exchangeAbi };

export const liquidityPoolContract = { address: LiquidityPool, abi: lpPoolAbi };

export const optionContract = { address: Option, abi: optionAbi };

export enum BalancesEnum {
  ETH_IN_WALLET = 'ETH_IN_WALLET',
  WETH_IN_WALLET = 'WETH_IN_WALLET',
  USDC_IN_WALLET = 'USDC_IN_WALLET',
  WETH_IN_ACCOUNT = 'WETH_IN_ACCOUNT',
  USDC_IN_ACCOUNT = 'USDC_IN_ACCOUNT',
}

export enum AllowancesEnum {
  WETH_IN_WALLET_ALLOWANCE = 'WETH_IN_WALLET_ALLOWANCE',
  USDC_IN_WALLET_ALLOWANCE = 'USDC_IN_WALLET_ALLOWANCE',
}

export enum TRADE_DIRECTION_ENUM {
  LONG = 'LONG',
  SHORT = 'SHORT',
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  CALL = 'CALL',
  PUT = 'PUT',
}

export enum TRADE_TOKEN {
  USDC = 'USDC',
  WETH = 'WETH',
}
