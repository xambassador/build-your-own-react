import * as React from "../miniact.js";
import * as ReactDOM from "../miniact-dom.js";

function Timer() {
  const [time, setTime] = ReactDOM.useState(new Date());

  ReactDOM.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-10 flex flex-col items-center">
      <span className="text-lg font-medium text-gray-700 mb-4">Current Time</span>
      <div>
        <span className="text-2xl font-bold text-cyan-700">{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

function Counter() {
  const [count, setCount] = ReactDOM.useState(0);
  const [doubleCount, setDoubleCount] = ReactDOM.useState(0);
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-64 mt-10">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Counter</h2>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCount((prev) => prev - 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors w-10"
        >
          -
        </button>
        <span className="text-3xl font-semibold text-gray-800">{count}</span>
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors w-10"
        >
          +
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div>
        <h2 className="text-5xl font-extrabold mb-6 leading-tight">
          Hello <span className="text-indigo-600">Miniact!</span>
        </h2>
        <Counter />
        <Timer />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
