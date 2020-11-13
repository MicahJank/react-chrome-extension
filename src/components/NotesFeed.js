import React from 'react';

import Note from './Note.js';
import Search from './Search.js';

const NotesFeed = () => {

    return (
        <div className="notes-feed-container">
            <Search />
            {/* logic here for showing all notes */}
        </div>
    )
}

export default NotesFeed;