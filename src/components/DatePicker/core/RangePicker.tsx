import * as React from 'react';
import Calendar from './DatePicker';
import { useRecoilValue } from 'recoil';
import { recoilLocale } from '@/models/_global';
import dayjs, { Dayjs } from 'dayjs';

import localeEn from 'dayjs/locale/en';
import localeEs from 'dayjs/locale/es';
import localePt from 'dayjs/locale/pt';

const LOCALE_DAYJS = {
  'en-US': localeEn,
  'es-ES': localeEs,
  'pt-PT': localePt,
};

export interface RangeCalendarProps {
  value?: number[];
  onChange: (timeStampList: number[]) => any;
}

const RangeCalendar = (props: RangeCalendarProps) => {
  const { value = [], onChange } = props;
  const locale = useRecoilValue(recoilLocale);

  const now = dayjs(value[0]).locale(LOCALE_DAYJS[locale]);
  const next = now.add(1, 'month');
  // 用来标记当前用户选择的是最大值还是最小值，能整除2就是最小值
  const currentStepRef = React.useRef(0);
  const [sequenceMonth, setSequenceMonth] = React.useState<Dayjs[]>([now, next]);
  const [rangeDateList, setRangeDateList] = React.useState<number[]>(value);
  const [hoverDateList, setHoverDateList] = React.useState<number[]>([]);
  /**
   * 当日历组件选择某个日期时，根据当前状态判断是选择的最大日期还是最小日期
   */
  const handleChooseDate = React.useCallback(
    (date: dayjs.Dayjs) => {
      let tempRangeDateList: number[] = [];

      const isMin = currentStepRef.current % 2 === 0;
      if (isMin) {
        tempRangeDateList = [date.startOf('day').valueOf()];
      } else {
        // 判断第二次选中的日期是前面还是后面，
        const prevTime = rangeDateList[0];
        const nowChooseTime = +date;
        if (prevTime <= nowChooseTime) {
          tempRangeDateList = [prevTime, date.endOf('day').valueOf()];
        } else {
          tempRangeDateList = [nowChooseTime, dayjs(prevTime).endOf('day').valueOf()];
        }
      }

      // console.log(isMin, tempRangeDateList);
      currentStepRef.current++;
      setRangeDateList(tempRangeDateList);

      if (tempRangeDateList.length === 2) {
        setHoverDateList([]);
      }

      if (typeof onChange === 'function' && !isMin) {
        onChange(tempRangeDateList);
      }
    },
    [setRangeDateList, rangeDateList, onChange],
  );

  /**
   * 当日历组件上的月份被改变时触发
   */
  const handleChangeMonth = React.useCallback(
    (type: 'left' | 'right', d: Dayjs) => {
      if (type === 'left') {
        setSequenceMonth([d, d.add(1, 'M')]);
      }
      if (type === 'right') {
        setSequenceMonth([d.subtract(1, 'M'), d]);
      }
    },
    [setSequenceMonth],
  );

  const handleHoverDate = React.useCallback(
    (date: number) => {
      if (rangeDateList.length !== 1) return;
      setHoverDateList([rangeDateList[0], date]);
    },
    [rangeDateList],
  );

  return (
    <div className="row-center">
      <Calendar
        isForRange
        value={rangeDateList[0]}
        propMonth={sequenceMonth[0]}
        onChange={handleChooseDate}
        onOver={handleHoverDate}
        rangeDateList={rangeDateList}
        hoverRangeDateList={hoverDateList}
        onChangeMonth={(d) => handleChangeMonth('left', d)}
      />
      <Calendar
        isForRange
        value={rangeDateList[1]}
        propMonth={sequenceMonth[1]}
        onChange={handleChooseDate}
        onOver={handleHoverDate}
        rangeDateList={rangeDateList}
        hoverRangeDateList={hoverDateList}
        onChangeMonth={(d) => handleChangeMonth('right', d)}
      />
    </div>
  );
};

export default RangeCalendar;
