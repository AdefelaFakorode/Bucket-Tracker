import { useState } from "react";
import "../styles/Table.css";

function Table() {
  const [tableData, setTableData] = useState([]);
  const [newTrans, setNewTrans] = useState({ title: "", expense: "" });

  //total income
  //total expenses
  //add a component that tells user to enter a new transaction

  function AddTrans() {
    if (newTrans.title !== "" && newTrans.expense !== "") {
      const updatedTableData = [...tableData, newTrans];
      setTableData(updatedTableData);
      setNewTrans({ title: "", expense: "" });
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
        <table>
          <thead className="table-head">
            <tr>
              <th>Title</th>
              <th>Total Expenses</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td className="expenses">{item.expense}</td>
                <td>
                  <button onClick={() => DeleteTrans(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="add-trans">
        <input
          type="text"
          placeholder="Title"
          value={newTrans.title}
          onChange={(e) => setNewTrans({ ...newTrans, title: e.target.value })}
        />

        <input
          type="text"
          placeholder="Expense"
          value={newTrans.expense}
          onChange={(e) =>
            setNewTrans({ ...newTrans, expense: e.target.value })
          }
        />
        <button onClick={AddTrans}>Add Transaction</button>
      </div>
    </div>
  );
}

export default Table;
