import BulletController from './controllers/bullet';
import Point from './point';
import ShipController, { SHIP_HEIGHT } from './controllers/ship';

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
	ships: Set<ShipController>,
) {
	const hitShips = new Set<ShipController>();

	for (const ship of ships) {
		if (polygonContains(ship.toPolygon(), bullet.x, bullet.y)) {
			hitShips.add(ship);
		}
	}

	return hitShips;
}
