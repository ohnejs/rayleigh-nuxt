/**
 * Whether the mobile menu is open.
 * `useState` shares one value between the header's burger and the menu, and keeps it across pages.
 */
export const useMobileMenu = () => useState('mobile-menu', () => false);
