import PlayerController from './player-controller';

export default class GameController {
	constructor(public readonly players: PlayerController[]) {}

	tick(delta: number) {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].tick(delta);
		}
	}
}
