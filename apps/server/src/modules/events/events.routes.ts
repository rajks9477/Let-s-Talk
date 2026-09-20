import { Router } from 'express';
import { EventsController } from './events.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const eventsRouter = Router();

eventsRouter.post('/', authMiddleware, EventsController.create);
eventsRouter.post('/:id/rsvp', authMiddleware, EventsController.rsvp);
