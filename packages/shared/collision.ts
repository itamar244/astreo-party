import { BulletState } from './controllers/bullet';
import { SHIP_HEIGHT, ShipState, shipToPolygon } from './controllers/ship';
import Point from './point';
import { objectEach } from './utils';

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
	bullet: BulletState,
	ships: Record<string, ShipState>,
) {
	const hitShips: ShipState[] = [];

	objectEach(ships, ship => {
		if (polygonContains(shipToPolygon(ship), bullet.x, bullet.y)) {
			hitShips.push(ship);
		}
	});

	return hitShips;
}
