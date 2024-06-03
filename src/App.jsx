/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl";
import useSupercluster from "use-supercluster";
import StylePicker from "./component/StylePicker/StylePicker";
import "./GlobalStyles/App.styles.scss";
import { Container } from "@mui/material";
import { useMapData } from "./context/MapDataContext";
import DrawerContainer from "./component/DrawerContainer/DrawerContainer";
import DrawerContainerBottom from "./component/DrawerContainer/DrawerContainerBottom";
import noPhotoAvailable from "./assets/img/noPhotoAvailable.webp";
import { ClusterMarker, Singlemarker } from "./component/Markers/Markers";
import SignIn from "./component/SignIn/SignIn";
import SearchBar from "./component/SearchBar/SearchBar";
import styled from "@emotion/styled";
import ButtonBase from "@mui/material/ButtonBase";
import NetworkError from "./component/NetworkError/NetworkError";

const SingleMarkerContainerPopup = styled(ButtonBase)(({ theme }) => {
  return {
    "&:hover": {
      boxShadow: "0px 2px 5px 1px rgba(0,0,0,0.09)",
      zIndex: 1000,
      overflow: "hidden",
    },
  };
});
export default function App() {
  const defaultImage = noPhotoAvailable;
  const [popUpData, setPopUpData] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const mapboxAccessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);
  const { companyData, mapStyle, phoneView, networkError } = useMapData();
  const [clusterSelected, setClusterSelected] = useState([]);
  const [changeStylePicker, setChangeStylePicker] = useState(false);
  const [zoomStatus, setZoomStatus] = useState(14);
  const [clusterStatus, setClusterStatus] = useState(100);
  const [openetworkError, setOpenNetworkError] = useState(false);
  const [stylePopup, setSetStylePopup] = useState(null);
  useEffect(() => {
    if (zoomStatus > 17) {
      setClusterStatus(30);
    } else {
      setClusterStatus(100);
    }
  }, [zoomStatus]);
  useEffect(() => {
    if (networkError) {
      setOpenNetworkError(true);
    } else {
      setOpenNetworkError(false);
    }
  }, [networkError]);
  useEffect(() => {
    handlerPopup(popUpData);
  }, [popUpData]);
  const [viewPort, setviewPort] = useState({
    latitude: 45.346577035886355,
    longitude: -75.91944575814581,
    zoom: zoomStatus,
    pitch: 0,
  });
  const mapRef = useRef();
  const points = companyData.map((item) => ({
    type: "feature",
    properties: {
      cluster: false,
      Addresses: item.Addresses,
      CompanyName: item.CompanyName,
      PhoneNumber: item.PhoneNumber,
      Website: item.Website,
      Linkedin: item.Linkedin,
      Image: item.Image ? item.Image : defaultImage,
      latitude: parseFloat(item.Latitude),
      longitude: parseFloat(item.Longitude),
      IndustrialSector: item.IndustrialSector,
      docId: item.docId,
      CompanyDescription: item.CompanyDescription,
    },
    geometry: {
      type: "point",
      coordinates: [parseFloat(item.Longitude), parseFloat(item.Latitude)],
    },
  }));
  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;
  const { clusters, supercluster } = useSupercluster({
    points,
    zoom: viewPort.zoom,
    bounds: bounds,
    options: { radius: phoneView ? 100 : clusterStatus, maxZoom: 18 },
  });
  const handlerPopup = (data) => {
    if (!data) return;
    if (data.cluster.length == 1) {
      setSetStylePopup("singlePopupContainer");
    } else {
      setSetStylePopup("");
    }
  };
  const onMove = (evt) => {
    setZoomStatus(evt.viewState.zoom);
    setviewPort((prevViewPort) => ({
      ...prevViewPort,
      latitude: evt.viewState.latitude,
      longitude: evt.viewState.longitude,
      zoom: evt.viewState.zoom,
      pitch: evt.viewState.pitch,
    }));
  };
  const maxBounds = {
    northeast: phoneView
      ? { latitude: 45.364, longitude: -75.875 }
      : { latitude: 45.364, longitude: -75.875 },
    southwest: phoneView
      ? { latitude: 45.327, longitude: -75.957 }
      : { latitude: 45.327, longitude: -75.957 },
  };
  const handleDrawerOpen = (cluster, anchor) => {
    setClusterSelected(cluster);
    if (anchor) {
      setOpenBottomDrawer(true);
    } else {
      setOpenDrawer(true);
    }
    setChangeStylePicker(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setChangeStylePicker(false);
  };
  const handleDrawerCloseBottom = () => {
    setOpenBottomDrawer(false);
  };
  return (
    <>
      <Container disableGutters maxWidth={false} sx={{ display: "flex" }}>
        {openetworkError ? <NetworkError /> : null}
        {!phoneView ? <SignIn changeStyleSignIn={changeStylePicker} /> : null}
        {!phoneView ? (
          <StylePicker changeStylePicker={changeStylePicker} />
        ) : null}
        <SearchBar
          setPopUpData={setPopUpData}
          setShowPopup={setShowPopup}
          open={setOpenDrawer}
          changeStyleBar={changeStylePicker}
          mapRef={mapRef}
          handleDrawerOpen={handleDrawerOpen}
        />
        {!phoneView ? (
          <DrawerContainer
            open={openDrawer}
            handleDrawerClose={handleDrawerClose}
            clusters={clusterSelected}
            mapRef={mapRef}
            setPopUpData={setPopUpData}
            setShowPopup={setShowPopup}
          />
        ) : (
          <DrawerContainerBottom
            open={openBottomDrawer}
            handleDrawerClose={handleDrawerCloseBottom}
            clusters={clusterSelected}
            mapRef={mapRef}
          />
        )}
        <Map
          maxBounds={[
            [maxBounds.southwest.longitude, maxBounds.southwest.latitude],
            [maxBounds.northeast.longitude, maxBounds.northeast.latitude],
          ]}
          {...viewPort}
          onMove={(evt) => {
            onMove(evt);
          }}
          ref={mapRef}
          styleimagemissing="https://cdn.mapmarker.io/api/v1/pin?size=50&background=%99000000&color=%23FFFFFF&voffset=0&hoffset=1&"
          mapboxAccessToken={mapboxAccessToken}
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
          }}
          maxZoom={18}
          minZoom={13}
          mapStyle={mapStyle}
          styleDiffing={false}
        >
          {!phoneView ? <NavigationControl position="top-left" /> : null}
          {popUpData && showPopup && !phoneView ? (
            <Popup
              className="PopupStlyes"
              closeButton={true}
              onClose={() => {
                setShowPopup(false);
              }}
              closeOnClick={false}
              longitude={`${popUpData.longitude}`}
              latitude={`${popUpData.latitude}`}
            >
              <div
                className={`${stylePopup ? stylePopup : ""} containerImages`}
              >
                {popUpData.cluster.map((item) => {
                  return (
                    <SingleMarkerContainerPopup
                      key={item.properties.docId}
                      onClick={() => {
                        handleDrawerOpen([item]);
                      }}
                    >
                      <img
                        className="itemImages"
                        key={item.properties.docId}
                        src={`${item.properties.Image}`}
                      />
                    </SingleMarkerContainerPopup>
                  );
                })}
              </div>
            </Popup>
          ) : null}
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } =
              cluster.properties;
            if (isCluster) {
              return (
                <Marker
                  key={cluster.id}
                  latitude={latitude}
                  longitude={longitude}
                  onClick={() => {
                    const leaves = supercluster.getLeaves(cluster.id);
                    {
                      !phoneView
                        ? handleDrawerOpen(leaves)
                        : handleDrawerOpen(leaves, "bottom");
                    }
                  }}
                >
                  <ClusterMarker
                    latitude={latitude}
                    longitude={longitude}
                    clusterId={cluster.id}
                    setPopUpData={setPopUpData}
                    setShowPopup={setShowPopup}
                    cluster={supercluster.getLeaves(cluster.id)}
                    zoomStatus={zoomStatus}
                  />
                </Marker>
              );
            }
            return (
              <Marker
                key={cluster.properties.docId}
                latitude={latitude}
                longitude={longitude}
                onClick={() => {
                  const marker = cluster.properties;
                  {
                    !phoneView
                      ? handleDrawerOpen([{ properties: marker }])
                      : handleDrawerOpen([{ properties: marker }], "bottom");
                  }
                }}
              >
                <Singlemarker
                  cluster={cluster}
                  setShowPopup={setShowPopup}
                  latitude={latitude}
                  setPopUpData={setPopUpData}
                  longitude={longitude}
                />
              </Marker>
            );
          })}
        </Map>
      </Container>
    </>
  );
}
