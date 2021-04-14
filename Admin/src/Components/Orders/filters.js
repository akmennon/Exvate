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
    return <Chip className={classes.chip} label={label} key={label}/>;
};

const PostFilter = (props) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <QuickFilter label="Unverified" source="verified.value" defaultValue={false}  />
        <QuickFilter label="Main Order" source="subOrder" defaultValue={false} />
    </Filter>
);

export default PostFilter