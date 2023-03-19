import { useCallback, useEffect, useRef } from 'react';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import UTC from 'dayjs/plugin/utc';
// import { getOverrides, getStudiesOverrides, mainBg } from './chartTheme';
import { IChartingLibraryWidget, ResolutionString, Timezone, widget } from 'charting_library';
// import { IChartingLibraryWidget, ResolutionString, Timezone, widget } from '../../../../public/charting_library';
import { recoilExchangeFuturePrice, recoilKlinePrice } from '@/models/_global';
import { useMount, useUnmount } from 'ahooks';
import BigNumber from 'bignumber.js';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Datafeed } from './Datafeed';
import { useGenGetBars, useGenSubscribeBars, useGenUnsubscribeBars } from './genBars';
import { getSymbols } from './genSymbols';
import overrides from './overrides';

dayjs.extend(UTC);
dayjs.extend(timezone);

const GLOBAL_COMPONENT_NAME = 'TestTVChartComponent';

const TVChart = ({ disabled_features }: { disabled_features?: any[] }) => {
  const { futurePrice } = useRecoilValue(recoilExchangeFuturePrice);
  const setPrice = useSetRecoilState(recoilKlinePrice);

  useEffect(() => {
    if (futurePrice) {
      setPrice((old: any) => {
        const _old = JSON.parse(JSON.stringify(old));
        return {
          ..._old,
          indexPrice: BigNumber(futurePrice).div(100).toString(),
        };
      });
    }
  }, [futurePrice]);

  // const [prices, setPrices] = useState({
  //   priceChangeRate: 0,
  //   priceHigh: 0,
  //   priceLow: 0,
  //   indexPrice: 0,
  // });

  const widgetRef = useRef<(IChartingLibraryWidget & { _ready: boolean }) | null>(null);

  const createAndInitWidget = useCallback(async () => {
    if (widgetRef.current) return;
    try {
      const symbols = await getSymbols();
      const symbol = 'ETH';

      // eslint-disable-next-line new-cap
      const curWidget = new widget({
        autosize: true,
        theme: 'Dark',
        timezone: dayjs.tz.guess() as Timezone,
        interval: '15' as ResolutionString,
        library_path: '/charting_library/',
        symbol,
        overrides,
        datafeed: new Datafeed({
          symbols,
          getBars: useGenGetBars,
          subscribeBars: useGenSubscribeBars,
          unsubscribeBars: useGenUnsubscribeBars,
        }),
        container: GLOBAL_COMPONENT_NAME,
        locale: 'en',
        custom_css_url: './custom.css',
        auto_save_delay: 0,
        disabled_features: disabled_features || [
          // 'main_series_scale_menu',
          // 'header_widget',
          // 'header_widget_dom_node',
          // 'symbol_search_hot_key',
          // 'header_resolutions',
          // 'header_interval_dialog_button',
          // 'show_interval_dialog_on_key_press',
          // 'header_chart_type',
          // 'header_indicators',
          // 'header_undo_redo',
          // 'header_screenshot',
          // 'header_settings',
          // 'header_fullscreen_button',
          // 'left_toolbar',
          // 'border_around_the_chart',
          // 'header_saveload',
          'timeframes_toolbar',
          // 'legend_widget',
          // 'use_localstorage_for_settings',
          // 'show_chart_property_page',
          'context_menus',
          'control_bar', //   底部工具栏
          // 'remove_library_container_border',
          'go_to_date',
          // 'volume_force_overlay',
          // 'display_market_status',
          'create_volume_indicator_by_default',
          'header_symbol_search',
          // 'header_compare',
        ],
        enabled_features: [
          'items_favoriting',
          'side_toolbar_in_fullscreen_mode',
          'header_in_fullscreen_mode',
          'show_dom_first_time',
        ],
        saved_data: { charts: [] },
      }) as IChartingLibraryWidget & { _ready: boolean };

      widgetRef.current = curWidget;

      curWidget.onChartReady(async () => {
        // 初次加载
        // curWidget
        //   .activeChart()
        //   .onDataLoaded()
        //   .subscribe(null, (...props) => console.log("New history bars are loaded", props));
        const currentPrice = +dayjs().unix();
        const prev24Hour = currentPrice - 60 * 60 * 24;
        console.log('prev24Hour', currentPrice, prev24Hour);

        // 获取最近的300条数据，需要to参数
        const data = await curWidget.chart().exportData({
          includedStudies: 'all',
          from: prev24Hour,
          to: currentPrice,
        });
        console.log('data', data);

        // 0 - time; 1 - o; 2 - h; 3 - l; 4- c
        const prev = data?.data?.slice(0, 1)[0];
        const latest = data?.data?.slice(-1)[0];

        const prevPrice = prev.slice(-1)[0];
        const latestPrice = latest.slice(-1)[0];

        const fullClosePrice = data?.data?.map((i) => i?.slice(-1)[0]);

        const priceChangeRate = ((latestPrice - prevPrice) / latestPrice) * 100;
        const priceHigh = Math.max(...fullClosePrice);
        const priceLow = Math.min(...fullClosePrice);

        setPrice((old: any) => {
          const _old = JSON.parse(JSON.stringify(old));
          return {
            ..._old,
            priceChangeRate,
            priceHigh,
            priceLow,
            currentPrice: latestPrice,
          };
        });

        // k线更新
        curWidget.subscribe('onTick', (...props) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const latestPrice = props[0]?.close;

          setPrice((old: any) => ({
            ...old,
            currentPrice: latestPrice,
          }));
        });
      });

      // console.log('widgetRef.current',curWidget.activeChart())
      // widgetRef.current.activeChart().onDataLoaded().subscribe(null, () => console.log('New history bars are loaded'))
    } catch (err) {
      console.log('err', err);
    }
  }, [disabled_features, setPrice]);

  useMount(() => {
    createAndInitWidget();
  });

  useUnmount(() => {
    if (widgetRef?.current) {
      widgetRef?.current?.remove();
    }
  });

  return (
    <>
      <div
        style={{
          height: '480px',
          padding: '12px 6px 12px 0',
          borderRadius: '12px',
          background: '#1E1F25',
        }}
      >
        <div
          style={{
            height: '100%',
            // minHeight: '220px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <div style={{ flexGrow: 1 }} id={GLOBAL_COMPONENT_NAME} />
        </div>
      </div>
    </>
  );
};

export default TVChart;
