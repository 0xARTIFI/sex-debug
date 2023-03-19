import classNames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';
import useDrag from './hooks/useDrag';
import useOffset from './hooks/useOffset';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  padding: 2px 0;
  border-radius: 6px;
  touch-action: none;
  .rail {
    position: absolute;
    width: 100%;
    height: 8px;
    background: #323a4f;
    transition: all 0.3s ease-in-out;
    border-radius: 4px;
    .mark {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      pointer-events: none;
      transition: all 0.3s ease-in-out;
    }
    .mark-active {
      width: 4px;
      height: 10px;
      background: #54678b;
      border-radius: 3px;
    }
    .mark-default {
      width: 4px;
      height: 10px;
      background: #54678b;
      border-radius: 3px;
    }
  }
  .track {
    position: absolute;
    left: 0;
    height: 8px;
    background: linear-gradient(90deg, #fa2256 1.32%, #11cabf 50.66%, #fa2256 100%);
    border-radius: 4px;
    /* &.track-anime {
      transition: all 0.3s ease-in-out;
    } */
  }
  .handle {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #9cadcd;
    border: 3px solid #e5e6ed;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
    touch-action: pan-x;
    cursor: pointer;
    cursor: grab;
    transition: border-color 0.3s ease-in-out, outline 0.3s ease-in-out;
    z-index: 2;
    &:hover {
      border: 3px solid #316ed8;
    }
  }
  .handle:hover + .tooltip {
    display: block;
  }
  .dragging {
    border: 3px solid #316ed8;
    outline: 1px solid #0e4bc3;
  }
  .dragging + .tooltip {
    display: block;
  }
  .tooltip {
    display: none;
    position: absolute;
    bottom: -28px;
    padding: 0 4px;
    height: 22px;
    background: #323a4f;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    white-space: nowrap;
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 22px;
    color: #e5e6ed;
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
      <div
        className="track"
        style={{
          width: '100%',
          clipPath: `inset(0px ${100 - track}% 0px 0px)`,
        }}
      />
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
