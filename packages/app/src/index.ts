import { Application } from 'pixi.js';
import Game from './game';

import './styles/main.css';

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
	{ left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Space' },
]);

app.ticker.add(delta => {
	game.tick(delta);
});
