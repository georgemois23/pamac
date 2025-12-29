import { Box, Button, InputBase, Typography } from "@mui/material";
import { useState } from "react";
import api from "../api/axios";
import { useSnackbar } from "../context/SnackbarContext";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from '../Polyvox.svg';

const ForgotPassword = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const { username: initialUsername } = location.state || {};
  const [username, setUsername] = useState(initialUsername || "");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  document.title = "Forgot Password";
  const size = 250;
  const [validEmail, setValidEmail] = useState(false);
  const [whyButDisabled, setWhyButDisabled] = useState("");

  const handleEmailChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9._%+-@.-]/g, '');
    setEmail(value);

    if (value === "") {
      setValidEmail(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setValidEmail(false);
      setWhyButDisabled("Invalid email format");
      return;
    }

    setValidEmail(true);
    setWhyButDisabled("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar({
        message: "Please enter a valid email address.",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { username, email });
      showSnackbar({
        message: "If your credentials match, you will receive a reset email.",
        severity: "info",
      });
      setUsername("");
      setEmail("");
      navigate('/auth/login');
    } catch (error) {
      console.error("Forgot password error", error);
      showSnackbar({
        message: "Failed to send reset email",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
      p={{ xs: 2, sm: 4 }}
      mt={12}
      minHeight="70vh"
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", textAlign: "center", fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" } }}
      >
        Forgot Password
      </Typography>

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          maxWidth: { xs: "90%", sm: "400px" },
          fontSize: { xs: "0.85rem", sm: "0.9rem" },
        }}
      >
        Enter your username and email. If they match our records, we'll email you instructions to reset your password.
      </Typography>

      {/* Username Input */}
      <Box
        sx={{
          width: { xs: "70%", sm: "300px" },
          border: "2px solid #a4c2f4",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          px: 2,
          minHeight: "45px",
        }}
      >
        <InputBase
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          fullWidth
          sx={{ textAlign: "center", fontSize: { xs: "0.9rem", sm: "1rem" } }}
        />
      </Box>

      {/* Email Input */}
      <Box
        sx={{
          width: { xs: "70%", sm: "300px" },
          border: "2px solid #a4c2f4",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          px: 2,
          minHeight: "45px",
        }}
      >
        <InputBase
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          fullWidth
          sx={{ textAlign: "center", fontSize: { xs: "0.9rem", sm: "1rem" } }}
        />
      </Box>
      <Typography variant="body2" color="error">{whyButDisabled}</Typography>

      <Button
        variant="outlined"
        onClick={handleSubmit}
        disabled={!username || !email || !validEmail}
        sx={{
          width: 'fit-content',
          borderRadius: "10px",
          py: 1,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
      >
        Send Email
      </Button>
       <Logo
        style={{
          width: size * 0.6,
          height: size * 0.6,
          position: 'absolute',
          top: '-5%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '20px',
        }}
        onClick={() => navigate('/auth')}
      />
    </Box>
  );
};

export default ForgotPassword;
