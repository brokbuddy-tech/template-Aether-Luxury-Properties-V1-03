
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/data";
import { FilterBar } from "@/components/filter-bar";

export default function BuyPage() {
  const buyProperties = properties.filter(p => p.type === 'BUY');
  return (
    <div className="container max-w-7xl py-12">
      <h1 className="text-4xl font-bold mb-8">Properties for Sale</h1>
      <FilterBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {buyProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
