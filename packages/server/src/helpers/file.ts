import { resolve } from 'path';
import { createWriteStream } from 'fs';

import { v4 } from 'uuid';
import { FileUpload } from 'graphql-upload';

const uploadDir = resolve(__dirname, '..', '..', '..', '..', 'public', 'uploads');

const createFilenameByMimeType = (mimeType: string) => `${v4()}.${mimeType.split('/')[1]}`;

export const uploadFile = (file: FileUpload): Promise<string> => {
  const filename = createFilenameByMimeType(file.mimetype);
  const path = `${uploadDir}/${filename}`;

  const streamIn = file.createReadStream();
  const streamOut = createWriteStream(path);

  return new Promise((res, rej) => {
    streamIn
      .pipe(streamOut)
      .on('finish', () => res(path))
      .on('error', () => rej('Erro ao subir arquivo'));
  });
};
