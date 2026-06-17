export {}; // Makes this file a module

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
      sessionId?: string;
      validatedBody?: Record<string, unknown>;
      validatedFile?: Express.Multer.File;
    }
  }
}
