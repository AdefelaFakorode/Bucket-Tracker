/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

//rendering budget row
function BudgetRow({ budget }) {
  return (
    <tr>
      <td className="text-[#cfd0d4] font-bold">Budget:</td>
      <td className="text-[#de66d6] font-bold">{budget ? `$${budget}` : "---"}</td>
      <td></td>
    </tr>
  );
}
//rendering total expense row
function TotalExpensesRow({ tableData }) {
  const totalExpenses = tableData.reduce(
    (total, item) => total + parseFloat(item.expense),
    0
  );

  return (
    <tr>
      <td className="text-[#cfd0d4] font-bold">Total Expenses:</td>
      <td className="text-[#77537a] font-bold">
        {totalExpenses !== 0 ? `$${totalExpenses.toFixed(2)}` : "---"}
      </td>
      <td></td>
    </tr>
  );
}

//tableData: represents array of transactions
//newTran: stores the details of a new trans
//budget: maintains budget
//showForm: setting id counter + 1
function Table() {
  const [tableData, setTableData] = useState([]); 
  const [newTrans, setNewTrans] = useState({ id: 0, title: "", expense: "" });
  const [budget, setBudget] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [counter, setCounter] = useState(0);

  //fetching initial data from API first
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const response = await fetch("http://localhost:3000/Expenses");
        const expenses = await response.json();
        setTableData(expenses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchExpenses(); 
  }, []); //empty array makes it only be called on inital render, fetches initial data from API

  function AddTrans( event ) {
    event.preventDefault(); //page doesnt reload after alert 
    if (newTrans.title !== "" && newTrans.expense !== "") {
      const expenseAmount = parseFloat(newTrans.expense);
      const updatedBudget = budget - expenseAmount;

      if (updatedBudget < 0) {
        alert("Expense exceeds budget!");
        return;
      }

      setNewTrans({ id: counter + 1, title: "", expense: "" });
      setCounter((prevCounter) => prevCounter + 1);
      setShowForm(false);

      const updatedTableData = [...tableData, { ...newTrans, id: counter }];
      setTableData(updatedTableData);
      setBudget(updatedBudget);

      //updating API after new transaction has been added
      // eslint-disable-next-line no-inner-declarations
      async function updateAPI() {
        try {
          await fetch("http://localhost:3000/Expenses", {
            method: "POST",
            body: JSON.stringify({ ...newTrans, id: counter }),
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

  function DeleteTrans(id) {
    const deletedIndex = tableData.findIndex((item) => item.id === id);
    if (deletedIndex !== -1) {
      const deletedTrans = tableData[deletedIndex];
      const updatedTableData = [...tableData];
      updatedTableData.splice(deletedIndex, 1);
      setTableData(updatedTableData);

      const deletedExpense = parseFloat(deletedTrans.expense);
      const updatedBudget = parseFloat(budget) + deletedExpense; // Parse budget as float
      setBudget(updatedBudget.toFixed(2)); // Fix the budget to 2 decimal places
    }
  }

  function EditTrans(id) {
    const updatedTableData = tableData.map((item) =>
      item.id === id ? { ...item, isEditing: true } : item
    );
    setTableData(updatedTableData);
  }

  function UpdateTrans(id, title, expense) {
  const updatedExpense = parseFloat(expense);
  const updatedTableData = tableData.map((item) =>
    item.id === id ? { ...item, title, expense: updatedExpense, isEditing: false } : item
  );
  setTableData(updatedTableData);

  const updatedTotalExpenses = updatedTableData.reduce(
    (total, item) => total + parseFloat(item.expense),
    0
  );
  const originalExpense = tableData.find((item) => item.id === id).expense;
  const updatedBudget = parseFloat(budget) - parseFloat(originalExpense) + updatedTotalExpenses;
  setBudget(updatedBudget.toFixed(2));
}

  

  return (
    <div className="flex-col items-center justify-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-[#dc70e6] mb-5">Budget Tracker</h1>
        <table className="bg-[#121829] border-separate border-spacing-y-5 border-spacing-x-11 drop-shadow-lg rounded-xl">
          <thead className="table-head">
            <tr>
              <th className="text-white text-xl font-bold">Title</th>
              <th className="text-white text-xl font-bold">Total Expenses</th>
              <th className="text-white text-xl font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            <BudgetRow budget={budget} />
            {tableData.map((item) =>
              item.isEditing ? (
                <tr key={item.id}>
                  <td>
                    <input
                      className="text-[#82277c] font-bold w-20"
                      defaultValue={item.title}
                      onChange={(e) => (item.title = e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="text-[#82277c] font-bold w-20"
                      defaultValue={item.expense}
                      onChange={(e) => (item.expense = e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => UpdateTrans(item.id, item.title, item.expense)}
                      className="bg-[#b234aa] hover:bg-[#5d1b59] flex items-center justify-center w-20 h-7 rounded-half font-bold text-white rounded drop-shadow-lg"
                    >
                      Submit
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td className="text-[#cecece] font-bold">{item.title}</td>
                  <td className="text-[#cecece] font-bold">${item.expense}</td>
                  <td>
                    <button
                      onClick={() => EditTrans(item.id)}
                      className="mb-2 bg-[#b234aa] hover:bg-[#5d1b59] flex items-center justify-center w-20 h-7 rounded-half font-bold text-white rounded drop-shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => DeleteTrans(item.id)}
                      className="bg-[#b234aa] hover:bg-[#5d1b59] flex items-center justify-center w-20 h-7 rounded-half font-bold text-white rounded drop-shadow-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
            <TotalExpensesRow tableData={tableData} />
          </tbody>
        </table>
      </div>
      <div>
        {showForm ? (
          <form onSubmit={AddTrans} className=" mt-5 text-[#dc70e6] font-bold">
            <label>
              Budget:
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                className="bg-[#121829]"
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
                className="bg-[#121829] mt-2 mb-2"
              />
            </label>
            <br />
            <label className="font-bold ">
              Expense Amount:
              <input
                type="number"
                value={newTrans.expense}
                onChange={(e) =>
                  setNewTrans({ ...newTrans, expense: e.target.value })
                }
                required
                className="bg-[#121829] "
              />
            </label>
            <br />
            <button
              type="submit"
              className="bg-[#b234aa] hover:bg-[#5d1b59] text-white font-bold py-2 px-4 rounded mt-3"
            >
              Submit
            </button>
          </form>
        ) : (
          <button
            className="bg-[#b234aa] hover:bg-[#5d1b59] mt-5 text-white font-bold py-2 px-4 rounded drop-shadow-lg"
            onClick={() => setShowForm(true)}
          >
            Add Expenses
          </button>
        )}
      </div>
    </div>
  );
}

export default Table;