
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CaseProvider } from './contexts/CaseContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Cases from './pages/Cases';
import CaseWorkspace from './pages/CaseWorkspace';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Index from './pages/Index';
import { useAuth } from './hooks/useAuth';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#cf2e2e',
      dark: '#b02525',
      light: '#da5555',
    },
    secondary: {
      main: '#37474f',
      dark: '#263238',
      light: '#546e7a',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Cairo', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#cf2e2e',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.3s ease',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl',
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CaseProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/documents" element={<Documents />} />
                        <Route path="/cases" element={<Cases />} />
                        <Route path="/cases/:caseId" element={<CaseWorkspace />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </CaseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
