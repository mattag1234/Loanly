import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CredibilityGaugeProps {
  score: number;
  maxScore?: number;
}

export function CredibilityGauge({ score, maxScore = 100 }: CredibilityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const percentage = (score / maxScore) * 100;
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on score
  const getColor = () => {
    if (percentage >= 70) return "#1ABC9C"; // Green/Teal - Low risk
    if (percentage >= 40) return "#F39C12"; // Yellow - Medium risk
    return "#E74C3C"; // Red - High risk
  };

  const getTier = () => {
    if (percentage >= 70) return "Low-Risk Tier";
    if (percentage >= 40) return "Medium-Risk Tier";
    return "High-Risk Tier";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        {/* Background Circle */}
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Progress Circle */}
          <motion.circle
            stroke={getColor()}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + " " + circumference}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="text-4xl leading-none" style={{ color: getColor() }}>
              {Math.round(animatedScore)}
            </div>
            <div className="text-gray-500 leading-none ml-1">/ {maxScore}</div>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-gray-700">You're in the</div>
        <div className="text-xl mt-1" style={{ color: getColor() }}>
          {getTier()}
        </div>
      </div>
    </div>
  );
}
