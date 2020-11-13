import React, { useState } from 'react';

import { Input, Icon, Button } from 'semantic-ui-react';

const Search = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');


    const handleChange = e => {
        setSearch(e.target.value);
    }

    return (
        <Input onChange={handleChange} className="search" value={search} icon="search" iconPosition="left" placeholder="Search for a note..." />
    )
}


export default Search;