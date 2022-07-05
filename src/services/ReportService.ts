import "reflect-metadata"
import { contextPath } from '../constant/Url';
import { commonAjaxPostCallsWithBlob } from './Promises';
import HealthCenter from './../models/HealthCenter';
import Filter from '../models/common/Filter';
import { injectable } from 'inversify';

@injectable()
export default class ReportService {
  loadStockOpnameReport = (filter: Filter, location: HealthCenter) => {
    const endpoint = contextPath().concat("api/app/report/stockopname")
    return commonAjaxPostCallsWithBlob(endpoint, {
      healthcenter: location,
      filter: filter
    });
  }
  loadMontlyReport = (filter: Filter) => {
    const endpoint = contextPath().concat("api/app/report/monthly")
    return commonAjaxPostCallsWithBlob(endpoint, {
      filter: filter
    });
  }
  printTransactionReceipt = (code: string) => {
    const endpoint = contextPath().concat("api/app/report/transactionreceipt/" + code)
    return commonAjaxPostCallsWithBlob(endpoint, {});
  }
  printReceiveRequestSheet = (filter: Filter, location: HealthCenter) => {
    const endpoint = contextPath().concat("api/app/report/receiverequestsheet")
    return commonAjaxPostCallsWithBlob(endpoint, {
      healthcenter: location,
      filter: filter
    });
  }
  printRecipeReport = (filter: Filter) => {
    const endpoint = contextPath().concat("api/app/report/recipe")
    return commonAjaxPostCallsWithBlob(endpoint, {
      filter: filter
    });
  }

}