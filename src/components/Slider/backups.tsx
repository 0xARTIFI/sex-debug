/* eslint-disable newline-per-chained-call */
import * as React from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import { useEventListener } from 'ahooks';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 10px 0;
  width: 100%;
  .inside {
    position: relative;
    height: 3px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    user-select: none;
    .rail {
      position: absolute;
      width: 100%;
      height: 3px;
      z-index: 1;
      .mark {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        pointer-events: none;
        transition: all 0.3s ease-in-out;
      }
      .mark:first-child {
        transform: translateX(-4px);
      }
      .mark:last-child {
        transform: translateX(4px);
      }
      .mark-active {
        background: #00ba3d;
        border: 1px solid #00ba3d;
      }
      .mark-default {
        background: #ffffff;
        border: 1px solid #e7e7e7;
      }
    }
    .track {
      position: absolute;
      top: 0;
      left: 0;
      height: 3px;
      background: #00ba3d;
      border-radius: 3px;
      &.track-anime {
        transition: all 0.3s ease-in-out;
      }
    }
    .handle {
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #00ba3d;
      border: 3px solid #ffffff;
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
      outline: 1px solid transparent;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      z-index: 2;
      &:hover {
        outline: 1px solid #00ba3d;
      }
    }
    .tooltip {
      display: none;
      position: absolute;
      top: -36px;
      right: -20px;
      width: 40px;
      height: 20px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      box-shadow: 0px 4px 10px rgba(208, 208, 208, 0.5);
      background: #ffffff;
      border-radius: 4px;
      white-space: nowrap;
      text-align: center;
      font-size: 12px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.8);
      z-index: 10;
      transition: all 0.3s ease-in-out;
    }
  }
  &:hover .tooltip {
    display: block;
  }
`;

export interface SliderProps {
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number; // 步长，取值必须大于 0，并且可被 (max - min) 整除。
  marks?: number;
  tooltip?: React.ReactNode;
  onChange?: (...args: any[]) => any;
}

interface State {
  ratio: number;
  reset: boolean;
  lastPos?: number;
  slideRange?: number;
  sliding?: boolean;
}

interface Action {
  type: 'setRatio' | 'start' | 'move' | 'end' | 'to';
  x?: number;
  slideWidth?: number;
  newRatio?: number;
}

const filterRatio = (ratio: number) => Math.max(0, Math.min(1, ratio));

const Slider: React.FC<SliderProps> = (props: SliderProps) => {
  const { className, disabled = false, min = 0, max = 100, step = 0.001, marks = 5, tooltip, onChange } = props;

  const classes = classNames(className, { disabled });

  const sliderRef = React.useRef<HTMLDivElement>(null);

  const reducer = (state: State, action: Action): State => {
    const { ratio, reset, lastPos = 0, slideRange = 1, sliding } = state;
    const { type, x = 0, slideWidth = 100, newRatio = 0 } = action;

    switch (type) {
      case 'setRatio': {
        if (!reset || newRatio !== ratio) {
          return { ...state, ratio: filterRatio(newRatio), reset: true };
        }
        return state;
      }
      case 'start': {
        return { ...state, reset: false, lastPos: x, slideRange: slideWidth, sliding: true };
      }
      case 'move': {
        if (!sliding) return state;
        const delta = new BigNumber(x).minus(lastPos).dividedBy(slideRange).plus(ratio).toNumber();
        return { ...state, ratio: filterRatio(delta), reset: false, lastPos: x };
      }
      case 'end': {
        if (!sliding) return state;
        const nowRatio = filterRatio(ratio + (x - lastPos) / slideRange);
        return { ...state, ratio: nowRatio, reset: false, lastPos: x, sliding: false };
      }
      case 'to': {
        const nowRatio = filterRatio(x / slideWidth);
        return { ...state, ratio: nowRatio, reset: false, sliding: false };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, { ratio: 0, reset: true });
  const [finalValue, setFinalValue] = React.useState<string>('0');

  const filterReckon = React.useMemo(() => {
    const minValue = new BigNumber(min).dividedBy(1).toNumber();
    const maxValue = new BigNumber(max).dividedBy(1).toNumber();
    const stepValue = new BigNumber(step).dividedBy(1).toNumber();

    const section = new BigNumber(maxValue).minus(minValue).multipliedBy(state.ratio).plus(minValue); // 数值区间
    const final = section.dividedToIntegerBy(stepValue).multipliedBy(stepValue).toString(); // 输出数值
    setFinalValue(final);

    const finalSite = ((Number(final) - minValue) / (maxValue - minValue)) * 100; // 滑块位置
    return finalSite;
  }, [min, max, step, state.ratio]);

  React.useEffect(() => {
    onChange?.(finalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalValue]);

  // handle event
  const handleChange = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const hotArea = sliderRef.current.clientWidth;
    dispatch({ type: 'to', x: e.nativeEvent.offsetX, slideWidth: hotArea });
  }, []);

  const handleMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const hotArea = sliderRef.current.clientWidth;
    dispatch({ type: 'start', x: e.pageX, slideWidth: hotArea });
  }, []);

  // const handleRatio = React.useCallback((ratio: number) => dispatch({ type: 'setRatio', newRatio: ratio }), []);

  useEventListener('mousemove', ({ pageX }) => dispatch({ type: 'move', x: pageX }));
  useEventListener('mouseup', ({ pageX }) => dispatch({ type: 'end', x: pageX }));

  const sliderMarks = React.useMemo(() => {
    if (marks < 3) return null;
    const isExist = (value: number) => filterReckon >= (100 / (marks - 1)) * value;
    return [...Array(marks).keys()].map((ele) => (
      <div key={ele} className={`mark ${isExist(ele) ? 'mark-active' : 'mark-default'}`} />
    ));
  }, [filterReckon, marks]);

  return (
    <Wrapper className={classes}>
      <div className="inside">
        <div className="rail row-between" ref={sliderRef} onMouseDown={handleChange}>
          {sliderMarks}
        </div>
        <div className={`track ${state.sliding ? '' : 'track-anime'}`.trimEnd()} style={{ width: `${filterReckon}%` }}>
          <div className="handle" onMouseDown={handleMove} />
          <p className="tooltip">{tooltip ?? `${filterReckon.toFixed(0)}%`}</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Slider;
