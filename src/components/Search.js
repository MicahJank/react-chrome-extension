import React, { useState } from 'react';

const Search = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');


    const handleChange = e => {
        setSearch(e.target.value);
    }

    return (
        <input onChange={handleChange} className="search" value={search} icon="search" iconPosition="left" placeholder="Search for a note..." />
    )
}


export default Search;