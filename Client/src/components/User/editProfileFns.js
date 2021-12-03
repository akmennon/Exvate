import React from "react";
import Name from './editFns.js/editName'
import Email from './editFns.js/editEmail'
import Mobile from './editFns.js/editMobile'
import Password from './editFns.js/editPassword'
import CompanyDetails from './editFns.js/editCompanyDetails'
import CircularProgress from "@mui/material/CircularProgress";


export default function EditFunction (props){
    switch(props.match.params.type){
        case 'name':
            return (
                <div>
                    <Name {...props}/>
                </div>
            )
        case 'email':
            return (
                <div>
                    <Email {...props}/>
                </div>
            )
        case 'mobile':
            return (
                <div>
                    <Mobile {...props}/>
                </div>
            )
        case 'password':
            return (
                <div>
                    <Password {...props}/>
                </div>
            )
        case 'companyDetails':
            return (
                <div>
                    <CompanyDetails {...props}/>
                </div>
            )
        default:
            props.history.replace('/')
            return <CircularProgress/>
    }
}