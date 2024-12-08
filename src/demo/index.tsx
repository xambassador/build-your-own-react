import * as React from "../miniact.js";
import * as ReactDOM from "../miniact-dom.js";

function Counter() {
  console.log("rendering Counter");
  const [count, setCount] = ReactDOM.useState(0);
  return (
    <div className="counter">
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

function App() {
  console.log("rendering App");
  return (
    <div className="app">
      <h1>Hello, Miniact!</h1>
      <Counter />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
