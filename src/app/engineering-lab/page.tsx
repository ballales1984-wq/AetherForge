import { AeroCalculator } from "@/components/engineering/AeroCalculator";
import { WeightDistributionCalculator } from "@/components/engineering/WeightDistributionCalculator";
import { MaterialDatabase } from "@/components/engineering/MaterialDatabase";

export default function EngineeringLab() {
  return (
    <div className="space-y-16">
      {/* Aero Calculator Section */}
      <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
        <AeroCalculator />
      </section>
      
      {/* Weight Distribution Section */}
      <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
        <WeightDistributionCalculator />
      </section>
      
      {/* Material Database Section */}
      <section className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
        <MaterialDatabase />
      </section>
    </div>
  );
}