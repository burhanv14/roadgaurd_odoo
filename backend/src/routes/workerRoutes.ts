import { Router } from 'express';
import WorkerController from '../controllers/workerController';
import authenticateToken from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Worker routes
router.post('/', WorkerController.createWorker);
router.get('/workshop/my-workers', WorkerController.getWorkshopWorkers);
router.get('/:id', WorkerController.getWorkerById);
router.patch('/:id', WorkerController.updateWorker);
router.patch('/:id/availability', WorkerController.updateWorkerAvailability);
router.patch('/:id/location', WorkerController.updateWorkerLocation);
router.delete('/:id', WorkerController.deleteWorker);
router.get('/service-request/:service_request_id/available', WorkerController.getAvailableWorkers);

export default router;
