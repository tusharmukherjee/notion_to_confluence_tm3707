import "./App.css";
import "../src/styles/Main-Content/MainContent.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import MyCkeditor from "./components/MyCkeditor";
import PageInfo from "./components/PageInfo";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <Sidebar />
              <Outlet />
            </>
          }
        >
          <Route path="/page" element={<PageInfo />} />
          <Route path="/edit" element={<MyCkeditor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
