import { RestaurantDetail } from "@/src/components/RestaurantDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const restaurantId = parseInt(id, 10);

  return <RestaurantDetail restaurantId={restaurantId} />;
}
