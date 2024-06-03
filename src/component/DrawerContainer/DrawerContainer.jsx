/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import KNBALogo from "../../assets/img/KNBALogo.webp";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import styled from "@emotion/styled";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useDropzone } from "react-dropzone";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PlaceIcon from "@mui/icons-material/Place";
import MuiAlert from "@mui/material/Alert";
import LanguageIcon from "@mui/icons-material/Language";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import GroupsIcon from "@mui/icons-material/Groups";
import Tooltip from "@mui/material/Tooltip";
import { useMapData } from "../../context/MapDataContext";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useCallback, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

const StyleDivImageContainer = styled("div")(({ theme }) => {
  return {
    zIndex: 1000,
    display: "flex",
    padding: 10,
    backgroundColor: "rgb(229,232,232)",
    width: "-webkit-fill-available",
    position: "fixed",
    justifyContent: "space-between",
    alignItems: "center",
    ".KNBALogoContainer": {
      width: "100%",
      height: 50,
      img: {
        width: "auto",
        height: "100%",
      },
    },
  };
});
const StyledImageCompany = styled("img")(({ theme }) => {
  return {
    objectFit: "contain",
    width: "inherit",
    height: 75,
    borderRadius: 10,
  };
});
const StyledDivEllipsisContainer = styled("div")(({ theme }) => {
  return {
    maxWidth: 325,
    display: "flex",
    borderRadius: 10,
    padding: 5,
    backgroundColor: theme.palette.common.white,
    flexDirection: "column",
    alignItems: "center",
    "&:hover": {
      boxShadow: "0px 6px 15px 5px rgba(0,0,0,0.15)",
    },
    width: "inherit",
    gap: 1,
    transition: "all 0.225s ease-in-out",
    border: `2px solid ${theme.palette.common.white}`,
  };
});
const StyledBoxDropZone = styled(Box)(({ theme }) => {
  return {
    width: 300,
    height: 300,
    padding: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    color: theme.palette.primary.main,
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: 10,
    "& .errorImage": {
      color: theme.palette.error.main,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 18,
    },
    "& svg": {
      fontSize: 125,
    },
    "& p": {
      fontSize: 17,
      fontWeight: theme.typography.fontWeightRegular,
      textAlign: "center",
      margin: 10,
    },
    "&:hover": {
      cursor: "pointer",
    },
  };
});

