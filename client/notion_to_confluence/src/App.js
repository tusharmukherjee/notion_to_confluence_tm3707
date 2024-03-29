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
import Search from "./components/Search";
import Fourofour from "./components/Fourofour";

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
          <Route path="/page/:dbid" element={<PageInfo />} />
          <Route path="/edit/:editid" element={<MyCkeditor />} />
          <Route path="/search/:pageID" element={<Search/>}/>
        </Route>
        <Route path="*" element={<Fourofour/>}/>
      </Routes>
    </Router>
  );
}

export default App;
