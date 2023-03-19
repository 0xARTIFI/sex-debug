import * as React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { filterTime } from '@/utils/tools';
import { useClickAway } from 'ahooks';
import Calendar from './core/DatePicker';
import RangeCalendar from './core/RangePicker';
import styled from 'styled-components';
import { fadeConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { t } from '@lingui/macro';

const Wrapper = styled.div`
  /* global */
  border: 1px solid ${(props) => props.theme.lineColorPrimary};
  transition: all 0.3s ease-in-out;
  &.follow {
    position: relative;
  }
  > .inside {
    .placeholder {
      color: ${(props) => props.theme.textColorFourth};
      transition: all 0.3s ease-in-out;
    }
    .selection {
      color: ${(props) => props.theme.textColorPrimary};
    }
    .iconfont {
      color: ${(props) => props.theme.textColorFourth};
      transition: all 0.3s ease-in-out;
    }
  }
  &:not(.danger, .disabled).visible {
    border: 1px solid #00ba3d;
    .arrow {
      fill: #00ba3d;
      transform: rotateZ(-180deg);
    }
    .icon-calendar {
      color: #00ba3d;
    }
  }
  &:not(.danger, .disabled):hover {
    border: 1px solid #00ba3d;
    .inside {
      cursor: pointer;
    }
  }
  /* base */
  &.danger {
    color: #ff7878;
    border: 1px solid #ff7878;
    .arrow {
      fill: #ff7878;
    }
  }
  &.disabled {
    background: ${(props) => props.theme.disabledColorPrimary};
    user-select: none;
    cursor: not-allowed;
    transition: all 0.3s ease-in-out;
    .selection {
      color: ${(props) => props.theme.textColorFifth};
    }
    .arrow {
      fill: ${(props) => props.theme.textColorFifth};
      transition: all 0.3s ease-in-out;
    }
  }
  &.sm {
    border-radius: 4px;
    .inside {
      padding: 0 8px;
      min-width: 80px;
      height: 30px;
      .placeholder,
      .selection {
        font-size: 12px;
      }
    }
  }
  &.md {
    border-radius: 5px;
    .inside {
      padding: 0 10px;
      height: 38px;
      .placeholder,
      .selection {
        font-size: 12px;
      }
    }
  }
  &.lg {
    border-radius: 6px;
    .inside {
      padding: 0 12px;
      height: 42px;
      .placeholder,
      .selection {
        font-size: 16px;
      }
    }
  }
`;

const Trigger = styled(motion.div)`
  /* global */
  position: absolute;
  background: ${(props) => props.theme.backgroundColorThird};
  box-shadow: ${(props) => props.theme.boxShadowColorPrimary};
  border: 1px solid ${(props) => props.theme.lineColorPrimary};
  overflow: hidden;
  z-index: 999999;
  /* transition: background-color box-shadow border 0.3s ease-in-out; */
  /* base */
  &.sm {
    border-radius: 4px;
    li {
      padding: 0 8px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
    }
  }
  &.md {
    border-radius: 5px;
    li {
      padding: 0 10px;
      height: 38px;
      line-height: 38px;
      font-size: 12px;
    }
  }
  &.lg {
    border-radius: 6px;
    li {
      padding: 0 12px;
      height: 42px;
      line-height: 42px;
      font-size: 16px;
    }
  }
`;

type DropdownPlacement = 'left' | 'right';

type SizeType = 'sm' | 'md' | 'lg';

export interface DatePickerProps<T extends 'date' | 'range'> {
  className?: string;
  follow?: boolean;
  size?: SizeType;
  placement?: DropdownPlacement;
  type: T;
  value?: T extends 'date' ? number : [number, number];
  danger?: boolean;
  disabled?: boolean;
  placeholder?: string;
  overlay?: React.ReactNode;
  onChange?: (v: T extends 'date' ? number : [number, number]) => any;
}

const DIRECTION_MAP = {
  left: 'start' as const,
  right: 'end' as const,
};

interface PositionProps {
  top: number;
  left?: number;
  right?: number;
  // width: number | 'auto';
  height?: number;
}

interface TriggerProps extends DatePickerProps<'date' | 'range'> {
  followRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
  onClose: (...args: any[]) => any;
}

const Portal: React.FC<TriggerProps> = (props: TriggerProps) => {
  // function Portal<T extends 'date' | 'range'>(props: DatePickerProps<T>) {
  const { followRef, value, placement = 'left', type = 'date', size = 'md', follow, onChange, onClose } = props;

  const innerRef = React.useRef<HTMLDivElement>(null);

  const [direction, setDirection] = React.useState<PositionProps>();
  const extra = DIRECTION_MAP[placement];

  const filterPosition = React.useCallback(
    (space: DOMRect, inside: DOMRect) => {
      const { top: followTop, left: followLeft, width: followWidth, height: followHeight } = space;
      const { width: innerWidth } = inside;
      const siteMap = {
        start: followLeft,
        end: followLeft + followWidth - innerWidth,
        // end: followLeft - Math.abs(followWidth - innerWidth),
      };
      const rectSize: PositionProps = {
        top: (follow ? 0 : followTop) + followHeight + 4,
        // [placement]: follow ? -1 : siteMap[extra],
        left: follow ? -1 : siteMap[extra],
      };

      return rectSize;
    },
    [follow, extra],
  );

  React.useEffect(() => {
    if (!followRef.current || !innerRef.current) return;
    const space = followRef.current.getBoundingClientRect();
    const inside = innerRef.current.getBoundingClientRect();
    const result = filterPosition(space, inside);
    setDirection(result);
  }, [followRef, innerRef, filterPosition]);

  const [date, setDate] = React.useState<number | undefined>(() => {
    return type === 'date' ? (value as number) : undefined;
  });
  const [rangeDate, setRangeDate] = React.useState<number[] | undefined>(() => {
    return type === 'range' ? (value as number[]) : undefined;
  });

  const selectTrigger = React.useMemo(() => {
    if (!followRef.current) return;
    return (
      <Trigger className={size} ref={innerRef} style={direction} onClick={(e) => e.stopPropagation()} {...fadeConfig}>
        {/* {cloneElement(children, { onClick: onClose })} */}
        {type === 'date' && (
          <Calendar
            value={date}
            onChange={(d) => {
              setDate(d);
              // console.log(d);
              onChange?.(d);
              onClose();
            }}
          />
        )}
        {type === 'range' && (
          <RangeCalendar
            value={rangeDate}
            onChange={(dateRange) => {
              setRangeDate(dateRange);
              // console.log(dateRange);
              onChange?.(dateRange as [number, number]);
              onClose();
            }}
          />
        )}
      </Trigger>
    );
  }, [followRef, size, direction, type, date, rangeDate, onChange, onClose]);

  useClickAway(() => onClose?.(), followRef);

  const DOM = (follow && followRef.current ? followRef.current : window.document.body) as HTMLElement;
  return createPortal(selectTrigger, DOM);
};

// const DatePicker: React.FC<DatePickerProps<XXX>> = (props: DatePickerProps<XXX>) => {
function DatePicker<T extends 'date' | 'range'>(props: DatePickerProps<T>) {
  const {
    className,
    value,
    follow = false,
    type = 'date',
    size = 'md',
    danger = false,
    disabled = false,
    placeholder,
  } = props;

  const followRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState<boolean>(false);

  const classes = classNames(className, {
    follow,
    [`${size}`]: size,
    danger,
    disabled,
    visible,
  });

  // handle event
  const handleOpen: React.MouseEventHandler<HTMLDivElement> = () => {
    if (disabled) return;
    setVisible(true);
  };

  const handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    if (disabled) return;
    setVisible(false);
  };

  const memoElement = React.useMemo(() => {
    const isDate = type === 'date' && typeof value !== 'number';
    const isRange = type === 'range' && (!Array.isArray(value) || value.length !== 2);
    if (isDate || isRange) return <span className="placeholder">{placeholder || t`datePlaceholder`}</span>;
    const renderClone = (
      <p className="selection">
        {type === 'date'
          ? filterTime(`${value}`)
          : `${filterTime(String(value?.[0]))} - ${filterTime(String(value?.[1]))}`}
      </p>
    );
    return renderClone;
  }, [placeholder, type, value]);

  return (
    <React.Fragment>
      <Wrapper className={classes} ref={followRef} onClick={handleOpen}>
        <div className="inside row-between">
          {memoElement}
          <i className="iconfont icon-calendar" />
        </div>
      </Wrapper>
      <AnimatePresence>{visible && <Portal {...props} followRef={followRef} onClose={handleClose} />}</AnimatePresence>
    </React.Fragment>
  );
}

export default DatePicker;
