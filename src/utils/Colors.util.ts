const Colors = {
  IPP_ORANGE: '#E88817', // Primary
  PLACEHOLDER: '#414649', // Secondary
  BLACK: '#000000',
  BORDER_GREY: '#DFDFDF', // For Borders
  DARK_GRAY: '#616161', // Secondary Texts
  BACKGROUND: '#F2F2F2', // Screen Background
  WHITE: '#FFFFFF',
  TRANSPARENT: 'rgba(1,1,1,0)',
  GREEN_TEXT: '#01383E',
  DARK_BLUE: '#2196F3',
  RED: '#FF3B31',
  YELLOW: '#FFC107',
  DARK_GREEN: '#4caf50'
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
