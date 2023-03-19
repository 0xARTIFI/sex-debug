function formatResolution(resolution: string) {
  const reg = /^1([A-Z])$/;
  const match = reg.exec(resolution);
  const fResolution = match ? match[1] : resolution;
  return fResolution;
}

export class Datafeed {
  supportedResolutions: string[];
  symbols: any;
  getBars: (
    symbolInfo: any,
    resolution: any,
    periodParams: {
      from: any;
      to: any;
      firstDataRequest: any;
    },
    onHistoryCallback: any,
    onErrorCallback: any,
  ) => void;
  subscribeBars: (
    symbolInfo: any,
    resolution: any,
    onRealtimeCallback: any,
    subscriberUID: any,
    onResetCacheNeededCallback: any,
  ) => void;
  unsubscribeBars: any;
  constructor({ symbols, getBars, subscribeBars, unsubscribeBars }: any) {
    // this.supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720', '1D', '1W', '1M']
    this.supportedResolutions = ['5', '15', '60', '240', 'D'];
    this.symbols = symbols;

    this.getBars = (
      symbolInfo: any,
      resolution: any,
      periodParams: { from: any; to: any; firstDataRequest: any },
      onHistoryCallback: any,
      onErrorCallback: any,
    ) => {
      const { from, to, firstDataRequest } = periodParams;

      getBars(symbolInfo, formatResolution(resolution), from, to, onHistoryCallback, onErrorCallback, firstDataRequest);
    };
    this.subscribeBars = (
      symbolInfo: any,
      resolution: any,
      onRealtimeCallback: any,
      subscriberUID: any,
      onResetCacheNeededCallback: any,
    ) => {
      subscribeBars(
        symbolInfo,
        formatResolution(resolution),
        onRealtimeCallback,
        subscriberUID,
        onResetCacheNeededCallback,
      );
    };
    this.unsubscribeBars = unsubscribeBars;
  }

  onReady(
    configurationData: (arg0: {
      exchanges: never[];
      symbolsTypes: never[];
      supported_resolutions: any;
      supports_marks: boolean;
      supports_search: boolean;
      supports_time: boolean;
      supports_timescale_marks: boolean;
      has_no_volume: boolean;
    }) => void,
  ) {
    setTimeout(() => {
      configurationData({
        exchanges: [],
        symbolsTypes: [],
        supported_resolutions: this.supportedResolutions,
        supports_marks: false,
        supports_search: false,
        supports_time: true,
        supports_timescale_marks: false,
        has_no_volume: true,
      });
    }, 0);
  }

  searchSymbols(userInput: string, exchange: any, symbolType: any, onResultReadyCallback: (arg0: any[]) => void) {
    const result = [];
    for (const name in this.symbols) {
      if (name.indexOf(userInput) !== -1) {
        result.push(this.symbols[name]);
      }
    }
    onResultReadyCallback(result);
  }

  resolveSymbol(symbolName: string, onSymbolResolvedCallback: (arg0: any) => void, onResolveErrorCallback: () => void) {
    setTimeout(() => {
      let symbolInfo = null;
      for (const name in this.symbols) {
        if (name.indexOf(symbolName) !== -1) {
          symbolInfo = this.symbols[name];
          break;
        }
      }
      if (symbolInfo) {
        onSymbolResolvedCallback(symbolInfo);
      } else {
        onResolveErrorCallback();
      }
    });
  }
}

export default Datafeed;
