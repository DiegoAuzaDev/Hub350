/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Autocomplete, TextField } from "@mui/material";
import noPhotoAvailable from "../../assets/img/noPhotoAvailable.webp";
import { useMapData } from "../../context/MapDataContext";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

const StyledSearchBar = styled(Box)(({ theme, changestylebar, phoneview }) => {
  return {
    position: "absolute !important",
    display: "flex",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.225s",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "8px",
    right:
      phoneview === "true"
        ? "8px"
        : changestylebar === "true"
        ? "390px"
        : "8px",
  };
});

export default function SearchBar({
  changeStyleBar,
  handleDrawerOpen,
  mapRef,
  setPopUpData,
  setShowPopup,
}) {
  const { companyData, phoneView } = useMapData();
  const [openAutoComplete, setOpenAutoComplete] = useState(false);
  const autoCompleteInfo = companyData.map((item, index) => ({
    label: `${item.CompanyName} - ${item.Addresses.split(0, 2) + index}....`,
    docId: item.docId,
  }));
  const [loading, setLoading] = useState(true);
  const handlerSearch = (docId, anchor) => {
    const selected = companyData.filter((item) => item.docId === docId);
    if (selected.length === 0) return;
    if (selected[0].Image === undefined || selected[0].Image === null) {
      selected[0].Image = noPhotoAvailable;
    }
    const newSelectedCluster = [
      {
        properties: {
          Addresses: selected[0].Addresses,
          CompanyName: selected[0].CompanyName,
          Image: selected[0].Image,
          IndustrialSector: selected[0].IndustrialSector,
          latitude: selected[0].Latitude,
          longitude: selected[0].Longitude,
          docId: selected[0].docId,
          uid: selected[0].uid,
          Linkedin: selected[0].Linkedin,
          Website: selected[0].Website,
          PhoneNumber: selected[0].PhoneNumber,
        },
      },
    ];
    handleDrawerOpen(newSelectedCluster, anchor);
    setPopUpData({
      cluster: newSelectedCluster,
      longitude: parseFloat(selected[0].Longitude),
      latitude: parseFloat(selected[0].Latitude),
    });
    setShowPopup(true);
    mapRef.current.easeTo({
      center: [
        parseFloat(selected[0].Longitude),
        parseFloat(selected[0].Latitude),
      ],
      zoom: 17,
      duration: 500,
    });
  };
  useEffect(() => {
    if (autoCompleteInfo.length > 0) {
      setLoading(false);
    }
  }, [autoCompleteInfo]);
  return (
    <StyledSearchBar
      changestylebar={changeStyleBar == true ? "true" : "false"}
      phoneview={phoneView == true ? "true" : "false"}
    >
      <Autocomplete
        disablePortal
        id="auto-complete-search-bar"
        autoHighlight={true}
        clearOnEscape={true}
        open={openAutoComplete}
        loading={loading}
        clearText="Clear"
        ListboxProps={{ style: { maxHeight: "30vh" } }}
        onClose={() => setOpenAutoComplete(false)}
        onOpen={() => setOpenAutoComplete(true)}
        isOptionEqualToValue={(option, value) => {
          return option.docId === value.docId;
        }}
        options={autoCompleteInfo}
        onChange={(event, value) => {
          if (value) {
            if (!phoneView) {
              handlerSearch(value.docId);
            } else {
              handlerSearch(value.docId, "bottom");
            }
          }
        }}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search by name"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
    </StyledSearchBar>
  );
}
