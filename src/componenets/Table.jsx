/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function BudgetRow({ budget }) {
  return (
    <tr>
      <td>Budget:</td>
      <td>{budget ? `$${budget}` : ""}</td>
      <td></td>
    </tr>
  );
}
 
function TotalExpensesRow({ tableData }) {
  const totalExpenses = tableData.reduce(
    (total, item) => total + parseFloat(item.expense),
    0
  );

  return (
    <tr>
      <td>Total Expenses:</td>
      <td>{totalExpenses !== 0 ? `$${totalExpenses.toFixed(2)}` : "0"}</td>
      <td></td>
    </tr>
  );
}

function Table() {
  const [tableData, setTableData] = useState([]);
  const [newTrans, setNewTrans] = useState({ title: "", expense: "" });
  const [budget, setBudget] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTableData();
  }, []);

  useEffect(() => {
    saveTableData();
  }, [tableData]);

  useEffect(() => {
    saveTableData();
  }, [budget]);

  async function fetchTableData() {
    try {
      const response = await fetch("http://localhost:3000/Expenses");
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  }

  async function saveTableData() {
    try {
      await fetch("http://localhost:3000/Expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
      });
      console.log("Table data saved successfully");
    } catch (error) {
      console.error("Error saving table data:", error);
    }
  }

  function AddTrans() {
    if (newTrans.title !== "" && newTrans.expense !== "") {
      const updatedTableData = [...tableData, newTrans];
      setTableData(updatedTableData);
      setNewTrans({ title: "", expense: "" });
      setShowForm(false);
    }
  }

  function DeleteTrans(index) {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  }

  return (
    <div>
      <div className="table-container">
        <h1>Budget Tracker</h1>
        <h2>Transactions</h2>
        <div>
          {showForm ? (
            <form onSubmit={AddTrans}>
              <label>
                Budget:
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </label>
              <br />
              <label>
                Expense Title:
                <input
                  type="text"
                  value={newTrans.title}
                  onChange={(e) =>
                    setNewTrans({ ...newTrans, title: e.target.value })
                  }
                  required
                />
              </label>
              <br />
              <label>
                Expense Amount:
                <input
                  type="number"
                  value={newTrans.expense}
                  onChange={(e) =>
                    setNewTrans({ ...newTrans, expense: e.target.value })
                  }
                  required
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          ) : (
            <button className="add-exp" onClick={() => setShowForm(true)}>
              Add Expenses
            </button>
          )}
        </div>

        <table>
          <thead className="table-head">
            <tr>
              <th>Title</th>
              <th>Total Expenses</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            <BudgetRow budget={budget} />
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>${item.expense}</td>
                <td>
                  <button onClick={() => DeleteTrans(index)}>Delete</button>
                </td>
              </tr>
            ))}
            <TotalExpensesRow tableData={tableData} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
