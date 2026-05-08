import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function IssMap({ positions }) {
  if (!positions || positions.length === 0) {
    return <div className="h-[400px] w-full bg-muted flex items-center justify-center rounded-lg">Loading Map...</div>;
  }

  const currentPos = positions[positions.length - 1];
  const center = [currentPos.latitude, currentPos.longitude];
  const polylineCoords = positions.map(p => [p.latitude, p.longitude]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border">
      <MapContainer center={center} zoom={3} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        
        <Marker position={center} icon={customIcon}>
          <Popup>
            ISS Current Location <br />
            Lat: {currentPos.latitude.toFixed(4)} <br />
            Lon: {currentPos.longitude.toFixed(4)}
          </Popup>
        </Marker>
        
        <Polyline positions={polylineCoords} color="red" weight={3} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
}
