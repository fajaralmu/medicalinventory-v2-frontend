import React from 'react'
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import EntityProperty from '../../../models/settings/EntityProperty';

const ExternalEditForm = (props: { record: any, entityProperty: EntityProperty, }) => {

    let link = "";
    if (props.entityProperty.entityName === 'transaction') {
        link = "/transaction/detail/" + props.record.code;
    } else if (props.entityProperty.entityName === 'product') {
        link = "/dashboard/statistic/product/" + props.record.code;
    } else {
        // console.debug("ENTITY NAME: ", props.entityProperty.entityName);
        // console.debug("NO External Edit FORM");
        return null;
    }

    return (
        <AnchorWithIcon
            className="btn btn-sm btn-dark" 
            iconClassName="fas fa-external-link-alt"
            to={link}
            attributes={{ target: "_blank" }}
        />
    )
}

export default ExternalEditForm;