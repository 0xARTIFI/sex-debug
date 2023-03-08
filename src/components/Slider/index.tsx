import * as React from 'react';
import classNames from 'classnames';
import useDrag from './hooks/useDrag';
import useOffset from './hooks/useOffset';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  padding: 8.5px 0;
  border-radius: 3px;
  touch-action: none;
  .rail {
    position: absolute;
    width: 100%;
    height: 3px;
    background: ${(props) => props.theme.lineColorSecond};
    transition: all 0.3s ease-in-out;
    border-radius: 3px;
    /* user-select: none; */
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
      background: ${(props) => props.theme.backgroundColorPrimary};
      border: 1px solid ${(props) => props.theme.sliderBorderPrimary};
    }
  }
  .track {
    position: absolute;
    left: 0;
    height: 3px;
    background: #00ba3d;
    border-radius: 3px;
    /* &.track-anime {
      transition: all 0.3s ease-in-out;
    } */
  }
  .handle {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #00ba3d;
    border: 3px solid ${(props) => props.theme.backgroundColorThird};
    /* box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05); */
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
    outline: 1px solid transparent;
    touch-action: pan-x;
    cursor: pointer;
    cursor: grab;
    transition: border-color 0.3s ease-in-out, outline 0.3s ease-in-out;
    z-index: 2;
    &:hover {
      outline: 1px solid #00ba3d;
    }
  }
  .handle:hover + .tooltip {
    display: block;
  }
  .dragging {
    outline: 1px solid #00ba3d;
  }
  .dragging + .tooltip {
    display: block;
  }
  .tooltip {
    display: none;
    position: absolute;
    top: -26px;
    width: 40px;
    height: 20px;
    background: ${(props) => props.theme.backgroundColorThird};
    border: 1px solid ${(props) => props.theme.lineColorSecond};
    box-shadow: ${(props) => props.theme.boxShadowColorPrimary};
    border-radius: 4px;
    white-space: nowrap;
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    color: ${(props) => props.theme.textColorPrimary};
    z-index: 10;
  }
  .disabled {
    background-color: #e9e9e9;
    .track {
      background-color: #ccc;
    }
    .handle,
    .dot {
      background-color: #ffffff;
      border-color: #ccc;
      box-shadow: none;
      cursor: not-allowed;
    }
    .mark-text,
    .dot {
      cursor: not-allowed !important;
    }
  }
`;

export interface SliderProps {
  className?: string;
  disabled?: boolean;
  value: number;
  min?: number;
  max?: number;
  step?: number; // 步长，取值必须大于 0，并且可被 (max - min) 整除。
  marks?: number;
  tooltip?: React.ReactNode;
  onChange?: (value: number) => void;
}

type OnStartMove = (e: React.MouseEvent | React.TouchEvent) => void;

const Slider = (props: SliderProps) => {
  const { className, disabled = false, min = 0, max = 100, step = 1, value = 0, marks = 5, tooltip, onChange } = props;

  const sliderRef = React.useRef<HTMLDivElement>(null);

  const [formatValue, offsetValues] = useOffset(min, max, step);

  const rawValues = React.useMemo(() => {
    const newValue = Math.max(min, Math.min(max, value));
    return [newValue] as number[];
  }, [max, min, value]);

  const rawValuesRef = React.useRef(rawValues);
  rawValuesRef.current = rawValues;

  const triggerChange = (nextValues: number[]) => {
    onChange?.(nextValues[0]);
  };

  const onSliderMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!sliderRef.current) return;
    e.preventDefault();

    const { width, left } = sliderRef.current.getBoundingClientRect();
    const { clientX } = e;

    const percent = (clientX - left) / width;
    const nextValue = min + percent * (max - min);

    if (!disabled) {
      onChange?.(formatValue(nextValue));
    }
  };

  const [draggingIndex, onStartDrag] = useDrag(sliderRef, rawValues, min, max, triggerChange, offsetValues);

  const onStartMove: OnStartMove = (e) => {
    onStartDrag(e);
  };

  const track = React.useMemo(() => {
    const offsetEnd = (Math.max(min, rawValues[0]) - min) / (max - min);
    return offsetEnd * 100;
  }, [min, rawValues, max]);

  const onInternalStartMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!disabled) {
      onStartMove(e);
    }
  };

  const sliderMarks = React.useMemo(() => {
    if (marks < 3) return null;
    const isExist = (v: number) => track >= (100 / (marks - 1)) * v;
    return [...Array(marks).keys()].map((ele) => (
      <div key={ele} className={`mark ${isExist(ele) ? 'mark-active' : 'mark-default'}`} />
    ));
  }, [track, marks]);

  return (
    <Wrapper className={className} ref={sliderRef} onMouseDown={onSliderMouseDown}>
      <div className="rail row-between">{sliderMarks}</div>
      <div className="track" style={{ width: `${track}%` }} />
      <div
        className={classNames('handle', { dragging: draggingIndex === 0 })}
        style={{ left: `${track}%` }}
        onMouseDown={onInternalStartMove}
        onTouchStart={onInternalStartMove}
      />
      <div className="tooltip" style={{ left: `calc(${track}% - 20px)` }}>
        {tooltip ?? `${rawValues[0]}%`}
      </div>
    </Wrapper>
  );
};

export default Slider;
