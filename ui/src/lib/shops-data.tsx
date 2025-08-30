export type Shop = {
  id: string
  name: string
  description: string
  imageUrl: string
  rating: number
  reviewText: string
  owner: { name: string; phone: string; email: string }
  services: string[]
  location: { address: string; lat: number; lng: number }
  isOpen: boolean
  distanceKm: number
  premium?: boolean
}

export const shops: Shop[] = [
  {
    id: "auto-work-1",
    name: "Automobile Work Shop",
    description:
      "Complete auto care: engine diagnostics, oil changes, AC service, brakes and detailing. Transparent pricing and quick turnarounds.",
    imageUrl: "/workshop-exterior.png",
    rating: 4.5,
    reviewText: "Very good service and quick response.",
    owner: { name: "Marc Demo", phone: "+1 555-555-5556", email: "info@yourcompany.com" },
    services: ["Oil Change", "Tyres", "Battery", "AC Service", "Diagnostics", "Detailing"],
    location: {
      address: "Silver Auditorium, Ahmedabad, Gujarat",
      lat: 23.0225,
      lng: 72.5714,
    },
    isOpen: true,
    distanceKm: 2.5,
    premium: true,
  },
  {
    id: "premium-auto-2",
    name: "Premium Auto Care",
    description:
      "Expert technicians for modern vehicles. Genuine parts and a smooth experience from estimate to delivery.",
    imageUrl: "/premium-auto-garage.png",
    rating: 4.0,
    reviewText: "Friendly staff and fair pricing.",
    owner: { name: "Ava Patel", phone: "+1 555-222-7777", email: "hello@premiumauto.com" },
    services: ["Brakes", "Suspension", "Battery", "Alignment", "Car Wash"],
    location: {
      address: "CG Road, Ahmedabad, Gujarat",
      lat: 23.03,
      lng: 72.58,
    },
    isOpen: true,
    distanceKm: 5.8,
  },
  {
    id: "neighborhood-3",
    name: "Neighborhood Auto Shop",
    description: "Trusted neighborhood mechanics for routine service, emergency fixes, and maintenance plans.",
    imageUrl: "/neighborhood-auto-shop.png",
    rating: 3.5,
    reviewText: "Good value for routine maintenance.",
    owner: { name: "Ravi Kumar", phone: "+1 555-444-1122", email: "service@neighborhoodauto.com" },
    services: ["Oil Change", "Tyres", "Electrical", "AC Service"],
    location: {
      address: "Maninagar, Ahmedabad, Gujarat",
      lat: 22.9925,
      lng: 72.602,
    },
    isOpen: false,
    distanceKm: 9.2,
  },
]