import ROLE from "./role";

const PAGE = {
  DASHBOARD: {
    NAME: "DASHBOARD",
    ROUTE: "/dashboard",
    ACCESS: [ROLE.SUPERADMIN, ROLE.ADMIN],
  },
  BULDINGS: {
    NAME: "BULDINGS",
    ROUTE: "/building",
    ACCESS: [ROLE.SUPERADMIN, ROLE.ADMIN],
  },
  ROBOTS: {
    NAME: "ROBOTS",
    ROUTE: "/robots",
    ACCESS: [ROLE.SUPERADMIN, ROLE.ADMIN],
  },
  ROBOT_CREATE: {
    NAME: "ROBOT_CREATE",
    ROUTE: "/robots/add/base",
    ACCESS: [ROLE.SUPERADMIN],
  },
  ROBOT_EDIT: {
    NAME: "ROBOT_EDIT",
    ROUTE: "/robots/edit/base",
    ACCESS: [ROLE.SUPERADMIN],
  },
  LOCATIONS: {
    NAME: "LOCATIONS",
    ROUTE: "/location",
    ACCESS: [ROLE.SUPERADMIN, ROLE.ADMIN],
  },
  REPORT: {
    NAME: "REPORT",
    ROUTE: "/reports",
    ACCESS: [ROLE.SUPERADMIN, ROLE.ADMIN],
  },
  ACCOUNT: {
    NAME: "ACCOUNT",
    ROUTE: "/accounts",
    ACCESS: [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.USER],
  },
};

const PAGES = [
  PAGE.DASHBOARD,
  PAGE.BULDINGS,
  PAGE.ROBOT_CREATE,
  PAGE.ROBOT_EDIT,
  PAGE.ROBOTS,
  PAGE.LOCATIONS,
  PAGE.REPORT,
  PAGE.ACCOUNT,
];

export { PAGE, PAGES };
