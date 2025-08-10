// apps/api/src/types/express/index.d.ts
import { GoogleProfile } from '../../auth/interfaces/google-profile.interface';

module 'express-serve-static-core' {
  interface Request {
    user?: GoogleProfile; // hoặc User, hoặc union nhiều loại
  }
}