export default function DrawerContainer({
  open,
  handleDrawerClose,
  clusters,
  mapRef,
  setPopUpData,
  setShowPopup,
}) {
  const {
    userRole,
    updateImageCompany,
    deleteImageFromStorageProvider,
    companyData,
  } = useMapData();
  const [companyID, setCompanyID] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorImage, setImagError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const handlerOpenDialog = () => {
    setOpenDialog(true);
  };
  const handlerOpenAlert = () => {
    setOpenAlert(true);
    handlerCloseDialog();
  };
  const handlerCloseAlert = () => {
    setOpenAlert(false);
  };
  const handlerCloseDialog = () => {
    setOpenDialog(false);
    setImagError(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const onDrop = useCallback(
    async (acceptedFiles) => {
      setImagError(false);
      handleDrawerClose();
      const maxSize = 9000000;
      const fileType = ["image/jpeg", "image/png"];
      if (
        acceptedFiles[0].size < maxSize &&
        fileType.includes(acceptedFiles[0].type)
      ) {
        setLoading(true);
        let response = false;
        const company = companyData.find((item) => item.docId == companyID);
        if (company.Image == null) {
          const responseData = await updateImageCompany(
            companyID,
            acceptedFiles[0]
          );
          response = responseData;
        }
        if (company.Image != null) {
          const responseData = await deleteImageFromStorageProvider(
            companyID,
            company.Image
          );
          if (responseData == true) {
            const responseData = await updateImageCompany(
              companyID,
              acceptedFiles[0]
            );
            response = responseData;
          }
        }
        if (response == true) {
          setLoading(false);
          handlerOpenAlert();
        } else {
          setImagError(true);
        }
      } else {
        setImagError(true);
      }
    },
    [
      companyData,
      companyID,
      deleteImageFromStorageProvider,
      handleDrawerClose,
      handlerOpenAlert,
      updateImageCompany,
    ]
  );
  const disabledFunction = (item) => {
    let response = false;
    if (item == null || item == undefined || item == "N/A") {
      response = true;
    }
    return response;
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        open={open}
        sx={{
          width: 100,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 375,
            boxSizing: "border-box",
            backgroundColor: "rgb(229,232,232)",
          },
        }}
      >
        <StyleDivImageContainer>
          <div className="KNBALogoContainer">
            <img src={KNBALogo} alt="KNBA logo" />
          </div>
          <div>
            <IconButton onClick={handleDrawerClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </div>
        </StyleDivImageContainer>
        <Grid
          container
          direction="column"
          alignContent="center"
          sx={{
            marginTop: 12,
            marginBottom: 5,
            gap: 2,
          }}
        >
          {clusters.map((cluster) => {
            return (
              <StyledDivEllipsisContainer key={cluster.properties.docId}>
                <StyledImageCompany src={cluster.properties.Image} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {cluster.properties.CompanyName}
                  </Typography>
                  <Typography className="ellipsis-text" variant="body2">
                    {cluster.properties.CompanyDescription
                      ? cluster.properties.CompanyDescription
                      : "No description available"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <GroupsIcon sx={{ fontSize: 15 }} />
                    <Typography
                      className="ellipsis-text"
                      variant="caption"
                      color="text.secondary"
                    >
                      {cluster.properties.IndustrialSector
                        ? cluster.properties.IndustrialSector
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalPhoneIcon sx={{ fontSize: 15 }} />
                    <Typography
                      className="ellipsis-text"
                      variant="caption"
                      color="text.secondary"
                    >
                      {cluster.properties.PhoneNumber
                        ? cluster.properties.PhoneNumber
                        : "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PlaceIcon sx={{ fontSize: 15 }} />
                    <Typography
                      className="ellipsis-text"
                      variant="caption"
                      color="text.secondary"
                    >
                      {cluster.properties.Addresses}
                    </Typography>
                  </Box>

                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    {userRole == "admin" || userRole == "editor" ? (
                      <Tooltip title="Update image">
                        <Button
                          aria-label="Update image"
                          variant="text"
                          size="large"
                          startIcon={<AddPhotoAlternateIcon />}
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            setCompanyID(cluster.properties.docId);
                            handlerOpenDialog();
                          }}
                        >
                          Update
                        </Button>
                      </Tooltip>
                    ) : null}
                    <Tooltip title="Find on map">
                      <Button
                        aria-label="Find on map"
                        variant="text"
                        size="large"
                        startIcon={<PlaceIcon />}
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          mapRef.current.easeTo({
                            center: [
                              cluster.properties.longitude,
                              cluster.properties.latitude,
                            ],
                            zoom: 18,
                            duration: 500,
                          });
                          setPopUpData({
                            cluster: [cluster],
                            longitude: parseFloat(cluster.properties.longitude),
                            latitude: parseFloat(cluster.properties.latitude),
                          });
                          setShowPopup(true);
                        }}
                      >
                        Find
                      </Button>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <IconButton
                        disabled={disabledFunction(cluster.properties.Linkedin)}
                        aria-label="LinkedIn"
                        color="primary"
                        href={cluster.properties.Linkedin}
                        target="_blank"
                        rel="noopener"
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Website">
                      <IconButton
                        disabled={disabledFunction(cluster.properties.Website)}
                        aria-label="Website"
                        color="primary"
                        href={cluster.properties.Website}
                        target="_blank"
                        rel="noopener"
                      >
                        <LanguageIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </StyledDivEllipsisContainer>
            );
          })}
        </Grid>
      </Drawer>
      <Dialog open={openDialog} onClose={handlerCloseDialog}>
        <DialogContent>
          <StyledBoxDropZone {...getRootProps()}>
            <span {...getInputProps()} />
            <p className="errorImage">
              {errorImage == true
                ? `Invalid file format or file is too large`
                : " "}
            </p>
            <p>Only .jpeg and .png images are supported</p>
            <AddPhotoAlternateIcon sx={{ fontSize: 50 }} />
            <p>This action will replace the current image, if any</p>
          </StyledBoxDropZone>
        </DialogContent>
        {loading == true ? <LinearProgress /> : null}
      </Dialog>
      <Snackbar
        autoHideDuration={2000}
        onClose={handlerCloseAlert}
        open={openAlert}
      >
        <Alert
          onClose={handlerCloseAlert}
          severity={"info"}
          sx={{ width: "100%" }}
        >
          Image updated successfully, refresh the page to see the changes
        </Alert>
      </Snackbar>
    </>
  );
}
