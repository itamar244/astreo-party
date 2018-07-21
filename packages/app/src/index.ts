import { Application } from '@pixi/app';
import { Renderer } from '@pixi/core';
import { GraphicsRenderer } from '@pixi/graphics';
import Game from './game';

import './styles/main.css';

// @ts-ignore
if (module.hot) module.hot.accept();

Renderer.registerPlugin('graphics', GraphicsRenderer);

const app = new Application({
	resolution: 1,
	transparent: false,
	view: document.querySelector('.game-wrapper'),
});
app.stage.position.y = app.renderer.height / app.renderer.resolution;
app.stage.scale.y = -1;

const game = new Game(app, [
	// prettier-ignore
	{ left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Space' },
	{ left: 'KeyA', right: 'KeyD', shoot: 'KeyS' },
]);

app.ticker.add(delta => {
	game.tick(delta);
});
