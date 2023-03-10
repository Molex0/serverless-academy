import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import CheckOut from "./components/CheckOut";

function App() {

  return (
    <Router>
      <NavBar/>
      <Header/>
      

    </Router>
  );
}


export default App;
