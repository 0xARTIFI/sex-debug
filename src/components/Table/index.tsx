import * as React from 'react';
import classNames from 'classnames';
import { IconGlobalSpin } from '@/assets/icons/IconGroup';
import { fadeConfig } from '../../configs/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneElement } from '../_util/reactNode';
import { ResetFactor } from '../_type/type';
import { Scrollbar } from '../index';
import styled from 'styled-components';

const Wrapper = styled.div`
  .tbody {
    position: relative;
    .scroll {
      padding: 12px 0;
      span {
        margin-left: 8px;
        font-size: 14px;
        color: #54678b;
      }
    }
    .normal {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(14, 75, 195, 0.04);
      backdrop-filter: blur(4px);
      cursor: not-allowed;
      transition: all 0.3s ease-in-out;
      z-index: 10;
    }
    .empty {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      img {
        margin: 0 auto 4px auto;
        width: 48px;
        height: 48px;
      }
      h6 {
        width: 100%;
        text-align: center;
        font-size: 12px;
        line-height: 120%;
        color: #54678b;
        transition: all 0.3s ease-in-out;
      }
    }
  }
`;

interface TheadProps {
  fixed?: boolean;
  children?: React.ReactNode;
}

interface TbodyProps {
  type?: 'start' | 'end';
  empty?: React.ReactNode;
  dataSource?: object[];
  scroll?: number;
  children?: React.ReactNode;
  onMore?: (...args: any[]) => any;
}

type TableInstance = TheadProps & ResetFactor<TbodyProps, 'type' | 'dataSource'>;

export interface TableProps extends TableInstance {
  className?: string;
}

const TableHead: React.FC<TheadProps> = ({ children, fixed }) => {
  return <ul className="thead row-between">{cloneElement(children)}</ul>;
};

const TableBody: React.FC<TbodyProps> = (props) => {
  const { type, scroll, empty, dataSource = [], children, onMore } = props;

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight === scrollHeight) {
        console.log('I am on the bottom!');
        onMore?.();
      }
    },
    [onMore],
  );

  const memoLoading = React.useMemo(() => {
    return (
      <AnimatePresence>
        {type === 'start' && (
          <motion.div className={`${scroll ? 'scroll' : 'normal'} row-center`.trimEnd()} {...fadeConfig}>
            <IconGlobalSpin size={scroll ? 16 : 38} color="#0e4bc3" />
            {scroll && <span>loading…</span>}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }, [type, scroll]);

  const memoEmpty = React.useMemo(() => {
    return (
      <AnimatePresence>
        {type === 'end' && dataSource.length === 0 && (
          <motion.div className="empty col-center" {...fadeConfig}>
            <img src={require('@/assets/images/_global/nodata.svg')} alt="icon" />
            {empty || <h6>No Data</h6>}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }, [type, dataSource, empty]);

  // 多维滚动计算宽度
  const renderScroll = React.useMemo(() => {
    return (
      <Scrollbar onScroll={handleScroll}>
        {cloneElement(children)}
        {memoLoading}
        {memoEmpty}
      </Scrollbar>
    );
  }, [children, memoLoading, memoEmpty, handleScroll]);

  const renderNormal = React.useMemo(() => {
    return (
      <React.Fragment>
        {cloneElement(children)}
        {memoLoading}
        {memoEmpty}
      </React.Fragment>
    );
  }, [children, memoLoading, memoEmpty]);

  return (
    <ul className="tbody" style={{ height: scroll ?? 'auto' }}>
      {scroll ? renderScroll : renderNormal}
    </ul>
  );
};

const InternalTable = (props: TableProps, ref: React.Ref<HTMLDivElement>) => {
  const { className, children, ...rest } = props;

  const classes = classNames(className, 'table');

  return (
    <Scrollbar>
      <Wrapper className={classes} ref={ref}>
        {React.Children.map(children, (ele, i) => i < 2 && cloneElement(ele, { ...rest }))}
      </Wrapper>
    </Scrollbar>
  );
};

const Table = React.forwardRef(InternalTable) as unknown as ((
  props: React.PropsWithChildren<TableProps>,
) => React.ReactElement) & { TableHead: typeof TableHead; TableBody: typeof TableBody };

Table.TableHead = TableHead;
Table.TableBody = TableBody;

export default Table;
