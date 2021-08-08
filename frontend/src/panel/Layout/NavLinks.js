import Dashboard from "../Dashboard";
import Accounts from "../Accounts";
import Turbo from "../Turbo";

const links = [
    {
        text: "Dashboard",
        icon: "dashboard",
        path: "/panel/dashboard",
        section: "GENERAL",
        component: Dashboard
    },
    {
        text: "Turbo",
        icon: "lightning",
        path: "/panel/turbo",
        section: "GENERAL",
        component: Turbo
    },
    {
        text: "Accounts",
        icon: "accounts",
        path: "/panel/accounts",
        section: "GENERAL",
        component: Accounts
    },
    //{
        //text: "Targets",
        //icon: "targets",
        //path: "/panel/targets",
        //section: "GENERAL",
        //component: null
    //},
    //{
        //text: "Webhooks",
        //icon: "webhooks",
        //path: "/panel/webhooks",
        //section: "GENERAL",
        //component: null
    //},
    {
        text: "Settings",
        icon: "settings",
        path: "/panel/settings",
        section: "GENERAL",
        component: null
    },
    {
        text: "News & Updates",
        icon: "news",
        path: "/panel/news",
        section: "OTHER",
        component: null,
        ping: true
    },
    {
        text: "Plans",
        icon: "plans",
        path: "/panel/plans",
        section: "OTHER",
        component: null
    },
    {
        text: "Help",
        icon: "help",
        path: "/panel/help",
        section: "OTHER",
        component: null
    }
];

export const sections = [
    "GENERAL", 
    "OTHER"
];

export default links;
