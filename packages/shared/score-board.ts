import BulletController from './bullet-controller';
import ShipController from './ship-controller';

export default class ScoreBoard {
	private _scores = new Map<ShipController, number>();
	private _scoreForWinning: number;

	constructor(scoreForWinning: number, ships: Set<ShipController>) {
		this._scoreForWinning = scoreForWinning;

		ships.forEach(ship => {
			this._scores.set(ship, 0);
		});
	}

	updateFromKill(bullet: BulletController, ship: ShipController) {
		this._updateById(ship, ship !== bullet.owner ? 1 : -1);
	}

	getWinner() {
		let maxShip = null;
		let maxScore = 0;

		this._scores.forEach((score, ship) => {
			if (score > maxScore) {
				maxShip = ship;
				maxScore = score;
			} else if (maxShip !== null && score === maxScore) {
				maxShip = null;
			}
		});

		return maxScore >= this._scoreForWinning ? maxShip : null;
	}

	private _updateById(ship: ShipController, change: number) {
		const score = this._scores.get(ship);
		if (score === undefined) {
			return;
		}

		let next = score + change;
		this._scores.set(ship, next < 0 ? 0 : next);
	}
}
