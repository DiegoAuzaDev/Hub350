/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import KNBALogo from "../../assets/img/KNBALogo.webp";
import styled from "@emotion/styled";
import { useMapData } from "../../context/MapDataContext";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Typography, Button, Stack } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GroupsIcon from "@mui/icons-material/Groups";
import Tooltip from "@mui/material/Tooltip";
const StyleDrawerContainer = styled("span")(({ theme }) => {
  return {
    marginTop: "10px",
    position: "fixed",
    width: "25%",
    height: "5px",
    background: "rgba(0,0,0,0.5)",
    marginLeft: "35%",
    zIndex: 1000,
    borderRadius: "10px",
  };
});
const StyledImageCompany = styled("img")(({ theme }) => {
  return {
    objectFit: "contain",
    width: 80,
    height: 80,
    borderRadius: 10,
  };
});
const StyledDivEllipsisContainer = styled("div")(({ theme }) => {
  return {
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
    backgroundColor: theme.palette.common.white,
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: 20,
    alignItems: "center",
    "&:hover": {
      boxShadow: "0px 6px 15px 5px rgba(0,0,0,0.15)",
    },
    transition: "all 0.225s ease-in-out",
    border: `2px solid ${theme.palette.common.white}`,
  };
});
export default function DrawerContainerBottom({
  open,
  handleDrawerClose,
  clusters,
  mapRef,
}) {
  const [dragState, SetdragState] = useState(false);
  const dragControlStyle = () => {};
  const disabledFunction = (item) => {
    let response = false;
    if (item == null || item == undefined || item == "N/A") {
      response = true;
    }
    return response;
  };
  return (
    <>
      <Drawer
        variant="persistent"
        anchor="bottom"
        open={open}
        sx={{
          width: "100%",
          flexShrink: 0,
          position: "relative",
          "& .MuiDrawer-paper": {
            paddingTop: 2,
            borderTopLeftRadius: "10%",
            borderTopRightRadius: "10%",
            height: "35vh",
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "rgb(229,232,232)",
          },
        }}
      >
        <StyleDrawerContainer
          draggable={true}
          onDragStart={() => {
            handleDrawerClose();
          }}
          onTouchMoveCapture={() => {
            handleDrawerClose();
          }}
          onClick={() => {
            handleDrawerClose();
          }}
        />

        <Box
          sx={{
            paddingLeft: 1.5,
            paddingRight: 1.5,
            paddingTop: 4,
            paddingBottom: 5,
          }}
        >
          {clusters.map((company) => {
            const properties = company.properties;
            return (
              <StyledDivEllipsisContainer key={properties.docId}>
                <StyledImageCompany src={properties.Image} />
                <div>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", paddingBottom: 0.8 }}
                  >
                    {properties.CompanyName}
                  </Typography>

                  <Typography
                    className="ellipsis-text"
                    variant="body2"
                    sx={{ paddingBottom: 0.5, marginBottom: 0.8 }}
                  >
                    {properties.CompanyDescription
                      ? properties.CompanyDescription
                      : "No description available"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      marginBottom: 0.8,
                    }}
                  >
                    <LocalPhoneIcon sx={{ fontSize: 16 }} />
                    <Typography
                      className="ellipsis-text"
                      variant="caption"
                      color="text.secondary"
                    >
                      {properties.PhoneNumber ? properties.PhoneNumber : "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      marginBottom: 0.8,
                    }}
                  >
                    <PlaceIcon sx={{ fontSize: 16 }} />
                    <Typography
                      className="ellipsis-text"
                      variant="caption"
                      color="text.secondary"
                    >
                      {properties.Addresses}
                    </Typography>
                  </Box>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Tooltip title="Find on map">
                      <Button
                        aria-label="Click to find on map"
                        variant="text"
                        size="large"
                        startIcon={<PlaceIcon />}
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                          mapRef.current.easeTo({
                            center: [
                              properties.longitude,
                              properties.latitude - 0.0005,
                            ],
                            zoom: 18,
                            duration: 500,
                          });
                        }}
                      >
                        Find
                      </Button>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <IconButton
                        disabled={disabledFunction(properties.Linkedin)}
                        aria-label="LinkedIn"
                        color="primary"
                        href={properties.Linkedin}
                        target="_blank"
                        rel="noopener"
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Website">
                      <IconButton
                        disabled={disabledFunction(properties.Website)}
                        aria-label="Website"
                        color="primary"
                        href={properties.Website}
                        target="_blank"
                        rel="noopener"
                      >
                        <LanguageIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </div>
              </StyledDivEllipsisContainer>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}
