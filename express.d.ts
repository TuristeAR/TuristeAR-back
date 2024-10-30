// express.d.ts
import express from 'express';

declare global {
  namespace Express {
    interface Request {
      sessionLocate: string; // Define el tipo según lo que necesitas
    }
  }
}