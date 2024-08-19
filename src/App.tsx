import { createTheme, ThemeProvider } from '@mui/material';
import { ApiClientContextProvider } from './providers/ApiClientProvider';
import { AuthContextProvider } from './providers/AuthProvider';
import { MainScreen } from './screens/MainScreen';

const theme = createTheme({
  palette: {
    background: {
      paper: '#ffffff'
    }
  },
});

function App() {
  return (<ThemeProvider theme={theme}>
    <ApiClientContextProvider>
      <AuthContextProvider>
        <MainScreen />
      </AuthContextProvider>
    </ApiClientContextProvider>
  </ThemeProvider>);
}

export default App;
