import ROLE from "@/const/role";

export const menuList = [
  {
    name: "Home",
    icon: "/upload/icons/side-bar/home_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_home_icon.svg",
    path: "/dashboard" || "/",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Organization",
    icon: "/upload/icons/side-bar/organization_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_organization_icon.svg",
    path: "/organization",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Robot",
    icon: "/upload/icons/side-bar/robot_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_robot_icon.svg",
    path: "/robots",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Map & Cleaning Zones",
    icon: "/upload/icons/side-bar/location_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_location_icon.svg",
    path: "/location",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Report",
    icon: "/upload/icons/side-bar/report_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_report_icon.svg",
    path: "/reports",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Account",
    icon: "/upload/icons/side-bar/account_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_account_icon.svg",
    path: "/accounts",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN],
  },
  {
    name: "Schedule",
    icon: "/upload/icons/side-bar/schedule_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_schedule_icon.svg",
    path: "/schedule",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Clean Plan Editor",
    icon: "/upload/icons/side-bar/clean_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_clean_icon.svg",
    path: "/cleaning-plan",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
  {
    name: "Configuration Manager",
    icon: "/upload/icons/side-bar/setting_icon.svg",
    activeIcon: "/upload/icons/side-bar/active_setting_icon.svg",
    path: "/configuration-manager",
    access: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
];

export const issues = [
  {
    bot: "Bot A",
    issue: "Cleaning mechanism clogged",
    time: "12:35",
    date: "7/6/24",
  },
  { bot: "Bot B", issue: "Cleaning fluid <5%", time: "10:35", date: "7/6/24" },
  {
    bot: "Bot C",
    issue: "Bot encountered obstacle",
    time: "11:37",
    date: "6/6/24",
  },
  { bot: "Bot D", issue: "Battery Low (3%)", time: "8:35", date: "6/6/24" },
];

export const activities = [
  {
    bot: "Bot C",
    activity: "Cleaning Completed",
    completion: "82%",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot C",
    activity: "Commence cleaning",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot A",
    activity: "Cleaning Completed",
    completion: "82%",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot B",
    activity: "Cleaning Completed",
    completion: "82%",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot B",
    activity: "Commence cleaning",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot A",
    activity: "Commence cleaning",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot E",
    activity: "Cleaning Completed",
    completion: "82%",
    time: "12:35",
    date: "7/6/24",
  },
  {
    bot: "Bot E",
    activity: "Commence cleaning",
    time: "12:35",
    date: "7/6/24",
  },
];
