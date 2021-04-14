import * as React from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Title } from 'react-admin';

const CreateOrder = (props) => (
    <Card>
        <Title title="Create Order" />
        <CardContent>
            <h1>Pending</h1>
        </CardContent>
    </Card>
);

export default CreateOrder;
