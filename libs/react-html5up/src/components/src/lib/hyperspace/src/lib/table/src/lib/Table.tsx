import React, { FunctionComponent, HTMLAttributes, createElement } from 'react';
import { TableStyles } from './Table.style';

export interface ITableDataProps {
  body: string[][];
  head?: string[];
  foot?: string[];
}

export interface ITableProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'default' | 'alternate';
  data: ITableDataProps;
}

export const validateData = ({ body, foot, head }: ITableProps['data']) => {
  if (!body.length) {
    throw new Error('Table body is empty');
  }

  let sizes: number[] = [];

  body.forEach((tr) => sizes.push(tr.length));

  if (head) {
    sizes.push(head.length);
  }
  if (foot) {
    sizes.push(foot.length);
  }

  if (!sizes.every((value, _i, array) => value === array[0])) {
    throw new Error("Data array sizes aren't same");
  }
};

export const TableHead: FunctionComponent<{
  data: ITableDataProps['head'];
}> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <thead>
      {createElement(
        'tr',
        {},
        data.map((d, i) => <th key={i}>{d}</th>)
      )}
    </thead>
  );
};

export const TableFooter: FunctionComponent<{
  data: ITableDataProps['foot'];
}> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <tfoot>
      {createElement(
        'tr',
        {},
        data.map((d, i) => <td key={i}>{d}</td>)
      )}
    </tfoot>
  );
};

export const TableBody: FunctionComponent<{
  data: ITableDataProps['body'];
}> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <tbody>
      {data.map((d, i) =>
        createElement(
          'tr',
          { key: i },
          d.map((td, j) => createElement('td', { key: j }, td))
        )
      )}
    </tbody>
  );
};

export const Table: FunctionComponent<ITableProps> = ({
  type,
  data,
  ...rest
}) => {
  validateData(data);

  return (
    <div {...rest} {...TableStyles({ type: type ?? 'default' })}>
      <table>
        <TableHead data={data.head} />
        <TableBody data={data.body} />
        <TableFooter data={data.foot} />
      </table>
    </div>
  );
};

export default Table;
