import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Header from "../components/Header";


function Metrics() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      const querySnapshot = await getDocs(collection(db, "purchases"));
      setPurchases(querySnapshot.docs.map((doc) => doc.data()));
    };
    fetchPurchases();
  }, []);

  const totalSpent = purchases.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
    <Header/>
      <h2>Purchase Metrics</h2>
      <p>Total Spent: ${totalSpent}</p>
      <ul>
        {purchases.map((p, index) => (
          <li key={index}>{p.item}: ${p.amount}</li>
        ))}
      </ul>
      <a href="/">Back to Input</a>
    </div>
  );
}

export default Metrics;
