import "../styles/Display.css";

  function Display() {
    const transactions = {
      Gas: "$14.33",
      Utilities: "$39.58",
      Car_Payment: "$250",
      Rent: "$1350"
    };
    
    const transactionItems = [];
    for (let key in transactions) {
      // eslint-disable-next-line no-prototype-builtins
      if (transactions.hasOwnProperty(key)) {
        let value = transactions[key];
        transactionItems.push(
          <li key={key}>
            {key}: {value}
          </li>
        );
      } 
    }
  
    return (
      <div className="transactions">
        <h1 className="trans-text">Transactions</h1>
        <ul>{transactionItems}</ul>
      </div>
    );
  }
  
  export default Display;
