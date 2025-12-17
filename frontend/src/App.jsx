import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { DocumentProvider } from "./context/DocumentContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DocumentProvider>
          <Router />
        </DocumentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
