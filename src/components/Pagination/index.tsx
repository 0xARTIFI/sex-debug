import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* display: flex;
  align-items: center; */
  margin-top: 24px;
  li {
    list-style: none;
  }
  .iconfont {
    transition: all 0.3s ease-in;
    color: ${(props) => props.theme.textColorPrimary};
  }
  .prev,
  .next {
    cursor: pointer;
    .iconfont {
      transition: all 0.3s ease-in;
    }
    &.disabled {
      cursor: not-allowed;
      .iconfont {
        color: ${(props) => props.theme.disabledColorPrimary};
      }
    }
  }
  .prev {
    margin-right: 6px;
  }
  .next {
    margin-left: 2px;
  }
  .pageItem {
    width: 28px;
    height: 28px;
    margin-right: 4px;
    text-align: center;
    line-height: 28px;
    font-size: 12px;
    color: ${(props) => props.theme.textColorPrimary};
    transition: all 0.3s ease-in;
    font-weight: bold;
    &:hover,
    &.selected {
      &:not(.omit) {
        cursor: pointer;
        background-color: ${(props) => props.theme.backgroundColorSecond};
      }
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
    (num) => {
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
      <p
        className={`prev ${disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (disabled) return;
          pageClick(currentPage - 1);
        }}
      >
        <i className="iconfont icon-arrow-left" />
      </p>
    );
  }, [currentPage, pageClick]);

  const renderNext = React.useMemo(() => {
    const disabled = currentPage >= totalPage;
    return (
      <p
        className={`next ${disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (disabled) return;
          pageClick(currentPage + 1);
        }}
      >
        <i className="iconfont icon-arrow-right" />
      </p>
    );
  }, [currentPage, pageClick, totalPage]);

  const calcList = React.useMemo(() => {
    const pageListArr: number[] = [];
    for (let i = 0; i < totalPage; i++) {
      pageListArr.push(i + 1);
    }
    // if (totalPage < showOmit) {
    //   return pageListArr.map((item: number) => (
    //     <p
    //       key={item}
    //       className={`pageItem ${pageItem === currentPage && 'selected'}`}
    //       onClick={() => {
    //         pageClick(item);
    //       }}
    //     >
    //       {item}
    //     </p>
    //   ));
    // }

    const pages: React.ReactNode[] = [];

    // 首页
    pages.push(
      <p className={`pageItem ${currentPage === 1 ? 'selected' : ''}`} key={1} onClick={() => pageClick(1)}>
        1
      </p>,
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
        <p
          className="pageItem omit"
          key={-1}
          onClick={() => {
            pageClick(Math.max(1, currentPage - groupCount));
          }}
        >
          ...
        </p>,
      );
    }

    // 中间页码
    for (let i = startPage; i < pageLength; i++) {
      if (i <= totalPage - 1 && i > 1) {
        pages.push(
          <p className={`pageItem ${currentPage === i ? 'selected' : ''}`} key={i} onClick={() => pageClick(i)}>
            {i}
          </p>,
        );
      }
    }

    // 右省略
    if (totalPage - startPage >= groupCount + 1) {
      pages.push(
        <p
          className="pageItem omit"
          key={-2}
          onClick={() => {
            pageClick(Math.min(Math.floor((total - 1) / pageSize) + 1, currentPage + groupCount));
          }}
        >
          ...
        </p>,
      );
    }
    // 末页
    pages.push(
      <p
        className={`pageItem ${currentPage === totalPage ? 'selected' : ''}`}
        key={totalPage}
        onClick={() => pageClick(totalPage)}
      >
        {totalPage}
      </p>,
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
