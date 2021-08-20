import React, { Fragment } from 'react';
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const supplierModal = ({ reset, confirm, setParams, params, classes, props ,cred, paymentDetails,setCred,setPaymentDetails}) => {
    if (params.type==='assign') {
        return (
            <div className={classes.paper}>
                <h2>Order Values</h2>
                <div className={classes.variables}>
                    {
                        !params.values || !params.values.variables ? <div /> : params.values.variables.map((ele, index) => {
                            return (
                                <div key={ele.id} className={classes.param}>
                                    <TextField
                                        label='Title'
                                        type="text"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.valuesField}
                                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.variables[index].title = val; return { ...p } }) }}
                                        value={params.values.variables[index].title}
                                    />
                                    <TextField
                                        label='Value'
                                        type="number"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.valuesField}
                                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.variables[index].value = val; return { ...p } }) }}
                                        value={params.values.variables[index].value}
                                    />
                                    <TextField
                                        label='Unit'
                                        type="text"
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.valuesField}
                                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.variables[index].unit = val; return { ...p } }) }}
                                        value={params.values.variables[index].unit}
                                    />
                                    <Button variant='outlined' color='primary' onClick={() => setParams(p => { p.values.variables.splice(index, 1); return { ...p } })}>Remove</Button>
                                </div>
                            )
                        })
                    }
                    <Button style={{ marginBottom: 20 }} variant='outlined' color='primary' onClick={() => setParams(p => { p.values.variables.push({ id: `${'$' + (new Date()).getTime().toString()}`, title: 'Pending', value: 1, unit: '' }); return { ...p } })}>Add Param</Button>
                    <TextField
                        label='Supplier Price'
                        type="number"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        className={classes.valuesField}
                        onChange={(e) => { const val = e.target.value; setParams(p => { p.values.supplierAmount = val; return { ...p } }) }}
                        value={params.values.supplierAmount}
                    />
                </div>
                <TextField
                    label="Price"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { const val = e.target.value; setParams({ ...params, values: { ...params.values, price: Number(val) } }) }}
                    value={params.values.price}
                />
                <TextField
                    label="Time"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { const val = e.target.value; setParams({ ...params, values: { ...params.values, time: Number(val) } }) }}
                    value={params.values.time}
                />
                <TextField
                    label="Validity"
                    type="number"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => { const val = e.target.value; setParams({ ...params, values: { ...params.values, validTill: Number(val) } }) }}
                    value={params.values.validTill}
                />
                <button onClick={() => reset()}>Reset Values</button>
                <button onClick={() => { confirm('supplier',params, props) }}>Confirm</button>
            </div>
        )
    }
    else if(params.type==='payment'){
        return (
            <div className={classes.paper}>
                <Fragment>
                    <div className={classes.paymentSelect}>
                        <Typography>Payment Type :</Typography>
                        <div className={classes.select}>
                            <Select
                                value={paymentDetails.type}
                                onChange={(e) => { const val = e.target.value; setPaymentDetails(p => ({ ...p, type: val })) }}
                                label="Payment"
                            >
                                <MenuItem value={"LC"}>LC</MenuItem>
                                <MenuItem value={"Advance/LC"}>Advance/LC</MenuItem>
                                <MenuItem value={"Advance"}>Advance</MenuItem>
                            </Select>
                        </div>
                    </div>
                </Fragment>
                {
                    <TextField
                        label="AdvancePercent"
                        type="number"
                        variant='outlined'
                        onChange={(e) => { const val = e.target.value; setPaymentDetails(p => ({ ...p, advancePercent: val })) }}
                        value={paymentDetails.advancePercent}
                    />
                }
                <Typography>Authentication</Typography>
                <TextField
                    label="email"
                    type="email"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, email: val })) }}
                    value={cred.email}
                />
                <TextField
                    label="password"
                    type="password"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, password: val })) }}
                    value={cred.password}
                />
                <Button color='primary' variant='outlined' onClick={() => { confirm('payment') }}>Confirm</Button>
            </div>
        )
    }
    else{
        return (
            <div className={classes.paper}>
                <Typography>Authentication</Typography>
                <TextField
                    label="email"
                    type="email"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, email: val })) }}
                    value={cred.email}
                />
                <TextField
                    label="password"
                    type="password"
                    variant='outlined'
                    onChange={(e) => { const val = e.target.value; setCred(cred => ({ ...cred, password: val })) }}
                    value={cred.password}
                />
                <Button color='primary' variant='outlined' onClick={() => { confirm('finish') }}>Confirm</Button>
            </div>
        )
    }
}

export default supplierModal