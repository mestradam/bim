import { FeatureOverrideProvider, Viewport, FeatureSymbology } from "@bentley/imodeljs-frontend";
import { ColorDef, ElementProps } from "@bentley/imodeljs-common";

export class SampleFeatureOverrideProvider implements FeatureOverrideProvider {

  private _elements: ElementProps[];

  public constructor(elements: ElementProps[]) {
    this._elements = elements;
  }

  // interface function to set feature overrides
  public addFeatureOverrides(_overrides: FeatureSymbology.Overrides, _viewport: Viewport) {

    const defaultAppearance = FeatureSymbology.Appearance.fromRgba(ColorDef.white);
    const lightGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 255, 0)); // green
    const darkGreen = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 100, 0)); // green
    // const invisible = FeatureSymbology.Appearance.fromRgba(ColorDef.from(0, 0, 0, 255));

    // set default appearance for all elements
    _overrides.setDefaultOverrides(defaultAppearance);
    // set appearance of elements passed in
    if (this._elements) this._elements.forEach( (element: ElementProps) => {
      if (element.id){
        if (element.geometry_Length < 50) {
          _overrides.overrideElement(element.id, darkGreen);
        } else {
          _overrides.overrideElement(element.id, lightGreen);
        }
      }
    });
  }
}
