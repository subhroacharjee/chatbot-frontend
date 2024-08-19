import { Avatar, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { AccountCircleRounded } from "@mui/icons-material";
import { ApiClientContext } from "../providers/ApiClientProvider";
import { UserApi } from "../api/UserApi";
import { AuthContext } from "../providers/AuthProvider";
import { ScreenItem } from "./ScreenItem";

enum AuthType {
  LOGIN,
  SIGNUP
}


export const AuthComponent = () => {
  const [authType, setAuthType] = useState(AuthType.LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiClient = useContext(ApiClientContext);
  const userAuthContext = useContext(AuthContext);
  const userApis = new UserApi(apiClient);


  const toggleAuthType = () => {
    const nextAuthType = authType === AuthType.LOGIN ? AuthType.SIGNUP : AuthType.LOGIN;
    setAuthType(nextAuthType);
  }

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      if (!username || username.trim().length === 0) {
        setUsernameError('Username is required');
        setTimeout(() => {
          setUsernameError(null);
        }, 3 * 1000);

        return;
      }

      // set you password as 8 spaces and i will allow it XD;
      if (!password || password.length === 0) {
        setPasswordError('Password is required');
        setTimeout(() => {
          setPasswordError(null);
        }, 3 * 1000);

        return;
      }


      const authResult = await (authType === AuthType.LOGIN ? userApis.login(username, password) : userApis.signup(username, password));
      if (authResult.isOk()) {
        const { accessToken, username } = authResult.unwrap();
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('username', username);

        userAuthContext.action({
          isAuth: true,
          token: accessToken,
        });
      } else {
        const err = authResult.unwrapErr();
        if (err.status === 400) {
          alert('Please check the input');
        } else {
          console.log(err);
          alert('Something went wrong please try again');
        }
      }
    } catch (error) {
      alert('Something went wrong');
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <ScreenItem>
      <Box display={'flex'} flexDirection='column' alignItems={'center'}>
        <Avatar>
          <AccountCircleRounded />
        </Avatar>
        <Typography component={'h1'} variant='h5'>
          {authType === AuthType.LOGIN ? 'Login' : 'Signup'}
        </Typography>
      </Box>


      <TextField
        required
        error={!!usernameError}
        label="Username"
        variant="outlined"
        fullWidth
        margin="dense"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        helperText={usernameError}
      />

      <TextField
        required
        error={!!passwordError}
        label="Password"
        variant="outlined"
        fullWidth
        margin="dense"
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        helperText={passwordError}
      />

      <Button variant="outlined" color="primary" fullWidth style={{ marginTop: '10px' }} onClick={handleAuth} disabled={isLoading}>{authType === AuthType.LOGIN ? 'Login' : 'Signup'}</Button>
      <Grid container>
        <Grid item >
          <Typography component={'text'} variant='caption' onClick={toggleAuthType} color='primary'>
            {authType === AuthType.LOGIN ? 'Dont have an account? Signup' : 'Already have an account? Login'}
          </Typography>
          {/* <Button variant="text" color="primary" fullWidth onClick={toggleAuthType}> */}
          {/**/}
          {/* </Button> */}
        </Grid>
      </Grid>

    </ScreenItem>
  );
}
