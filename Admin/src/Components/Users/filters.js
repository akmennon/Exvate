import React from 'react';
import { makeStyles, Chip } from '@material-ui/core';
import { Filter, SearchInput } from 'react-admin'


const useQuickFilterStyles = makeStyles(theme => ({
    chip: {
        marginBottom: theme.spacing(1),
    },
}));

const QuickFilter = ({ label }) => {
    const classes = useQuickFilterStyles();
    return <Chip className={classes.chip} label={label} />;
};

const UserFilter = (props) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <QuickFilter label="host" source="host" defaultValue={true}  />
    </Filter>
);

export default UserFilter