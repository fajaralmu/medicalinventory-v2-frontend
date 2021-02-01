
import UserService from './UserService';
import MasterDataService from './MasterDataService';
import TransactionService from './TransactionService';
import InventoryService from './InventoryService';
import ReportService from './ReportService';
export default class Services {
    userService: UserService = UserService.getInstance();
    masterDataService: MasterDataService = MasterDataService.getInstance();
    transactionService: TransactionService = TransactionService.getInstance();
    inventoryService: InventoryService = InventoryService.getInstance();
    reportService: ReportService = ReportService.getInstance();
}