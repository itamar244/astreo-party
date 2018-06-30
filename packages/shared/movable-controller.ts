import { PI_2 } from '@pixi/math';
import Ticker from './ticker';

function angleFromRotation(rotation: number) {
	return (rotation + 0.25) * PI_2;
}

function coordinateUpdate(
	trigoFunc: (number) => number,
	rotation: number,
	speed: number,
) {
	return trigoFunc(angleFromRotation(rotation)) * speed;
}

export function getProgress(rotation: number, progress: number) {
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
		protected _speed: number,
	) {}

	protected _move(rotation: number, delta: number) {
		this.x += coordinateUpdate(Math.cos, rotation, this._speed * delta);
		this.y += coordinateUpdate(Math.sin, rotation, this._speed * delta);
	}

	tick(delta: number) {
		this._move(this.rotation, delta);
	}
}
