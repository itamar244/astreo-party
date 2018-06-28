import { Container, Graphics } from 'pixi.js';
import BulletController from 'shared/bullet-controller';
import { YELLOW } from './colors';

function createPoint(controller: BulletController) {
	const point = new Graphics();

	point.beginFill(YELLOW);
	point.drawCircle(0, 0, 10);

	updateBulletFromController(point, controller);

	return point;
}

function updateBulletFromController(
	projectile: Graphics,
	controller: BulletController,
) {
	projectile.position.set(controller.x, controller.y);
}

export default class Bullet extends Container {
	private readonly projectile: Graphics;

	constructor(public readonly controller: BulletController) {
		super();
		this.projectile = this.addChild(createPoint(controller));
	}

	tick(delta: number): void {
		updateBulletFromController(this.projectile, this.controller);
	}
}
