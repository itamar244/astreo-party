import { EventEmitter } from 'events';
import Ticker from './ticker';
import BulletController from './bullet-controller';
import PlayerController from './player-controller';

export default class GameController extends EventEmitter implements Ticker {
	readonly playersByName: { [key: number]: PlayerController } = {};
	readonly bullets = new Set<BulletController>();
	public readonly players = new Set<PlayerController>();

	constructor(playersOptions: Array<{ x: number; y: number }>) {
		super();
		for (let i = 0; i < playersOptions.length; i++) {
			const player = new PlayerController(
				i,
				playersOptions[i].x,
				playersOptions[i].y,
			);
			this.playersByName[player.id] = player;
			this.players.add(player);
		}
	}

	tick(delta: number) {
		this.players.forEach(player => {
			player.tick(delta);
		});
		this.bullets.forEach(bullet => {
			bullet.tick(delta);
		});
	}

	shoot(playerId: number) {
		const bullet = this.playersByName[playerId].shoot();
		if (bullet !== null) {
			this.emit('bullet-added', bullet);
			this.bullets.add(bullet);
		}
	}
}
