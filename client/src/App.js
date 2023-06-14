import { BrowserRouter, Navigate, Routes, Route} from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import ChatPage from "scenes/chatPage/ChatPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ToolPage from "scenes/toolPage";
import ToolDetailPage from "scenes/toolDetailsPage";

import GitHubRegistrationForm from "./scenes/loginPage/GitHubRegistrationForm";
import HandleLogin from "./scenes/controller/handlelogin";
function App() {
  const mode = useSelector((state) => state.auth?.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.auth?.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/tool"
              element={isAuth ? <ToolPage /> : <Navigate to="/" />}
            />
            <Route
              path="/tool/:id"
              element={isAuth ? <ToolDetailPage /> : <Navigate to="/" />}
            />
            <Route
                   path="/login"
                element={<HandleLogin />}
                />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            {/* // Render the GitHubRegistrationForm component */}
            <Route
                path="/register/github"
                element={<GitHubRegistrationForm />}  />
            <Route
                path="/chat"
              element={isAuth ? <ChatPage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
