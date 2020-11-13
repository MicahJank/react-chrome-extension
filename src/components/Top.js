import React from 'react';
import { Button, Icon, Header } from 'semantic-ui-react';


const Top = () => {

    return (
        <div className="top-container">
            <Button circular icon>
                <Icon name='plus' />
            </Button>
            <Header as="h1">Noted</Header>
        </div>
    )
}

export default Top;