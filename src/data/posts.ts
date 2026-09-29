import type { ImageMetadata } from 'astro';
import pnz from '../assets/images/positive-negative-zero-offset.png';
import pft from '../assets/images/poke-flush-tucked.png';
import ovb from '../assets/images/wheel-offset-vs-backspacing.png';
import et from '../assets/images/what-is-wheel-offset-et.png';

export interface Post {
  slug: string;
  title: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  category: { name: string; slug: string };
  author: string;
  /** ISO dates from the live post sitemap. */
  published: string;
  modified: string;
}

const WHEEL_OFFSET = { name: 'Wheel Offset Calculator', slug: 'wheel-offset-calculator' };

/** Newest first — same order as the live /blog/ listing. */
export const POSTS: Post[] = [
  {
    slug: 'positive-negative-zero-offset',
    title: 'Positive vs Negative vs Zero Offset',
    description: 'A complete guide to all three offset types exact ET ranges, fitment effects, handling changes, and which offset is right for your vehicle.',
    image: pnz,
    imageAlt: 'Illustrated guide comparing negative, zero and positive wheel offset (ET)',
    category: WHEEL_OFFSET,
    author: 'Jake Harmon',
    published: '2026-07-28T20:34:09+00:00',
    modified: '2026-07-28T20:34:09+00:00',
  },
  {
    slug: 'poke-flush-tucked',
    title: 'Poke vs Flush vs Tucked',
    description: 'Three terms that describe exactly how far your wheel and tire sit relative to the fender lip and how offset controls each one.',
    image: pft,
    imageAlt: 'Illustrated wheel stance guide showing poke, flush and tucked fitment',
    category: WHEEL_OFFSET,
    author: 'mike.themechanic',
    published: '2026-07-27T22:14:45+00:00',
    modified: '2026-07-27T22:14:45+00:00',
  },
  {
    slug: 'wheel-offset-vs-backspacing',
    title: 'Wheel Offset vs Backspacing',
    description: 'Both measurements describe wheel position but they use different reference points and units. Here is exactly what separates them and how to convert between them.',
    image: ovb,
    imageAlt: 'Illustrated comparison of wheel offset and backspacing measurements',
    category: WHEEL_OFFSET,
    author: 'mike.themechanic',
    published: '2026-07-27T22:07:27+00:00',
    modified: '2026-07-27T22:07:27+00:00',
  },
  {
    slug: 'what-is-wheel-offset-et',
    title: 'What is Wheel Offset (ET)?',
    description: 'The complete definition of wheel offset what ET means, how it is measured, and how every millimeter affects your wheel fitment.',
    image: et,
    imageAlt: 'Mechanic pointing at a wheel labelled ET +35mm with tuck and poke arrows',
    category: WHEEL_OFFSET,
    author: 'mike.themechanic',
    published: '2026-07-27T21:24:26+00:00',
    modified: '2026-07-27T21:24:26+00:00',
  },
];

export const CATEGORIES = [WHEEL_OFFSET];
