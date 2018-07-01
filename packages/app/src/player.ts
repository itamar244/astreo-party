import { GameController, ShipController, Direction } from 'shared/index';
import keyListener from './key-listener';

export type PlayerKeyOptions = { left: string; right: string; shoot: string };

function keyPressController(
	key: string,
	dir: Direction,
	shipController: ShipController,
) {
	return keyListener(key, {
		onKeyDown: () => {
			if (shipController.turn === Direction.STRAIGHT) {
				shipController.updateTurn(dir);
			}
		},
		onKeyUp: () => {
			shipController.updateTurn(Direction.STRAIGHT);
		},
	});
}

export default function initPlayer(
	shipID: number,
	keys: PlayerKeyOptions,
	gameController: GameController,
) {
	const shipController = gameController.getShipById(shipID);
	const stopLeft = keyPressController(
		keys.left,
		Direction.LEFT,
		shipController,
	);
	const stopRight = keyPressController(
		keys.right,
		Direction.RIGHT,
		shipController,
	);
	const stopShoot = keyListener(keys.shoot, () => {
		gameController.shoot(shipID);
	});

	return () => {
		stopLeft();
		stopRight();
		stopShoot();
	};
}
