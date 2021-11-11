import { writable } from "svelte/store";

export const mobileMenuVisible = writable(false);
export const isSmallScreen = writable(false);
export const isDarkMode = writable(false);