import {
	GameController,
	ShipController,
	TurnType,
	TURN_NONE,
	TURN_LEFT,
	TURN_RIGHT,
} from 'shared';
import keyListener from './key-listener';

export type PlayerKeyOptions = { left: string; right: string; shoot: string };

function keyPressController(
	key: string,
	dir: TurnType,
	shipController: ShipController,
) {
	return keyListener(
		key,
		() => {
			if (shipController.turn === TURN_NONE) {
				shipController.updateTurn(dir);
			}
		},
		() => {
			shipController.updateTurn(TURN_NONE);
		},
	);
}

export default function initPlayer(
	shipID: number,
	keys: PlayerKeyOptions,
	gameController: GameController,
) {
	const shipController = gameController.getShipById(shipID);
	const stopLeft = keyPressController(keys.left, TURN_LEFT, shipController);
	const stopRight = keyPressController(keys.right, TURN_RIGHT, shipController);
	const stopShoot = keyListener(
		keys.shoot,
		() => {
			gameController.shoot(shipID);
		},
		() => {},
	);

	return () => {
		stopLeft();
		stopRight();
		stopShoot();
	};
}
