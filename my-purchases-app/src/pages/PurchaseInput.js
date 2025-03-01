import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import Header from "../components/Header";

function PurchaseInput() {
  const [purchase, setPurchase] = useState({
    item: "",
    store: "",
    amount: "",
    category: "Groceries",
    date: "",
  });

  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (purchase.item && purchase.store && purchase.amount && purchase.date) {
      await addDoc(collection(db, "purchases"), {
        ...purchase,
        amount: Number(purchase.amount),
        date: new Date(purchase.date),
      });
      setPurchase({ item: "", store: "", amount: "", category: "Groceries", date: "" });
      fetchHistory();
    }
  };

  // Fetch purchases from the last 7 days
  const fetchHistory = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(collection(db, "purchases"), where("date", ">", sevenDaysAgo));
    const querySnapshot = await getDocs(q);
    setHistory(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); // Include doc ID for deletion
  };

  // Delete a purchase
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "purchases", id));
    fetchHistory(); // Refresh history after deletion
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        {/* Left: Form */}
        <div style={styles.formBox}>
          <h2>Enter a Purchase</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" name="item" placeholder="Purchase (e.g., Coffee)" value={purchase.item} onChange={handleChange} required style={styles.input} />
            <input type="text" name="store" placeholder="From where?" value={purchase.store} onChange={handleChange} required style={styles.input} />
            <input type="number" name="amount" placeholder="Amount (£)" value={purchase.amount} onChange={handleChange} required style={styles.input} />
            <select name="category" value={purchase.category} onChange={handleChange} style={styles.input}>
              {["Groceries", "Breakfast", "Lunch", "Dinner", "Clothes", "Entertainment", "Fitness"].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input type="date" name="date" value={purchase.date} onChange={handleChange} required style={styles.input} />
            <button type="submit" style={styles.button}>Submit</button>
          </form>
        </div>

        {/* Right: Purchase History */}
        <div style={styles.historyBox}>
          <h2>Purchase History (Last 7 Days)</h2>
          <ul style={styles.historyList}>
            {history.length > 0 ? (
              history.map((p) => (
                <li key={p.id} style={styles.historyItem}>
                  <span>
                    <strong>{p.item}</strong> from {p.store} - £{p.amount} ({p.category})
                  </span>
                  <button style={styles.deleteButton} onClick={() => handleDelete(p.id)}>delete</button>
                </li>
              ))
            ) : (
              <p>No recent purchases.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// CSS styles as an object
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    height: "calc(100vh - 60px)", // ✅ Keeps content within the page height
  },
  formBox: {
    flex: 1,
    margin: "3px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "white",
    maxHeight: "70vh", // ✅ Prevents overflow
    overflowY: "auto", // ✅ Enables scrolling inside the form box
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  historyBox: {
    flex: 1,
    margin: "3px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "white",
    maxHeight: "70vh", // ✅ Keeps history box within page height
    overflowY: "auto", // ✅ Enables scrolling inside the history box
  },
  historyList: {
    listStyleType: "none",
    padding: "0",
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between", // ✅ Aligns text and delete button
    alignItems: "center",
    padding: "8px",
    borderBottom: "1px solid #ddd",
  },
  deleteButton: {
    backgroundColor: "grey",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PurchaseInput;
