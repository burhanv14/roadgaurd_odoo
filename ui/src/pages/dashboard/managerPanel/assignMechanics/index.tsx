import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';

const AssignMechanicsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/managerShopPanel" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Assign Mechanics
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and assign mechanics to your workshops.
        </p>
      </div>

      {/* Placeholder Content */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mechanic Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="mb-4">
              This page is under development. The mechanic assignment system will be implemented here.
            </p>
            <p className="text-sm">
              Features will include: Mechanic search, assignment to workshops, and role management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignMechanicsPage;
