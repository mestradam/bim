import {DecorateContext, GraphicType, Decorator} from "@bentley/imodeljs-frontend";
import {ColorDef} from "@bentley/imodeljs-common";
import {Point3d} from "@bentley/geometry-core";

export class BarDecorator implements Decorator {
    private readonly _x: number;
    private readonly _y: number;
    private readonly _z: number;

    // private _positions: number[][];

    public constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    // public constructor(positions: number[][]) {
    //   this._positions = positions;
    // }

    public decorate(context: DecorateContext): void {
        // Check view type, project extents is only applicable to show in spatial views.
        const vp = context.viewport;
        if (!vp.view.isSpatialView())
            return;

        const builder = context.createGraphicBuilder(GraphicType.WorldDecoration, undefined);

        let red = (this._z-0.5) * 255 / 2.5;
        let color = ColorDef.from(red, 255 - red, 0);
        builder.setSymbology(color, color, 2);
        builder.addPointString([new Point3d(this._x,this._y,this._z)]);

       /* this._positions.forEach((position) => {

            builder.setSymbology(ColorDef.from(255, 0, 0), ColorDef.blue, 2);
            const aBox = new Range3d(position[0] - 5, position[1] - 5, 0, position[0] + 5, position[1] + 5, 100);
            builder.addRangeBox(aBox);
        });*/
        context.addDecorationFromBuilder(builder);
    }
}
