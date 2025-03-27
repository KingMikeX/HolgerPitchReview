import React, { useState } from "react";

const topics = [
  "Budget",
  "Timing",
  "Politisch wichtig?",
  "Strategisch wichtig?",
  "Kreativpotenzial",
  "Abstimmungsstufen beim Kunden",
  "Arbeitstage (geschätzt)",
  "Teamstärke (geschätzt)",
  "Generiert Folgejobs"
];

export default function App() {
  const [data, setData] = useState(
    topics.map((topic) => ({ topic, score: 5, weight: 1 }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = Number(value);
    setData(updated);
  };

  const getDynamicWeight = (row, index) => {
    const budgetScore = data[0].score;
    if (row.topic === "Arbeitstage (geschätzt)") {
      if (budgetScore <= 3) return row.score > 5 ? 0.5 : 1;
      if (budgetScore >= 8) return row.score > 5 ? 1.5 : 1;
    }
    return 1;
  };

  const weightedScores = data.map((row, index) => {
    const dynamicWeight = getDynamicWeight(row, index);
    return row.score * row.weight * dynamicWeight;
  });

  const totalWeight = data.reduce((sum, row, index) => {
    const dynamicWeight = getDynamicWeight(row, index);
    return sum + row.weight * dynamicWeight;
  }, 0);

  const totalScore =
    totalWeight > 0
      ? weightedScores.reduce((sum, s) => sum + s, 0) / totalWeight
      : 0;

  const recommendation = totalScore >= 7 ? "Pitch annehmen" : totalScore >= 5 ? "Genau abwägen" : "Nicht empfehlenswert";

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>Pitch-Bewertungstool für Kreativagentur</h1>
      {data.map((row, index) => (
        <div key={index} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 160px 100px", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>{row.topic}</div>
          <input
            type="number"
            min={1}
            max={10}
            value={row.score}
            onChange={(e) => handleChange(index, "score", e.target.value)}
          />
          <input
            type="number"
            step="0.1"
            min={0}
            value={row.weight}
            onChange={(e) => handleChange(index, "weight", e.target.value)}
          />
          <div>Gewichteter Score: {(row.score * row.weight).toFixed(2)}</div>
        </div>
      ))}
      <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "1rem" }}>
        Gesamtscore: {totalScore.toFixed(2)} – Empfehlung: {recommendation}
      </div>
    </div>
  );
}
// * getDynamicWeight(row, index)
