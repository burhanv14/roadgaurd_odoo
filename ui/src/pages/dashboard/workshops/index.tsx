import React from 'react';
import { ShopCard } from '@/pages/dashboard/workshops/components/shopCard'; // Changed to relative path
import { shops as data } from '@/lib/shops-data';   

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
  const adaptedShops: CardShop[] = React.useMemo(() => {
    return data.map((shop) => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
      imageUrl: shop.imageUrl || '/workshop-exterior.png', // Fallback image
      owner: shop.owner.name,
      services: shop.services,
      locationLabel: shop.location.address,
      lat: shop.location.lat,
      lng: shop.location.lng,
      review: {
        author: shop.owner.name,
        rating: shop.rating,
        text: shop.reviewText,
      },
    }));
  }, []); 

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold">Workshops Nearby</h1>
        <p className="text-muted-foreground">
          Explore and book trusted automotive workshops. Data shown below is sample content.
        </p>
      </header>

      <section className="grid gap-6">
        {adaptedShops.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
        ))}
      </section>
    </main>
  );
}