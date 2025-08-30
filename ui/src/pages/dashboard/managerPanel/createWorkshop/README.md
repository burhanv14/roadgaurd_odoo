# Workshop Creation Feature

This feature allows MECHANIC_OWNER users to create new workshops in the RoadGuard system.

## Components

### 1. CreateWorkshopPage (`index.tsx`)
Main page component that renders the workshop creation interface with header and form.

### 2. CreateWorkshopForm (`components/CreateWorkshopForm.tsx`)
Comprehensive form component with:
- Basic workshop information (name, description, status, image)
- Location selection with interactive map
- Form validation and error handling
- Success/error notifications
- Backend integration

### 3. WorkshopLocationMap (`components/WorkshopLocationMap.tsx`)
Interactive Leaflet map component that allows users to:
- Click to select workshop location
- Use current location
- Visual marker placement
- Reverse geocoding for address

## Features

### Form Fields
- **Name**: Workshop name (2-255 characters, required)
- **Description**: Detailed description (10-2000 characters, required)
- **Address**: Workshop address (auto-filled from map selection, required)
- **Location**: Latitude/longitude coordinates from map (required)
- **Image URL**: Optional workshop image with preview
- **Status**: OPEN/CLOSED status

### Map Integration
- Interactive Leaflet map with OpenStreetMap tiles
- Click-to-select location functionality
- Current location detection with geolocation API
- Visual markers with custom styling
- Reverse geocoding for address lookup

### Validation
- Client-side form validation
- Real-time error display
- Required field checking
- URL format validation for images
- Coordinate range validation

### User Experience
- Loading states during submission
- Success/error toast notifications
- Auto-redirect after successful creation
- Form reset on success
- Responsive design
- Accessibility features

### Backend Integration
- Uses WorkshopService singleton for API calls
- Handles authentication requirements
- Error handling with user-friendly messages
- Proper TypeScript typing

## Usage

1. Navigate to `/managerShopPanel/createWorkshop`
2. Fill in workshop details
3. Select location on map or use current location
4. Optionally add image URL
5. Submit form
6. Get redirected to manager dashboard on success

## Security

- Route protected by authentication middleware
- Role-based access control (MECHANIC_OWNER only)
- JWT token validation
- Input sanitization and validation

## API Integration

Creates workshops via POST `/api/workshops` with:
```typescript
{
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  status?: 'OPEN' | 'CLOSED';
}
```

## Dependencies

- React Router for navigation
- Leaflet for maps
- Lucide React for icons
- Custom UI components
- Zustand for state management
- Axios for API calls
