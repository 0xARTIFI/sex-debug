import * as React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { fadeConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement } from '../_util/reactNode';
import { Scrollbar } from '@/components';
import { useClickAway } from 'ahooks';
import styled from 'styled-components';

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
    .arrow {
      fill: ${(props) => props.theme.textColorPrimary};
      transition: all 0.3s ease-in-out;
    }
  }
  &:not(.danger, .disabled).visible {
    border: 1px solid #00ba3d;
    .arrow {
      fill: #00ba3d;
      transform: rotateZ(-180deg);
    }
  }
  &:not(.danger, .disabled):hover {
    border: 1px solid #00ba3d;
    cursor: pointer;
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
  z-index: 1;
  transition: background-color box-shadow border 0.3s ease-in-out;
  .ms-container {
    width: 100%; // 注意边框侵占容器宽度导致样式错误
    max-height: 20vh;
  }
  li {
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      background: ${(props) => props.theme.backgroundColorFourth};
    }
  }
  /* base */
  .outer {
    position: sticky;
    top: 0;
    padding: 12px 0;
    background: ${(props) => props.theme.backgroundColorThird};
  }
  .search {
    margin: 0 12px;
    label {
      border: 1px solid ${(props) => props.theme.lineColorSecond};
      background: ${(props) => props.theme.backgroundColorFourth};
    }
    .icon-search {
      margin-right: 6px;
      color: ${(props) => props.theme.textColorPrimary};
      transition: all 0.3s ease-in-out;
    }
  }
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

const DIRECTION_MAP = {
  left: 'start' as const,
  right: 'end' as const,
};

type DropdownPlacement = 'left' | 'right';

type SizeType = 'sm' | 'md' | 'lg';

export interface SelectProps {
  className?: string;
  placement?: DropdownPlacement;
  follow?: boolean;
  size?: SizeType;
  danger?: boolean;
  disabled?: boolean;
  placeholder?: string;
  triggerWidth?: number;
  triggerHeight?: number;
  overlay?: React.ReactNode;
}

interface TriggerProps extends SelectProps {
  followRef: React.RefObject<HTMLDivElement>;
  children?: React.ReactNode;
  onClose: (...args: any[]) => any;
}

interface PositionProps {
  top: number;
  left?: number;
  right?: number;
  width: number | 'auto';
  height?: number;
}

const IconArrow: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="8" height="5" viewBox="0 0 8 5" {...props}>
      <path
        // eslint-disable-next-line
        d="M0.707105 1.70711C0.0771402 1.07714 0.523309 0 1.41421 0H6.58579C7.47669 0 7.92286 1.07714 7.29289 1.70711L4.70711 4.29289C4.31658 4.68342 3.68342 4.68342 3.29289 4.29289L0.707105 1.70711Z"
      />
    </svg>
  );
};

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
  const { className, follow = false, size = 'md', danger = false, disabled = false, placeholder, overlay } = props;

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
          <IconArrow className="arrow" />
        </div>
      </Wrapper>
      <AnimatePresence>{visible && <Portal {...props} followRef={followRef} onClose={handleClose} />}</AnimatePresence>
    </React.Fragment>
  );
};

export default Select;
