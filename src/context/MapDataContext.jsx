/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { createContext, useState, useContext, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/Firebase";
import { signOut } from "firebase/auth";
import { getDataFirebase, updateGeolocation } from "../config/Firebase";
import {
  createNewImageCompany,
  deleteImageFromStorage,
} from "../config/Firebase";

import { getUserRoleByUID } from "../config/Firebase";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const MapDataContext = createContext();

function MapDataProvider(props) {
  const auth = getAuth(app);
  const [phoneView, setPhoneView] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [uid, setUid] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [networkError, setNetworkError] = useState(false);
  const [mapStyle, setMapStyle] = useState(
    `mapbox://styles/diegoauza/clnm1a1ix004m01p5cppk0j8j`
  );
  const localStorageName = "mapDataKanataV1";
  useEffect(() => {
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    if (windowWidth < 780) {
      setPhoneView(true);
    } else {
      setPhoneView(false);
    }
    return () => {};
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid);
        setIsAuthenticating(true);
        updateGeolocationContext();
      } else {
        setIsAuthenticating(false);
        setUid(null);
        setUserRole(null);
      }
    });
    return () => {
      unsubscribe();
    };
  });
  useEffect(() => {
    if (uid) {
      getUserRoleByUID(uid).then((userRoles) => {
        if (userRoles) {
          setUserRole(userRoles.roles[0]);
        }
      });
    }
  }, [uid]);
  useEffect(() => {
    let data = null;
    const functiongetDataFirebase = async () => {
      const dataFirebaseRes = await getDataFirebase();
      if (dataFirebaseRes === null) {
        getLocalStorage();
      } else {
        data = true;
        localStorage.clear();
        setCompanyData(dataFirebaseRes);
        setLocalStorage(dataFirebaseRes);
      }
    };
    functiongetDataFirebase();
    const timerId = setTimeout(() => {
      if (data === null) {
        getLocalStorage();
        functiongetDataFirebase();
        signOutUser();
      }
    }, 4500);
    return () => clearTimeout(timerId);
  }, []);

  function signOutUser() {
    signOut(auth);
    setIsAuthenticating(null);
    setUid(null);
    setUserRole(null);
  }

  function getLocalStorage() {
    const dataLocalStorage = localStorage.getItem(localStorageName);
    if (dataLocalStorage === null) {
      setNetworkError(true);
    } else {
      setCompanyData(JSON.parse(dataLocalStorage));
    }
  }

  function setLocalStorage(dataFirebaseRes) {
    localStorage.setItem(localStorageName, JSON.stringify(dataFirebaseRes));
  }
  async function signInUser(email, password, checkBoxvalue) {
    if (checkBoxvalue) {
      setPersistence(auth, browserLocalPersistence);
    }
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        setUid(uid);
        setIsAuthenticating(true);
        updateGeolocationContext();
        return true;
      })
      .catch(() => {
        return false;
      });
  }
  function updateGeolocationContext() {
    const mapboxAccessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;
    const baseURL = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    const params = new URLSearchParams({
      country: "ca",
      fuzzyMatch: "true",
      routing: "true",
      proximity: "-75.90307073393681,45.3283659706355",
      language: "en",
      bbox: "-75.937612,45.328,-75.891,45.35699",
      limit: 2,
      access_token: mapboxAccessToken,
    }).toString();
    companyData.map(async (element) => {
      if (element.Latitude == undefined || element.Longitude == undefined) {
        const url = `${baseURL}${encodeURIComponent(
          element.Addresses
        )}.json?${params}`;
        const resMap = await fetch(url);
        const data = await resMap.json();
        if (data.features.length === 0) {
          throw new Error(`No results for ${element.Addresses}`);
        }
        const Latitude = data.features[0].center[1];
        const Longitude = data.features[0].center[0];
        updateGeolocation(element.docId, element, Latitude, Longitude);
        if (!resMap.ok) {
          throw new Error(`Fetch failed for ${url}`);
        }
      }
    });
  }
  function updateMapStyle(style) {
    setMapStyle(style);
  }
  async function updateImageCompany(docId, image) {
    const res = await createNewImageCompany(docId, image, userRole);
    return res;
  }
  async function deleteImageFromStorageProvider(docId, imageURL) {
    const res = await deleteImageFromStorage(docId, imageURL);
    return res;
  }

  return (
    <MapDataContext.Provider
      value={{
        updateMapStyle,
        updateImageCompany,
        signOutUser,
        signInUser,
        deleteImageFromStorageProvider,
        companyData,
        mapStyle,
        userRole,
        networkError,
        phoneView,
        isAuthenticating,
      }}
    >
      {props.children}
    </MapDataContext.Provider>
  );
}
function useMapData() {
  const context = useContext(MapDataContext);
  if (!context) {
    throw new Error("useMapData must be used within a MapDataProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { MapDataProvider, useMapData };
