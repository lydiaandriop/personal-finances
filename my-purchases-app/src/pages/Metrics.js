import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Header from "../components/Header";
import { PieChart } from "@mui/x-charts";

function Metrics() {
  const [purchases, setPurchases] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState("week"); // Default: Last Week

  useEffect(() => {
    fetchPurchases(timeRange);
  }, [timeRange]); // Re-fetch data when the time range changes

  const fetchPurchases = async (range) => {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Reset to midnight

    if (range === "week") {
      startDate.setDate(startDate.getDate() - ((startDate.getDay() + 6) % 7)); // Last Monday
    } else if (range === "month") {
      startDate.setMonth(startDate.getMonth() - 1, 1); // First day of last month
    } else if (range === "threeMonths") {
      startDate.setMonth(startDate.getMonth() - 2, 1); // First day of 3 months ago
    } else if (range === "year") {
      startDate.setMonth(0, 1); // First day of January
    }

    const q = query(collection(db, "purchases"), where("date", ">", startDate));
    const querySnapshot = await getDocs(q);
    setPurchases(querySnapshot.docs.map((doc) => doc.data()));
  };

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.amount), 0);

  // Assign colors for each category
  const categoryColors = {
    Groceries: "#FF6384",
    Breakfast: "#36A2EB",
    Lunch: "#FFCE56",
    Dinner: "#4BC0C0",
    Clothes: "#9966FF",
    Entertainment: "#FF9F40",
    Fitness: "#C9CBCF",
  };

  // Group purchases by category and calculate percentage
  const categoryTotals = purchases.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + Number(p.amount);
    return acc;
  }, {});

  // Convert absolute values to percentages
  const chartData = Object.keys(categoryTotals).map((category, id) => ({
    id,
    value: totalSpent > 0 ? ((categoryTotals[category] / totalSpent) * 100).toFixed(2) : 0, // Convert to %
    label: `${category} (${((categoryTotals[category] / totalSpent) * 100).toFixed(1)}%)`,
    color: categoryColors[category] || "#CCCCCC", // Assign color or default gray
  }));

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.totalSpent}>Total Spent: £{totalSpent}</h2>

          {/* Time Range Buttons */}
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => setTimeRange("week")}>Last Week</button>
            <button style={styles.button} onClick={() => setTimeRange("month")}>Last Month</button>
            <button style={styles.button} onClick={() => setTimeRange("threeMonths")}>Last 3 Months</button>
            <button style={styles.button} onClick={() => setTimeRange("year")}>Last Year</button>
          </div>

          <div style={styles.chartContainer}>
            {/* MUI Pie Chart with Percentages */}
            <PieChart
              series={[
                {
                  data: chartData,
                  innerRadius: 70,
                  outerRadius: 120,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 270,
                  onClick: (_, event) => setSelectedCategory(event.label.split(" ")[0]), // Click to show details
                },
              ]}
              width={400}
              height={400}
              slotProps={{ legend: { hidden: true } }} // ✅ Hide default legend
            />
          </div>

          {/* Custom Color Key / Legend */}
          <div style={styles.legendContainer}>
            {chartData.map((entry) => (
              <div key={entry.id} style={styles.legendItem}>
                <div style={{ ...styles.legendColor, backgroundColor: entry.color }}></div>
                <span>{entry.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>

          {/* Purchases for Selected Category */}
          {selectedCategory && (
            <div style={styles.historyBox}>
              <h3>Purchases for {selectedCategory}</h3>
              <ul style={styles.historyList}>
                {purchases
                  .filter((p) => p.category === selectedCategory)
                  .map((p, index) => (
                    <li key={index} style={styles.historyItem}>
                      <strong>{p.item}</strong> - £{p.amount} from {p.store} on {new Date(p.date).toLocaleDateString()}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
  },
  box: {
    background: "white",
    padding: "5%",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "70%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  totalSpent: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "grey",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  chartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  legendContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "20px",
    gap: "15px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  historyBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f9f9f9",
    width: "80%",
  },
  historyList: {
    listStyleType: "none",
    padding: "0",
  },
  historyItem: {
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
};

export default Metrics;
