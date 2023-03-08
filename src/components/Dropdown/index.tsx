import * as React from 'react';
import { createPortal } from 'react-dom';
import { fadeConfig } from '@/config/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement } from '../_util/reactNode';
import useRandomId from '@/hooks/useRandomId';
import { useBoolean, useHover, useDebounceEffect } from 'ahooks';
import styled from 'styled-components';

const Trigger = styled(motion.div)`
  position: fixed;
  z-index: 1001;
`;

const DIRECTION_MAP = {
  left: 'start' as const,
  right: 'end' as const,
};

type DropdownPlacement = 'left' | 'right';

export interface DropdownProps {
  placement?: DropdownPlacement;
  overlay?: React.ReactNode;
}

interface TriggerProps extends DropdownProps {
  followRef: React.RefObject<HTMLDivElement>;
  followID?: string;
  children?: React.ReactNode;
  onClose: (...args: any[]) => any;
}

interface PositionProps {
  top: number;
  left: number;
}

const Portal: React.FC<TriggerProps> = (props: TriggerProps) => {
  const { followRef, followID, placement = 'left', children, onClose } = props;

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
      const size: PositionProps = {
        top: followTop + followHeight,
        left: siteMap[extra],
      };
      return size;
    },
    [extra],
  );

  React.useEffect(() => {
    if (!followRef.current || !innerRef.current) return;
    const space = followRef.current.getBoundingClientRect();
    const inside = innerRef.current.getBoundingClientRect();
    const result = filterPosition(space, inside);
    setDirection(result);
  }, [followRef, innerRef, filterPosition]);

  const memoElement = React.useMemo(() => {
    return (
      <Trigger ref={innerRef} id={followID} style={direction} onClick={(e) => e.stopPropagation()} {...fadeConfig}>
        {cloneElement(children, { onClick: onClose })}
      </Trigger>
    );
  }, [followID, direction, children, onClose]);

  return createPortal(memoElement, window.document.body as HTMLElement);
};

const Dropdown: React.FC<DropdownProps> = (props: DropdownProps) => {
  const { overlay } = props;

  const followRef = React.useRef<HTMLDivElement>(null);
  const uuid = useRandomId();

  const [state, { setTrue, setFalse }] = useBoolean(false);

  // handle event
  const hoverFollow = useHover(followRef, { onEnter: setTrue });
  const hoverPortal = useHover(() => window.document.getElementById(uuid), {
    onLeave: setFalse,
  });

  const handleClose = React.useCallback(() => {
    if (hoverFollow || hoverPortal) return;
    setFalse();
  }, [hoverFollow, hoverPortal, setFalse]);

  useDebounceEffect(() => handleClose(), [hoverFollow, hoverPortal], { wait: 150 });

  return (
    <React.Fragment>
      {cloneElement(overlay, { ref: followRef })}
      <AnimatePresence>
        {state && <Portal followRef={followRef} followID={uuid} onClose={setFalse} {...props} />}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Dropdown;
