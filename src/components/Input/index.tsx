import * as React from 'react';
import classNames from 'classnames';
import { LiteralUnion } from '../_type/type';
import useRandomId from '@/hooks/useRandomId';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  transition: all 0.3s ease-in-out;
  /* 清除默认样式 */
  input {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    color: ${(props) => props.theme.textColorPrimary};
    transition: all 0.3s ease-in-out;
    &:focus {
      outline: none;
    }
    /* global */
    flex: auto;
    height: inherit;
    &::placeholder {
      color: ${(props) => props.theme.textColorFourth};
      transition: all 0.3s ease-in-out;
    }
  }
  /* chrome autocomplete background color */
  input:-webkit-autofill,
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: ${(props) => props.theme.textColorPrimary};
    transition: background-color 99999s 0s, color 99999s 0s;
  }
  /* input[data-autocompleted] {
    background-color: transparent !important;
  } */
  /* chrome autocomplete background color */
  label {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    border: 1px solid ${(props) => props.theme.lineColorPrimary};
    transition: all 0.3s ease-in-out;
  }
  &:not(.danger, .disabled):hover label,
  input:focus + label {
    border: 1px solid #00ba3d;
  }
  .clear {
    padding: 6px;
    font-size: 12px;
    font-weight: bold;
    color: ${(props) => props.theme.textColorPrimary};
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
    transform: scale(0.8);
    transition: all 0.3s ease-in-out;
    &:hover {
      color: #00ba3d;
      background: rgba(0, 186, 61, 0.1);
    }
  }
  /* base */
  &.danger {
    input {
      color: #ff7878;
    }
    label,
    input:focus + label {
      border: 1px solid #ff7878;
    }
  }
  &.disabled {
    user-select: none;
    cursor: not-allowed;
    input {
      color: ${(props) => props.theme.textColorFifth};
      cursor: not-allowed;
      z-index: 1;
      transition: all 0.3s ease-in-out;
      &::placeholder {
        color: ${(props) => props.theme.textColorFifth};
        transition: all 0.3s ease-in-out;
      }
    }
    label {
      background: ${(props) => props.theme.disabledColorPrimary};
      transition: all 0.3s ease-in-out;
    }
  }
  &.sm {
    padding: 0 8px;
    min-width: 80px;
    height: 30px;
    input {
      font-size: 12px;
    }
    label {
      border-radius: 4px;
    }
  }
  &.md {
    padding: 0 10px;
    height: 38px;
    input {
      font-size: 12px;
    }
    label {
      border-radius: 5px;
    }
  }
  &.lg {
    padding: 0 12px;
    height: 42px;
    input {
      font-size: 16px;
    }
    label {
      border-radius: 6px;
    }
  }
`;

/* eslint-disable */
type inputType = LiteralUnion<
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week',
  string
>;
/* eslint-enable */

type SizeType = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  className?: string;
  type?: inputType;
  size?: SizeType;
  danger?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clear?: boolean;
  onChange?: (...args: any[]) => any;
  onFocus?: (...args: any[]) => any;
  onBlur?: (...args: any[]) => any;
  onClear?: (...args: any[]) => any;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}

const Input: React.FC<InputProps> = React.forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    className,
    type = 'text',
    size = 'md',
    danger = false,
    disabled = false,
    prefix,
    suffix,
    clear = false,
    value,
    onChange,
    onFocus,
    onBlur,
    onClear,
    onPressEnter,
    ...rest
  } = props;

  const uuid = useRandomId();

  const classes = classNames(className, 'row-between', {
    [`${size}`]: size,
    danger,
    disabled,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value, e.target.name);
  };

  const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFocus?.(e.target.value, e.target.name);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    onBlur?.(e.target.value, e.target.name);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    onPressEnter?.(e);
  };

  const handleClear = () => {
    onClear?.() ?? onChange?.('', 'clear');
  };

  return (
    <Wrapper className={classes}>
      {prefix}
      <input
        autoComplete="off"
        ref={ref}
        type={type}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={handleEnter}
        {...rest}
      />
      <label htmlFor={uuid} />
      {!disabled && clear && value && <i className="iconfont icon-select-cancel clear" onClick={handleClear} />}
      {suffix}
    </Wrapper>
  );
});

export default Input;
