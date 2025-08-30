import { Router } from 'express';
import ServiceRequestController from '../controllers/serviceRequestController';
import authenticateToken from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Service request routes
router.post('/', ServiceRequestController.createServiceRequest);
router.get('/', ServiceRequestController.getServiceRequests);
router.get('/:id', ServiceRequestController.getServiceRequestById);
router.patch('/:id', ServiceRequestController.updateServiceRequest);
router.post('/:id/assign-workshop', ServiceRequestController.assignWorkshop);

export default router;
