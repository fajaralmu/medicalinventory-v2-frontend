
import Menu from './../models/Menu';

export const HOME = "home"; 
export const ABOUT = "about";
export const ACCOUNT = "account";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const DASHBOARD = "dashboard"; 
export const MENU_SETTING = "settings";
export const MENU_MASTER_DATA = "management"; 
export const CHATROOM = "chatroom"; 
export const TRANSACTION = "transaction"; 
export const INVENTORY = "INVENTORY"; 

export const getMenus = () => {
    let menuSet: Menu[] = [];
    for (let i = 0; i < menus.length; i++) {
        const element: Menu = menus[i];
        menuSet.push(element);
    }
    return menuSet;
}
export const extractMenuPath = (pathName: string) => {
    const pathRaw = pathName.split('/');
    console.debug("pathName: ", pathName);
    let firstPath = pathRaw[0];
    if (firstPath.trim() == "") {
        firstPath = pathRaw[1];
    }
    return firstPath;
}
export const getMenuByMenuPath = (pathName: string): Menu | null => {
    try {
        for (let i = 0; i < menus.length; i++) {
            const menu: Menu = menus[i];
            if (menu.url == "/" + pathName) {
                return menu;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

export const menus: Menu[] = [
    {
        code: HOME,
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: false
    },
    
    {
        code: DASHBOARD,
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'dashboard_stat',
                name: 'Statistic',
                url: 'statistic',
                menuClass: 'fas fa-chart-bar'

            },
            {
                code: 'dashboard_productsales',
                name: 'Product Sales',
                url: 'productsales',
                menuClass: 'fas fa-chart-line'
            }
        ]
    }, 
    {
        code: INVENTORY,
        name: "Inventory",
        url: "/inventory",
        menuClass: "fas fa-warehouse",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'inventory_stocks',
                name: 'Stock',
                url: 'stock',
                menuClass: 'fas fa-archive'

            },
            {
                code: 'inventory_forecast',
                name: 'Forecast',
                url: 'forecast',
                menuClass: 'fas fa-chart-line'
            }
            ,
            {
                code: 'report',
                name: 'Report',
                url: 'report',
                menuClass: 'fas fa-file-alt'
            }
        ]
    }, 
    {
        code: TRANSACTION,
        name: "Transaction",
        url: "/transaction",
        menuClass: "fas fa-book",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'transaction_in',
                name: 'Transaksi Masuk',
                url: 'productin',
                menuClass: 'fas fa-arrow-down'

            },
            {
                code: 'transaction_out',
                name: 'Transaksi Keluar',
                url: 'productout',
                menuClass: 'fas fa-arrow-up'
            },
            {
                code: 'transaction_detail',
                name: 'Transaksi Detail',
                url: 'detail',
                menuClass: 'fas fa-folder'
            }
        ]
    },  
    {
        code: MENU_MASTER_DATA,
        name: "Master Data",
        url: "/management",
        menuClass: "fa fa-database",
        active: false,
        authenticated: true,
        showSidebar: true
    },
    {
        code: MENU_SETTING,
        name: "Setting",
        url: "/settings",
        menuClass: "fas fa-cogs",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'user_profile',
                name: 'Profile',
                menuClass: 'fas fa-user-cog',
                url: 'user-profile',
            },
            {
                code: 'app_profile',
                name: 'Application Setting',
                menuClass: 'fas fa-cog',
                url: 'app-profile',
            },
            {
                code: 'inventory_config',
                name: 'Inventory Configuration',
                menuClass: 'fas fa-cog',
                url: 'inventory-config',
            },
            
        ]
    },
];
