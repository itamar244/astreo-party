import { Graphics, Point } from 'pixi.js';
import PlayerController from 'shared/player-controller';
import { Color, WHITE } from './colors';

const SHIP_HEIGHT = 45;
const SHIP_WIDTH = 32;
const POLYGON_DEFAULT = [
	new Point(0, +SHIP_HEIGHT / 2),
	new Point(-SHIP_WIDTH / 2, -SHIP_HEIGHT / 2),
	new Point(+SHIP_WIDTH / 2, -SHIP_HEIGHT / 2),
	new Point(0, +SHIP_HEIGHT / 2),
];

export function createShip(color: Color, initialX: number, initialY: number) {
	const ship = new Graphics(false);

	ship.beginFill(color);
	ship.lineStyle(3, WHITE);
	ship.drawPolygon(POLYGON_DEFAULT);

	ship.position.x = initialX;
	ship.position.y = initialY;

	return ship;
}

export function updateShipFromController(
	ship: Graphics,
	state: PlayerController,
) {
	ship.position.x = state.x;
	ship.position.y = state.y;
	ship.rotation = state.rotation * Math.PI * 2;
}
