import { useEffect, useRef, useState } from "react";
import L, { LatLngExpression, LatLngTuple, Map as LeafletMap, Marker as LeafletMarker, Popup } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface CustomLocation {
    coordinates: LatLngTuple;
    popupText?: string;
}

interface MapProps {
    posix: LatLngExpression | LatLngTuple;
    zoom?: number;
    customLocations?: CustomLocation[];
    bounds?: { north: number; south: number; east: number; west: number };
    // Update the callback type to receive both coordinates and popupText
    onLocationSelect: (location: { coordinates: LatLngTuple; popupText?: string }) => void;
}

const Map = ({ posix, zoom = 15, customLocations = [], bounds, onLocationSelect }: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<LeafletMap | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<LeafletMarker | null>(null);

    useEffect(() => {
        if (mapContainerRef.current && !mapInstanceRef.current) {
            const initializedMap = L.map(mapContainerRef.current, {
                attributionControl: false,
                center: posix,
                zoom: zoom,
            });
            
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(initializedMap);

            const markers: LeafletMarker[] = [];
            customLocations.forEach((location) => {
                const marker = L.marker(location.coordinates).addTo(initializedMap);
                if (location.popupText) {
                    marker.bindPopup(location.popupText);
                }
                
                marker.on("click", () => {
                    if (selectedMarker !== marker) {
                        marker.openPopup();
                        // Pass both coordinates and popupText to the callback
                        onLocationSelect({
                            coordinates: location.coordinates,
                            popupText: location.popupText
                        });
                        setSelectedMarker(marker);
                    } else {
                        marker.togglePopup();
                    }
                });
                markers.push(marker);
            });

            if (bounds) {
                const maxBounds = L.latLngBounds(
                    [bounds.south, bounds.west],
                    [bounds.north, bounds.east]
                );
                initializedMap.setMaxBounds(maxBounds);
                initializedMap.on("drag", () => {
                    initializedMap.panInsideBounds(maxBounds, { animate: false });
                });
            }

            mapInstanceRef.current = initializedMap;

            return () => {
                markers.forEach((marker) => marker.remove());
                initializedMap.remove();
                mapInstanceRef.current = null;
            };
        }
    }, [posix, zoom, customLocations, bounds, onLocationSelect]);

    useEffect(() => {
        if (selectedMarker) {
            selectedMarker.openPopup();
        }
    }, [selectedMarker]);

    return (
        <div>
            <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "100vh", padding: 0, margin: 0 }}
            />
        </div>
    );
};

export default Map;