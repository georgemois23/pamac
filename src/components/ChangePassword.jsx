import { Box, Button, InputBase, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from "../api/axios";
import { useSnackbar } from "../context/SnackbarContext";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingSpinner from "./LoadingSpinner";
import { ReactComponent as Logo } from '../Polyvox.svg';

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { showSnackbar } = useSnackbar();
  const [valid, setValid] = useState(false);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  document.title = "Reset Password";
  const size = window.screen.width > 750 ? 350 : 250;

  useEffect(() => {
    if (!token) {
      showSnackbar({ message: 'No token provided', severity: 'error' });
      navigate('/');
      return;
    }

    api.get(`/auth/verify-reset-token?token=${token}`)
      .then(() => setValid(true))
      .catch(() => {
        showSnackbar({ message: 'Invalid or expired token', severity: 'error' });
        navigate('/auth/login');
      });
  }, [token, navigate, showSnackbar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showSnackbar({ message: 'Fill both fields', severity: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      showSnackbar({ message: 'Passwords do not match', severity: 'error' });
      return;
    }

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      showSnackbar({ message: 'Password changed successfully', severity: 'success' });
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (error) {
      console.error("Error resetting password", error);
      showSnackbar({ message: 'Password change failed', severity: 'error' });
    }
  };

  const autofillStyle = {
    "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active": {
      transition: "background-color 5000s ease-in-out 0s",
      WebkitBoxShadow: "0 0 0 1000px #001f3f inset !important",
      WebkitTextFillColor: "#a4c2f4 !important",
      backgroundClip: "content-box !important",
      border: "none !important",
      outline: "none !important",
    }
  };

  if (!valid) return <LoadingSpinner />;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
      padding={4}
      minHeight="70vh"
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Reset Password
        </Typography>

        <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: 400, pt: 1 }}>
          Please enter your new password below.
        </Typography>
      </Box>

      {/* PASSWORD */}
      <Box
        sx={{
          width: { sm: "80%", md: "300px" },
          border: "2px solid #a4c2f4",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          px: 2,
          position: "relative", // Ensure relative positioning for the absolute icon
        }}
      >
        <InputBase
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          maxLength={12}
          fullWidth
          autoComplete="new-password"
          sx={{
            "& .MuiInputBase-input": {
              textAlign: "center",
              padding: "12px 0", // CRITICAL: This forces the text height to be consistent
              ...autofillStyle
            }
          }}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%", // FIX: Changed from 60% to 50% to perfectly center it
            transform: "translateY(-50%)",
            cursor: "pointer",
            display: password ? "flex" : "none",
            alignItems: "center",
            color: "#a4c2f4"
          }}
        >
          {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
        </span>
      </Box>

      {/* CONFIRM PASSWORD */}
      <Box
        sx={{
          width: { sm: "80%", md: "300px" },
          border: "2px solid #a4c2f4",
          borderRadius: "15px",
          display: "flex",
          alignItems: "center",
          px: 2,
          position: "relative",
        }}
      >
        <InputBase
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          maxLength={12}
          fullWidth
          autoComplete="new-password"
          sx={{
            "& .MuiInputBase-input": {
              textAlign: "center",
              padding: "12px 0", // CRITICAL: Added symmetric padding here too
              ...autofillStyle
            }
          }}
        />
        <span
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%", // FIX: Changed from 60% to 50%
            transform: "translateY(-50%)",
            cursor: "pointer",
            display: confirmPassword ? "flex" : "none",
            alignItems: "center",
            color: "#a4c2f4"
          }}
        >
          {showConfirmPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
        </span>
      </Box>
      <Button
        variant="outlined"
        onClick={handleSubmit}
        disabled={!password || !confirmPassword || password !== confirmPassword}
        sx={{ borderRadius: "10px", padding: "8px 0", width: 'fit-content', minWidth: "150px" }}
      >
        Submit
      </Button>
      <Logo
        style={{
          width: size * 0.6,
          height: size * 0.6,
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '20px',
        }}
        onClick={() => navigate('/auth')}
      />
    </Box>
  );
};

export default ChangePassword;