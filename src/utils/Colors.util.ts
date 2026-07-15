const Colors = {
  // Brand Colors from Image
  PRIMARY: '#172C6B',     // Dark Navy (Logo/Headers)
  SECONDARY: '#268AFF',   // Bright Blue (Buttons/Actions)
  ACCENT: '#7ED3EF',      // Sky Blue (Highlights)
  SUCCESS: '#2CC93C',     // Vibrant Green

  // Neutral Palette
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  BACKGROUND: '#F8FAFF',  // Very Light Blue Tint
  SURFACE: '#FFFFFF',
  BORDER_GREY: '#E2E8F0',
  DARK_GRAY: '#475569',
  TEXT_GREY: '#94A3B8',

  // Functional Colors
  RED: '#FF3B31',
  YELLOW: '#FFC107',
  DARK_BG: '#0F172A',     // Deep Slate for dark mode elements
  INPUT_BG: '#F1F5F9',
  TRANSPARENT: 'rgba(0,0,0,0)',

  // Supporting Image Colors
  BLUE_MEDIUM: '#253D84',
  BLUE_LIGHT: '#3B5399',
};

export default Colors;

export function alpha(color: string, alphaValue: number): string {
  const rgbaColor = hexToRgba(color);
  return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${alphaValue})`;
}

function hexToRgba(hex: string): { r: number; g: number; b: number } {
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex?.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex?.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return { r, g, b };
}
