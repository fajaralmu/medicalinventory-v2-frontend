import React from 'react'
import AnchorWithIcon from './../../navigation/AnchorWithIcon';
import EntityProperty from '../../../models/settings/EntityProperty';

const ExternalEditForm = (props: { record: any, entityProperty: EntityProperty, }) => {


    let link = "";
    if (props.entityProperty.entityName == 'transaction') {
        link = "/transaction/detail/" + props.record.code;
    } if (props.entityProperty.entityName == 'product') {
        link = "/dashboard/statistic/product/" + props.record.code;
    } else {
        return null;
    }


    return <AnchorWithIcon className="btn btn-sm btn-dark" iconClassName="fas fa-eye" to={link} attributes={{ target: "_blank" }} />
}

export default ExternalEditForm;