import { Container, Graphics, Point } from 'pixi.js';
import ShipController, {
	TurnType,
	TURN_NONE,
	TURN_LEFT,
	TURN_RIGHT,
	SHIP_HEIGHT,
	SHIP_WIDTH,
} from 'shared/ship-controller';
import { BLUE, Color, WHITE } from './colors';

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
	state: ShipController,
) {
	ship.position.x = state.x;
	ship.position.y = state.y;
	ship.rotation = state.rotation * Math.PI * 2;
}

export default class Ship extends Container {
	private readonly controller: ShipController;
	private readonly ship: Graphics;

	constructor(controller: ShipController) {
		super();
		this.controller = controller;
		this.ship = createShip(BLUE, controller.x, controller.y);

		this.addChild(this.ship);
	}

	tick(delta: number): void {
		updateShipFromController(this.ship, this.controller);
	}
}
