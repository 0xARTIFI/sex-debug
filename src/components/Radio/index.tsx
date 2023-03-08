import * as React from 'react';
import classNames from 'classnames';
import { cloneElement } from '../_util/reactNode';
import useRandomId from '@/hooks/useRandomId';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* 清除默认样式 */
  input {
    display: none;
    opacity: 0;
  }
  /* global */
  label {
    display: flex;
    cursor: pointer;
    user-select: none;
    .choose {
      position: relative;
      border: 1px solid ${(props) => props.theme.lineColorPrimary};
      border-radius: 50%;
      transition: all 0.3s ease-in-out;
      svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease-in-out;
      }
    }
    .content {
      flex: 1;
      word-break: break-word;
      color: ${(props) => props.theme.textColorPrimary};
    }
  }
  &:not(.checked) {
    svg {
      opacity: 0;
    }
  }
  &:not(.disabled):hover {
    .choose {
      border: 1px solid rgba(0, 186, 61, 0.8);
    }
  }
  /* base */
  &.checked {
    .choose {
      border: 1px solid #00ba3d;
    }
  }
  &.disabled {
    label {
      cursor: not-allowed;
    }
    .content {
      color: ${(props) => props.theme.textColorFourth};
    }
  }
  &.sm {
    label {
      font-weight: 500;
      font-size: 14px;
      line-height: 14px;
    }
    .choose {
      margin-right: 6px;
      width: 14px;
      height: 14px;
      svg {
        width: 8px;
        height: 8px;
      }
    }
  }
  &.md {
    label {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
    }
    .choose {
      margin-right: 10px;
      width: 18px;
      height: 18px;
    }
  }
  &.lg {
  }
`;

type SizeType = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'checked'> {
  className?: string;
  size?: SizeType;
  disabled?: boolean;
  value: string | number;
  checked?: string | number;
  children?: React.ReactNode;
  onChange?: (...args: any[]) => any;
}

const IconCircle: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" {...props}>
      <circle cx="5" cy="5" r="5" fill="#00BA3D" />
    </svg>
  );
};

const Radio: React.FC<RadioProps> = React.forwardRef((props: RadioProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, size = 'md', disabled = false, value, checked, children, onChange } = props;

  const uuid = useRandomId();

  const visible = React.useMemo(() => String(checked) === String(value), [checked, value]);

  const classes = classNames(className, {
    [`${size}`]: size,
    checked: visible,
    disabled,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const final = typeof value === 'number' ? Number(e.target.value) : e.target.value;
    onChange?.(final, 'radio');
  };

  const memoElement = React.useMemo(() => {
    if (!React.isValidElement(children)) return <span>{children}</span>;
    const renderClone = cloneElement(children, {
      className: `content ${children.props.className ?? ''}`.trimEnd(),
    });
    return renderClone;
  }, [children]);

  return (
    <Wrapper className={classes}>
      <input
        type="radio"
        name="group"
        id={uuid}
        ref={ref}
        disabled={disabled}
        value={value}
        checked={visible}
        onChange={handleChange}
      />
      <label htmlFor={uuid}>
        <div className="choose">
          <IconCircle />
        </div>
        {memoElement}
      </label>
    </Wrapper>
  );
});

export default Radio;
