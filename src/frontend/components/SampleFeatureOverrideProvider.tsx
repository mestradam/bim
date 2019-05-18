import { FeatureOverrideProvider, Viewport, FeatureSymbology } from "@bentley/imodeljs-frontend";
import { ColorDef } from "@bentley/imodeljs-common";

export class SampleFeatureOverrideProvider implements FeatureOverrideProvider {

  // private readonly _elements: ElementProps[];
  // private readonly _depthSlice: number[];
  //
  // public constructor(elements: ElementProps[], depthSlice: number[]) {
  //   this._elements = elements;
  //   this._depthSlice = depthSlice;
  // }

  // interface function to set feature overrides
  public addFeatureOverrides(_overrides: FeatureSymbology.Overrides, _viewport: Viewport) {

    // const defaultAppearance = FeatureSymbology.Appearance.fromRgba(ColorDef.white);
    // const lightGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 255, 0)); // green
    // const darkGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 100, 0)); // green
    const invisible = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 0, 0, 255));

    // set default appearance for all elements
    _overrides.setDefaultOverrides(invisible);
    // set appearance of elements passed in
    /*if (this._elements) this._elements.forEach( (element: ElementProps) => {
      if (element.id){
        if (element.geometry_Length < this._depthSlice[0] || element.geometry_Length > this._depthSlice[1]) {
          _overrides.overrideElement(element.id, invisible);
        }
        else if (element.geometry_Length < 50) {
          _overrides.overrideElement(element.id, darkGreen);
        } else {
          _overrides.overrideElement(element.id, lightGreen);
        }
      }
    });*/
  }
}
