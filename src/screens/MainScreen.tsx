
import { CssBaseline, Grid } from "@mui/material";
import { useContext } from "react";
import { ChatComponent } from "../components/ChatComponent";
import { AuthComponent } from "../components/LoginComponent";
import { AuthContext } from "../providers/AuthProvider";

export const MainScreen = () => {
  const authContext = useContext(AuthContext);

  return <Grid
    container
    style={{ background: '#f4f5f5' }}
    sx={{ minHeight: '100vh' }}
    alignItems="center"
    justifyContent="center"
    spacing={0} >
    <CssBaseline />
    {authContext.state.isAuth ? <ChatComponent /> : <AuthComponent />}
  </Grid>
}
