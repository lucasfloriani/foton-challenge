import multer from '@koa/multer';

const storage = multer.diskStorage({ destination: 'public/uploads' });

const limits = { fieldSize: 30 * 1024 * 1024 };

export default multer({ storage, limits }).any();
