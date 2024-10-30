import express from 'express';

declare global {
  namespace Express {
    interface Request {
        reqLocation?: string; // Define el tipo según lo que necesitas
    }
  }
}