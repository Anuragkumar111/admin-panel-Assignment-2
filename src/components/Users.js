import React, { useState, useEffect, useMemo } from 'react';
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from 'react-table';
import { COLUMNS } from './columns';
import './table.css';
import Search from './Search';
import { Checkbox } from './Checkbox';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Users = ({ users }) => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => users, [users]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state,
    gotoPage,
    pageCount,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: 'selection',
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <Checkbox {...getToggleAllPageRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <Checkbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter, pageIndex } = state;
  const [usersList, setUsersList] = useState([page]);

  useEffect(() => {
    setUsersList(page);
  }, [page]);

  const handleDelete = (rowId) => {
    const data = usersList.filter((row) => row.id !== rowId);
    setUsersList(data);
  };

  const handleDeleteSelected = (selectedFlatRows) => {
    if (selectedFlatRows.length === 0) return;
    console.log('clicked');
    selectedFlatRows.map((row) => console.log(row.id));
    const data = usersList.filter(
      (obj) =>
        !selectedFlatRows.some((excludedObj) => excludedObj.id === obj.id)
    );
    setUsersList(data);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Search filter={globalFilter} setFilter={setGlobalFilter} />
        <FaTrash
          color='red'
          size={20}
          className='delete-selected'
          onClick={() => handleDeleteSelected(selectedFlatRows)}
        />
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {usersList.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={cell.id}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
                <td>
                  <FaEdit className='edit-icon' />

                  <FaTrash
                    className='delete-icon'
                    onClick={() => handleDelete(row.id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          | Go to page:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{
              width: '50px',
            }}
          />
        </span>
        <button className='first-page' onClick={() => gotoPage(0)}>
          {'First Page'}
        </button>
        <button
          className='previous-page'
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <button
          className='next-page'
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
        <button className='last-page' onClick={() => gotoPage(pageCount - 1)}>
          {'Last Page'}
        </button>
      </div>
    </>
  );
};

export default Users;
