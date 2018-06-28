import { Graphics, Point } from 'pixi.js';
import PlayerController, {
	PLAYER_HEIGHT,
	PLAYER_WIDTH,
} from 'shared/player-controller';
import { Color, WHITE } from './colors';

const POLYGON_DEFAULT = [
	new Point(0, +PLAYER_HEIGHT / 2),
	new Point(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2),
	new Point(+PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2),
	new Point(0, +PLAYER_HEIGHT / 2),
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
