import multer from 'koa-multer';

const storage = multer.memoryStorage();

const limits = { fieldSize: 30 * 1024 * 1024 };

export default multer({ storage, limits }).any();
