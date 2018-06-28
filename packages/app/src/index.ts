import { Application } from 'pixi.js';
import Game from './game';

// @ts-ignore
if (module.hot) module.hot.accept();

const app = new Application({
	view: document.querySelector('.game-wrapper'),
	transparent: false,
	resolution: 1,
});
app.stage.position.y = app.renderer.height / app.renderer.resolution;
app.stage.scale.y = -1;

// prettier-ignore
const game = new Game(app.stage, [
	['ArrowLeft', 'ArrowRight'],
	['a', 'd'],
]);

app.ticker.add(delta => {
	game.tick(delta);
});
