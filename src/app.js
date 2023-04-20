import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { httpLogStream } from './utils/index.js';
import { errorHandler } from './middlewares/index.js';
import { signupRouter } from './routers/index.js';
import { productRouter } from './routers/index.js'

const app = express();

// process.env에 설정한 환경변수 추가
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

process.chdir(rootDir);
dotenv.config();

const port = process.env.PORT || 3000;

// MongoDB
mongoose.connect(process.env.DB_KEY);
const db = mongoose.connection;

db.on('connected', () => console.log('Connecting DB Success'));
db.on('error', (err) => console.error('Connecting DB Failed'));


// app.set(views)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('root');
});

// 순서 중요 (errorHandler은 다른 일반 라우팅 다음에 와야 next로 잘 받아줌)
app.use('/signup', signupRouter);
app.use('/api', productRouter);
app.use(errorHandler);


// public 폴더 접근
app.use(express.static('public'));

// Log 생성기
// app.use(morgan('dev', { stream: httpLogStream }));

app.listen(port, () => {
  console.log(`Connected to ${port}...`);
});

export default app;


