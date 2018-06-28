import { createServer } from 'http';
import { Server as WebScoketServer } from 'ws';

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
