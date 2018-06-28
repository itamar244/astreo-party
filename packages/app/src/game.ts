import { Container, Graphics } from 'pixi.js';
import {
	Ticker,
	GameController,
	BulletController,
	PlayerController,
} from 'shared';
import Player, { PlayerKeyOptions } from './player';
import Bullet from './bullet';

export default class Game {
	private readonly controller: GameController;
	private readonly stage: Container;
	private readonly elements: Ticker[] = [];

	constructor(stage: Container, playersKeys: PlayerKeyOptions[]) {
		this.stage = stage;
		// TODO: make cleaner once there is a new design in mind
		this.controller = new GameController([{ x: 100, y: 100 }]);

		this.controller.on('bullet-added', (bullet: BulletController) => {
			const element = new Bullet(bullet);
			this.elements.push(element);
			this.stage.addChild(element);
		});

		this.controller.players.forEach(playerController => {
			const player = new Player(
				playersKeys[playerController.id],
				playerController,
				() => {
					this.controller.shoot(playerController.id);
				},
			);
			this.stage.addChild(player);
			this.elements.push(player);
		})
	}

	tick(delta: number): void {
		this.controller.tick(delta);
		for (let i = 0; i < this.elements.length; i++) {
			this.elements[i].tick(delta);
		}
	}
}
