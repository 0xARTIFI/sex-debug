import { maskConfig, modalConfig } from '@/configs/motion';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
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
    background: rgba(0, 0, 0, 0.2);
  }
  &.scroll {
    margin: 0 auto;
    width: fit-content;
  }
  > .inner-modal {
    max-height: 88vh;
    background: ${(props) => props.theme.modalBackgroundColorSex};
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px rgba(0, 0, 0, 0.05), 0px 12px 48px rgba(0, 0, 0, 0.03);
    border-radius: ${(props) => props.theme.modalRadiusSex};
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    .header {
      padding: 0 8px;
      height: 54px;
      border-bottom: 1px solid ${(props) => props.theme.modalHeaderBorderColorSex};
      transition: all 0.3s ease-in-out;
      h4 {
        flex: 1;
        padding-left: 24px;
        text-align: left;
        font-weight: 700;
        font-size: 20px;
        line-height: 120%;
        color: ${(props) => props.theme.modalColorSex};
        transition: all 0.3s ease-in-out;
      }
      .clear {
        padding: 6px;
        font-size: 12px;
        font-weight: bold;
        color: ${(props) => props.theme.modalColorSex};
        border-radius: 50%;
        user-select: none;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        &:hover {
          color: #00ba3d;
          background: rgba(0, 186, 61, 0.1);
        }
      }
    }
    .content {
      padding: 24px;
      .ms-container {
        max-height: inherit;
      }
    }
    .footer {
      padding: 20px 20px 36px 20px;
      button + button {
        margin-left: 32px;
      }
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
    (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
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
        {closable && (
          <img
            src={require('@/assets/images/_global/IconClose.svg')}
            className="iconfont icon-select-cancel clear"
            onClick={handleCancel}
          />
        )}
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
        <motion.div className="inner-modal" {...modalConfig}>
          {renderHeader}
          <div className="content" style={{ maxHeight: `calc(88vh - 152px - ${forceHeight}px)` }}>
            <Scrollbar>{cloneElement(children)}</Scrollbar>
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
