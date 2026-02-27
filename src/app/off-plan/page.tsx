import { OffPlanCard } from "@/components/off-plan-card";
import { offPlanProjects } from "@/lib/data";

export default function OffPlanPage() {
  return (
    <div className="container max-w-7xl py-12">
      <h1 className="text-4xl font-bold mb-8">Off-Plan Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {offPlanProjects.map(project => (
          <OffPlanCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
