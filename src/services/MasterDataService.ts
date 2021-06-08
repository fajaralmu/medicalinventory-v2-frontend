
import Filter from '../models/common/Filter';
import WebRequest from '../models/common/WebRequest';
import { contextPath } from './../constant/Url';
import { commonAjaxPostCalls, commonAjaxPostCallsWithBlob } from './Promises';
import BaseEntity from './../models/BaseEntity';
import ManagementProperty from '../models/ManagementProperty';
import EntityProperty from '../models/settings/EntityProperty';
import ApplicationProfile from './../models/ApplicationProfile';
import HealthCenter from './../models/HealthCenter';
import Configuration from './../models/Configuration';

export default class MasterDataService {
  
    managementProperties: ManagementProperty[] = [];
    private entityPropertyMap: Map<string, EntityProperty> = new Map();
    private healthCenters: HealthCenter[] = [];
    private static instance:undefined| MasterDataService;

    static getInstance(): MasterDataService {
        if (this.instance == null) {
            this.instance = new MasterDataService();
        }
        return this.instance;
    }

    getProductByCode = (code: string) => {
        return this.getByKey('product', 'code', code);
    }
    getProductsByName = (name:string) => {
        return this.getRecordsByKeyLike("product", "name", name);
    }
    setEntityProperty(code: string, data:undefined| EntityProperty) {
        if (!data) {
            return;
        }
        this.entityPropertyMap.set(code, data);
    }
    getEntityProperty(code:undefined| string): EntityProperty | undefined {
        if (code == undefined) {
            return undefined;
        }
        return this.entityPropertyMap.get(code);
    }

    loadManagementProperties(req:undefined| any) {
        const endpoint: string = contextPath().concat("api/app/entity/managementpages");
        return commonAjaxPostCalls(endpoint, {});

    }
    loadEntityProperty(code: string) {
        console.debug("Load entity prop: ", code);
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: code
        });
        const endpoint: string = contextPath().concat("api/app/entity/configv2");
        return commonAjaxPostCalls(endpoint, request);

    }
    loadHealthCenters = () => {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: 'healthcenter', filter: Object.assign(new Filter(),{ orderBy: 'name', orderType: 'asc' })
        });
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
    }
    loadItems(request: WebRequest) {
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);

    }
    loadAllEntities(code: string) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: code,
            filter: {
                limit: 0, page: 0
            }
        });
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);

    }
    getByKey(entity: string, key: string, value: any) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: entity,
            filter: {
                exacts: true,
                limit: 1,
                page: 0,
                fieldsFilter: { [key]: value }
            }
        });
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
    }
    getRecordsByKeyLike(entity: string, key: string, value: any) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: entity,
            filter: {
                // exacts: true,
                limit: 10,
                page: 0,
                fieldsFilter: { [key]: value }
            }
        });
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
    }
    getById(entity: string, id: number) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: entity,
            filter: {
                exacts: true,
                limit: 1,
                page: 0,
                fieldsFilter: { 'id': id }
            }
        });
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
    }
    getBy(code: string, fieldsFilter: {}, limit = 1) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: code,
            filter: {
                exacts: true,
                limit: limit,
                page: 0,
                fieldsFilter: fieldsFilter
            }
        });
        const endpoint: string = contextPath().concat("api/app/entity/get");
        return commonAjaxPostCalls(endpoint, request);
    }
    delete(code: string, id: number) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: code,
            filter: {
                fieldsFilter: { 'id': id }
            }
        });
        const endpoint: string = contextPath().concat("api/app/entity/delete");
        return commonAjaxPostCalls(endpoint, request);
    }
    save(code: string, model: BaseEntity, editMode: boolean) {
        const request: WebRequest = Object.assign(new WebRequest(),{
            entity: code,
            [code]: model
        });
        let endpoint: string;
        if (editMode) {
            endpoint = contextPath().concat("api/app/entity/update");
        } else {
            endpoint = contextPath().concat("api/app/entity/add");
        }
        return commonAjaxPostCalls(endpoint, request);
    }

    updateApplicationProfile = (applicationProfile: ApplicationProfile) => {
        const request: WebRequest = Object.assign(new WebRequest(),{
            profile: applicationProfile
        });
        const endpoint = contextPath().concat("api/app/setting/updateprofile");
        return commonAjaxPostCalls(endpoint, request)
    }
    updateConfiguration = (config:Configuration) => {
        const request: WebRequest = Object.assign(new WebRequest(),{
           inventoryConfiguration: config
        });
        const endpoint = contextPath().concat("api/app/setting/updateconfig");
        return commonAjaxPostCalls(endpoint, request)
    }

    setHealthCenters = (healthCenters:HealthCenter[]) => {
        this.healthCenters = healthCenters;
    }
    getHealthCenters = () :HealthCenter[] => {
        return this.healthCenters;
    }

    generateReport(request: WebRequest) {
        const endpoint: string = contextPath().concat("api/app/report/records");
        return commonAjaxPostCallsWithBlob(endpoint, request);

    }
}