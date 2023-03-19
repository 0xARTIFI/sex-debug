import { IconSelectArrow } from '@/assets/icons/IconGroup';
import { Scrollbar } from '@/components';
import { fadeConfig } from '@/configs/motion';
import { useClickAway } from 'ahooks';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { cloneElement } from '../_util/reactNode';

const Wrapper = styled.div`
  /* global */
  border: 1px solid #34384c;
  transition: all 0.3s ease-in-out;
  &.follow {
    position: relative;
  }
  > .inside {
    cursor: pointer;
    .placeholder {
      color: rgba(255, 255, 255, 0.25);
      transition: all 0.3s ease-in-out;
    }
    .selection {
      color: #e5e6ed;
    }
    .arrow {
      fill: #e5e6ed;
      transition: all 0.3s ease-in-out;
    }
  }
  &:not(.danger, .disabled):hover {
    border: 1px solid #34384c;
  }
  &:not(.danger, .disabled).visible {
    border: 1px solid #0e4bc3;
    .arrow {
      fill: #e5e6ed;
      transform: rotateZ(-180deg);
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
    background: rgba(255, 255, 255, 0.08);
    user-select: none;
    cursor: not-allowed;
    transition: all 0.3s ease-in-out;
    .selection {
      color: rgba(255, 255, 255, 0.25);
    }
    .arrow {
      fill: rgba(255, 255, 255, 0.25);
      transition: all 0.3s ease-in-out;
    }
  }
  &.sm {
    border-radius: 12px;
    .inside {
      padding: 0 8px;
      height: 24px;
      .placeholder,
      .selection {
        font-size: 14px;
      }
    }
  }
  &.md {
    border-radius: 16px;
    .inside {
      padding: 0 16px;
      height: 32px;
      .placeholder,
      .selection {
        font-size: 14px;
      }
    }
  }
  &.lg {
    border-radius: 20px;
    .inside {
      padding: 0 20px;
      height: 40px;
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
  padding: 4px;
  background: #242731;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
    0px 9px 28px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  z-index: 1;
  transition: background-color box-shadow 0.3s ease-in-out;
  .ms-container {
    width: 100%; // 注意边框侵占容器宽度导致样式错误
    max-height: 60vh;
  }
  li {
    color: #e5e6ed;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:not(.active, .disabled):hover {
      background: rgba(255, 255, 255, 0.12);
    }
    /* base */
    &.active {
      position: relative;
      background: #54678b;
      font-weight: 600;
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: 16px;
        width: 20px;
        height: 20px;
        background: url(${require('@/assets/images/_global/IconCheck.svg')}) no-repeat;
        transform: translateY(-50%);
      }
    }
    &.disabled {
      filter: brightness(50%);
      cursor: not-allowed;
    }
  }
  li + li {
    margin-top: 4px;
  }
  /* base */
  &.sm {
    border-radius: 12px;
    li {
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      border-radius: 12px;
    }
  }
  &.md {
    border-radius: 16px;
    li {
      padding: 0 16px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      border-radius: 16px;
    }
  }
  &.lg {
    border-radius: 20px;
    li {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      border-radius: 20px;
    }
  }
`;

const DIRECTION_MAP = {
  left: 'start' as const,
  right: 'end' as const,
};

type DropdownPlacement = 'left' | 'right';

type SizeType = 'sm' | 'md' | 'lg';

export interface SelectProps {
  className?: string;
  placement?: DropdownPlacement;
  children?: React.ReactNode;
  follow?: boolean;
  size?: SizeType;
  danger?: boolean;
  disabled?: boolean;
  placeholder?: string;
  triggerWidth?: number;
  triggerHeight?: number;
  overlay?: React.ReactNode;
  onChange?: (...args: any[]) => any;
}

interface TriggerProps extends SelectProps {
  followRef: React.RefObject<HTMLDivElement>;
  // children?: React.ReactNode;
  onClose: (...args: any[]) => any;
}

interface PositionProps {
  top: number;
  left?: number;
  right?: number;
  width: number | 'auto';
  height?: number;
}

const Portal: React.FC<TriggerProps> = (props: TriggerProps) => {
  const { followRef, placement = 'left', size = 'md', follow, triggerWidth, triggerHeight, children, onClose } = props;

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
      };
      const rectSize: PositionProps = {
        top: (follow ? 0 : followTop) + followHeight + 4,
        [placement]: follow ? -1 : siteMap[extra],
        width: placement === 'left' ? triggerWidth || followWidth : 'auto',
      };
      if (triggerHeight) rectSize.height = triggerHeight;

      return rectSize;
    },
    [follow, placement, extra, triggerHeight, triggerWidth],
  );

  React.useEffect(() => {
    if (!followRef.current || !innerRef.current) return;
    const space = followRef.current.getBoundingClientRect();
    const inside = innerRef.current.getBoundingClientRect();
    const result = filterPosition(space, inside);
    setDirection(result);
  }, [followRef, innerRef, filterPosition]);

  const selectTrigger = React.useMemo(() => {
    if (!followRef.current) return;
    return (
      <Trigger className={size} ref={innerRef} style={direction} onClick={(e) => e.stopPropagation()} {...fadeConfig}>
        <Scrollbar>{cloneElement(children, { onClick: onClose })}</Scrollbar>
      </Trigger>
    );
  }, [followRef, size, direction, children, onClose]);

  useClickAway(() => onClose?.(), followRef);

  const DOM = (follow && followRef.current ? followRef.current : window.document.body) as HTMLElement;
  return createPortal(selectTrigger, DOM);
};

const Select: React.FC<SelectProps> = (props: SelectProps) => {
  const {
    className,
    follow = false,
    size = 'md',
    danger = false,
    disabled = false,
    placeholder,
    overlay,
    onChange,
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
    onChange?.();
  };

  const handleClose: React.MouseEventHandler<HTMLDivElement> = () => {
    if (disabled) return;
    setVisible(false);
  };

  const memoElement = React.useMemo(() => {
    if (!React.isValidElement(overlay)) return <span className="placeholder">{placeholder}</span>;
    const renderClone = cloneElement(overlay, {
      className: `selection ${overlay.props.className ?? ''}`.trimEnd(),
    });
    return renderClone;
  }, [overlay, placeholder]);

  return (
    <React.Fragment>
      <Wrapper className={classes} ref={followRef} onClick={handleOpen}>
        <div className="inside row-between">
          {memoElement}
          <IconSelectArrow className="arrow" />
        </div>
      </Wrapper>
      <AnimatePresence>{visible && <Portal {...props} followRef={followRef} onClose={handleClose} />}</AnimatePresence>
    </React.Fragment>
  );
};

export default Select;
