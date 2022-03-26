import { Container } from 'inversify'
import 'reflect-metadata'
import InventoryService from './services/InventoryService';
import MasterDataService from './services/MasterDataService';
import ReportService from './services/ReportService';
import TransactionService from './services/TransactionService';
import UserService from './services/UserService';
import DialogService from './services/DialogService';
import LoadingService from './services/LoadingService';

let container:Container = new Container();

container.bind(InventoryService).toSelf().inSingletonScope();
container.bind(MasterDataService).toSelf().inSingletonScope();
container.bind(ReportService).toSelf().inSingletonScope();
container.bind(TransactionService).toSelf().inSingletonScope();
container.bind(UserService).toSelf().inSingletonScope();
container.bind(DialogService).toSelf().inSingletonScope();
container.bind(LoadingService).toSelf().inSingletonScope();

export {container}
