import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const InteractiveMap = ({ address, className = "" }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  // Default coordinates for Las Piñas, Metro Manila, Philippines
  const defaultLocation = { lat: 14.4500, lng: 120.9833 };

  useEffect(() => {
    console.log('InteractiveMap useEffect - address received:', address);
    
    // Don't load maps if no valid address
    if (!address || address === 'Loading...' || address === 'Address not configured') {
      console.log('No valid address provided for map');
      setMapError('No valid address provided');
      return;
    }

    // Initialize map with default location (Las Piñas coordinates)
    console.log('Using default Las Piñas coordinates for map');
    initializeMap();
  }, [address]);

  // Re-initialize map when map element becomes available
  useEffect(() => {
    if (address && !map && window.google && window.google.maps) {
      const mapElement = document.getElementById('contact-map');
      if (mapElement) {
        console.log('Map element available, initializing...');
        initializeMap();
      }
    }
  }, [address, map]);

  const initializeMap = () => {
    console.log('initializeMap called, window.google:', !!window.google);
    
    if (window.google && window.google.maps) {
      const mapElement = document.getElementById('contact-map');
      console.log('Map element found:', !!mapElement);
      
      if (mapElement && !map) {
        console.log('Creating Google Map with Las Piñas coordinates...');
        
        const googleMap = new window.google.maps.Map(mapElement, {
          center: defaultLocation,
          zoom: 15,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true
        });

        const googleMarker = new window.google.maps.Marker({
          position: defaultLocation,
          map: googleMap,
          title: 'Rosel Meat Store',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#860809" stroke="#fff" stroke-width="2"/>
                <path d="M20 8c-4.4 0-8 3.6-8 8 0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#fff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          }
        });

        // Create info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #860809; font-size: 16px; font-weight: bold;">
                Rosel Meat Store
              </h3>
              <p style="margin: 0; color: #030105; font-size: 14px; line-height: 1.4;">
                ${address || 'Las Piñas, Metro Manila, Philippines'}
              </p>
              <p style="margin: 8px 0 0 0; color: #82695b; font-size: 12px;">
                Click for directions
              </p>
            </div>
          `
        });

        // Add click event to marker
        googleMarker.addListener('click', () => {
          infoWindow.open(googleMap, googleMarker);
        });

        // Add click event to map
        googleMap.addListener('click', () => {
          infoWindow.close();
        });

        setMap(googleMap);
        setMarker(googleMarker);
        setMapLoaded(true);
        console.log('Google Map initialized successfully with Las Piñas coordinates');
      }
    } else {
      // Load Google Maps script if not already loaded
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const apiKey = import.meta.env.VITE_MAPS_PLATFORM_API_KEY;
        console.log('Google Maps API Key:', apiKey);
        
        if (!apiKey) {
          console.error('VITE_MAPS_PLATFORM_API_KEY is not defined in environment variables');
          setMapError('Google Maps API key not configured');
          return;
        }
        
        console.log('Loading Google Maps script...');
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Maps script loaded, initializing map...');
          setTimeout(initializeMap, 100);
        };
        script.onerror = () => {
          console.error('Failed to load Google Maps script');
          setMapError('Failed to load Google Maps');
        };
        document.head.appendChild(script);
      } else {
        console.log('Google Maps script already loaded, retrying initialization...');
        setTimeout(initializeMap, 100);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-[#fef2f2] rounded-lg">
          <div className="text-center p-8">
            <MapPin className="w-16 h-16 text-[#ef4444] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#ef4444] mb-2">Our Location</h3>
            <p className="text-[#030105] text-lg mb-2">{address || 'Las Piñas, Metro Manila, Philippines'}</p>
            <p className="text-sm font-medium text-[#ef4444] mb-2">
              {mapError}
            </p>
            <p className="text-xs text-[#dc2626]">
              Map temporarily unavailable. Please use the address above for directions.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div 
            id="contact-map"
            className="w-full h-full rounded-lg"
            style={{ minHeight: '400px' }}
          />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f8f3ed] rounded-lg">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#a31f17] mx-auto mb-2" />
                <p className="text-sm text-[#a31f17]">
                  Loading Google Maps...
                </p>
                <p className="text-xs mt-1 text-[#860809]">
                  Finding our location...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;