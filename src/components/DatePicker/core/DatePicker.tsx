/* eslint-disable react/no-array-index-key */
import classNames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';

import dayjs, { Dayjs } from 'dayjs';
// import locale from 'dayjs/locale/zh-cn';
import localeEn from 'dayjs/locale/en';
import localeEs from 'dayjs/locale/es';
import localePt from 'dayjs/locale/pt';

import isToday from 'dayjs/plugin/isToday';
import toObject from 'dayjs/plugin/toObject';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.extend(toObject);
dayjs.extend(isToday);

const LOCALE_DAYJS = {
  'en-US': localeEn,
  'es-ES': localeEs,
  'pt-PT': localePt,
};

const Wrapper = styled.div`
  width: 292px;
  font-size: 12px;
  padding: 0 10px 10px 10px;
  background: ${(props) => props.theme.backgroundColorThird};
  transition: all 0.3s ease-in-out;
  /* &.shadow {
    border: 1px solid ${(props) => props.theme.lineColorPrimary};
    overflow: hidden;
    border-radius: 5px;
  } */
  .header {
    height: 40px;
    .iconfont {
      padding: 6px 7px;
      border-radius: 2px;
      font-size: 12px;
      color: #bac2c7;
      user-select: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &:hover {
        color: #00ba3d;
        background: ${(props) => props.theme.backgroundColorSecond};
      }
    }
    span {
      flex: 1;
      font-weight: 500;
      font-size: 14px;
      color: ${(props) => props.theme.textColorPrimary};
      transition: all 0.3s ease-in-out;
      text-align: center;
    }
  }
  .week {
    li {
      width: 38px;
      height: 28px;
      line-height: 28px;
      font-weight: 500;
      font-size: 12px;
      text-align: center;
      color: #bac2c7;
    }
  }
  .content {
    .days {
      margin: 3px;
    }
    .cell {
      width: 38px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      transition: 0.25s ease-out;
      position: relative;
      box-sizing: border-box;
      border-color: #00ba3d;
      /* 选中的状态，最小日期和最大日期 */
      &.cell__selected:not(.disabled) {
        .cell-inner {
          background-color: #00ba3d;
          color: ${(props) => props.theme.backgroundColorPrimary};
          transition: all 0.3s ease-in-out;
        }
        &.start:not(.end)::after {
          content: '';
          background-color: rgba(0, 186, 61, 0.1);
          width: 50%;
          height: 100%;
          z-index: 0;
          right: 0;
          position: absolute;
        }
        &.end:not(.start)::after {
          content: '';
          background-color: rgba(0, 186, 61, 0.1);
          width: 50%;
          height: 100%;
          z-index: 0;
          left: 0;
          position: absolute;
        }
      }
      /** 在最大与最小日期内的日期 */
      &.cell__inview:not(.disabled) {
        background-color: rgba(0, 186, 61, 0.1);
        color: ${(props) => props.theme.textColorPrimary};
        transition: all 0.3s ease-in-out;
      }
      &.cell__hover:not(.disabled) {
        &::before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          z-index: 0;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          border-top: 1px dashed #00ba3d;
          border-bottom: 1px dashed #00ba3d;
        }
        &.cell__hover--start {
          &.cell__selected {
            &::before {
              display: none;
            }
            &::after {
              left: 50%;
              border-top: 1px dashed #00ba3d;
              border-left: none;
              border-bottom: 1px dashed #00ba3d;
            }
          }
        }
        &.cell__hover--start,
        &.cell__hover-edge--start {
          &::after {
            content: '';
            display: block;
            width: 50%;
            height: 100%;
            z-index: 0;
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            background-color: transparent;
            border-left: 1px dashed #00ba3d;
          }
        }
        &.cell__hover--end {
          &.cell__selected {
            &::before {
              display: none;
            }
            &::after {
              left: 0;
              border-right: none;
              border-top: 1px dashed #00ba3d;
              border-bottom: 1px dashed #00ba3d;
            }
          }
        }
        &.cell__hover--end,
        &.cell__hover-edge--end {
          &::after {
            content: '';
            display: block;
            width: 50%;
            height: 100%;
            z-index: 0;
            box-sizing: border-box;
            position: absolute;
            left: 50%;
            top: 0;
            background-color: transparent;
            border-right: 1px dashed #00ba3d;
          }
        }
      }
      &.cell__noSelect:not(.disabled) {
        background: ${(props) => props.theme.backgroundColorSecond};
        transition: all 0.3s ease-in-out;
        color: ${(props) => props.theme.textColorFifth};
        cursor: not-allowed;
      }
      &:not(.disabled):not(.cell__selected):not(.cell__hover):not(.cell__inview) {
        color: ${(props) => props.theme.textColorPrimary};
        transition: all 0.3s ease-in-out;
        .cell-inner:hover {
          background: ${(props) => props.theme.backgroundColorSecond};
        }
      }
      &:not(.disabled).cell__inview {
        .cell-inner:hover {
          background: rgba(0, 186, 61, 0.4);
        }
      }
      .cell-inner {
        position: relative;
        z-index: 2;
        min-width: 28px;
        line-height: 28px;
        height: 28px;
        display: inline-block;
        transition: all 0.3s ease-in-out;
        border-radius: 2px;
      }
    }
    .disabled {
      color: ${(props) => props.theme.textColorFifth};
      transition: all 0.3s ease-in-out;
      cursor: not-allowed;
    }
  }
`;

