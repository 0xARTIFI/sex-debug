import { maskConfig, modalConfig } from '@/configs/motion';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { IconModalClose } from '@/assets/icons/IconGroup';
import { createPortal } from 'react-dom';
import { RemoveScroll } from 'react-remove-scroll';
import styled from 'styled-components';
import { Button, Scrollbar } from '../index';
import { cloneElement } from '../_util/reactNode';

const PortalWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999998;
  &.mask {
    background: rgba(0, 0, 0, 0.65);
  }
  &.scroll {
    margin: 0 auto;
    width: fit-content;
  }
  > .inside {
    max-height: 88vh;
    background: #242731;
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
      0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    border-radius: 20px;
    overflow: hidden;
    .header {
      padding: 0 24px;
      height: 56px;
      border-bottom: 1px solid #34384c;
      h4 {
        font-weight: 600;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.85);
      }
      .clear {
        padding: 4px;
        width: 24px;
        height: 24px;
        fill: rgba(255, 255, 255, 0.45);
        border-radius: 50%;
        user-select: none;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        &:hover {
          fill: #0e4bc3;
          background: rgba(49, 110, 216, 0.1);
        }
      }
    }
    .content {
      .ms-container {
        max-height: inherit;
      }
    }
    .footer {
      gap: 32px;
      padding: 12px 24px 24px 24px;
    }
  }
`;

enum StyleType {
  sex = 'sex',
}
export interface ModalProps {
  className?: string;
  visible?: boolean;
  mask?: boolean;
  scroll?: boolean;
  forceRender?: React.ReactNode;
  title?: React.ReactNode;
  closable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  cancel?: React.ReactNode;
  ok?: React.ReactNode;
  children?: React.ReactNode;
  onCancel?: (...args: any[]) => any;
  onOk?: (...args: any[]) => any;
  type?: StyleType;
}

const Portal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    className,
    mask = true,
    scroll = false,
    forceRender,
    title,
    closable = true,
    cancel,
    ok,
    children,
    onCancel,
    onOk,
    type = StyleType.sex,
    ...rest
  } = props;

  const classes = classNames(`${className} ${type}`, { 'col-center': true, mask, scroll });

  const forceRef = React.useRef<HTMLDivElement>(null);

  const handleCancel = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLOrSVGElement>) => {
      onCancel?.(e);
    },
    [onCancel],
  );

  const handleOk = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onOk?.(e);
    },
    [onOk],
  );

  const [forceHeight, setForceHeight] = React.useState<number>(0);

  const forcePosition = React.useCallback(() => {
    if (!forceRef.current) return;
    const { offsetHeight } = forceRef.current;
    if (forceHeight !== 0) return;
    setForceHeight(offsetHeight);
  }, [forceRef, forceHeight]);

  React.useEffect(() => {
    forcePosition();
  }, [forceRef, forcePosition]);

  const renderHeader = React.useMemo(() => {
    if (forceRender) return cloneElement(forceRender, { ref: forceRef });
    if (!title && !closable) return null;
    return (
      <div className="header row-between">
        <h4>{title}</h4>
        {closable && <IconModalClose className="clear" onClick={handleCancel} />}
      </div>
    );
  }, [forceRender, forceRef, title, closable, handleCancel]);

  const renderFooter = React.useMemo(() => {
    if (!cancel && !ok) return null;
    return (
      <div className="footer row-between">
        {cancel && (
          <Button type="solid" size="lg" onClick={handleCancel}>
            {cancel}
          </Button>
        )}
        {ok && (
          <Button size="lg" {...rest} onClick={handleOk}>
            {ok}
          </Button>
        )}
      </div>
    );
  }, [cancel, ok, handleCancel, handleOk, rest]);

  const memoElement = React.useMemo(() => {
    const renderPortal = (
      <PortalWrapper className={classes} {...maskConfig}>
        <motion.div className="inside" {...modalConfig}>
          {renderHeader}
          <div className="content" style={{ maxHeight: `calc(88vh - 132px - ${forceHeight}px)` }}>
            <Scrollbar trackGap={[20, 20, 20, 20]}>{cloneElement(children)}</Scrollbar>
          </div>
          {renderFooter}
        </motion.div>
      </PortalWrapper>
    );

    return scroll ? renderPortal : <RemoveScroll>{renderPortal}</RemoveScroll>;
  }, [classes, renderHeader, forceHeight, children, renderFooter, scroll]);

  return createPortal(memoElement, window.document.body);
};

const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const { visible = false } = props;

  return <AnimatePresence>{visible && <Portal {...props} />}</AnimatePresence>;
};

export default Modal;
