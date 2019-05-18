import { FeatureOverrideProvider, Viewport, FeatureSymbology } from "@bentley/imodeljs-frontend";
import {ColorDef, ElementProps, RgbColor} from "@bentley/imodeljs-common";

export class SampleFeatureOverrideProvider implements FeatureOverrideProvider {

  private readonly _elements: ElementProps[];
  private readonly _depthSlice: number[];

  public constructor(elements: ElementProps[], depthSlice: number[]) {
    this._elements = elements;
    this._depthSlice = depthSlice;
  }
  
  private static toCm(val: string | number) : number {
    if (typeof val === 'number') {
      return val;
    } else if (val.substr(val.length - 1) === '"') {
      return 2.53 * parseFloat(val.substr(0, val.length - 1));
    } else {
      return parseFloat(val);
    }
  }

  // interface function to set feature overrides
  public addFeatureOverrides(_overrides: FeatureSymbology.Overrides, _viewport: Viewport) {

    const defaultAppearance = FeatureSymbology.Appearance.fromRgba(ColorDef.white);
    // const lightGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 255, 0)); // green
    // const darkGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 100, 0)); // green
    const invisible = FeatureSymbology.Appearance.fromTransparency(1.0);

    // const thicc = FeatureSymbology.Appearance.fromJSON({rgb: new RgbColor(0,250,50), weight: 5});

    // set default appearance for all elements
    _overrides.setDefaultOverrides(defaultAppearance);
    // set appearance of elements passed in
    if (this._elements) this._elements.forEach( (element: ElementProps) => {
      if (element.id){

        if(element.upDepth > this._depthSlice[0] && element.upDepth < this._depthSlice[1]
        && element.downDepth > this._depthSlice[0] && element.downDepth < this._depthSlice[1]) {
            _overrides.overrideElement(element.id,
                FeatureSymbology.Appearance.fromJSON({
                      rgb: new RgbColor(0, 250, 50),
                      weight: element.diameter
                          ? Math.max(1, Math.min(7, (1 + 6 * SampleFeatureOverrideProvider.toCm(element.diameter) / 190)))
                          : 4
                    }
                ));
        }
        else {
            _overrides.overrideElement(element.id, invisible);
        }

        /*if (element.diameter && this.toCm(element.diameter) > 100) {
          _overrides.overrideElement(element.id, thicc);
        } else

        if (element.geometry_Length < this._depthSlice[0] || element.geometry_Length > this._depthSlice[1]) {
          _overrides.overrideElement(element.id, invisible);
        }
        else if (element.geometry_Length < 50) {
          _overrides.overrideElement(element.id, darkGreen);
        } else {
          _overrides.overrideElement(element.id, lightGreen);
        }*/
      }
    });
  }
}
