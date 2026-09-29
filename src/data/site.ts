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

/** Header menu. The Calculators dropdown lists all four tools (owner request, 2026-09-29). */
export const NAV: NavItem[] = [
  { label: 'Calculators', href: '/', children: [
      { label: 'Tire size Calculator', href: '/' },
      { label: 'Speedometer Error Calculator', href: '/speedometer-error-calculator/' },
      { label: 'Tire Revolutions Per Mile Calculator', href: '/tire-revolutions-per-mile-calculator/' },
      { label: 'Wheel Offset Calculator', href: '/wheel-offset/' },
    ] },
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
