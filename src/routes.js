import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

import authMiddleware from './app/middlewares/auth';
import EnrollmentController from './app/controllers/EnrollmentController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
/* a rota do auth só é usada depois da rota de logar o admin */
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);

routes.post('/plans/:planId/enrollment', EnrollmentController.store);

export default routes;
