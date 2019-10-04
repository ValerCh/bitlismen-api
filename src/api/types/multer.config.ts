import * as multer from 'multer';
import * as path from 'path';
import uuid from 'uuid';

export const fileUploadOptions =  { storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(undefined, 'src/uploads');
    },
    filename: (req: any, file: any, cb: any) => {
      cb(undefined, uuid.v1() + path.extname(file.originalname));
    },
  }),
};
