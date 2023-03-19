import * as React from 'react';
import classNames from 'classnames';
import { tuple } from '../_type/type';
import { cloneElement } from '../_util/reactNode';
import { IconGlobalSpin } from '@/assets/icons/IconGroup';
import styled from 'styled-components';

const Wrapper = styled.button`
  /* 清除默认样式 */
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
  &:focus {
    outline: none;
  }
  /* global */
  width: 100%;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.02);
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  span {
    display: inline-block;
    white-space: nowrap;
    font-weight: 500;
    transition: all 0.3s ease-in-out;
  }
  /* base */
  &.primary {
    background: #0e4bc3;
    span {
      color: #ffffff;
    }
    &:not(.loading, .disabled):hover {
      background: #316ed8;
    }
  }
  &.second {
    background: #13b0a7;
    span {
      color: #ffffff;
    }
    &:not(.loading, .disabled):hover {
      background: #31c4b6;
    }
  }
  &.third {
    background: #d9224f;
    span {
      color: #ffffff;
    }
    &:not(.loading, .disabled):hover {
      background: #e94869;
    }
  }
  &.solid {
    border: 1px solid #34384c;
    span {
      color: #e5e6ed;
    }
    &:not(.loading, .disabled):hover {
      border: 1px solid #34384c;
      span {
        color: #316ed8;
      }
    }
  }
  &.text {
    span {
      color: #e5e6ed;
    }
    &:not(.loading, .disabled):hover {
      background: rgba(255, 255, 255, 0.12);
      span {
        color: #e5e6ed;
      }
    }
  }
  &.danger {
    background: rgba(238, 105, 41, 0.1);
    span {
      color: #ee6929;
    }
    &:not(.loading, .disabled):hover {
      background: rgba(238, 105, 41, 0.2);
    }
  }
  &.disabled {
    border: none;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.08);
    span {
      color: rgba(255, 255, 255, 0.25);
    }
  }
  &.loading {
    cursor: not-allowed;
    svg {
      margin-right: 6px;
      width: 16px;
      height: 16px;
    }
  }
  &.sm {
    padding: 0 8px;
    height: 24px;
    border-radius: 12px;
    span {
      font-size: 14px;
    }
  }
  &.md {
    padding: 0 16px;
    height: 32px;
    border-radius: 16px;
    span {
      font-size: 14px;
    }
  }
  &.lg {
    padding: 0 20px;
    height: 40px;
    border-radius: 20px;
    span {
      font-weight: 600;
      font-size: 16px;
    }
  }
`;

const ButtonTypes = tuple('primary', 'second', 'third', 'solid', 'text', 'danger');

type ButtonType = (typeof ButtonTypes)[number];

type SizeType = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'prefix' | 'suffix'> {
  className?: string;
  type?: ButtonType;
  size?: SizeType;
  loading?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Button: React.FC<ButtonProps> = React.forwardRef((props: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    className,
    type = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    prefix,
    suffix,
    children,
    onClick,
    ...rest
  } = props;

  const classes = classNames(className, 'row-center', {
    [`${type}`]: type,
    [`${size}`]: size,
    loading,
    disabled,
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
  };

  return (
    <Wrapper className={classes} ref={ref} onClick={handleClick} {...rest}>
      {prefix}
      {!disabled && loading && <IconGlobalSpin color="#ffffff" />}
      <span>{cloneElement(children)}</span>
      {suffix}
    </Wrapper>
  );
});

export default Button;
