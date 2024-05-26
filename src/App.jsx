import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import RoutesList from "./routes-nav/RoutesList";
import LoadingSpinner from "./components/LoadingSpinner";
import JoblyApi from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

export const TOKEN_STORAGE_ID = "jobly-token"

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      if(token) {
        try{
          let { username } = jwt.decode(token);
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setApplicationIds(new Set(currentUser.applications));
        } catch(err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  // Handle site-wide signup.
  async function signup(signupData) {
    try{
      let token = await JoblyApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch(errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  // Handle site-wide login
  async function login(loginData) {
    try{
      let token = await JoblyApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch(errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }
  /** Checks if a job has been applied for. */
  function hasAppliedToJob(id) {
    return applicationIds.has(id);
  }

  /** Apply to a job: make API call and update set of application IDs. */
  function applyToJob(id) {
    if (hasAppliedToJob(id)) return;
    JoblyApi.applyToJob(currentUser.username, id);
    setApplicationIds(new Set([...applicationIds, id]));
  }

  // if no info loaded, render LoadingSpinner
  if (!infoLoaded) return <LoadingSpinner />;
  
  return (
    <BrowserRouter>
      <UserContext.Provider
          value={{ currentUser, setCurrentUser, hasAppliedToJob, applyToJob}}>
        <div className="App">
          <Navigation logout={logout} />
          <RoutesList login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
