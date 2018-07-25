import { BulletState } from './controllers/bullet';
import { ShipState } from './controllers/ship';

export interface ScoreBoard {
	scores: Record<string, number>;
	scoreForWinning: number;
}

export function createScoreBoard(
	scoreForWinning: number,
	ships: Record<string, ShipState>,
): ScoreBoard {
	const scores = {};

	for (const ship of Object.values(ships)) {
		scores[ship.id] = 0;
	}

	return {
		scoreForWinning,
		scores,
	};
}

function updateById(scoreBoard: ScoreBoard, ship: ShipState, change: number) {
	const score = scoreBoard.scores[ship.id];
	if (score === undefined) {
		return;
	}

	const next = score + change;
	scoreBoard.scores[ship.id] = next < 0 ? 0 : next;
}

export function updateFromKill(
	scoreBoard: ScoreBoard,
	bullet: BulletState,
	ship: ShipState,
) {
	updateById(scoreBoard, ship, ship.id !== bullet.owner ? 1 : -1);
}

export function getWinner(scoreBoard: ScoreBoard): number {
	let maxShip = null;
	let maxScore = 0;

	for (const ship of Object.keys(scoreBoard.scores)) {
		const score = scoreBoard.scores[ship];
		if (score > maxScore) {
			// this change is important because `ship` is actually a string
			maxShip = Number(ship);
			maxScore = score;
		} else if (maxShip !== null && score === maxScore) {
			maxShip = null;
		}
	}

	return maxScore >= scoreBoard.scoreForWinning ? maxShip : null;
}
