import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Map from "./components/Map";

function App() {
  const [count, setCount] = useState(0);

  // fetch data from free weather API for Spain

  return (
    <div className="App">
      <Map />
      <p>Basic Map</p>
    </div>
  );
}

export default App;
