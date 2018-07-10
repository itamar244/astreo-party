import { Direction } from 'shared/index';
import Game from './game';
import keyListener from './key-listener';

export interface PlayerKeyOptions {
	left: string;
	right: string;
	shoot: string;
}

function keyPressState(key: string, id: number, dir: Direction, game: Game) {
	return keyListener(key, {
		onKeyDown: () => {
			game.updateTurnById(id, dir);
		},
		onKeyUp: () => {
			game.updateTurnById(id, Direction.STRAIGHT);
		},
	});
}

export default function initPlayer(
	shipID: number,
	keys: PlayerKeyOptions,
	game: Game,
) {
	const stopLeft = keyPressState(keys.left, shipID, Direction.LEFT, game);
	const stopRight = keyPressState(keys.right, shipID, Direction.RIGHT, game);
	const stopShoot = keyListener(keys.shoot, () => {
		game.shoot(shipID);
	});

	return () => {
		stopLeft();
		stopRight();
		stopShoot();
	};
}