interface DayType {
  date: Dayjs;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isCurrentDay: boolean;
  isMonthStartDay: boolean;
  isMonthEndDay: boolean;
  isWeekStartDay: boolean;
  isWeekEndDay: boolean;
  isInsideRange?: boolean;
  isOuterRange?: boolean;
  isMinDateInRange?: boolean;
  isMaxDateInRange?: boolean;
  isInRangeHover?: boolean;
  isStartRangeHover?: boolean;
  isEndRangeHover?: boolean;
}

export interface CalendarProps {
  value?: number;
  isForRange?: boolean;
  rangeDateList?: number[];
  hoverRangeDateList?: number[];
  propMonth?: Dayjs;
  onChange?: (date: dayjs.Dayjs) => any;
  onChangeMonth?: (firstDate: Dayjs) => any;
  onOver?: (date: number) => any;
}

type WeekType = DayType[];

const Calendar = (props: CalendarProps) => {
  const { value, onChange, isForRange, rangeDateList, hoverRangeDateList, onChangeMonth, onOver, propMonth } = props;
  const locale = 'en-US';

  const defaultMonth = (value ? dayjs(value) : dayjs()).locale(LOCALE_DAYJS[locale]);
  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(propMonth || defaultMonth);

  const [selectedDate, setSelectedDate] = React.useState<Dayjs>(value ? dayjs(value) : dayjs());
  const [arrayOfDays, setArrayOfDays] = React.useState<WeekType[]>([]);

  /**
   * 渲染日历头部，年份
   */
  const handlePrevMonth = (params: 'month' | 'year') => {
    const minus = (currentMonth as Dayjs).subtract(1, params);

    if (isForRange === true) {
      typeof onChangeMonth === 'function' && onChangeMonth(minus);
      return;
    }

    setCurrentMonth(minus);
  };

  const handleNextMonth = (params: 'month' | 'year') => {
    const plus = currentMonth.add(1, params);
    if (isForRange === true) {
      typeof onChangeMonth === 'function' && onChangeMonth(plus);
      return;
    }
    setCurrentMonth(plus);
  };

  /**
   * 日期
   */
  const handleClickCells = (day: DayType) => {
    if (day.isOuterRange || !day.isCurrentMonth) {
      return;
    }
    setSelectedDate(day.date);
    typeof onChange === 'function' && onChange(day.date);
  };

  const handleMouseOverCells = (day: DayType) => {
    if (isForRange !== true || rangeDateList === undefined || rangeDateList[1] !== undefined || !day.isCurrentMonth) {
      return;
    }
    typeof onOver === 'function' && onOver(day.date.valueOf());
  };

  const getCellClassNames = (d: DayType) => {
    return classNames(
      'cell',
      { disabled: !d.isCurrentMonth },
      { cell__selected: d.isMinDateInRange || d.isMaxDateInRange || d.isCurrentDay },
      { cell__inview: d.isInsideRange },
      { cell__noSelect: d.isOuterRange },
      { start: d.isMinDateInRange },
      { end: d.isMaxDateInRange },
      { cell__hover: d.isInRangeHover || d.isStartRangeHover || d.isEndRangeHover },
      { 'cell__hover--start': d.isStartRangeHover },
      { 'cell__hover--end': d.isEndRangeHover },
      { 'cell__hover-edge--start': d.isInRangeHover && (d.isMonthStartDay || d.isWeekStartDay) },
      { 'cell__hover-edge--end': d.isInRangeHover && (d.isMonthEndDay || d.isWeekEndDay) },
    );
  };

  const formatDateObject = React.useCallback(
    (date: Dayjs) => {
      const clonedObject = { ...date.toObject() };
      const formatedObject: DayType = {
        date,
        day: clonedObject.date,
        month: clonedObject.months,
        year: clonedObject.years,
        isCurrentMonth: clonedObject.months === currentMonth.month(),
        isCurrentDay: date.isSame(selectedDate, 'day'),
        isMonthStartDay: date.isSame(date.startOf('month'), 'day'),
        isMonthEndDay: date.isSame(date.endOf('month'), 'day'),
        isWeekStartDay: date.isSame(date.startOf('week'), 'day'),
        isWeekEndDay: date.isSame(date.endOf('week'), 'day'),
        isInsideRange: false,
        isOuterRange: false,
        isMaxDateInRange: false,
        isMinDateInRange: false,
        isInRangeHover: false,
        isStartRangeHover: false,
        isEndRangeHover: false,
      };

      // 如果是日期范围选择器
      if (isForRange === true && Array.isArray(rangeDateList) && rangeDateList.length > 0) {
        const minDate: Dayjs = dayjs(rangeDateList[0]);
        formatedObject['isCurrentDay'] = date.isSame(minDate, 'day');

        // 虚线框的 Hover 状态相关
        if (Array.isArray(hoverRangeDateList) && hoverRangeDateList.length === 2 && rangeDateList.length === 1) {
          const maxHoverDate: Dayjs = dayjs(Math.max(...hoverRangeDateList));
          const minHoverDate: Dayjs = dayjs(Math.min(...hoverRangeDateList));
          formatedObject['isInRangeHover'] = date.isAfter(minHoverDate, 'day') && date.isBefore(maxHoverDate, 'day');
          formatedObject['isStartRangeHover'] = date.isSame(minHoverDate, 'day') && !date.isSame(maxHoverDate, 'day');
          formatedObject['isEndRangeHover'] = date.isSame(maxHoverDate, 'day') && !date.isSame(minHoverDate, 'day');
        }

        // 选中最大值的时候
        if (rangeDateList[1]) {
          const maxDate = dayjs(rangeDateList[1]);
          formatedObject['isInRangeHover'] = false; // 当选中最大值后，去掉 hover 情况
          formatedObject['isEndRangeHover'] = false;
          formatedObject['isStartRangeHover'] = false;
          formatedObject['isMinDateInRange'] = date.isSame(minDate, 'day');
          formatedObject['isMaxDateInRange'] = date.isSame(maxDate, 'day');
          formatedObject['isInsideRange'] = date.isAfter(minDate, 'day') && date.isBefore(maxDate, 'day');
          formatedObject['isOuterRange'] = date.isBefore(minDate, 'day') && date.isAfter(maxDate, 'day');
          formatedObject['isCurrentDay'] = date.isSame(maxDate, 'day');
        }
      }

      return formatedObject;
    },
    [rangeDateList, currentMonth, selectedDate, isForRange, hoverRangeDateList],
  );

  const getAllDays = React.useCallback(() => {
    let currentDate = currentMonth.startOf('month').weekday(0);
    const nextMonth = currentMonth.add(2, 'month').month();

    const allDates: any = [];
    let weekDates: any = [];

    let weekCounter = 1;

    const pushWeekDates = () => {
      allDates.push(weekDates);
      weekDates = [];
      weekCounter = 0;
    };

    while (currentDate.weekday(0).toObject().months !== nextMonth) {
      const formated = formatDateObject(currentDate);

      weekDates.push(formated);

      if (weekCounter === 7) {
        pushWeekDates();
      }

      weekCounter++;
      currentDate = currentDate.add(1, 'day');
    }

    setArrayOfDays(allDates.slice(0, 6));
  }, [formatDateObject, currentMonth]);

  React.useEffect(() => {
    // console.log('更新日期');
    getAllDays();
  }, [getAllDays]);

  // 更新日历所在月份
  React.useEffect(() => {
    if (isForRange === true && propMonth) {
      // console.log('由外部 props 更新月份');
      setCurrentMonth(propMonth);
    }
  }, [propMonth, isForRange, getAllDays]);

  return (
    <Wrapper className={isForRange === true ? '' : 'shadow'}>
      <div className="header row-between">
        <i className="iconfont icon-twin-arrow-left" onClick={() => handlePrevMonth('year')} />
        <i className="iconfont icon-arrow-left" onClick={() => handlePrevMonth('month')} />
        <span>{currentMonth.format('MMM YYYY')}</span>
        <i className="iconfont icon-arrow-right" onClick={() => handleNextMonth('month')} />
        <i className="iconfont icon-twin-arrow-right" onClick={() => handleNextMonth('year')} />
      </div>
      <ul className="week row-between">
        {[...Array(7).keys()].map((ele) => (
          <li key={ele}>{defaultMonth.weekday(ele).format('dd')}</li>
        ))}
      </ul>
      <div className="content">
        {arrayOfDays.map((week, index) => (
          <div className="row-between days" key={index}>
            {week.map((d, i) => (
              <div
                className={getCellClassNames(d)}
                key={i}
                onClick={() => handleClickCells(d)}
                onMouseOver={() => handleMouseOverCells(d)}
              >
                <div className="cell-inner">{d.day}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default Calendar;
