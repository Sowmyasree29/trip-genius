import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import Header from "./components/ui/custom/Header.jsx";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ViewTrip from "./ViewTrip/[tripId]/ViewTrip.jsx";
import MyTrip from "./my-trips/MyTrip.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_AUTH_ID}>
   
      <BrowserRouter>
      <Header />
      <Toaster />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/createTrip" element={<CreateTrip />} />
          <Route path="/viewTrip/:tripId" element={<ViewTrip />} />
          <Route path="/mytrip" element={<MyTrip/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
