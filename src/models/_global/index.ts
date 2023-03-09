import { BalancesEnum, TRADE_DIRECTION_ENUM } from '@/configs/common';
import type { BalancesInterface, PositionsInterface } from '@/typings/_global';
import { atom } from 'recoil';

export const recoilBalances = atom<BalancesInterface & { loading: boolean }>({
  key: 'balances',
  default: {
    [BalancesEnum.ETH_IN_WALLET]: '0',
    [BalancesEnum.WETH_IN_WALLET]: '0',
    [BalancesEnum.USDC_IN_WALLET]: '0',
    [BalancesEnum.USDC_IN_ACCOUNT]: '0',
    [BalancesEnum.WETH_IN_ACCOUNT]: '0',
    loading: false,
  },
});

export const recoilPositions = atom<PositionsInterface>({
  key: 'positions',
  default: {
    [TRADE_DIRECTION_ENUM.LONG]: {
      leverage: '0',
      netValue: '0',
      earnings: '0',
      earningRates: '0',
      collateral: '0',
      originEntryPrice: '0',
      entryPrice: '0',
      size: '0',
      sizeValue: '0',
      liqPrice: '0',
      totalPositionValue: '0',
      direction: '0',
    },
    [TRADE_DIRECTION_ENUM.SHORT]: {
      leverage: '0',
      netValue: '0',
      earnings: '0',
      earningRates: '0',
      collateral: '0',
      originEntryPrice: '0',
      entryPrice: '0',
      size: '0',
      sizeValue: '0',
      liqPrice: '0',
      totalPositionValue: '0',
      direction: '0',
    },
  },
});
