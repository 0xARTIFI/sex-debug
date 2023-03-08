import * as React from 'react';
import classNames from 'classnames';
import { cloneElement } from '../_util/reactNode';
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
    display: flex;
    cursor: pointer;
    user-select: none;
    .choose {
      position: relative;
      border: 1px solid ${(props) => props.theme.lineColorThird};
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
      background: #00ba3d;
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
      font-size: 12px;
      line-height: 14px;
    }
    .choose {
      margin-right: 6px;
      width: 14px;
      height: 14px;
      border-radius: 3px;
      svg {
        width: 7.5px;
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
      border-radius: 4px;
    }
  }
  &.lg {
  }
`;

type SizeType = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  size?: SizeType;
  disabled?: boolean;
  checked?: boolean;
  children?: React.ReactNode;
  onChange?: (...args: any[]) => any;
}

const IconCheck: React.FC<React.SVGAttributes<SVGElement>> = (props) => {
  return (
    <svg width="9" height="6" viewBox="0 0 9 6" {...props}>
      <path
        // eslint-disable-next-line max-len
        d="M6.846.23L3 4.078 1.308 2.385a1.314 1.314 0 0 0-1.077 0c-.308.307-.308.923 0 1.23L2.385 5.77a.744.744 0 0 0 1.077 0l4.461-4.461a.744.744 0 0 0 0-1.077.744.744 0 0 0-1.077 0z"
        fill="#ffffff"
      />
    </svg>
  );
};

const Checkbox: React.FC<CheckboxProps> = React.forwardRef((props: CheckboxProps, ref: React.Ref<HTMLInputElement>) => {
  const { className, size = 'md', disabled = false, checked = false, children, onChange } = props;

  const uuid = useRandomId();

  const classes = classNames(className, {
    [`${size}`]: size,
    checked,
    disabled,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked, 'checkbox');
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
      <input type="checkbox" id={uuid} ref={ref} disabled={disabled} checked={checked} onChange={handleChange} />
      <label htmlFor={uuid}>
        <div className="choose">
          <IconCheck />
        </div>
        {memoElement}
      </label>
    </Wrapper>
  );
});

export default Checkbox;
