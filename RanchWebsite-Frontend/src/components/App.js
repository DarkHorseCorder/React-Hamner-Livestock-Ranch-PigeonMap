import { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "../styles/app.scss";
import LoginContainer from "./routing/LoginContainer";
import DefaultContainer from "./routing/DefaultContainer";
import solidIcons from "../util/fontawesome-icons/solidIcons";
import brandIcons from "../util/fontawesome-icons/brandIcons";
import Navbar from "./navigation/Header";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Trailer from "./pages/Trailer";
// import MapContainer from "../util/map/map";
import HeroMap from "../util/map/heromap";
// import SignupPage from "./pages/signup/signupPage";

solidIcons();
brandIcons();

function App() {
  const [authToken, setAuthToken] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Switch>
          {/* <Route path="/register" component={SignupPage} /> */}
          <Route path="/home" component={Home} />
          <Route path="/about_us" component={AboutUs} />
          <Route path="/trailer" component={Trailer} />
          <Route path="/map" component={HeroMap} />
          <Route
            path="/login"
            render={(routeProps) => {
              return (
                <LoginContainer
                  {...routeProps}
                  authToken={authToken}
                  setAuthToken={setAuthToken}
                />
              );
            }}
          />

          <Redirect exact from="/" to="/home" />

          <Route
            render={(routeProps) => (
              <DefaultContainer
                {...routeProps}
                authToken={authToken}
                setAuthToken={setAuthToken}
              />
            )}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

{
  /* 
 import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./components/navheadfoot/NavBar";
import NavBar from "./navigation/Header";
import LoginContainer from "./routing/LoginContainer";
 import DefaultContainer from "./routing/DefaultContainer";
 import UserProvider from "./routing/UserProvider";
 import roleSelect from "./routing/UserProvider";
 function App() { */
}
//   return (
//     <div className="App">
//       <Router>
//         <UserProvider>
//           <NavBar />

//           <Route path="/" component={LoginContainer} />

//           <roleSelect withRedirect>
//             <Route path="/" component={DefaultContainer} />
//           </roleSelect>

//           {/* <Footer /> */}
//         </UserProvider>
//       </Router>
//     </div>
//   );
// }

// export default App;
