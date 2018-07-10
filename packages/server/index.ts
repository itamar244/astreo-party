import { createServer } from 'http';
import { createRandomGame } from 'shared/controllers/game';
import { Server as WebScoketServer } from 'ws';

const Game = createRandomGame(2, 1000, 1000);
const server = createServer((req, res) => {
	res.end('Hello World!');
});

const wss = new WebScoketServer({ server });

wss.on('connection', ws => {
	ws.on('message', message => {
		ws.send(message);
	});
});

server.listen(3000);
