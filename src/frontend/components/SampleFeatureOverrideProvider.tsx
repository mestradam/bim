import {FeatureOverrideProvider, Viewport, FeatureSymbology} from "@bentley/imodeljs-frontend";
import {ColorDef, ElementProps} from "@bentley/imodeljs-common";

export class SampleFeatureOverrideProvider implements FeatureOverrideProvider {

    private readonly _elements: ElementProps[];
    private readonly _depthSlice: number[];
    private readonly _showWater: boolean;

    public constructor(elements: ElementProps[], depthSlice: number[], showWater: boolean) {
        this._elements = elements;
        this._depthSlice = depthSlice;
        this._showWater = showWater;
    }

    // interface function to set feature overrides
    public addFeatureOverrides(_overrides: FeatureSymbology.Overrides, _viewport: Viewport) {

        const defaultAppearance = FeatureSymbology.Appearance.fromRgba(ColorDef.white);
        const lightGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 255, 0)); // green
        const yellow = FeatureSymbology.Appearance.fromRgba(ColorDef.from(255, 255, 0)); // yellow
        const invisible = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 0, 0, 255));
        const grey = FeatureSymbology.Appearance.fromRgba(ColorDef.from(40, 40, 40, 255));
        const red = FeatureSymbology.Appearance.fromRgba(ColorDef.from(255, 0, 0));

        // const thicc = FeatureSymbology.Appearance.fromJSON({rgb: new RgbColor(0,250,50), weight: 5});

        // set default appearance for all elements
        _overrides.setDefaultOverrides(defaultAppearance);
        // set appearance of elements passed in
        if (this._elements) this._elements.forEach((element: ElementProps) => {
          if (element.id) {
            if (element.userLabel !== "nwgis_sewer") {
              if (this._showWater === true) {
                _overrides.overrideElement(element.id, invisible);
              } else {
                _overrides.overrideElement(element.id, grey);
              }
            } else {
                if (!element.upDepth && !element.downDepth) {
                  _overrides.overrideElement(element.id, red);
                } else {
                  if (element.upDepth && element.downDepth) {
                    const avg = ((element.upDepth) / 2 + (element.downDepth) / 2);
                    if (avg < this._depthSlice[0] || avg > this._depthSlice[1]) {
                      _overrides.overrideElement(element.id, invisible);
                    } else {
                      _overrides.overrideElement(element.id, lightGreen);
                    }
                  } else {
                    const height = element.upDepth ? element.upDepth : element.downDepth;
                    if (height < this._depthSlice[0] || height > this._depthSlice[1]) {
                      _overrides.overrideElement(element.id, invisible);
                    } else {
                      _overrides.overrideElement(element.id, yellow);
                    }
                  }
                }
              }
          }
        });
    }
}
