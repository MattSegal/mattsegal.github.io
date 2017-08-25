/*
Vertical angle is 0
Counter-clockwise is +ve
The centroid of the triangle is (x, y)
*/

export default class Triangle {
    constructor(x, y, radius, angle) {
        this.x = x
        this.y = y
        this.radius = radius,
        this.angle = angle
    }

    // Rotate triangle by angle
    rotate(angle) {
        this.angle += angle % (2 * Math.PI)
    }

    // Translate centroid of triangle
    translate(x, y) {
        this.x += x
        this.y += y
    }

    // Grow the radius by a number
    grow(factor) {
        this.radius = this.radius * factor
    }

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
