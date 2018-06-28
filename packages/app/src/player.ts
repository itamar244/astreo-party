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

export default class Game extends Container {
	private readonly controller: PlayerController;
	private readonly ship: Graphics;

	constructor(keys: [string, string], controller: PlayerController) {
		super();
		this.controller = controller;
		this.ship = createShip(BLUE, controller.x, controller.y);

		this.addChild(this.ship);

		const stopLeft = keyPressController(keys[0], TURN_LEFT, this.controller);
		const stopRight = keyPressController(keys[1], TURN_RIGHT, this.controller);

		this.on('removed', () => {
			stopLeft();
			stopRight();
		});
	}

	tick(delta: number): void {
		this.controller.tick(delta);
		updateShipFromController(this.ship, this.controller);
	}
}
