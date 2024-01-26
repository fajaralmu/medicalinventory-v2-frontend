import React from 'react';
import { baseImageUrl } from '../constant/Url';
import { FieldType } from '../models/FieldType';
import EntityProperty from '../models/settings/EntityProperty';
import { beautifyNominal } from './StringUtil';

export default class EntityValues {
  static parseValues(object: any, prop: EntityProperty): Array<any> {
    const result = new Array();
    const { elements } = prop;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const elementid = element.id;
      let value = object[elementid];
      if (value === null) {
        result.push(value);
        continue;
      }
      switch (element.fieldType) {
        case FieldType.FIELD_TYPE_DATE:
          value = new Date(value).toLocaleDateString('ID');
          break;
        case FieldType.FIELD_TYPE_DATETIME:
          value = new Date(value).toLocaleDateString('ID') + ' ' + new Date(value).toLocaleTimeString();
          break;
        case FieldType.FIELD_TYPE_IMAGE:
          const imgLink = new String(value).split('~')[0];
          value = <img src={baseImageUrl() + imgLink} width='50' height='50' />;
          break;
        case FieldType.FIELD_TYPE_COLOR:
          value = <strong style={{ color: value }}>{value}</strong>;
          break;
        case FieldType.FIELD_TYPE_NUMBER:
          value = beautifyNominal(value);
          break;
        case FieldType.FIELD_TYPE_TEXTEDITOR:
          value = <div dangerouslySetInnerHTML={{
            __html: new String(value).length > 100 ?
              (new String(value).substring(0, 100) + '...')
              : value
          }}></div>;
          break;
        case FieldType.FIELD_TYPE_CHECKBOX:
          value = value === true ? <i>true</i> : <i>false</i>;
          break;
        case FieldType.FIELD_TYPE_FIXED_LIST:
        case FieldType.FIELD_TYPE_DYNAMIC_LIST:
        default:
          if (element.optionItemName && element.optionItemName != '' && object[elementid]) {
            // console.log('elementid', elementid, 'object', object, 'element.optionItemName', element.optionItemName);
            const valueAsObj = object[elementid];
            value = valueAsObj[element.optionItemName ?? 'id'];
          } else {
            value = object[elementid];
          }
      }
      result.push(value);
    }
    return result;
  }
}