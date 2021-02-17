
import Menu from '../models/common/Menu';

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
        name: "Beranda",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: false
    },
    
    {
        code: DASHBOARD,
        name: "Dasbor",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'dashboard_info',
                name: 'Info Persediaan',
                url: 'info',
                menuClass: 'fas fa-info-circle'

            },
            {
                code: 'productstat',
                name: 'Statistik Produk',
                url: 'productstat',
                menuClass: 'fas fa-chart-line'
            },
            {
                code: 'productstat',
                name: 'Statistik Produk Detail',
                url: 'productstatdetail',
                menuClass: 'fas fa-chart-line'
            }
        ]
    }, 
    {
        code: INVENTORY,
        name: "Persediaan",
        url: "/inventory",
        menuClass: "fas fa-warehouse",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'inventory_stocks',
                name: 'Stok',
                url: 'stock',
                menuClass: 'fas fa-archive'

            },
            {
                code: 'inventory_status',
                name: 'Status',
                url: 'status',
                menuClass: 'fas fa-layer-group'
            }
            ,
            {
                code: 'report',
                name: 'Laporan',
                url: 'report',
                menuClass: 'fas fa-file-alt'
            }
        ]
    }, 
    {
        code: TRANSACTION,
        name: "Transaksi",
        url: "/transaction",
        menuClass: "fas fa-book",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'transaction_in',
                name: 'Pasokan',
                url: 'productin',
                menuClass: 'fas fa-arrow-down'

            },
            {
                code: 'transaction_out',
                name: 'Distribusi',
                url: 'productout',
                menuClass: 'fas fa-arrow-up'
            },
            {
                code: 'transaction_detail',
                name: 'Detail',
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
                name: 'Profil Pengguna',
                menuClass: 'fas fa-user-cog',
                url: 'user-profile',
            },
            {
                code: 'app_profile',
                name: 'Setting Aplikasi',
                menuClass: 'fas fa-cog',
                url: 'app-profile',
            },
            {
                code: 'inventory_config',
                name: 'Konfigurasi Persediaan',
                menuClass: 'fas fa-cog',
                url: 'inventory-config',
            },
            
        ]
    },
];
