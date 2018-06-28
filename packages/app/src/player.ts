import { Container, Graphics } from 'pixi.js';
import PlayerController, {
	TurnType,
	TURN_NONE,
	TURN_LEFT,
	TURN_RIGHT,
} from 'shared/player-controller';
import { BLUE } from './colors';
import keyListener from './key-listener';
import { createShip, updateShipFromController } from './ship';

export type PlayerKeyOptions = { left: string; right: string; shoot: string };

function keyPressController(
	key: string,
	dir: TurnType,
	state: PlayerController,
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

export default class Player extends Container {
	private readonly controller: PlayerController;
	private readonly ship: Graphics;

	constructor(
		keys: PlayerKeyOptions,
		controller: PlayerController,
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
