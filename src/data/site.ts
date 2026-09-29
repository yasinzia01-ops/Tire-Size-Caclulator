export const SITE = {
  name: 'Tire Size Calculator',
  domain: 'Tiresizecalculator.pro',
  url: 'https://tiresizecalculator.pro',
  author: 'mike.themechanic',
  gaId: 'GT-MBT5TB3W',
  defaultOgImage: '/og-default.jpg',
};

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/** Mirrors the live header menu exactly (solution.md §2). */
export const NAV: NavItem[] = [
  { label: 'Calculators', href: '/', children: [{ label: 'Tire size Calculator', href: '/' }] },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Blog', href: '/blog/' },
];

export const FOOTER_LINKS: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms & Condition', href: '/terms-condition/' },
];

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: `${SITE.url}/favicon-192.png`,
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: `${SITE.url}/`,
  publisher: { '@id': `${SITE.url}/#organization` },
  inLanguage: 'en-US',
};
