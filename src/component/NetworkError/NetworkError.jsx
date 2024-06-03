import { useMapData } from "../../context/MapDataContext";
// import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SlowIcon from "../../assets/img/slowIcon.webp";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import React, { useEffect } from "react";
import Button from "@mui/material/Button";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const NetworkError = () => {
  const { networkError } = useMapData();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (networkError) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [networkError]);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      keepMounted
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">
        {"Slow Internet Connection"}
      </DialogTitle>
      <DialogContent sx={{ width: 250 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            paddingBottom: "20px",
            width: "100%",
            height: "70px",
          }}
        >
          <img
            src={SlowIcon}
            style={{ width: "70px", height: "300" }}
            alt="Slow connection Icon"
          />
        </div>
        <DialogContentText id="alert-dialog-slide-description">
          It seems like your internet connection is slow. Please consider trying
          again later or reloading the page.
        </DialogContentText>
        <Stack
          spacing={3}
          direction="row"
          sx={{ justifyContent: "center", marginTop: 2 }}
        >
          <Button
            variant="contained"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
export default NetworkError;
