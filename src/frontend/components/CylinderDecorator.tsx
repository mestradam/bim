import {DecorateContext, GraphicType, Decorator} from "@bentley/imodeljs-frontend";
import {ColorDef, GraphicParams} from "@bentley/imodeljs-common";
import {Point3d} from "@bentley/geometry-core";

export class CylinderDecorator implements Decorator {
    private readonly _x: number;
    private readonly _y: number;
    private readonly _z: number;
    // private _p: Point3d[];

    // private _positions: number[][];

    public constructor(x: number, y: number, depth: number|null) {
        console.log("Create CylinderDecorator: ", arguments)
        this._x = x;
        this._y = y;
        this._z = depth ? -depth : 0;
        // console.log('Create pointString')
    }

    // public constructor(p: any[]) {
    //     this._p=p.map(element => new Point3d(element.X, element.Y, element.depth))
    // }

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
        // builder.setSymbology(color, color, 12);

        let params = new GraphicParams();
        params.rasterWidth=10;
        params.setLineColor(color);
        builder.activateGraphicParams(params);

        builder.addShape([new Point3d(this._x,this._y,this._z), new Point3d(this._x,this._y, 0)]);

        // builder.addPointString(this._p);

       /* this._positions.forEach((position) => {

            builder.setSymbology(ColorDef.from(255, 0, 0), ColorDef.blue, 2);
            const aBox = new Range3d(position[0] - 5, position[1] - 5, 0, position[0] + 5, position[1] + 5, 100);
            builder.addRangeBox(aBox);
        });*/
        context.addDecorationFromBuilder(builder);
    }
}
