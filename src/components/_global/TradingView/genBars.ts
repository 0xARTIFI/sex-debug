/* eslint-disable @iceworks/best-practices/recommend-polyfill */
import dayjs from 'dayjs';

const intervalTask: any = {};
let oldSubscriberUID = '';
const timeOut = 10000;

const timeScale: any = {
  5: '5m',
  15: '15m',
  30: '30m',
  60: '1h',
  120: '2h',
  240: '4h',
  720: '12h',
  D: '1d',
  // W: "7d"
};

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

const getKline = (chainId: number, period: string, limit: number) => {
  // @ts-ignore
  return fetch(
    `https://stats.gmx.io/api/candles/ETH?preferableChainId=${chainId}&period=${period}&preferableSource=fast&limit=${limit}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    },
  );
};

// ticker, resolution, formatTo, firstDataRequest, size, type
async function getBars(ticker: string, resolution: any, formatTo: number, firstDataRequest: any, size = 2000) {
  let klineList: string | any[] = [];

  // 发送api获取数据
  const res = await getKline(42161, timeScale[resolution.toString()], size);
  const resText: any = await res?.text();
  const response = JSON.parse(resText);
  if (!response?.prices?.length) return [];
  klineList = JSON.parse(JSON.stringify(response?.prices));

  //   {
  //     "t": 1673793000,
  //     "o": 1532.4,
  //     "c": 1537.82,
  //     "h": 1537.82,
  //     "l": 1532.37
  // }
  const bars: Bar[] = [];
  for (let i = 0; i < klineList.length; i++) {
    const item = klineList[i];
    const ifArray = Array.isArray(item);
    bars.push({
      time: +dayjs.unix(item.t),
      open: Number(item.o),
      high: Number(item.h),
      low: Number(item.l),
      close: Number(item.c),
    });
  }
  return bars;
}

export async function useGenGetBars(
  symbolInfo: { ticker: any },
  resolution: any,
  from: any,
  to: number,
  onHistoryCallback: (arg0: Bar[], arg1: { noData: boolean }) => void,
  onErrorCallback: (arg0: any) => void,
  firstDataRequest: any,
) {
  const { ticker } = symbolInfo;
  const formatTo = firstDataRequest ? new Date().getTime() : Math.floor(to / 60) * 60 * 1000;
  try {
    const bars: Bar[] = await getBars(ticker, resolution, formatTo, false, 1000);
    bars.sort((l, r) => (l.time > r.time ? 1 : -1));

    console.log('useGenGetBars', bars);
    onHistoryCallback(bars, {
      noData: bars.length === 0,
    });
  } catch (e) {
    console.error('getbar error', e);
    // @ts-ignore
    onErrorCallback(e.message || e.data?.ret_msg || 'some error');
    // 防止后端数据异常时无限刷接口，影响后端服务
    if (!firstDataRequest) {
      onHistoryCallback([], {
        noData: true,
      });
    }
  }
}

export function useGenSubscribeBars(
  symbolInfo: { ticker: any },
  resolution: any,
  onRealtimeCallback: (arg0: Bar) => void,
  subscriberUID: string,
  onResetCacheNeededCallback: any,
  type: any,
) {
  const { ticker } = symbolInfo;
  if (oldSubscriberUID !== '') {
    if (intervalTask[oldSubscriberUID]) {
      clearTimeout(intervalTask[oldSubscriberUID]);
      // console.log('clear old bars', oldSubscriberUID)
    }
  }
  oldSubscriberUID = subscriberUID;

  const func = async () => {
    try {
      const formatTo = new Date().getTime();
      const bars: Bar[] = await getBars(ticker, resolution, formatTo, true, 1);
      if (bars.length > 0) {
        bars[0].time = formatTo;
        onRealtimeCallback(bars[0]);
      }
      console.log('useGenSubscribeBars', bars);
      // console.log('get bars', ticker, subscriberUID, resolution)
      intervalTask[subscriberUID] = setTimeout(func, timeOut);
    } catch (e: any) {
      // console.log('error bars', ticker, subscriberUID, resolution)
      clearTimeout(intervalTask[subscriberUID]);
    }
  };
  intervalTask[subscriberUID] = setTimeout(func, timeOut);
}

export function useGenUnsubscribeBars(subscriberUID: string | number) {
  if (intervalTask[subscriberUID]) {
    clearTimeout(intervalTask[subscriberUID]);
  }
}
