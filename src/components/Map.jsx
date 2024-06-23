import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

const Map = ({ onRadiusChange, onCenterChange }) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [radius, setRadius] = useState(1000);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onCenterChange([e.latlng.lat, e.latlng.lng]);
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Circle center={position} radius={radius} />
      </Marker>
    );
  };

  const handleRadiusChange = (e) => {
    const newRadius = e.target.value;
    setRadius(newRadius);
    onRadiusChange(newRadius);
  };

  return (
    <div>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      <div style={{ marginTop: '10px' }}>
        <label>Radius: </label>
        <input type="range" min="100" max="5000" value={radius} onChange={handleRadiusChange} />
        <span>{radius} meters</span>
      </div>
    </div>
  );
};

export default Map;