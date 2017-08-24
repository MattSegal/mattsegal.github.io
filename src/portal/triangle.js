import RadialShape from './radialshape'

export default class Triangle extends RadialShape {
  
    // Get triangle points
    getPoints() {
        return [
            [this._getX(0), this._getY(0)],
            [this._getX(1), this._getY(1)],
            [this._getX(2), this._getY(2)],
        ]
    }

    _getY(pointIdx) {
        const offset = 2 *pointIdx * Math.PI / 3
        return this.y - this.radius * Math.cos(this.angle + offset)
    }

    _getX(pointIdx) {
        const offset = 2 * pointIdx * Math.PI / 3
        return this.x + this.radius * Math.sin(this.angle + offset)
    }
}
