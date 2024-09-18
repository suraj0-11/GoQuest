import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { RoutingMachine } from "react-leaflet-routing-machine";

gsap.registerPlugin(ScrollTrigger);

const QuestMode = () => {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const heroRef = useRef(null);
  const [userLocation, setUserLocation] = useState([12.9716, 77.5946]); // Bangalore coordinates
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        markers: false,
      },
    });

    tl.to(imgRef.current, {
      scale: 2,
      z: 350,
      transformOrigin: "center center",
      ease: "power1.inOut",
    }).to(
      heroRef.current,
      {
        scale: 1.1,
        transformOrigin: "center center",
        ease: "power1.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const updateServerLocation = async (lat, lon) => {
      try {
        await fetch("http://localhost:5000/api/update-location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        });
      } catch (error) {
        console.error("Error updating server location:", error);
      }
    };

    const fetchNearbyPlaces = async (lat, lon) => {
      try {
        // List of places closer to Bangalore
        const places = [
          { name: "Nandi Hills", lat: 13.4062, lon: 77.7501 },
          { name: "Mysore Palace", lat: 12.3052, lon: 76.6552 },
          { name: "Hampi", lat: 15.335, lon: 76.46 },
          { name: "Coorg", lat: 12.4191, lon: 75.7399 },
          { name: "Kabini", lat: 12.1615, lon: 75.9674 },
          { name: "Sakleshpur", lat: 13.2175, lon: 75.6977 },
        ];
        setNearbyPlaces(places);
      } catch (error) {
        console.error("Error fetching nearby places:", error);
        setNearbyPlaces([]); // Default to empty array on error
      }
    };

    updateServerLocation(userLocation[0], userLocation[1]);
    fetchNearbyPlaces(userLocation[0], userLocation[1]);
  }, [userLocation]);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
  };

  function LocationMarker() {
    const map = useMap();

    useEffect(() => {
      map.flyTo(userLocation, map.getZoom());
    }, [map, userLocation]);

    return (
      <>
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>
        {nearbyPlaces.map((place) => (
          <Marker
            key={place.name}
            position={[place.lat, place.lon]}
            eventHandlers={{
              click: () => handlePlaceClick(place),
            }}
          >
            <Popup>
              {place.name} -{" "}
              {Math.round(
                L.latLng(userLocation).distanceTo(
                  L.latLng(place.lat, place.lon)
                ) / 1000
              )}{" "}
              km away
            </Popup>
          </Marker>
        ))}
      </>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full z-10">
      <div className="relative w-full overflow-x-hidden z-10">
        <section
          ref={heroRef}
          className="w-full h-screen bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1589848315097-ba7b903cc1cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        ></section>

        <section className="w-full h-screen bg-gradient-to-r from-purple-500 to-purple-900 flex flex-col items-center justify-around p-4">
          <div className="w-full h-1/2 mb-4">
            <MapContainer
              center={userLocation}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker />
              {selectedPlace && (
                <RoutingMachine
                  waypoints={[
                    L.latLng(userLocation[0], userLocation[1]),
                    L.latLng(selectedPlace.lat, selectedPlace.lon),
                  ]}
                  routeWhileDragging={true}
                />
              )}
            </MapContainer>
          </div>

          <div
            className="w-full bg-white rounded-lg shadow-lg p-4 overflow-y-auto"
            style={{ maxHeight: "40%" }}
          >
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
              Nearby Places to Visit
            </h2>
            <ul className="space-y-2">
              {nearbyPlaces.map((place) => (
                <li
                  key={place.name}
                  className="bg-purple-100 p-2 rounded cursor-pointer"
                  onClick={() => handlePlaceClick(place)}
                >
                  {place.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <div className="absolute top-0 left-0 right-0 w-full h-screen perspective-500 overflow-hidden z-20">
        <img
          ref={imgRef}
          src="https://assets-global.website-files.com/63ec206c5542613e2e5aa784/643312a6bc4ac122fc4e3afa_main%20home.webp"
          alt="Quest Mode Image"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default QuestMode;
