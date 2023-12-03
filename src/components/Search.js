import React from 'react';
import './table.css';

const Search = ({ filter, setFilter }) => {
  return (
    <span>
      <input
        type='text'
        className='search...'
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
        placeholder='Search'
      />
    </span>
  );
};

export default Search;
