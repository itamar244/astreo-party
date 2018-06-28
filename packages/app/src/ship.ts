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
import keyListener from './key-listener';

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


export type ShipKeyOptions = { left: string; right: string; shoot: string };

function keyPressController(
	key: string,
	dir: TurnType,
	state: ShipController,
) {
	return keyListener(
		key,
		() => {
			if (state.turn === TURN_NONE) {
				state.updateTurn(dir);
			}
		},
		() => {
			state.updateTurn(TURN_NONE);
		},
	);
}

export default class Ship extends Container {
	private readonly controller: ShipController;
	private readonly ship: Graphics;

	constructor(
		keys: ShipKeyOptions,
		controller: ShipController,
		shoot: () => void,
	) {
		super();
		this.controller = controller;
		this.ship = createShip(BLUE, controller.x, controller.y);

		this.addChild(this.ship);

		const stopLeft = keyPressController(keys.left, TURN_LEFT, this.controller);
		const stopRight = keyPressController(
			keys.right,
			TURN_RIGHT,
			this.controller,
		);
		const stopShoot = keyListener(keys.shoot, shoot, () => {});

		this.on('removed', () => {
			stopLeft();
			stopRight();
			stopShoot();
		});
	}

	tick(delta: number): void {
		updateShipFromController(this.ship, this.controller);
	}
}
