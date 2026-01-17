import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
  Container,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { validateLogin } from "../validators/loginValidator";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const validationErrors = validateLogin(email, password);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await loginUser(email, password);

      if (res.success) {
        setAuth(true);
        navigate("/home");
      } else {
        setServerError(res.error || "Login failed!");
      }
    } catch (err) {
      setServerError("Server error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                p: 1,
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
                    <LockOutlined sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color="white"
                    gutterBottom
                    sx={{ letterSpacing: "-0.5px" }}
                  >
                    Welcome Back! 👋
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.9)", fontSize: 15 }}
                  >
                    Sign in to continue your journey
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

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                      mb={3}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            sx={{
                              color: "primary.main",
                              "&.Mui-checked": {
                                color: "primary.main",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.secondary">
                            Remember me
                          </Typography>
                        }
                      />
                      <Link
                        to="/forgot-password"
                        style={{
                          fontSize: 14,
                          color: "#667eea",
                          textDecoration: "none",
                          fontWeight: 500,
                          transition: "all 0.2s",
                        }}
                      >
                        Forgot password?
                      </Link>
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={loading}
                      endIcon={!loading && <ArrowForward />}
                      sx={{
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
                        "Sign In"
                      )}
                    </Button>

                    <Divider sx={{ my: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ px: 2, fontWeight: 500 }}
                      >
                        OR CONTINUE WITH
                      </Typography>
                    </Divider>

                    <Stack direction="row" spacing={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={() => handleSocialLogin("Google")}
                        sx={{
                          borderRadius: 2,
                          height: 48,
                          textTransform: "none",
                          borderColor: "#e0e0e0",
                          color: "text.primary",
                          transition: "all 0.3s",
                          "&:hover": {
                            borderColor: "#667eea",
                            backgroundColor: "rgba(102, 126, 234, 0.04)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                          },
                        }}
                      >
                        Google
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        onClick={() => handleSocialLogin("GitHub")}
                        sx={{
                          borderRadius: 2,
                          height: 48,
                          textTransform: "none",
                          borderColor: "#e0e0e0",
                          color: "text.primary",
                          transition: "all 0.3s",
                          "&:hover": {
                            borderColor: "#667eea",
                            backgroundColor: "rgba(102, 126, 234, 0.04)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                          },
                        }}
                      >
                        GitHub
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FacebookIcon />}
                        onClick={() => handleSocialLogin("Facebook")}
                        sx={{
                          borderRadius: 2,
                          height: 48,
                          textTransform: "none",
                          borderColor: "#e0e0e0",
                          color: "text.primary",
                          transition: "all 0.3s",
                          "&:hover": {
                            borderColor: "#667eea",
                            backgroundColor: "rgba(102, 126, 234, 0.04)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.15)",
                          },
                        }}
                      >
                        Facebook
                      </Button>
                    </Stack>

                    <Typography
                      textAlign="center"
                      mt={4}
                      color="text.secondary"
                      variant="body2"
                    >
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        style={{
                          color: "#667eea",
                          textDecoration: "none",
                          fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                      >
                        Sign Up
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