import * as React from 'react';
import { IconPaginationArrowRight, IconPaginationArrowLeft } from '@/assets/icons/IconGroup';
import styled from 'styled-components';

const Wrapper = styled.ul`
  gap: 8px;
  margin-top: 16px;
  li {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
    transition: all 0.3s ease-in;
    svg {
      fill: rgba(255, 255, 255, 0.85);
      transition: all 0.3s ease-in;
    }
    &.selected,
    &:not(.disabled, .omit):hover {
      background: #54678b;
    }
  }
  .item {
    font-size: 14px;
    color: #9cadcd;
    transition: all 0.3s ease-in;
  }
  .selected {
    font-weight: 600;
    color: #e5e6ed;
  }
  .disabled {
    cursor: not-allowed;
    svg {
      fill: rgba(255, 255, 255, 0.25);
    }
  }
`;

export interface PaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  onChange?: (v: number) => any;
}

const groupCount = 5;

const Pagination: React.FC<PaginationProps> = (props: PaginationProps) => {
  const { current = 1, total, pageSize = 20, onChange } = props;

  const [currentPage, setCurrentPage] = React.useState<number>(current);
  const [startPage, setStartPage] = React.useState<number>(1); // 分组开始页码
  const [totalPage, setTotalPage] = React.useState<number>(0);

  React.useEffect(() => {
    setTotalPage(Math.floor((total - 1) / pageSize) + 1);
  }, [pageSize, total]);

  const pageClick = React.useCallback(
    (num: number) => {
      // 当当前页码大于分组的页码时，使当前页前面显示两个页码
      if (num >= groupCount) {
        setStartPage(num - 2);
      }
      if (num < groupCount) {
        setStartPage(1);
      }
      // 第一页时重新设置分组的起始页
      if (num === 1) {
        setStartPage(1);
      }
      setCurrentPage(num);
      onChange?.(num);
    },
    [onChange],
  );

  const renderPrev = React.useMemo(() => {
    const disabled = currentPage <= 1;
    return (
      <li
        className={`row-center ${disabled ? 'disabled' : ''}`.trimEnd()}
        onClick={() => {
          if (disabled) return;
          pageClick(currentPage - 1);
        }}
      >
        <IconPaginationArrowRight />
      </li>
    );
  }, [currentPage, pageClick]);

  const renderNext = React.useMemo(() => {
    const disabled = currentPage >= totalPage;
    return (
      <li
        className={`row-center ${disabled ? 'disabled' : ''}`.trimEnd()}
        onClick={() => {
          if (disabled) return;
          pageClick(currentPage + 1);
        }}
      >
        <IconPaginationArrowLeft />
      </li>
    );
  }, [currentPage, pageClick, totalPage]);

  const calcList = React.useMemo(() => {
    const pageListArr: number[] = [];
    for (let i = 0; i < totalPage; i++) {
      pageListArr.push(i + 1);
    }

    const pages: React.ReactNode[] = [];

    // 首页
    pages.push(
      <li className={`item row-center ${currentPage === 1 ? 'selected' : ''}`} key={1} onClick={() => pageClick(1)}>
        1
      </li>,
    );

    let pageLength = 0;
    if (groupCount + startPage > totalPage) {
      pageLength = totalPage;
    } else {
      pageLength = groupCount + startPage;
    }

    // 左省略
    if (currentPage >= groupCount) {
      pages.push(
        <li
          className="item row-center omit"
          key={-1}
          onClick={() => {
            pageClick(Math.max(1, currentPage - groupCount));
          }}
        >
          ...
        </li>,
      );
    }

    // 中间页码
    for (let i = startPage; i < pageLength; i++) {
      if (i <= totalPage - 1 && i > 1) {
        pages.push(
          <li className={`item row-center ${currentPage === i ? 'selected' : ''}`} key={i} onClick={() => pageClick(i)}>
            {i}
          </li>,
        );
      }
    }

    // 右省略
    if (totalPage - startPage >= groupCount + 1) {
      pages.push(
        <li
          className="item row-center omit"
          key={-2}
          onClick={() => {
            pageClick(Math.min(Math.floor((total - 1) / pageSize) + 1, currentPage + groupCount));
          }}
        >
          ...
        </li>,
      );
    }
    // 末页
    pages.push(
      <li
        className={`item row-center ${currentPage === totalPage ? 'selected' : ''}`}
        key={totalPage}
        onClick={() => pageClick(totalPage)}
      >
        {totalPage}
      </li>,
    );

    return pages.map((item) => item);
  }, [currentPage, pageClick, pageSize, startPage, total, totalPage]);

  if (totalPage < 2) {
    return null;
  }

  return (
    <Wrapper className="paginzation row-end">
      {renderPrev}
      {calcList}
      {renderNext}
    </Wrapper>
  );
};

export default Pagination;
