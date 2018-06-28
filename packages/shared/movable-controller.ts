import Ticker from './ticker';

function angleFromRotation(rotation: number) {
	return (rotation + 0.25) * Math.PI * 2;
}

function coordinateUpdate(
	trigoFunc: (number) => number,
	rotation: number,
	speed: number,
) {
	return trigoFunc(angleFromRotation(rotation)) * speed;
}

export function progress(rotation: number, progress: number) {
	return [
		coordinateUpdate(Math.cos, rotation, progress),
		coordinateUpdate(Math.sin, rotation, progress),
	];
}

export default class MovableController implements Ticker {
	constructor(
		public x: number,
		public y: number,
		public rotation: number,
		protected speed: number,
	) {}

	protected _move(rotation: number, delta: number) {
		this.x += coordinateUpdate(Math.cos, rotation, this.speed * delta);
		this.y += coordinateUpdate(Math.sin, rotation, this.speed * delta);
	}

	tick(delta: number) {
		this._move(this.rotation, delta);
	}
}
