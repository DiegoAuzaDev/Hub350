/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import { useState, useEffect } from "react";

const SingleMarkerContainer = styled(Box)(({ theme, groupstyle }) => {
  return {
    backgroundColor: theme.palette.common.white,
    borderRadius: 10,
    width: groupstyle ? 160 : 100,
    height: 60,
    display: "flex",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.35s ease",
  };
});

const ClusterMarker = ({
  cluster,
  longitude,
  latitude,
  setPopUpData,
  setShowPopup,
  zoomStatus,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [delayHandler, setDelayHandler] = useState(null);
  const [hanldeGroup, setHanldeGroup] = useState(false);
  const [groupStyle, setGroupStyle] = useState(null);
  useEffect(() => {
    if (zoomStatus > 17) {
      setHanldeGroup(true);
      setGroupStyle("true");
    } else {
      setHanldeGroup(false);
      setGroupStyle(null);
    }
  }, [zoomStatus]);
  const handleMouseEnter = () => {
    setDelayHandler(
      setTimeout(() => {
        setShowPopup(true);
        setPopUpData({ cluster, longitude, latitude });
      }, 500)
    );
  };
  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
  };
  return (
    <SingleMarkerContainer
      className={`SingleMarkerContainer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      groupstyle={groupStyle}
    >
      {hanldeGroup == false ? (
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <img
            className={`imgeMarker clusterGroup ${
              isImageLoaded ? "loaded" : ""
            }`}
            src={`${cluster[0].properties.Image}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {cluster[1] ? (
            <img
              className={`imgeMarker clusterGroup ${
                isImageLoaded ? "loaded" : ""
              }`}
              src={`${cluster[1].properties.Image}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : null}
        </div>
      ) : (
        <>
          <img
            className={`imgeMarker ${isImageLoaded ? "loaded" : ""}`}
            src={`${cluster[0].properties.Image}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          <img
            className={`imgeMarker ${isImageLoaded ? "loaded" : ""}`}
            src={`${cluster[1].properties.Image}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {cluster[2] ? (
            <img
              className={`imgeMarker ${isImageLoaded ? "loaded" : ""}`}
              src={`${cluster[2].properties.Image}`}
              onLoad={() => setIsImageLoaded(true)}
            />
          ) : null}
        </>
      )}
    </SingleMarkerContainer>
  );
};

const Singlemarker = ({
  cluster,
  setPopUpData,
  setShowPopup,
  longitude,
  latitude,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [delayHandler, setDelayHandler] = useState(null);
  const arrayCluster = [cluster];
  const handleMouseEnter = () => {
    setDelayHandler(
      setTimeout(() => {
        setShowPopup(true);

        setPopUpData({ cluster: arrayCluster, longitude, latitude });
      }, 500)
    );
  };
  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
  };
  return (
    <>
      <SingleMarkerContainer
        className="SingleMarkerContainer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          className={`imgeMarker ${isImageLoaded ? "loaded" : ""}`}
          src={`${cluster.properties.Image}`}
          onLoad={() => {
            setIsImageLoaded(true);
          }}
        />
      </SingleMarkerContainer>
    </>
  );
};

export { ClusterMarker, Singlemarker };
