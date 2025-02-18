import { motion } from "framer-motion"; // Import motion correctly
import { Card } from "./ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

export const ScenarioResults = ({ scenarios = [], monthlyIncome = 0, totalExpenses = 0 }) => {
  // Ensure scenarios is an array; convert object to array if needed
  const safeScenarios = Array.isArray(scenarios) ? scenarios : Object.values(scenarios || {});

  // Calculate current savings based on user input
  const currentSavings = monthlyIncome - totalExpenses;

  const scenarioData = safeScenarios.map((scenario) => ({
    name: scenario?.name || "Unknown",
    requiredSavings: Number(scenario?.requiredMonthlySavings) || 0,
    currentSavings: currentSavings,
    deficit: Number(scenario?.savingsDeficit) || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-6"
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
        <div className="h-64" style={{ height: 256 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData} barGap={10}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="requiredSavings"
                fill={COLORS[0]}
                name="Required Monthly Savings"
                barSize={100} // Increase bar size
              />
              <Bar
                dataKey="currentSavings"
                fill={COLORS[1]}
                name="Current Savings"
                barSize={100} // Increase bar size
              />
              <Bar
                dataKey="deficit"
                fill={COLORS[2]}
                name="Savings Deficit"
                barSize={100} // Increase bar size
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {safeScenarios.length > 0 ? (
            safeScenarios.map((scenario, index) => (
              <div key={index} className="p-3 bg-secondary rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{scenario.name || "Unknown"}</span>
                  <span className="text-sm text-primary">
                    ${scenario.requiredMonthlySavings?.toFixed(2) || "0.00"}/month
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {scenario.recommendation || "No recommendation available"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total Cost: ${scenario.eventCost?.toFixed(2) || "0.00"} | Months:{" "}
                  {scenario.monthsToSave || "N/A"} | Deficit: $
                  {scenario.savingsDeficit?.toFixed(2) || "0.00"}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No scenarios available.</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Allow both arrays and objects to prevent warnings
ScenarioResults.propTypes = {
  scenarios: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  monthlyIncome: PropTypes.number,
  totalExpenses: PropTypes.number,
};
