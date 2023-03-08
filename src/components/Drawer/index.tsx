import * as React from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { maskConfig, drawerConfig } from '@/configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { RemoveScroll } from 'react-remove-scroll';
import { cloneElement } from '../_util/reactNode';
import { Scrollbar } from '../index';
import styled from 'styled-components';

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
  > .inside {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => props.theme.modalColorPrimary};
    box-shadow: -6px 0px 16px rgba(0, 0, 0, 0.08), -9px 0px 28px rgba(0, 0, 0, 0.05), -12px 0px 48px rgba(0, 0, 0, 0.03);
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    .header {
      padding: 0 12px 0 20px;
      height: 60px;
      border-bottom: 1px solid ${(props) => props.theme.lineColorSecond};
      transition: all 0.3s ease-in-out;
      h4 {
        flex: 1;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: ${(props) => props.theme.textColorPrimary};
        transition: all 0.3s ease-in-out;
      }
      .clear {
        padding: 6px;
        font-size: 12px;
        font-weight: bold;
        color: ${(props) => props.theme.textColorFourth};
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
      max-height: calc(100vh - 60px);
      .ms-container {
        max-height: inherit;
      }
    }
  }
`;

export interface DrawerProps {
  className?: string;
  visible?: boolean;
  mask?: boolean;
  title?: React.ReactNode;
  closable?: boolean;
  children?: React.ReactNode;
  onCancel?: (...args: any[]) => any;
}

const Portal: React.FC<DrawerProps> = (props: DrawerProps) => {
  const { className, mask = true, title, closable = true, children, onCancel } = props;

  const classes = classNames(className, { mask });

  const handleCancel = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      onCancel?.(e);
    },
    [onCancel],
  );

  const renderHeader = React.useMemo(() => {
    if (!title && !closable) return null;
    return (
      <div className="header row-between">
        <h4>{title}</h4>
        {closable && <i className="iconfont icon-select-cancel clear" onClick={handleCancel} />}
      </div>
    );
  }, [title, closable, handleCancel]);

  const memoElement = React.useMemo(() => {
    return (
      <RemoveScroll>
        <PortalWrapper className={classes} {...maskConfig}>
          <motion.div className="inside" {...drawerConfig}>
            {renderHeader}
            <div className="content">
              <Scrollbar>{cloneElement(children)}</Scrollbar>
            </div>
          </motion.div>
        </PortalWrapper>
      </RemoveScroll>
    );
  }, [classes, renderHeader, children]);

  return createPortal(memoElement, window.document.body);
};

const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const { visible = false } = props;

  return <AnimatePresence>{visible && <Portal {...props} />}</AnimatePresence>;
};

export default Drawer;
