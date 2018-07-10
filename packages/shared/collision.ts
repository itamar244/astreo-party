import { BulletController } from './controllers/bullet';
import { SHIP_HEIGHT, ShipController, shipToPolygon } from './controllers/ship';
import Point from './point';

function polygonContains(polygon: Point[], x: number, y: number) {
	let inside = false;

	// use some raycasting to test hits
	// https://github.com/substack/point-in-polygon/blob/master/index.js
	const length = polygon.length;

	for (let i = 0, j = length - 1; i < length; j = i++) {
		const pi = polygon[i];
		const pj = polygon[j];
		const intersect =
			pi.y > y !== pj.y > y &&
			x < (pj.x - pi.x) * ((y - pi.y) / (pj.y - pi.y)) + pi.x;

		if (intersect) {
			inside = !inside;
		}
	}

	return inside;
}

export function getBulletToShipCollision(
	bullet: BulletController,
	ships: ShipController[],
) {
	const hitShips = new Set<ShipController>();

	for (const ship of ships) {
		if (polygonContains(shipToPolygon(ship), bullet.x, bullet.y)) {
			hitShips.add(ship);
		}
	}

	return hitShips;
}
