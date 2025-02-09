import React, { useState, useRef } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const initialCenter = {
  lat: 40.73061, // Default to New York City
  lng: -73.935242,
};

const libraries = ["places"];

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "", // Replace with your API key
    libraries,
  });

  const [center, setCenter] = useState(initialCenter);
  const [markerPosition, setMarkerPosition] = useState(initialCenter);
  const [inputLocation, setInputLocation] = useState("");
  const [places, setPlaces] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const mapRef = useRef(null);

  if (loadError)
    return <div>Error loading maps. Check your API key or network connection.</div>;
  if (!isLoaded) return <div>Loading...</div>;

  const textSearchPlaces = (query) => {
    setIsSearching(true);
    const service = new window.google.maps.places.PlacesService(mapRef.current);

    const request = {
      query,
      location: new window.google.maps.LatLng(center.lat, center.lng),
      radius: 10000, // Search within 10 km
    };

    console.log("Sending Text Search request:", request);

    service.textSearch(request, (results, status) => {
      setIsSearching(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Text Search Results:", results);
        setPlaces(results);
        if (results.length > 0) {
          const newCenter = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
        }
      } else {
        console.error("Text Search Error:", status);
        alert("Failed to fetch nearby medical centers. Please try again.");
        setPlaces([]);
      }
    });
  };

  const handleSearch = () => {
    if (inputLocation.trim() === "") {
      alert("Please enter a location or query.");
      return;
    }
    textSearchPlaces(`${inputLocation} hospitals`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for hospitals near a location"
        value={inputLocation}
        onChange={(e) => setInputLocation(e.target.value)}
        style={{ padding: "8px", width: "300px", margin: "10px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
        Search
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        <Marker position={markerPosition} />
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
            title={place.name}
          />
        ))}
      </GoogleMap>

      <h3>Nearby Medical Centers</h3>
      {isSearching ? (
        <p>Loading medical centers...</p>
      ) : places.length > 0 ? (
        <ul>
          {places.map((place, index) => (
            <li key={index} style={{ margin: "10px 0" }}>
              <strong>{place.name}</strong>
              <p>Address: {place.formatted_address}</p>
              {place.rating && <p>Rating: {place.rating}⭐</p>}
              <a
                href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Google Maps
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No nearby medical centers found.</p>
      )}
    </div>
  );
};

export default Map;
