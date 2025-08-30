import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const MechanicShopPanel: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mechanic Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {user?.name}! Manage your assigned tasks and services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Assigned Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Assigned Tasks
              <Badge variant="secondary">5</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Oil Change</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toyota Camry</p>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Brake Inspection</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Honda Civic</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium">9:00 AM</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engine Diagnostic</p>
                </div>
                <Badge variant="default">Confirmed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium">2:00 PM</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tire Rotation</p>
                </div>
                <Badge variant="default">Confirmed</Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Week's Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                <span className="font-bold text-2xl text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Customer Rating</span>
                <span className="font-bold text-2xl text-blue-600">4.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Hours Worked</span>
                <span className="font-bold text-2xl text-purple-600">32</span>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" variant="default">
                Start New Task
              </Button>
              <Button className="w-full" variant="outline">
                Update Task Status
              </Button>
              <Button className="w-full" variant="outline">
                Request Parts
              </Button>
              <Button className="w-full" variant="outline">
                Report Issue
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Completed brake pad replacement</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Started oil change service</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Updated task status</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Notifications
              <Badge variant="destructive">3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  New urgent task assigned
                </p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  5 minutes ago
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Parts delivery scheduled
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  1 hour ago
                </p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View All
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MechanicShopPanel;
