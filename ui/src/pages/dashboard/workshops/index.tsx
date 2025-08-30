import React from 'react';
import { ShopCard } from '@/pages/dashboard/workshops/components/shopCard';
import { useWorkshops } from '@/hooks/useWorkshops';
import type { Workshop } from '@/services/workshop.service';

type CardShop = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  services: string[];
  locationLabel: string;
  lat: number;
  lng: number;
  review: { author: string; rating: number; text: string };
};

export default function ShopsPage() {
  const { workshops, loading, error, refetch } = useWorkshops();

  const adaptedShops: CardShop[] = React.useMemo(() => {
    return workshops.map((workshop: Workshop) => ({
      id: workshop.id,
      name: workshop.name,
      description: workshop.description,
      imageUrl: workshop.image_url || '/workshop-exterior.png', // Fallback image
      owner: workshop.owner?.name || 'Unknown Owner',
      services: [], // Services would need to be fetched separately or included in the workshop response
      locationLabel: workshop.address,
      lat: workshop.latitude,
      lng: workshop.longitude,
      review: {
        author: workshop.owner?.name || 'Unknown Owner',
        rating: workshop.rating,
        text: 'Workshop review', // Default text since reviews aren't included in basic workshop response
      },
    }));
  }, [workshops]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading workshops...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-lg text-red-600">Error: {error}</div>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold">Workshops Nearby</h1>
        <p className="text-muted-foreground">
          Explore and book trusted automotive workshops. {workshops.length} workshop(s) found.
        </p>
      </header>

      <section className="grid gap-6">
        {adaptedShops.length > 0 ? (
          adaptedShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No workshops found.</p>
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        )}
      </section>
    </main>
  );
}