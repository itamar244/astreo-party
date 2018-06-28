import { EventEmitter } from 'events';
import Ticker from './ticker';
import BulletController from './bullet-controller';
import PlayerController from './player-controller';

// type GameEventTypes = 'bullet-added';

export default class GameController extends EventEmitter
	implements Ticker {
	readonly playersByName: { [key: number]: PlayerController } = {};
	readonly bullets: BulletController[] = [];
	public readonly players: PlayerController[];

	constructor(playersOptions: Array<{ x: number; y: number }>) {
		super();
		this.players = Array(playersOptions.length);
		for (let i = 0; i < this.players.length; i++) {
			const player = new PlayerController(
				i,
				playersOptions[i].x,
				playersOptions[i].y,
			);
			this.playersByName[player.id] = player;
			this.players[i] = player;
		}
	}

	tick(delta: number) {
		for (let i = 0; i < this.players.length; i++) {
			this.players[i].tick(delta);
		}
		for (let i = 0; i < this.bullets.length; i++) {
			this.bullets[i].tick(delta);
		}
	}

	shoot(playerId: number) {
		const bullet = this.playersByName[playerId].shoot();
		if (bullet !== null) {
			this.emit('bullet-added', bullet);
			this.bullets.push(bullet);
		}
	}
}
