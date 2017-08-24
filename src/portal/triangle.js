/*
Vertical angle is 0
Counter-clockwise is +ve
The centroid of the triangle is (x, y)
*/

export default class Triangle {
    constructor(x, y, size, angle) {
        this.x = x
        this.y = y
        this.size = size,
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

    // Grow the size by a number
    grow(growth) {
        this.size += growth
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
        return this.y - this.size * Math.cos(this.angle + offset)
    }

    _getX(pointIdx) {
        const offset = 2 * pointIdx * Math.PI / 3
        return this.x + this.size * Math.sin(this.angle + offset)
    }
}
