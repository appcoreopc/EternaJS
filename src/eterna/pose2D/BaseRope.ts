import { DisplayObject, Graphics, Point } from "pixi.js";
import { GameObject } from "../../flashbang/core/GameObject";
import { LateUpdatable } from "../../flashbang/core/LateUpdatable";
import { Pose2D } from "./Pose2D";
import { Vector2 } from "../../flashbang/geom/Vector2";

/** BaseRope: A class for drawing a smooth 'rope' through bases. **/
export class BaseRope extends GameObject implements LateUpdatable {

    public constructor(pose: Pose2D) {
        super();
        this._pose = pose;
        this._graphics = new Graphics();
        this._enabled = false;
    }

    public get display(): DisplayObject {
        return this._graphics;
    }

    public set enabled(value: boolean) {
        if (value === this._enabled){
            return;
        }
        this._enabled = value;
    }
    
    public lateUpdate(dt: number): void {
        for (let i = 0; i < this._pose.fullSequence.length; i++) {
            if (this._pose._bases[i]._animate) {
                this.redraw(false)
                return;
            }
        }
    }

    public redraw( force_BaseXY : boolean ) : void {

        this._graphics.clear();

        if (!this._enabled) return;

        let idx: number[] = [];
        let baseposX: number[] = [];
        let baseposY: number[] = [];
        for (let i = 0; i < this._pose.fullSequence.length; i++) {
            let center: Point = this._pose.getBaseXY(i);
            if ( !force_BaseXY && !this._pose._bases[i]._needsRedraw ) {
                // this logic took a long time to figure out -- the event 
                //  loop boolean settings are way too confusing -- rhiju.
                center = this._pose._bases[i].getLastDrawnPos();
            }
            if (center) {
                idx.push(i);
                baseposX.push(center.x);
                baseposY.push(center.y);
            }
          }

        // by drawing twice, can get a nice looking texture.
        // draw thick line and thin line on top
        let OUTER_ROPE_THICKNESS : number = 0.30 * Pose2D.ZOOM_SPACINGS[this._pose.zoomLevel];
        let INNER_ROPE_THICKNESS : number = 0.25 * Pose2D.ZOOM_SPACINGS[this._pose.zoomLevel];

        this._graphics.lineStyle(OUTER_ROPE_THICKNESS, 0x777777, 0.2);
        this._graphics.moveTo(baseposX[0], baseposY[0]);
        // this.drawBaseRopeLine(splineX, splineY);
        this.drawBaseRopeLine(baseposX, baseposY);

        this._graphics.lineStyle(INNER_ROPE_THICKNESS, 0xE8E8E8, 0.2);
        this._graphics.moveTo(baseposX[0], baseposY[0]);
        // this.drawBaseRopeLine(splineX, splineY);
        this.drawBaseRopeLine(baseposX, baseposY);
    }

    private drawBaseRopeLine(baseposX: number[], baseposY: number[]): void {
        // by drawing twice, can get a nice looking texture.
        this._graphics.moveTo(baseposX[0], baseposY[0]);
        // Update the points to correspond with base locations
        // Note that this could be way smarter -- just look at rope segments that need to be updated, not entire rope.
        let smooth_factor: integer = 5;
        for (let i = 1; i < this._pose.fullSequence.length * smooth_factor; i++) {
            // Smooth the curve with cubic interpolation to prevent sharp edges.
            const ix = this.cubicInterpolation(baseposX, i / smooth_factor);
            const iy = this.cubicInterpolation(baseposY, i / smooth_factor);
            this._graphics.lineTo(ix, iy);
        }
    }

    // adapted directly from  demo    
    //         https://pixijs.io/examples/#/demos-advanced/mouse-trail.js
    //  Cubic interpolation based on https://github.com/osuushi/Smooth.js
    //
    // Note: This is way faster than cubic-interpolation.js available through NPM.
    //
    private cubicInterpolation(array, t, tangentFactor) {
        if (tangentFactor == null) tangentFactor = 1;

        const k = Math.floor(t);
        const m = [this.getTangent(k, tangentFactor, array), this.getTangent(k + 1, tangentFactor, array)];
        const p = [this.clipInput(k, array), this.clipInput(k + 1, array)];
        t -= k;
        const t2 = t * t;
        const t3 = t * t2;
        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    }

    private getTangent(k, factor, array) {
        return factor * (this.clipInput(k + 1, array) - this.clipInput(k - 1, array)) / 2;
    }
    private clipInput(k, arr) {
        if (k < 0) k = 0;
        if (k > arr.length - 1) k = arr.length - 1;
        return arr[k];
    }

    // following not in use -- delete if still not in use in 2020.
    public makeVisibleIfLongSpacings(): void {
        if (this._enabled) return;
        for (let i = 1; i < this._pose.fullSequence.length; i++) {
            let vec: Vector2 = new Vector2.fromPoint(this._pose.getBaseXY(i)) - new Vector2.fromPoint(this._pose.getBaseXY(i - 1));
            if (vec.length > Pose2D.ZOOM_SPACINGS[0]) {
                this._enabled = true;
                return;
            }
        }
    }

    private readonly _pose: Pose2D;
    private readonly _graphics: Graphics;
    private _enabled: boolean;

}
