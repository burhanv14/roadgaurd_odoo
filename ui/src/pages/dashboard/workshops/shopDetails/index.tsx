import { useParams } from "react-router-dom";
import { shops } from "@/lib/shops-data"; // Assumes shops-data.ts is in a parent 'lib' folder
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stars } from "../components/stars";
import ShopMap from "../components/shopMap";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ShopDetailsPage() {
  // Use the useParams hook to get the 'id' from the URL
  const { id } = useParams();
  const shop = shops.find((s) => s.id === id);

  // Handle the case where the shop is not found
  if (!shop) {
    return (
      <main className="text-center py-10">
        <h1 className="text-2xl font-bold">404 - Shop Not Found</h1>
        <p className="text-muted-foreground">We couldn't find the shop you were looking for.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-pretty">{shop.name}</h1>
        <Button className="self-start bg-amber-500 text-black hover:bg-amber-400">Book Service</Button>
      </div>

      <section className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <article>
          <Card>
            <CardContent className="p-0">
              <img
                src={shop.imageUrl || "/placeholder.svg"}
                alt={`${shop.name} hero`}
                className="h-64 w-full object-cover"
              />
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            <p className="text-muted-foreground">{shop.description}</p>

            <div className="flex flex-wrap items-center gap-3">
              {shop.premium && <Badge className="bg-amber-500 text-black hover:bg-amber-500">Premium</Badge>}
              <Stars rating={shop.rating} />
              <span
                className={`text-sm ${shop.isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
              >
                • {shop.isOpen ? "Open" : "Closed"}
              </span>
              <span className="text-sm text-muted-foreground">• {shop.distanceKm} km away</span>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Customer Review</h3>
              <p className="mt-1 text-sm text-muted-foreground italic">“{shop.reviewText}”</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Services we provide</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {shop.services.map((s) => (
                  <Badge key={s} variant="secondary" className="justify-center py-2">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <div>
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{shop.location.address}</p>
            {/* Map only on detail page */}
            <ShopMap lat={shop.location.lat} lng={shop.location.lng} className="mt-3 h-56 w-full rounded-md border" />
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Owner</h3>
            <p className="text-sm text-muted-foreground mt-1">{shop.owner.name}</p>

            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${shop.owner.phone}`} className="hover:underline">
                  {shop.owner.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${shop.owner.email}`} className="hover:underline">
                  {shop.owner.email}
                </a>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}