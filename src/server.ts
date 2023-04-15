import app from './app/app';
import http from 'http';
import env from './utils/enValidator';

// create server

const server = http.createServer(app);

const PORT = env.PORT;

server.listen(PORT, () => console.log(`Server is running at ${PORT}`));
