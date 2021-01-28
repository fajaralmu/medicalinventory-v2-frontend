import React from 'react'
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import EntityProperty from './../../../models/EntityProperty';

const     ExternalEditForm = (props:{record:any, entityProperty:EntityProperty, show?:boolean}) => {
    const recordId = EntityProperty.getRecordId(props.record, props.entityProperty);
    if (props.show == false) return null;
    let link = "";
    if (props.entityProperty.entityName == 'quiz') {
        link = "/quizmanagement/detail/"+recordId;
    } else {
        return null;
    }

    
    return <AnchorWithIcon iconClassName="fas fa-edit" to={link} attributes={{target:"_blank"}} />
}

export default ExternalEditForm;