/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

//renders a row in table to display users budget
function BudgetRow({ budget }) {
  return (
    <tr>
      <td className="text-[#cfd0d4] font-bold">Budget:</td>
      <td className="text-[#de66d6] font-bold">{budget ? `$${budget}` : "---"}</td>
      <td>
      </td>
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
      <td className="text-[#cfd0d4] font-bold">Total Expenses:</td>
      <td className="text-[#77537a] font-bold">
        {totalExpenses !== 0 ? `$${totalExpenses.toFixed(2)}` : "---"}
      </td>
      <td>
      </td>
    </tr>
  );
}

//tableData: represents array of transactions
//newTran: stores the details of a new trans
//budget: maintains budget
//showForm: determines where the form for adding a new trans is displayed

function Table() {
  const [tableData, setTableData] = useState([]);
  const [newTrans, setNewTrans] = useState({ id: 0, title: "", expense: "" }); //new trans
  const [budget, setBudget] = useState(""); //updating user budget
  const [showForm, setShowForm] = useState(false); //add new trans
  const [counter, setCounter] = useState(0); // setting id counter to 1

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
  }, []); //empty array makes it only be called on inital render, fetches initial data from API

  function AddTrans() {
    if (newTrans.title !== "" && newTrans.expense !== "") {
      const expenseAmount = parseFloat(newTrans.expense); //taking in string value and converting to a float number
      const updatedBudget = budget - expenseAmount;

      if(updatedBudget < 0){
        alert("Expense exceeds budget!")
        return;
      }

      setNewTrans({ id: counter + 1, title: "", expense: "" });
      setCounter((prevCounter) => prevCounter + 1) //incrementing counter
      setShowForm(false);

      const updatedTableData = [...tableData, { ...newTrans, id: counter}];
      setTableData(updatedTableData);
      setBudget(updatedBudget);

      //Updating API
      // eslint-disable-next-line no-inner-declarations
      async function updateAPI() {
        try {
          await fetch("http://localhost:3000/Expenses", {
            method: "POST",
            body: JSON.stringify({ ...newTrans, id:counter }),
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

      // Subracting deleted trans from bugget
      const deletedExpense = parseFloat(deletedTrans.expense);
      const updatedBudget = budget + deletedExpense;
      setBudget(updatedBudget);
    }
  }

  return (
    <div className=" flex-col items-center justify-center">
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
            {tableData.map((item) => (
              <tr key={item.id}>
                <td className="text-[#cecece] font-bold">{item.title}</td>
                <td className="text-[#cecece] font-bold">${item.expense}</td>
                <td>
                  <button
                    onClick={() => DeleteTrans(item.id)}
                    className="bg-[#b234aa] hover:bg-[#5d1b59] flex items-center justify-center w-20 h-7 rounded-half  font-bold text-white rounded drop-shadow-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <TotalExpensesRow tableData={tableData} />
          </tbody>
        </table>
      </div>
      <div>

          {showForm ? (
            <form  onSubmit={AddTrans} className=" mt-5 text-[#dc70e6] font-bold">
              <label>
                Budget:
                <input
                  type = "text"
                  value = {budget}
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