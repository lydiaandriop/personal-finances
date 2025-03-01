import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <div style={styles.header}>
      <h1 style={styles.title}>Finance Tracker</h1>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/")}>
          Input
        </button>
        <button style={styles.button} onClick={() => navigate("/metrics")}>
          Metrics
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: "15px 20px",
    borderBottom: "2px solid #ddd",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "black",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
  },
  button: {
    width: "150px",  
    height: "40px",
    backgroundColor: "white",
    color: "black",
    border: "none",
    borderRadius: "8px", 
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
    font: "inherit",
  },
  buttonHover: {
    backgroundColor: "#333",
  },
};

export default Header;
