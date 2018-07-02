// Simplier implement of Point than pixi.
// Enables using object similiar to Point but like them that has `x` and `y` properties,
// also some other point's utils.
export interface PointLike {
	readonly x: number;
	readonly y: number;
}

export default class Point implements PointLike {
	static ORIGIN = new Point(0, 0);

	constructor(public readonly x: number, public readonly y: number) {}

	clone() {
		return new Point(this.x, this.y);
	}

	add(to: PointLike) {
		return new Point(this.x + to.x, this.y + to.y);
	}

	subtract(from: PointLike) {
		return new Point(this.x - from.x, this.y - from.y);
	}

	rotate(angle: number) {
		if (angle === 0) {
			return this.clone();
		}

		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		return new Point(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
	}

	rotateAround(angle: number, center: PointLike) {
		return this.subtract(center)
			.rotate(angle)
			.add(center);
	}
}
