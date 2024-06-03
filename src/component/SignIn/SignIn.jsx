/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import KNBALogo from "../../assets/img/KNBALogo.webp";
import { useState, useEffect } from "react";
import { useMapData } from "../../context/MapDataContext";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MuiAlert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import Snackbar from "@mui/material/Snackbar";
import {
  styled,
  Box,
  ButtonBase,
  Button,
  Typography,
  FormControl,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
const StyledBox = styled(Box)(({ theme, changestylesignin }) => {
  return {
    position: "absolute",
    transition: "all 0.225s",
    zIndex: 100,
    bottom: 120,
    right: changestylesignin ? 390 : 8,
  };
});
const SignButton = styled(ButtonBase)(({ theme }) => {
  return {
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: "rgba(0,0,0,0.3)",
    color: theme.palette.common.white,
    border: `4px solid ${theme.palette.common.white}`,
    width: 50,
    alignItems: "center",
    padding: 5,
    borderRadius: 15,
    gap: 5,
    overflow: "hidden",
    transition: "border 0.5s ease, width 0.5s ease, justify-content 0.5s ease",
    "& .IconAnimation": {
      fontWeight: theme.typography.fontWeightMedium,
      position: "relative",
      right: 0,
      transition: "right 0.5s ease",
    },
    "& .SignTextAnimation": {
      margin: 0,
      position: "absolute",
      opacity: 0,
      right: -30,
      transition: "opacity 0.5s ease, right 0.7s ease",
    },
    "&:hover": {
      border: `4px solid ${theme.palette.primary.light}`,
      width: 100,
      "& .SignTextAnimation": {
        margin: 0,
        opacity: 1,
        right: 15,
      },
      "& .IconAnimation": {
        right: 30,
      },
    },
  };
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SignIn = ({ changeStyleSignIn }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticating, signOutUser, signInUser } = useMapData();
  const [passwordError, setPasswordError] = useState(false);
  const [emilError, setEmailError] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkBoxvalue, setCheckBoxvalue] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenForm = () => {
    setOpenForm(true);
  };
  const handleCloseForm = () => {
    setOpenForm(false);
    setEmail("");
    setPassword("");
  };
  const validateInputValues = async (email, password) => {
    if (email === "" || !email.includes("@") || email.trim() == "") {
      setEmailError(true);
    } else if (password === "") {
      setPasswordError(true);
    } else {
      setDisableButton(true);
      setIsLoading(true);
      setEmailError(false);
      setPasswordError(false);
      const result = await signInUser(email, password, checkBoxvalue);
      if (result == true) {
        setSuccess("success");
        setDisableButton(false);
        setIsLoading(false);
        handlerOpenAlert();
        handleCloseForm();
      } else {
        setSuccess("error");
        setDisableButton(false);
        setIsLoading(false);
        handlerOpenAlert();
        handleCloseForm();
      }
    }
  };

  const handlerOpenAlert = () => {
    setOpenAlert(true);
  };
  const handlerCloseAlert = () => {
    setOpenAlert(false);
  };
  const signText = isAuthenticating ? "Sign out" : "Sign in";
  const dialogContentText = isAuthenticating
    ? "You are about to sign out. Are you sure?"
    : "You are currently not signed in. You can still view the map, but you will need to sign in to access administrative features.";
  return (
    <>
      <StyledBox
        changestylesignin={
          changeStyleSignIn ? changeStyleSignIn.toString() : undefined
        }
      >
        <SignButton
          onClick={() => {
            handleClickOpen();
          }}
        >
          <AccountCircleIcon className="IconAnimation" />
          <p className="SignTextAnimation">{signText}</p>
        </SignButton>
      </StyledBox>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Box sx={{ width: "100%", height: 50, paddingBottom: 2 }}>
            <img
              src={KNBALogo}
              alt="KNBA logo"
              style={{ width: "auto", height: "100%" }}
            />
          </Box>
          <Typography gutterBottom>{dialogContentText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              if (signText === "Sign out") {
                setSuccess("info");
                handlerOpenAlert();
                signOutUser();
              } else if (signText === "Sign in") {
                handleOpenForm();
              }
            }}
          >
            {signText}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openForm}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          if (isLoading === false) {
            handleCloseForm();
          }
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Box sx={{ width: "400px", height: 50, paddingBottom: 2 }}>
            <img
              src={KNBALogo}
              alt="KNBA logo"
              style={{ width: "auto", height: "100%" }}
            />
          </Box>
          <Typography gutterBottom>
            Please enter your email and password to log in.
          </Typography>
          <FormControl sx={{ width: "100%" }}>
            <TextField
              error={emilError}
              autoFocus
              required
              helperText={emilError ? "Invalid email value" : null}
              margin="dense"
              id="email"
              autoComplete="off"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={(ev) => {
                setEmail(ev.target.value);
              }}
            />
            <TextField
              error={passwordError}
              required
              helperText={passwordError ? "Invalid password value" : null}
              margin="dense"
              id="password"
              autoComplete="off"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
            />
            <FormControlLabel
              name="checkBoxvalue"
              value={checkBoxvalue}
              onChange={(ev) => {
                setCheckBoxvalue(ev.target.checked);
              }}
              control={<Checkbox />}
              label="Remember me"
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Box>
            <Button
              disabled={disableButton}
              color="error"
              onClick={() => {
                handleCloseForm();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={disableButton}
              onClick={() => {
                validateInputValues(email, password);
              }}
            >
              Submit
            </Button>
          </Box>
          <Box sx={{ width: "100%" }}>
            {isLoading ? <LinearProgress /> : null}
          </Box>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={handlerCloseAlert}
      >
        <Alert
          onClose={handlerCloseAlert}
          severity={
            success == "success"
              ? "success"
              : success == "error"
              ? "error"
              : success == "info"
              ? "info"
              : null
          }
          sx={{ width: "100%" }}
        >
          {success == "success"
            ? "You successfully logged in"
            : success == "error"
            ? "Invalid credentials"
            : success == "info"
            ? "You are logged out"
            : null}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SignIn;
