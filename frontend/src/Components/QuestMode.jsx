import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

gsap.registerPlugin(ScrollTrigger);

const QuestMode = () => {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const heroRef = useRef(null);
  const [userLocation, setUserLocation] = useState([51.505, -0.09]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  // GSAP animation effect
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: true,
        markers: false, // Disable markers in production
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

  // Geolocation and Fetch nearby places
  useEffect(() => {
    let watchId;

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
        const response = await fetch(
          `http://localhost:5000/api/nearby-places?lat=${lat}&lon=${lon}&distance=5`
        );
        const data = await response.json();
        setNearbyPlaces(data);
      } catch (error) {
        console.error("Error fetching nearby places:", error);
      }
    };

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          updateServerLocation(latitude, longitude);
          fetchNearbyPlaces(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Custom marker for the user's location and nearby places
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
          <Marker key={place.id} position={[place.lat, place.lon]}>
            <Popup>
              {place.name} - {place.distance} km away
            </Popup>
          </Marker>
        ))}
      </>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full z-10">
      <div className="relative w-full overflow-x-hidden z-10">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="w-full h-screen bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1589848315097-ba7b903cc1cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        ></section>

        {/* Section with Leaflet Map and Nearby Places */}
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
            </MapContainer>
          </div>

          {/* Nearby places list */}
          <div
            className="w-full bg-white rounded-lg shadow-lg p-4 overflow-y-auto"
            style={{ maxHeight: "40%" }}
          >
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
              Nearby Places to Visit
            </h2>
            <ul className="space-y-2">
              {nearbyPlaces.map((place) => (
                <li key={place.id} className="bg-purple-100 p-2 rounded">
                  {place.name} - {place.distance} km away
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Scrollable image background */}
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
