export const BACKEND_URL = "http://localhost:3010/api";

export const DASHBOARD_NAVIGATION = [
    { segment: 'dashboard', title: 'Dashboard' },
    { segment: 'dashboard/journals', title: 'Journals' },
    { segment: 'dashboard/profile', title: 'Profile' },
    { segment: 'dashboard/users', title: 'Users' },
];

export const DASHBOARD_NAV_BACKGROUND = {
    dark: {
        backgroundColor: '#e5e5f7',
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #212121 150px), repeating-linear-gradient(#212121, #000000)`
    },
    light: {
        backgroundColor: '#e5e5f7',
        backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, #efefef 150px), repeating-linear-gradient(#ffffff, #ffffff)`
    },
    setBackgroundNav: function (mode: "light" | "dark") {
        return this[mode];
    },
}
