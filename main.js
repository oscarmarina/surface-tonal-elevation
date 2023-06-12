/**
 * Computes the surface color at different elevation levels, such as eleveation1 through eleveation5.
 *
 * @param {number} elevation - Elevation value used to calculate the alpha of the color overlay layer.
 * @param {Object} colorScheme - The color scheme object with properties for surface and surfaceTint.
 *
 * @returns {string} - The surface color with the surfaceTint color overlaid on top of it, with the specified alpha.
 */
const surfaceColorAtElevation = (elevation, colorScheme) => {
  /**
   * Object mapping elevation levels to their corresponding values.
   * @type {Object<number, number>}
   */
  const elevationLevels = {
    0: 0,
    1: 1,
    2: 3,
    3: 6,
    4: 8,
    5: 12,
  };

  /**
   * The maximum elevation value.
   * @type {number}
   */
  const maxElevation = Math.max(...Object.keys(elevationLevels).map(Number));

  // Adjust the elevation level based on the limits set by Material Design (1 to 5)
  if (elevation <= 0) {
    elevation = 0;
  }/*  else if (elevation > maxElevation) {
    elevation = maxElevation;
  } */

  // Find the elevation value corresponding to the level
  const calculatedElevation2 = elevationLevels[elevation];
  const calculatedElevation = elevation;
  if (calculatedElevation === 0) {
    return colorScheme.surface;
  }

  /**
   * The alpha value used for the color overlay layer.
   * @type {number}
   */
  const alpha = (4.5 * Math.log(calculatedElevation + 1) + 2) / 100;

  /**
   * Helper function to convert a hex color to an RGBA object.
   *
   * @param {string} hex - The hex color value.
   * @param {number} alpha - The alpha value.
   * @returns {Object} - The RGBA color object.
   */
  const hexToRGBA = (hex, alpha) => {
    const red = parseInt(hex.slice(1, 3), 16);
    const green = parseInt(hex.slice(3, 5), 16);
    const blue = parseInt(hex.slice(5, 7), 16);

    return { red, green, blue, alpha };
  };

  /**
   * Helper function to composite two RGBA colors.
   *
   * @param {Object} fg - The first RGBA color.
   * @param {Object} bg - The second RGBA color.
   * @returns {Object} - The resulting composite color.
   */
  const compositeOver = (fg, bg) => {
    const fgA = fg.alpha;
    const bgA = bg.alpha;
    const a = fgA + bgA * (1 - fgA);

    const r = Math.round((fg.red * fgA + bg.red * bgA * (1 - fgA)) / a);
    const g = Math.round((fg.green * fgA + bg.green * bgA * (1 - fgA)) / a);
    const b = Math.round((fg.blue * fgA + bg.blue * bgA * (1 - fgA)) / a);

    return { r, g, b, a };
  };

  /**
   * Helper function to convert an RGBA object to a CSS rgba string.
   *
   * @param {Object} rgba - The RGBA color object.
   * @returns {string} - The CSS rgba string.
   */
  const rgbaToCSS = (rgba) => {
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  };

  const surfaceTintRGBA = hexToRGBA(colorScheme.surfaceTint, alpha);
  const surfaceRGBA = hexToRGBA(colorScheme.surface, 1);

  const compositeColor = compositeOver(surfaceTintRGBA, surfaceRGBA);

  return rgbaToCSS(compositeColor);
};

export { surfaceColorAtElevation };
