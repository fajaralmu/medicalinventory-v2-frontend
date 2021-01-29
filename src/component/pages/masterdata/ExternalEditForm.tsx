import React from 'react'
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import EntityProperty from './../../../models/EntityProperty';

const     ExternalEditForm = (props:{record:any, entityProperty:EntityProperty, show?:boolean}) => {
    
    if (props.show == false) return null;
    let link = "";
    if (props.entityProperty.entityName == 'transaction') {
        link = "/transaction/detail/"+props.record.code;
    } else {
        return null;
    }

    
    return <AnchorWithIcon iconClassName="fas fa-edit" to={link} attributes={{target:"_blank"}} />
}

export default ExternalEditForm;