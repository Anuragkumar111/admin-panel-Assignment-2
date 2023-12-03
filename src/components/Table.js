import React, { useMemo, useState } from 'react';
import { useTable, usePagination, useRowSelect } from 'react-table';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ columns, data: initialData }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize, selectedRowIds },
    page,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    toggleAllRowsSelected,
  } = useTable(
    {
      columns,
      data: initialData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination,
    useRowSelect // Enable row selection
  );

  const pageCount = pageOptions.length;

  const [editableRow, setEditableRow] = useState(null);
  const [data, setData] = useState(initialData);

  const memoizedColumns = useMemo(() => columns, [columns]);

  const handleEdit = (rowId) => {
    setEditableRow(rowId);
  };

  const handleSave = () => {
    // Save the changes and reset the editableRow state
    const newData = [...data];
    const editedRowIndex = newData.findIndex((row) => row.id === editableRow);

    if (editedRowIndex !== -1) {
      newData[editedRowIndex] = {
        ...newData[editedRowIndex],
        // Include your column data updates here
      };

      setData(newData);
    }

    setEditableRow(null);
  };

  return (
    <div>
      <table {...getTableProps()} className='table'>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              <th>
                {/* Checkbox to select all visible rows on the current page */}
                <input
                  type='checkbox'
                  onChange={() => toggleAllRowsSelected()}
                  checked={
                    page.length > 0 &&
                    page.every((row) => selectedRowIds[row.id])
                  }
                />
              </th>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {/* Checkbox for row selection */}
                <td>
                  <input
                    type='checkbox'
                    {...row.getToggleRowSelectedProps()}
                    checked={selectedRowIds[row.id]}
                  />
                </td>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.id}>
                    {editableRow === row.id ? (
                      <input
                        type='text'
                        value={data[row.index][cell.column.id]}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[row.index][cell.column.id] = e.target.value;
                          setData(newData);
                        }}
                      />
                    ) : (
                      cell.render('Cell')
                    )}
                  </td>
                ))}
                <td>
                  {editableRow === row.id ? (
                    <button onClick={() => handleSave()}>Save</button>
                  ) : (
                    <FaEdit
                      className='edit-icon'
                      onClick={() => handleEdit(row.id)}
                    />
                  )}
                  <FaTrash className='delete-icon' />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Delete All Selected button */}
      <button
        onClick={() =>
          console.log(
            'Deleting selected rows:',
            Object.keys(selectedRowIds).map(Number)
          )
        }
        disabled={Object.keys(selectedRowIds).length === 0}
      >
        Delete All Selected
      </button>

      {/* Pagination */}
      <div className='pagination'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Table;
