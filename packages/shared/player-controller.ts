export type TurnType = 0 | 1 | 2;

export const TURN_NONE = 0;
export const TURN_LEFT = 1;
export const TURN_RIGHT = 2;

export default class PlayerController {
	turn: TurnType = TURN_NONE;
	rotation: number = 0;
	speed: number = 2;

	constructor(public x: number, public y: number) {}

	tick(delta: number) {
		this.x += Math.cos((this.rotation + 0.25) * Math.PI * 2) * this.speed;
		this.y += Math.sin((this.rotation + 0.25) * Math.PI * 2) * this.speed;

		if (this.turn !== TURN_NONE) {
			if (this.turn === TURN_LEFT) {
				this.rotation += 0.01;
				if (this.rotation >= 1) this.rotation -= 1;
			} else if (this.turn === TURN_RIGHT) {
				this.rotation -= 0.01;
				if (this.rotation <= 0) this.rotation += 1;
			}
		}
	}

	updateTurn(dir: TurnType) {
		this.turn = dir;
	}
}
