// Vector shapes used by the icon renderer. Each key is an icon name.
window.CookFromHome = window.CookFromHome || {};
CookFromHome.iconPaths = {
  leaf: `
    <path d="M20 3C9 2 3 7 5 14s14 8 15-11Z"/>
    <path d="M4 21 16 9M10 15l-1-5m1 5 5 1"/>
  `,
  carrot: `
    <path d="m16 8-4 11c-1 3-3 4-4 3s-1-3 0-5l6-10Z"/>
    <path d="m15 7 1-5m0 5 5-3m-6 3 5 2M11 14l3 1m-5 3 2 1"/>
  `,
  egg: `
    <path d="M19 15c0 5-3 7-7 7s-7-2-7-7S9 2 12 2s7 8 7 13Z"/>
    <path d="M8 15c0 2 1 4 3 4"/>
  `,
  wheat: `
    <path d="M12 22V5m0 4C7 9 6 6 6 3c4 0 6 2 6 6Zm0 6c-5 0-6-3-6-6 4 0 6 2 6 6Zm0 5c-5 0-6-3-6-6 4 0 6 2 6 6Zm0-11c5 0 6-3 6-6-4 0-6 2-6 6Zm0 6c5 0 6-3 6-6-4 0-6 2-6 6Zm0 5c5 0 6-3 6-6-4 0-6 2-6 6Z"/>
  `,
  cheese: `
    <path d="m3 11 12-7 6 7v9H3Z"/>
    <path d="M3 11h18M7 15h.1m9 1h.1M11 18h.1"/>
  `,
  bowl: `
    <path d="M3 11h18c0 6-3 9-9 9s-9-3-9-9ZM8 22h8M8 7c-2-2 2-3 0-5m4 5c-2-2 2-3 0-5m4 5c-2-2 2-3 0-5"/>
  `,
  pot: `
    <path d="M5 10h14v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3ZM3 10h18M8 7h8m-5-2h2M2 13h3m14 0h3M9 3V2m6 1V2"/>
  `,
  hat: `
    <path d="M7 15a5 5 0 1 1 1-9 4 4 0 0 1 8 0 5 5 0 1 1 1 9v6H7Zm0 3h10"/>
  `,
  clock: `
    <circle cx="12" cy="12" r="9"/>
    <path d="M12 7v5l3 2"/>
  `,
  sun: `
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>
  `,
  bag: `
    <path d="M5 7h14l2 14H3ZM8 8V6a4 4 0 0 1 8 0v2"/>
    <path d="M9 18c-1-4 2-7 6-7 1 4-2 7-6 7Zm0 0 4-4"/>
  `,
  check: `
    <path d="m5 12 4 4L19 6"/>
  `,
  help: `
    <circle cx="12" cy="12" r="9"/>
    <path d="M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5m0 4h.01"/>
  `,
  bulb: `
    <path d="M8 16a7 7 0 1 1 8 0l-1 3H9Zm1 6h6M12 9v6m-3-5 3 2 3-2"/>
  `,
  swap: `
    <path d="M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4"/>
  `,
  mug: `
    <path d="M4 8h12v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Zm12 1h2a4 4 0 0 1 0 8h-2M7 4V2m5 2V2"/>
  `,
  bread: `
    <path d="M7 21c-5-1-6-5-3-9l8-8c3-3 7-2 9 1s0 6-2 8l-7 7c-2 2-3 2-5 1Z"/>
    <path d="m11 6 3 3m-7 1 3 3m-7 1 3 3"/>
  `,
  note: `
    <path d="M5 3h14v18H5ZM9 7h6m-6 4h6m-6 4h3M8 1v4m8-4v4"/>
  `,
  calendar: `
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M7 2v6m10-6v6M3 11h18M7 15h2m4 0h2m2 0h1M7 18h2m4 0h2"/>
  `,
  mail: `
    <rect x="2" y="5" width="20" height="15" rx="2"/>
    <path d="m3 7 9 7 9-7"/>
  `,
  search: `
    <circle cx="10" cy="10" r="6"/>
    <path d="m15 15 6 6"/>
  `,
  arrow: `
    <path d="M4 12h16m-6-6 6 6-6 6"/>
  `,
  users: `
    <circle cx="9" cy="7" r="3"/>
    <path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m2 3c3 1 3 4 3 7"/>
  `,
  jar: `
    <path d="M7 2h10v4H7Zm0 4-2 4v11h14V10l-2-4M5 12h14M8 15h8v3H8Z"/>
  `,
  onion: `
    <path d="M12 3c-1 5-8 6-8 12a8 8 0 0 0 16 0c0-6-7-7-8-12Zm0 0V1m0 6c-5 6-5 10 0 15 5-5 5-9 0-15Z"/>
  `,
  avocado: `
    <path d="M12 2c-4 0-3 5-7 9s-3 11 7 11 11-7 7-11-3-9-7-9Z"/>
    <circle cx="12" cy="15" r="4"/>
  `,
  cold: `
    <path d="M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4m10 14-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/>
  `,
  salt: `
    <path d="m9 7-4 12 11 3 4-12ZM9 7l1-5 11 3-1 5M12 4h.01m4 1h.01M8 14l8 2"/>
  `,
  sugar: `
    <path d="m4 8 8-5 8 5v10l-8 5-8-5Zm0 0 8 5 8-5m-8 5v10"/>
  `,
  tomato: `
    <path d="M12 7C2 2-1 21 10 21h4c11 0 8-19-2-14Z"/>
    <path d="m7 5 5 2 5-2-2 5-3-3-3 3ZM12 7V2"/>
  `,
  beans: `
    <path d="M15 3c-5-3-13 2-11 11s16 9 17 1c1-5-6-4-7-7-1-2 3-3 1-5Z"/>
    <path d="M9 7c-4 4-2 9 2 11"/>
  `,
  milk: `
    <path d="m8 2 8 0v4l3 5v11H5V11l3-5Zm0 4h8M5 11h14m-9 4h4v4h-4Z"/>
  `,
};
