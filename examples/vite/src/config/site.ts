export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "@abdokouta/config",
  description:
    "NestJS-inspired configuration management for React applications",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Config Demo",
      href: "/config",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Config Demo",
      href: "/config",
    },
  ],
  links: {
    github: "https://github.com/abdokouta/config",
    twitter: "https://twitter.com/abdokouta",
    discord: "https://discord.gg/abdokouta",
    sponsor: "https://github.com/sponsors/abdokouta",
    docs: "https://github.com/abdokouta/config#readme",
  },
};
