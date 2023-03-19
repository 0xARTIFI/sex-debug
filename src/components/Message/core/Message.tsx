import * as React from 'react';
import { fadeConfig } from '@/configs/motion';
import { motion } from 'framer-motion';
import { NotificationProps } from './PropsType';
import styled from 'styled-components';

const Wrapper = styled(motion.div)<{ isDark: boolean }>`
  margin: 24px auto 0 auto;
  padding: 20px;
  width: max-content;
  max-width: 40vw;
  background: ${({ isDark }) => (isDark ? '#292c2f' : '#ffffff')};
  box-shadow: 0px 4px 10px ${({ isDark }) => (isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(208, 208, 208, 0.5)')};
  border-radius: 6px;
  i {
    margin-right: 8px;
    font-size: 14px;
  }
  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')};
  }
  .icon-success {
    color: #00ba3d;
  }
  .icon-warning {
    color: #ffb795;
  }
  .icon-info {
    color: #68aeff;
  }
  .icon-error {
    color: #ff7878;
  }
`;

const Message: React.FC<NotificationProps> = React.forwardRef(
  (props: NotificationProps, ref: React.Ref<HTMLDivElement>) => {
    const { icon, content, onMouseEnter, onMouseLeave, onClose } = props;

    const localeTheme = window.localStorage.getItem('ice_theme') === '"dark"';

    return (
      <Wrapper ref={ref} isDark={localeTheme} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} {...fadeConfig}>
        <i className={`iconfont icon-${icon}`} />
        <span>{content}</span>
      </Wrapper>
    );
  },
);

export default Message;
