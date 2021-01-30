
import UserService from './UserService';
import MasterDataService from './MasterDataService';
import TransactionService from './TransactionService';
import InventoryService from './InventoryService';
export default class Services {
    userService: UserService = UserService.getInstance();
    masterDataService: MasterDataService = MasterDataService.getInstance();
    transactionService: TransactionService = TransactionService.getInstance();
    inventoryService: InventoryService = InventoryService.getInstance();
}