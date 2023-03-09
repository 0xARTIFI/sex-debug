import ERC20ABI from './abis/erc20.json';

export const USDC = '0x4cc596122d5326E447843447b54CbbaA8fAA2D2b' as const;
export const WETH = '0xA9B927911d42B8129d2af7632dC1a85c397a4a84' as const;
export const SubstanceExchange = '0x9678c7Aa49708AdD9e8661324958794F2b69C87e' as const;
export const LeverageLong = '0x9D4229BaFc286754CE44dfB304CF85c05C1c86a1' as const;
export const LeverageShort = '0x04BA35dEd4604aDE86235cbE398bFd4dEFae6c32' as const;
export const LiquidityPool = '0xbd56C4057dd799DBe163aa653c0DAA5Fb616D432' as const;

export const USDCContract = { address: USDC, abi: ERC20ABI };

export const WETHContract = { address: WETH, abi: ERC20ABI };

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
