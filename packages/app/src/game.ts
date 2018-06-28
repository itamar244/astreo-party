import { Container, Graphics } from 'pixi.js';
import GameController from 'shared/game-controller';
import PlayerController from 'shared/player-controller';
import { BLUE } from './colors';
import Player from './player';

export default class Game {
	private readonly controller: GameController;;
	private readonly stage: Container;
	private readonly players: Player[] = [];

	constructor(stage: Container, playersKeys: [string, string][]) {
		this.stage = stage;

		this.controller = new GameController(
			Array(playersKeys.length)
				.fill(null)
				.map(() => new PlayerController(100, 100)),
		);
		for (let i = 0; i < playersKeys.length; i++) {
			const player = new Player(playersKeys[i], this.controller.players[i]);
			this.stage.addChild(player);
			this.players.push(player);
		}
	}

	tick(delta: number): void {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].tick(delta);
		}
	}
}
