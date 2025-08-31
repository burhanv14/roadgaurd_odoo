import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { serviceRequestService } from '@/services/serviceRequest.service';
import { workshopService } from '@/services/workshop.service';
import type { ServiceRequest } from '@/services/serviceRequest.service';
import type { Worker } from '@/services/workshop.service';
import { ArrowLeft, Calendar, MapPin, User, Wrench, Phone, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssignMechanicsProps {
  workshopId?: string;
}

interface WorkshopWithData {
  id: string;
  name: string;
  address: string;
  serviceRequests: ServiceRequest[];
  workers: Worker[];
}

const AssignMechanics: React.FC<AssignMechanicsProps> = ({ workshopId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workshopsData, setWorkshopsData] = useState<WorkshopWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningWorker, setAssigningWorker] = useState<string | null>(null);

  // Fetch service requests and workers for all workshops
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);

        // Get all workshops owned by the user
        const workshopsResponse = await workshopService.getWorkshopsByOwnerId(user.id.toString());
        
        if (!workshopsResponse.success || !workshopsResponse.data || workshopsResponse.data.length === 0) {
          setError('No workshops found for this user');
          return;
        }

        // Fetch data for each workshop
        const workshopsWithData: WorkshopWithData[] = await Promise.all(
          workshopsResponse.data.map(async (workshop) => {
            try {
              // Fetch service requests for this workshop
              const serviceRequestsResponse = await serviceRequestService.getServiceRequests({
                workshop_id: workshop.id,
                status: undefined // Get all statuses
              });

              // Filter to show only requests that need worker assignment or are in progress
              const relevantRequests = serviceRequestsResponse.success 
                ? serviceRequestsResponse.data.serviceRequests.filter(
                    (request: ServiceRequest) => 
                      ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(request.status) &&
                      request.workshop_id === workshop.id
                  )
                : [];

              // Fetch workers for this workshop
              const workersResponse = await workshopService.getWorkshopWorkers(workshop.id);
              const workers = workersResponse.success ? workersResponse.data : [];

              return {
                id: workshop.id,
                name: workshop.name,
                address: workshop.address,
                serviceRequests: relevantRequests,
                workers: workers
              };
            } catch (error) {
              console.error(`Error fetching data for workshop ${workshop.id}:`, error);
              return {
                id: workshop.id,
                name: workshop.name,
                address: workshop.address,
                serviceRequests: [],
                workers: []
              };
            }
          })
        );

        setWorkshopsData(workshopsWithData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, workshopId]);

  const handleAssignWorker = async (serviceRequestId: string, workerId: string | null) => {
    try {
      setAssigningWorker(serviceRequestId);
      
      const response = await serviceRequestService.assignWorker(serviceRequestId, workerId || undefined);
      
      if (response.success) {
        // Update the service request in the local state
        setWorkshopsData(prevWorkshops =>
          prevWorkshops.map(workshop => ({
            ...workshop,
            serviceRequests: workshop.serviceRequests.map(request =>
              request.id === serviceRequestId
                ? { ...request, assigned_worker_id: workerId, assignedWorker: response.data.assignedWorker }
                : request
            )
          }))
        );
      }
    } catch (err) {
      console.error('Error assigning worker:', err);
      setError('Failed to assign worker');
    } finally {
      setAssigningWorker(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      ACCEPTED: { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      IN_PROGRESS: { color: 'bg-green-100 text-green-800', label: 'In Progress' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
      MEDIUM: { color: 'bg-blue-100 text-blue-800', label: 'Medium' },
      HIGH: { color: 'bg-orange-100 text-orange-800', label: 'High' },
      URGENT: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-lg text-red-600">{error}</div>
              <Button onClick={() => navigate('/dashboard/manager')} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/dashboard/manager')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assign Mechanics</h1>
                <p className="text-gray-600">Manage worker assignments for service requests</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {workshopsData.reduce((total, workshop) => total + workshop.serviceRequests.length, 0)} issue(s) • {workshopsData.reduce((total, workshop) => total + workshop.workers.length, 0)} worker(s) available
            </div>
          </div>
        </div>

        {workshopsData.every(workshop => workshop.serviceRequests.length === 0) ? (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Requests</h3>
              <p className="text-gray-600">There are no service requests that need worker assignment at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {workshopsData.map((workshop) => (
              <div key={workshop.id} className="space-y-4">
                {/* Workshop Header */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{workshop.name}</h2>
                      <p className="text-gray-600 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {workshop.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {workshop.serviceRequests.length} service request(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {workshop.workers.length} worker(s) available
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Requests for this Workshop */}
                {workshop.serviceRequests.length === 0 ? (
                  <Card className="ml-4">
                    <CardContent className="text-center py-8">
                      <div className="text-gray-500">No service requests for this workshop</div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4 ml-4">
                    {workshop.serviceRequests.map((request) => (
                      <Card key={request.id} className="shadow-sm">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold mb-2">
                                {request.name}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                {getStatusBadge(request.status)}
                                {getPriorityBadge(request.priority)}
                                <Badge variant="outline" className="text-xs">
                                  {request.service_type === 'INSTANT_SERVICE' ? 'Instant' : 'Pre-booked'}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                Request ID: {request.id.slice(0, 8)}...
                              </div>
                              <div className="text-sm text-gray-500">
                                Created: {new Date(request.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {/* Customer Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Customer Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Name:</span> {request.user?.name || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {request.user?.email || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {request.user?.phone || 'N/A'}
                              </div>
                            </div>
                          </div>

                          {/* Issue Details */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Issue Description</h4>
                            <p className="text-gray-700 text-sm">{request.issue_description}</p>
                          </div>

                          {/* Location */}
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{request.location_address}</span>
                          </div>

                          {/* Scheduling */}
                          {(request.scheduled_start_time || request.scheduled_end_time) && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>
                                {request.scheduled_start_time && (
                                  <>Start: {new Date(request.scheduled_start_time).toLocaleString()}</>
                                )}
                                {request.scheduled_start_time && request.scheduled_end_time && ' • '}
                                {request.scheduled_end_time && (
                                  <>End: {new Date(request.scheduled_end_time).toLocaleString()}</>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Worker Assignment Section */}
                          <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Wrench className="h-4 w-4 mr-2" />
                              Worker Assignment
                            </h4>
                            
                            {request.assigned_worker_id && request.assignedWorker ? (
                              // Worker already assigned
                              <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-green-900">
                                      {request.assignedWorker.name}
                                    </div>
                                    <div className="text-sm text-green-700 flex items-center space-x-4 mt-1">
                                      <span className="flex items-center">
                                        <Phone className="h-3 w-3 mr-1" />
                                        {request.assignedWorker.phone}
                                      </span>
                                      <span>{request.assignedWorker.specialization}</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAssignWorker(request.id, null)}
                                      disabled={assigningWorker === request.id}
                                    >
                                      {assigningWorker === request.id ? 'Unassigning...' : 'Unassign'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // No worker assigned
                              <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div className="text-yellow-800">
                                    <div className="font-medium">No worker assigned</div>
                                    <div className="text-sm">Select a worker to assign to this request</div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <select
                                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleAssignWorker(request.id, e.target.value);
                                        }
                                      }}
                                      disabled={assigningWorker === request.id}
                                      defaultValue=""
                                    >
                                      <option value="">Select Worker</option>
                                      {workshop.workers
                                        .filter((worker: Worker) => worker.isAvailable)
                                        .map((worker: Worker) => (
                                          <option key={worker.id} value={worker.id}>
                                            {worker.name} - {worker.specialization}
                                          </option>
                                        ))}
                                    </select>
                                    {assigningWorker === request.id && (
                                      <div className="text-sm text-gray-500">Assigning...</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Images */}
                          {request.image_urls && request.image_urls.length > 0 && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                              <div className="flex flex-wrap gap-2">
                                {request.image_urls.map((url: string, index: number) => (
                                  <img
                                    key={index}
                                    src={url}
                                    alt={`Issue ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-lg border"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignMechanics;
