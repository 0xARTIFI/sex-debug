import { AllowancesEnum, BalancesEnum, TRADE_DIRECTION_ENUM } from '@/configs/common';
import type {
  AllowancesInterface,
  BalancesInterface,
  OptionPositionItem,
  PositionsInterface,
  Token,
} from '@/typings/_global';
import { atom } from 'recoil';

export const recoilOptionEpochIds = atom<{
  startEpochId: string | undefined;
  endEpochId: string | undefined;
  historicalEpochIds: string[];
}>({
  key: 'optionEpochId',
  default: {
    startEpochId: undefined,
    endEpochId: undefined,
    historicalEpochIds: [],
  },
});

export const recoilOptionCurEpochIdExerciseTime = atom<{
  exerciseTime: number | undefined;
}>({
  key: 'optionCurEpochIdExerciseTime',
  default: {
    exerciseTime: undefined,
  },
});

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

export const recoilAllowance = atom<AllowancesInterface & { loading: boolean }>({
  key: 'allowance',
  default: {
    [AllowancesEnum.USDC_IN_WALLET_ALLOWANCE]: '0',
    [AllowancesEnum.WETH_IN_WALLET_ALLOWANCE]: '0',
    loading: false,
  },
});

export const recoilPoolBalances = atom<{
  totalPoolUSDCBalance: string;
  totalPoolWETHBalance: string;
  userPoolBalance: string;
  totalPoolBalance: string;
  lockedUSDCBalance: string;
  loading: boolean;
}>({
  key: 'lpBalances',
  default: {
    userPoolBalance: '0',
    totalPoolBalance: '0',
    totalPoolUSDCBalance: '0',
    totalPoolWETHBalance: '0',
    lockedUSDCBalance: '0',
    loading: false,
  },
});

export const recoilExchangeTokenPrice = atom<{
  tokenPrice: string;
  loading: boolean;
}>({
  key: 'exchangeTokenPrice',
  default: {
    tokenPrice: '0',
    loading: false,
  },
});

export const recoilExchangeFuturePrice = atom<{
  futurePrice: string;
  loading: boolean;
}>({
  key: 'exchangeFuturePrice',
  default: {
    futurePrice: '0',
    loading: false,
  },
});

// todo redesign
// 支持多币种
export const recoilPerpetualPositions = atom<PositionsInterface>({
  key: 'perpetualPositions',
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

export const recoilAllOptionPositions = atom<OptionPositionItem[]>({
  key: 'allOptionPositions',
  default: [],
});

export const recoilUnsettledOptionPositions = atom<OptionPositionItem[]>({
  key: 'unsettledOptionPositions',
  default: [],
});

export const recoilSettledOptionPositions = atom<OptionPositionItem[]>({
  key: 'settledOptionPositions',
  default: [],
});

export const recoilCurrentToken = atom<Token>({
  key: 'currentToken',
  default: {
    image: require('@/assets/images/tokens/eth.svg'),
    decimal: 18,
    value: 'WETH',
    label: 'ETH',
    disabled: false,
  },
});

export const recoilKlinePrice = atom<any>({
  key: 'klinePrice',
  default: {
    priceChangeRate: 0,
    priceHigh: 0,
    priceLow: 0,
    indexPrice: 0,
    currentPrice: 0,
  },
});
