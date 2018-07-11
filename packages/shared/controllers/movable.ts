import { PI_2 } from '@pixi/math';
import Ticker from '../ticker';

function angleFromRotation(rotation: number) {
	return (rotation + 0.25) * PI_2;
}

function coordinateUpdate(
	trigoFunc: (angle: number) => number,
	rotation: number,
	speed: number,
) {
	return trigoFunc(angleFromRotation(rotation)) * speed;
}

export function getProgress(rotation: number, progress: number) {
	return {
		x: coordinateUpdate(Math.cos, rotation, progress),
		y: coordinateUpdate(Math.sin, rotation, progress),
	};
}

export interface MovableState {
	id: string;
	x: number;
	y: number;
	rotation: number;
	speed: number;
}

export const movableUpdators = {
	tick(controller: MovableState, delta: number) {
		movableUpdators.move(controller, controller.rotation, delta);
	},

	move(controller: MovableState, rotation: number, delta: number) {
		controller.x += coordinateUpdate(
			Math.cos,
			rotation,
			controller.speed * delta,
		);
		controller.y += coordinateUpdate(
			Math.sin,
			rotation,
			controller.speed * delta,
		);
	},
};
