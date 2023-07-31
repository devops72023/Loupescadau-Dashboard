import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { toast } from 'react-toastify';
import SpinningToast from '../global/SpinningToast';

function PositionPicker({ onPositionSelected, POSITION=null, className }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const rectangleRef = useRef(null);

  useEffect(() => {
      if (POSITION === null ) {
        fetch(`${ import.meta.env.VITE_API_URL }settings/`, {
          method: "GET",
          headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then( res => res.json())
        .then( res => {
          const loader = new Loader({
            apiKey: import.meta.env.VITE_API_KEY,
            version: "weekly",
            libraries: ["places"]
          });
          // Promise
          loader
          .load()
          .then((google) => {
              const map = new google.maps.Map(mapRef.current, {
                center: {
                  lat: res.latitude,
                  lng: res.longitude
                },
                zoom: 14
              });
              const marker = new google.maps.Marker({
                  map,
                  draggable: true,
              });
  
              google.maps.event.addListener(marker, 'dragend', () => {
                  const position = marker.getPosition();
                  onPositionSelected(position);
              });
  
              google.maps.event.addListener(map, 'click', (event) => {
                  const clickedLocation = event.latLng;
                  marker.setPosition(clickedLocation);
                  onPositionSelected(clickedLocation);
              });
              
              
              const latlng = new google.maps.LatLng(res.latitude, res.longitude);
              marker.setPosition(latlng);
              onPositionSelected(latlng);
          
              markerRef.current = marker;
          })
          .catch((error) => {
            console.error('Error loading Google Maps API:', error);
          });
        })
        .catch(err => {
            console.log(err)
            let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
            toast.update(toastId, {
                render: err.error,
                type: 'error',
                theme: 'light',
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000, // Close the alert after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
      }
      else{
        const loader = new Loader({
            apiKey: "AIzaSyBLnA6f8CBY4swPh2K2RkBJch2hE922P_I",
            version: "weekly",
            libraries: ["places"]
          });
          // Promise
          loader
          .load()
          .then((google) => {
            const map = new google.maps.Map(mapRef.current, {
              center: {
                lat: POSITION.latitude,
                lng: POSITION.longitude
              },
              zoom: 14
            });
            const marker = new google.maps.Marker({
                map,
                draggable: true,
            });

            google.maps.event.addListener(marker, 'dragend', () => {
                const position = marker.getPosition();
                onPositionSelected(position);
            });

            google.maps.event.addListener(map, 'click', (event) => {
                const clickedLocation = event.latLng;
                marker.setPosition(clickedLocation);
                onPositionSelected(clickedLocation);
            });
            
            
            const latlng = new google.maps.LatLng(POSITION.latitude, POSITION.longitude);
            marker.setPosition(latlng);
            onPositionSelected(latlng);
        
            markerRef.current = marker;
          })
      }

    
      return () => {
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
      };
    }, [onPositionSelected]);
    

  return <div ref={mapRef} className={`map ${className}`}></div>;
}

export default PositionPicker;