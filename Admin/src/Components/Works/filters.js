import React from 'react';
import { Filter, SearchInput } from 'react-admin'

const WorkFilter = (props) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
    </Filter>
);

export default WorkFilter