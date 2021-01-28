
import Menu from './../models/Menu';

export const HOME = "home"; 
export const ABOUT = "about";
export const ACCOUNT = "account";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const DASHBOARD = "dashboard"; 
export const MENU_SETTING = "settings";
export const MENU_MASTER_DATA = "management";
export const LESSONS = "lessons";
export const CLUB = "language_club";
export const EVENTS = "events";
export const GALLERY = "gallery"; 
export const CHATROOM = "chatroom";
export const QUIZ_MANAGEMENT = "quiz_management";
export const PUBLIC_QUIZ = "public_quiz";

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
        code: LESSONS,
        name: "Lessons",
        url: "/lessons",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: true
    },
    {
        code: EVENTS,
        name: "Events",
        url: "/events",
        menuClass: "fa fa-calendar-week",
        active: false,
        authenticated: false,
        showSidebar: true,
        subMenus: [
            {
                code: 'e_public_speaking',
                name: 'Public Speaking',
                url: 'publicspeaking',
                menuClass: 'fas fa-broadcast-tower'

            },
            {
                code: 'e_skills',
                name: 'Skill',
                url: 'skill',
                menuClass: 'fas fa-basketball-ball'
            }
        ]
    },
    {
        code: PUBLIC_QUIZ,
        name: "Quiz",
        url: "/quiz",
        menuClass: "fas fa-book",
        active: false,
        authenticated: false,
        showSidebar: false,
        subMenus: []
    },
    {
        code: GALLERY,
        name: "Gallery",
        url: "/gallery",
        menuClass: "fa fa-photo-video",
        active: false,
        authenticated: false,
        showSidebar: true,
        subMenus: [
            {
                code: 'gallery_picture',
                name: 'Pictures',
                url: 'picture',
                menuClass: 'fas fa-images'

            },
            {
                code: 'gallery_video',
                name: 'Videos',
                url: 'video',
                menuClass: 'fas fa-video'
            }
        ]
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
        code: QUIZ_MANAGEMENT,
        name: "Quiz Management",
        url: "/quizmanagement",
        menuClass: "fas fa-chalkboard",
        active: false,
        authenticated: true,
        showSidebar: true,
        subMenus: [
            {
                code: 'quiz_management_form',
                name: 'Quiz Form',
                url: 'form',
                menuClass: 'fas fa-keyboard'

            }, 
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
            
        ]
    },
];
