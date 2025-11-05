'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  delay?: number;
}

function MetricCard({ title, value, subtitle, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4"
    >
      <h4 className="text-xs font-medium text-gray-500 mb-1.5 sm:mb-2">{title}</h4>
      <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>
    </motion.div>
  );
}

export function MetricsCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <MetricCard
        title="Current Monthly Burn"
        value="12 758,56 kr"
        subtitle="-93% vs 13 months"
        delay={0.3}
      />
      <MetricCard
        title="Runway Remaining"
        value="2 months"
        subtitle="Below recommended 12+ months"
        delay={0.4}
      />
      <MetricCard
        title="Average Burn Rate"
        value="99 698,00 kr"
        subtitle="Over last 13 months"
        delay={0.5}
      />
      <MetricCard
        title="Stock Dividen"
        value="39%"
        subtitle="50'l 225,69 kr of monthly burn"
        delay={0.6}
      />
    </div>
  );
}
