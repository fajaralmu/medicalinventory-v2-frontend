
import UserService from './UserService';
import MasterDataService from './MasterDataService';
import TransactionService from './TransactionService';
export default class Services {
    userService: UserService = UserService.getInstance();
    masterDataService: MasterDataService = MasterDataService.getInstance();
    transactionService: TransactionService = TransactionService.getInstance();
}