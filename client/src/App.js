import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import Signup from './pages/signup/index';
import Login from './pages/login/index';
import Home from './pages/home';
import MyLocations from './pages/locations/my-locations';
import MyComments from './pages/comment';
import NavBar from './components/navbar';
import ProtectedRoute from './protectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  LoadScript,
} from "@react-google-maps/api";

const mapsApiKey = "" || process.env.REACT_APP_MAPS_API_KEY;

function RouteWithNavBar() {
  let location = useLocation();
  if (location.pathname !== "/login" && location.pathname !== "/signup") {
    return <NavBar />;
  } else {
    return null;
  }
}

function App() {
  return (
    <LoadScript googleMapsApiKey={mapsApiKey}>
    <Router>
      <RouteWithNavBar />
      <Switch>
        <Route path="/" exact>
          <ProtectedRoute component={Home} />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/my-comments" exact>
          <ProtectedRoute component={MyComments} />
        </Route>
        <Route path="/my-locations" exact>
          <ProtectedRoute component={MyLocations} />
        </Route>
      </Switch>
    </Router>
    </LoadScript>
  );
}

export default App;
