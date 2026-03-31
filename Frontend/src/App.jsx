import "./App.css";
import "./styles/signin.css";
import Header from "./components/header.jsx";
import Footer from "./components/footer.jsx";
import Body from "./components/body.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@asgardeo/react'


function App() {
  return (
    <>
      <SignedIn>
        <div>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Body />} />
            </Routes>
            <Footer />
          </Router>
          <br></br>
          <SignOutButton />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="signin-container">
          <Header />
          <div className="signin-content">
            <div className="signin-wrapper">
              <h1 className="signin-title">
                Welcome to the Puppy Adoption Agency
              </h1>
              <p className="signin-subtitle">
                Sign in to manage and adopt puppies
              </p>
              <SignInButton className="signin-button" />
            </div>
          </div>
          <Footer />
        </div>
      </SignedOut>
    </>
  );
}

export default App;
