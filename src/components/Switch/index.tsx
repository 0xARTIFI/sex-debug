import * as React from 'react';
import classNames from 'classnames';
import useRandomId from '@/hooks/useRandomId';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  /* 清除默认样式 */
  input {
    display: none;
    opacity: 0;
  }
  /* global */
  label {
    position: relative;
    display: block;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &::after {
      content: '';
      position: absolute;
      left: 1px;
      top: 1px;
      display: block;
      border-radius: 50%;
      background: #ffffff;
      outline: 1px solid transparent;
      transition: all 0.3s ease-in-out;
    }
  }
  &:not(.checked) {
    label {
      background: ${(props) => props.theme.switchColorPrimary};
      &::after {
        box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
      }
    }
  }
  &:not(.checked, .disabled):hover {
    label::after {
      outline: 1px solid #00ba3d;
    }
  }
  /* base */
  &.checked {
    label {
      background: #00ba3d;
      &::after {
        transform: translateX(100%);
        box-shadow: -4px 1px 6px rgba(0, 0, 0, 0.25);
      }
    }
  }
  &.disabled {
    cursor: not-allowed;
    label {
      background: ${(props) => props.theme.disabledColorPrimary};
      cursor: not-allowed;
      &::after {
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
  &.sm {
  }
  &.md {
    label {
      width: 42px;
      height: 22px;
      border-radius: 22px;
      &::after {
        width: 20px;
        height: 20px;
      }
    }
  }
  &.lg {
  }
`;

type SizeType = 'sm' | 'md' | 'lg';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  size?: SizeType;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (...args: any[]) => any;
}

const Switch: React.FC<SwitchProps> = React.forwardRef((props: SwitchProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, size = 'md', disabled = false, checked = false, onChange } = props;

  const uuid = useRandomId();

  const classes = classNames(className, {
    [`${size}`]: size,
    checked,
    disabled,
  });

  const handleChange: React.MouseEventHandler<HTMLInputElement> = () => {
    if (disabled) return;
    onChange?.(!checked, 'switch');
  };

  return (
    <Wrapper className={classes}>
      <input type="checkbox" id={uuid} ref={ref} disabled={disabled} onClick={handleChange} />
      <label htmlFor={uuid} />
    </Wrapper>
  );
});

export default Switch;
