/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

//renders a row in table to display users budget
function BudgetRow({ budget }) {
  return (
    <tr>
      <td className="text-black font-bold">Budget:</td>
      <td className="text-green-500 font-bold">{budget ? `$${budget}` : ""}</td>
      <td></td>
    </tr>
  );
}

//renders a row in table to display users total expenses
function TotalExpensesRow({ tableData }) {
  const totalExpenses = tableData.reduce(
    (total, item) => total + parseFloat(item.expense),
    0
  );

  return (
    <tr>
      <td className="text-black font-bold">Total Expenses:</td>
      <td className="text-red-500 font-bold">{totalExpenses !== 0 ? `$${totalExpenses.toFixed(2)}` : "0"}</td>
      <td></td>
    </tr>
  );
}

function Table() {
  const [tableData, setTableData] = useState([]);
  const [newTrans, setNewTrans] = useState({ title: "", expense: "" });
  const [budget, setBudget] = useState(0); //updating user budget
  const [showForm, setShowForm] = useState(false); //add new trans

  useEffect(() => {
    //fetching initial data from API first
    async function fetchExpenses() {
      try {
        const response = await fetch("http://localhost:3000/Expenses"); //getting response
        const expenses = await response.json(); // parsing/converting
        setTableData(expenses); //putting expenses in API into Table
      } catch (error) {
        console.error("Error fetching data:", error); //if theres an error
      }
    }
    fetchExpenses();
  }, []); //empty array makes it only be called on inital render

  function AddTrans() {
    if (newTrans.title !== "" && newTrans.expense !== "") {
      setNewTrans({ title: "", expense: "" });
      setShowForm(false);
      const updatedTableData = [...tableData, newTrans];
      setTableData(updatedTableData);

      // adding parse
      // eslint-disable-next-line no-inner-declarations
      async function updateAPI() {
        try {
          await fetch("http://localhost:3000/Expenses", {
            method: "POST",
            body: JSON.stringify(newTrans),
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("New transaction added to API");
        } catch (error) {
          console.error("Error updating API:", error);
        }
      }

      updateAPI();
    }
  }

  function DeleteTrans(index) {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  }

  return (
    <div className=" flex-col items-center justify-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-black mb-1">Budget Tracker</h1>
        <h2 className="text-2xl font-bold text-black mb-2">Transactions</h2>
        <div>
          {showForm ? (
            <form onSubmit={AddTrans} className="mb-4 font-bold">
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
                  className="bg-gray-200"
                />
              </label>
              <br />
              <label className="font-bold">
                Expense Amount:
                <input
                  type="number"
                  value={newTrans.expense}
                  onChange={(e) =>
                    setNewTrans({ ...newTrans, expense: e.target.value })
                  }
                  required
                  className="bg-gray-200"
                />
              </label>
              <br />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-3"
              >
                Submit
              </button>
            </form>
          ) : (
            <button
              className="mb-7 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowForm(true)}
            >
              Add Expenses
            </button>
          )}
        </div>
  
        <table className="border-separate border border-gray-500 border-spacing-y-5 border-spacing-x-11 ">
          <thead className="table-head">
            <tr>
              <th className="text-black text-xl font-bold">Title</th>
              <th className="text-black text-xl font-bold">Total Expenses</th>
              <th className="text-black text-xl font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            <BudgetRow budget={budget} />
            {tableData.map((item) => (
              <tr key={item.id}>
                <td className="text-black font-bold">{item.title}</td>
                <td className="text-black font-bold">${item.expense}</td>
                <td>
                  <button
                    onClick={() => DeleteTrans(item.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full"
                  >
                    X
                  </button>
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
