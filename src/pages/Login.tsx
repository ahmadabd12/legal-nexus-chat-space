import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Microsoft } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithAzure } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleAzureLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithAzure();
      navigate("/dashboard");
    } catch (err) {
      setError("فشل تسجيل الدخول بـ Azure AD. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src="https://www.moci.gov.qa/wp-content/themes/2018_mec_v1/assets/images/logo-main.svg"
              alt="قطر"
              style={{ width: 200, height: 45, marginBottom: 16 }}
            />
            <Typography
              component="h1"
              variant="h4"
              color="primary"
              fontWeight="bold"
            >
              منصة البحث القانوني
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              وزارة التجارة والصناعة - دولة قطر
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              سجل دخولك إلى حسابك
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            // startIcon={<Microsoft />}
            startIcon={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft"
                style={{ width: 20, height: 20 }}
              />
            }
            onClick={handleAzureLogin}
            disabled={loading}
            sx={{ mb: 2, py: 1.5, flexDirection: "row-reverse" }}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              "تسجيل الدخول بـ Microsoft"
            )}
          </Button>

          <Divider sx={{ my: 2 }}>أو</Divider>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : "تسجيل الدخول"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
