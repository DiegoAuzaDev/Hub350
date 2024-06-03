/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  styled,
  Box,
  Typography,
  ButtonBase,
  Paper,
  Popper,
} from "@mui/material";
import darckImage from "../../assets/img/darck.webp";
import lightImage from "../../assets/img/light.webp";
import satelliteImage from "../../assets/img/satellite.webp";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { useMapData } from "../../context/MapDataContext";

const mapStyleURLArray = [
  {
    mode: "Dark",
    title: "dark mode",
    mapURl: "mapbox://styles/diegoauza/clnluejez003u01quht1q3do7",
    image: darckImage,
    height: 50,
  },
  {
    mode: "Light",
    title: "light mode",
    mapURl: "mapbox://styles/diegoauza/clnm1a1ix004m01p5cppk0j8j",
    image: lightImage,
    height: 50,
  },
  {
    mode: "Satellite",
    title: "satellite mode",
    mapURl: "mapbox://styles/diegoauza/clnluh867003c01p3b9tffx8q",
    image: satelliteImage,
    height: 50,
  },
];

const StyleButtonContainer = styled(ButtonBase)(({ theme }) => {
  return {
    position: "relative",
    overflow: "hidden",
    transition: "all 0.225s",
    "&:hover ,&.Mui-focusVisible": {
      "& img": {
        border: `4px solid ${theme.palette.primary.light}`,
      },
      "& p": {
        color: theme.palette.primary.light,
      },
    },
  };
});

const StyleImage = styled("img")(({ theme }) => {
  return {
    width: "auto",
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: 15,
    border: `4px solid ${theme.palette.grey[500]}`,
  };
});

const StyleText = styled(Typography)(({ theme }) => {
  return {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.grey[500],
  };
});
const StylePopper = styled(Popper)(({ theme }) => {
  return {
    position: "absolute !important",
    top: "auto !important",
    left: "auto !important",
    bottom: 8,
    right: "130px",
    transition: "right 0.225s",
  };
});
const StyleButtonControllerContainer = styled(ButtonBase)(
  ({ theme, changestylepicker }) => {
    return {
      position: "absolute",
      bottom: 8,
      width: 100,
      height: 100,
      zIndex: 100,
      borderRadius: 15,
      overflow: "hidden",
      transition: "all 0.225s",
      border: `4px solid ${theme.palette.common.white}`,
      right: changestylepicker ? 380 : 8,
      // "& active": {
      //   right: 500,
      // },
      "&:hover ,&.Mui-focusVisible": {
        border: `4px solid ${theme.palette.primary.light}`,
        "& .MuiImageBackdrop-root": {
          opacity: 0.35,
        },
        "& .MuiTypography-selectorText, & .MuiLayerIcon": {
          display: "none",
        },
        "& .MuiTypography-modeText": {
          display: "block",
        },
      },
    };
  }
);
const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundColor: "blue",
  backgroundPosition: "center 40%",
});
const ImageBackdrop = styled("span")(({ theme }) => {
  return {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.45,
    transition: theme.transitions.create("opacity"),
  };
});

export default function StylePicker({ changeStylePicker }) {
  const theme = useTheme();
  const { mapStyle, updateMapStyle } = useMapData();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };
  const [mapViewMode, setMapViewMode] = useState("Light");
  const setBackgroundImageSrc = () => {
    switch (mapStyle) {
      case "mapbox://styles/diegoauza/clnluejez003u01quht1q3do7":
        return darckImage;
      case "mapbox://styles/diegoauza/clnm1a1ix004m01p5cppk0j8j":
        return lightImage;
      case "mapbox://styles/diegoauza/clnluh867003c01p3b9tffx8q":
        return satelliteImage;
      default:
        return darckImage;
    }
  };
  const handleMapViewMode = (mode) => {
    mapStyleURLArray.map((mapMode) => {
      if (mapMode.mode === mode) {
        setMapViewMode(mode);
      }
    });
  };
  return (
    <>
      <StyleButtonControllerContainer
        aria-describedby={id}
        onClick={handleClick}
        changestylepicker={
          changeStylePicker ? changeStylePicker.toString() : undefined
        }
      >
        <Box
          sx={{
            zIndex: 1000,
            flexDirection: "row",
            display: "flex",
            color: theme.palette.common.white,
          }}
        >
          <LayersOutlinedIcon className="MuiLayerIcon" />
          <Typography
            sx={{ fontWeight: "medium" }}
            className="MuiTypography-selectorText"
          >
            Mode
          </Typography>
          <Typography
            sx={{ fontWeight: "medium", display: "none" }}
            className="MuiTypography-modeText"
          >
            {mapViewMode}
          </Typography>
        </Box>
        <ImageSrc
          style={{ backgroundImage: `url(${setBackgroundImageSrc()})` }}
        />
        <ImageBackdrop className="MuiImageBackdrop-root" />
      </StyleButtonControllerContainer>
      <StylePopper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="left"
        disablePortal={false}
        sx={{ right: changeStylePicker ? 500 : 120 }}
        modifiers={[
          {
            name: "flip",
            enabled: false,
            options: {
              altBoundary: false,
              rootBoundary: "document",
              p: 8,
            },
          },
          {
            name: "preventOverflow",
            enabled: false,
            options: {
              altAxis: false,
              altBoundary: false,
              tether: false,
              rootBoundary: "viewport",
              p: 8,
            },
          },
        ]}
      >
        <Paper
          elevation={8}
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "rgba(255, 255, 255, 1)",
          }}
        >
          {mapStyleURLArray.map((imageItem) => (
            <StyleButtonContainer
              variant="text"
              key={imageItem.mode}
              onClick={() => {
                updateMapStyle(imageItem.mapURl);
                handleMapViewMode(imageItem.mode);
              }}
              sx={
                imageItem.mapURl === mapStyle
                  ? {
                      "& img": {
                        border: `4px solid ${theme.palette.primary.light}`,
                      },
                      "& p": {
                        color: `${theme.palette.primary.light}`,
                      },
                    }
                  : {}
              }
            >
              <Box direction="column" sx={{ mx: "10px" }}>
                <StyleImage
                  draggable={false}
                  src={imageItem.image}
                  alt={`Image of the map on ${imageItem.mode} mode`}
                  style={{
                    height: imageItem.height,
                    pointerEvents: "none",
                  }}
                />
                <StyleText variant="body1">{imageItem.mode}</StyleText>
              </Box>
            </StyleButtonContainer>
          ))}
        </Paper>
      </StylePopper>
    </>
  );
}
