/*
Vertical angle is 0
Counter-clockwise is +ve
The centroid of the triangle is (x, y)
*/

export default class RadialShape {
    constructor(x, y, radius, angle) {
        this.x = x
        this.y = y
        this.radius = radius,
        this.angle = angle
    }

    // Rotate shape by angle
    rotate(angle) {
        this.angle += angle % (2 * Math.PI)
    }

    // Translate centroid of shape
    translate(x, y) {
        this.x += x
        this.y += y
    }

    // Grow the radius by a factor
    grow(factor) {
        this.radius = this.radius * factor
    }

    // Get shape points
    getPoints() {
        return []
    }
}
