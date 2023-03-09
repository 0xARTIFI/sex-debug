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
    background: #00ba3d;
    span {
      color: #ffffff;
    }
    &:not(.loading, .disabled):hover {
      background: #009230;
    }
  }
  &.second {
    background: rgba(0, 186, 61, 0.1);
    span {
      color: #00ba3d;
    }
    &:not(.loading, .disabled):hover {
      background: rgba(0, 146, 48, 0.2);
    }
  }
  &.third {
    background: ${(props) => props.theme.lineColorSecond};
    transition: all 0.3s ease-in-out;
    span {
      color: ${(props) => props.theme.textColorPrimary};
      transition: all 0.3s ease-in-out;
    }
    &:not(.loading, .disabled):hover {
      background: rgba(0, 186, 61, 0.1);
      span {
        color: #00ba3d;
      }
    }
  }
  &.solid {
    border: 1px solid #00ba3d;
    span {
      color: #00ba3d;
    }
    &:not(.loading, .disabled):hover {
      border: 1px solid #009230;
      span {
        color: #009230;
      }
    }
  }
  &.text {
    span {
      color: #00ba3d;
    }
    &:not(.loading, .disabled):hover {
      span {
        color: #009230;
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
    background: ${(props) => props.theme.disabledColorPrimary};
    span {
      color: ${(props) => props.theme.textColorFifth};
    }
  }
  &.loading {
    cursor: not-allowed;
    svg {
      margin-right: 6px;
    }
  }
  &.sm {
    min-width: 80px;
    height: 30px;
    border-radius: 4px;
    span {
      font-size: 14px;
    }
  }
  &.md {
    height: 38px;
    border-radius: 5px;
    span {
      font-size: 14px;
    }
  }
  &.lg {
    height: 42px;
    border-radius: 6px;
    span {
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

  const loadingColor = React.useMemo(() => {
    switch (type) {
      case 'primary':
        return '#ffffff';
      case 'danger':
        return '#ee6929';
      default:
        return '#00BA3D';
    }
  }, [type]);

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
      {!disabled && loading && <IconGlobalSpin color={loadingColor} />}
      <span>{cloneElement(children)}</span>
      {suffix}
    </Wrapper>
  );
});

export default Button;
