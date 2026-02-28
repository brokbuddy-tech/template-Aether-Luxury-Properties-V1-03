
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/lib/data";
import { FilterBar } from "@/components/filter-bar";

export default function BuyPage() {
  const buyProperties = properties.filter(p => p.type === 'BUY');
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Properties for Sale</h1>
      <FilterBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {buyProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav aria-label="Pagination">
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <span className="cursor-pointer px-3 py-2 ml-0 leading-tight text-primary bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">1</span>
            </li>
              <li>
              <span className="cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">...</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
