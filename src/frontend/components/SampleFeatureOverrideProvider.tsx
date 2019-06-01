import {FeatureOverrideProvider, Viewport, FeatureSymbology} from "@bentley/imodeljs-frontend";
import {ColorDef, ElementProps} from "@bentley/imodeljs-common";

export class SampleFeatureOverrideProvider implements FeatureOverrideProvider {

    private readonly _elements: ElementProps[];
    private readonly _depthSlice: number[];
    private readonly _showWater: boolean;
    private readonly _showRed: boolean;

    public constructor(elements: ElementProps[], depthSlice: number[], showWater: boolean, showRed: boolean) {
        this._elements = elements;
        this._depthSlice = depthSlice;
        this._showWater = showWater;
        this._showRed = showRed;
    }

    private toRGB(hue: number) {
      const i = Math.floor(hue * 6);
      const f = hue * 6 - i;
      const q = (1 - f);
      let r = 0, g = 0, b = 0;
      switch (i % 6) {
          case 0: r = 1, g = f, b = 0; break;
          case 1: r = q, g = 1, b = 0; break;
          case 2: r = 0, g = 1, b = f; break;
          case 3: r = 0, g = q, b = 1; break;
          case 4: r = f, g = 0, b = 1; break;
          case 5: r = 1, g = 0, b = q; break;
      }
      return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255),
      };
    }

    // interface function to set feature overrides
    public addFeatureOverrides(_overrides: FeatureSymbology.Overrides, _viewport: Viewport) {

        const defaultAppearance = FeatureSymbology.Appearance.fromRgba(ColorDef.white);
        // const lightGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 255, 0)); // green
        // const yellow = FeatureSymbology.Appearance.fromRgba(ColorDef.from(255, 255, 0)); // yellow
        const invisible = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 0, 0, 255));
        const greyAlpha = this._showWater ? 0 : 255; // 0 is opaque, 255 is transparent
        const grey = FeatureSymbology.Appearance.fromRgba(ColorDef.from(40, 40, 40, greyAlpha));
        const redAlpha = this._showRed ? 0 : 255; // 0 is opaque, 255 is transparent
        const red = FeatureSymbology.Appearance.fromRgba(ColorDef.from(255, 0, 0, redAlpha));

        // const thicc = FeatureSymbology.Appearance.fromJSON({rgb: new RgbColor(0,250,50), weight: 5});

        // set default appearance for all elements
        _overrides.setDefaultOverrides(defaultAppearance);
        // set appearance of elements passed in
        if (this._elements) this._elements.forEach((element: ElementProps) => {
          if (element.id) {
            if (element.userLabel !== "nwgis_sewer") {
              _overrides.overrideElement(element.id, grey);
            } else {
                if (!element.upDepth && !element.downDepth) {
                  _overrides.overrideElement(element.id, red);
                } else {
                  if (element.upDepth && element.downDepth) {
                    const avg = ((element.upDepth) / 2 + (element.downDepth) / 2);
                    if (avg < this._depthSlice[0] || avg > this._depthSlice[1]) {
                      _overrides.overrideElement(element.id, invisible);
                    } else {
                      const hue = ((avg - 500) / 7500);
                      const c = this.toRGB(hue);
                      _overrides.overrideElement(element.id, FeatureSymbology.Appearance.fromRgba(ColorDef.from(c.r, c.g, c.b)));
                    }
                  } else {
                    const height = element.upDepth ? element.upDepth : element.downDepth;
                    if (height < this._depthSlice[0] || height > this._depthSlice[1]) {
                      _overrides.overrideElement(element.id, invisible);
                    } else {
                      const hue = ((height - 500) / 7500);
                      const c = this.toRGB(hue);
                      _overrides.overrideElement(element.id, FeatureSymbology.Appearance.fromRgba(ColorDef.from(c.r, c.g, c.b)));
                    }
                  }
                }
              }
          }
        });
    }
}
