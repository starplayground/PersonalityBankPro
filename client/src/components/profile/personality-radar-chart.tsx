import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

interface PersonalityRadarChartProps {
  scores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export default function PersonalityRadarChart({ scores }: PersonalityRadarChartProps) {
  const data = [
    { trait: "Openness", value: scores.openness },
    { trait: "Conscientiousness", value: scores.conscientiousness },
    { trait: "Extraversion", value: scores.extraversion },
    { trait: "Agreeableness", value: scores.agreeableness },
    { trait: "Neuroticism", value: scores.neuroticism },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="trait" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar dataKey="value" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
