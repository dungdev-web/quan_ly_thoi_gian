import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Fade,
  Zoom,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  PersonAddOutlined,
  CheckCircle,
  Cancel,
  ArrowForward,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { validateRegister } from "../validators/registerValidator";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "error";
    if (passwordStrength < 70) return "warning";
    return "success";
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateRegister(email, password, confirmPassword);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await registerUser(email, password);

      if (res?.success === false) {
        setServerError(res.error || "Register failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setServerError("Server error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="sm">
        <Zoom in timeout={500}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            {/* Header Section with Gradient */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 4,
                textAlign: "center",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                },
              }}
            >
              <Fade in timeout={800}>
                <Box>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <PersonAddOutlined sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="white"
                    gutterBottom
                    sx={{ letterSpacing: "-0.5px" }}
                  >
                    Create Account 🚀
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}
                  >
                    Join us and start your journey today
                  </Typography>
                </Box>
              </Fade>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4, pt: 5 }}>
              <Fade in timeout={1000}>
                <Box>
                  {serverError && (
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        "& .MuiAlert-icon": {
                          fontSize: 24,
                        },
                      }}
                    >
                      {serverError}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlined sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "rgba(102, 126, 234, 0.03)",
                          transition: "all 0.3s",
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.06)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                          },
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      margin="normal"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: "primary.main" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "rgba(102, 126, 234, 0.03)",
                          transition: "all 0.3s",
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.06)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                          },
                        },
                      }}
                    />

                    {/* Password Strength Indicator */}
                    {password && (
                      <Box sx={{ mt: 1, mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Password Strength
                          </Typography>
                          <Chip
                            label={getStrengthLabel()}
                            size="small"
                            color={getStrengthColor()}
                            sx={{ height: 20, fontSize: 11, fontWeight: 600 }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrength}
                          color={getStrengthColor()}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "rgba(0,0,0,0.08)",
                          }}
                        />
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label="Confirm Password"
                      margin="normal"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {confirmPassword &&
                            password === confirmPassword ? (
                              <CheckCircle sx={{ color: "success.main" }} />
                            ) : confirmPassword ? (
                              <Cancel sx={{ color: "error.main" }} />
                            ) : (
                              <LockOutlined sx={{ color: "text.disabled" }} />
                            )}
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirm(!showConfirm)}
                              edge="end"
                              sx={{
                                "&:hover": {
                                  color: "primary.main",
                                },
                              }}
                            >
                              {showConfirm ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "rgba(102, 126, 234, 0.03)",
                          transition: "all 0.3s",
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.06)",
                          },
                          "&.Mui-focused": {
                            backgroundColor: "white",
                          },
                        },
                      }}
                    />

                    {/* Password Requirements */}
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(102, 126, 234, 0.05)",
                        border: "1px solid rgba(102, 126, 234, 0.1)",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={600}
                        display="block"
                        mb={1}
                      >
                        Password must contain:
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: password.length >= 6 ? "success.main" : "text.secondary",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {password.length >= 6 ? "✓" : "○"} At least 6 characters
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              /[a-z]/.test(password) && /[A-Z]/.test(password)
                                ? "success.main"
                                : "text.secondary",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {/[a-z]/.test(password) && /[A-Z]/.test(password)
                            ? "✓"
                            : "○"}{" "}
                          Upper & lowercase letters
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: /[0-9]/.test(password)
                              ? "success.main"
                              : "text.secondary",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {/[0-9]/.test(password) ? "✓" : "○"} At least one number
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={loading}
                      endIcon={!loading && <ArrowForward />}
                      sx={{
                        mt: 3,
                        height: 54,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none",
                        fontSize: 16,
                        fontWeight: 600,
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                        transition: "all 0.3s",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5568d3 0%, #6a3f92 100%)",
                          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
                          transform: "translateY(-2px)",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                        },
                        "&.Mui-disabled": {
                          background: "#e0e0e0",
                          color: "#9e9e9e",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    <Typography
                      textAlign="center"
                      mt={4}
                      color="text.secondary"
                      variant="body2"
                    >
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          color: "#667eea",
                          textDecoration: "none",
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                      >
                        Sign In
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Box>

            {/* Footer Accent */}
            <Box
              sx={{
                height: 6,
                background:
                  "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
              }}
            />
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}