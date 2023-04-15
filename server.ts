import app from './src/app/app';
import http from 'http';
import env from './src/utils/enValidator';

// create server

const server = http.createServer(app);

const PORT = env.PORT;

server.listen(PORT, () => console.log(`Server is running at ${PORT}`));
