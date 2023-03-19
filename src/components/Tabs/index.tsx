import classNames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* global */
  position: relative;
  .tab {
    display: flex;
    align-items: center;
    li {
      white-space: nowrap;
      font-weight: 500;
      color: #e5e6ed;
      user-select: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      &.active {
        color: #0e4bc3;
      }
      &:not(.active):hover {
        color: #0e4bc3;
      }
    }
  }
  hr {
    position: absolute;
    bottom: 0;
    margin: 0;
    border: none;
    transition: all 0.3s ease-in-out;
  }
  .bar {
    height: 2px;
    background: #0e4bc3;
    z-index: 1;
  }
  .line {
    right: 0;
    left: 0;
    height: 1px;
    background: #34384c;
    transition: all 0.3s ease-in-out;
  }
  /* base */
  &.sm {
  }
  &.md {
    .tab {
      gap: 38px;
      li {
        padding-bottom: 6px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
  &.lg {
    .tab {
      gap: 58px;
      li {
        padding-bottom: 10px;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
`;

type SizeType = 'sm' | 'md' | 'lg';

interface TabsObjectType {
  name: React.ReactNode;
  key: string | number;
}

export interface TabsProps {
  className?: string;
  size?: SizeType;
  // gutter?: number;
  underline?: boolean;
  items?: TabsObjectType[];
  activeIndex?: number;
  onChange?: (...args: any[]) => any;
  suffix?: React.ReactNode;
}

type PositionProps = Array<{ width: number; left: number }>;

const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
  const { suffix, className, size = 'md', underline = true, items = [], onChange, activeIndex } = props;

  const tabsRef = React.useRef<HTMLDivElement>(null);
  const innerRef = React.useRef<HTMLUListElement>(null);

  const [direction, setDirection] = React.useState<PositionProps>([]);

  const classes = classNames(className, { [`${size}`]: size });

  const filterPosition = React.useCallback((space: HTMLDivElement, inside: HTMLCollection) => {
    const { left: spaceLeft } = space.getBoundingClientRect();
    const siteMap: PositionProps = [];
    for (const element of inside) {
      const { width, left } = element.getBoundingClientRect();
      siteMap.push({ width, left });
    }
    const rectSize = siteMap.map((ele) => ({ ...ele, left: ele.left - spaceLeft }));
    return rectSize;
  }, []);

  React.useEffect(() => {
    if (!tabsRef.current || !innerRef.current || items.length === 0) return;
    const space = tabsRef.current;
    const inside = innerRef.current.children;
    const result = filterPosition(space, inside);
    setDirection(result);
  }, [tabsRef, items, filterPosition]);

  const [tabActive, setTabActive] = React.useState<number>(activeIndex || 0);

  // handle event
  const handleChange = (ele: TabsObjectType, index: number) => {
    // if (disabled) return;
    setTabActive(index);
    onChange?.(ele.key);
  };

  return (
    <Wrapper className={classes} ref={tabsRef}>
      <div className="row-between">
        <ul className="tab" ref={innerRef}>
          {items.map((ele, index) => (
            <li
              className={`${tabActive === index ? 'active' : 'default'}`.trimEnd()}
              key={ele.key}
              onClick={() => handleChange(ele, index)}
            >
              {ele.name}
            </li>
          ))}
        </ul>
        {suffix ? <div>{suffix}</div> : null}
      </div>
      <hr className="bar" style={direction[tabActive]} />
      {underline && <hr className="line" />}
    </Wrapper>
  );
};

export default Tabs;
