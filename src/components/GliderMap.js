/*global google*/
import React, { useState, useEffect } from 'react';
import { withGoogleMap, withScriptjs, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from 'react-google-maps';

const BELFAST_DEFAULT_LOCATION = {
  lat: 54.607868,
  lng: -5.926437
}

const GliderMap = withScriptjs(withGoogleMap((props) => {
  const [markerId, setMarkerId] = useState()
  const [isOpen, setIsOpen] = useState(false)

  const [stopInfo, setStopInfo] = useState()

  const onToggleOpen = () => setIsOpen(!isOpen)

  const onInspect = (stop) => {
    onToggleOpen()
    if (!isOpen) {
      setMarkerId(stop.id)
      props.fetchStopInfo(stop).then(stopInfo => {
        setStopInfo(stopInfo)
      })
    }
  }

  useEffect(() => {
    setIsOpen(false)
  }, props.currentStop)

  return (
    <GoogleMap
      defaultZoom={11}
      defaultCenter={BELFAST_DEFAULT_LOCATION}
    >
      { props.stops && props.stops.map(stop => (
          <Marker
              position={{
                lat: stop.lat,
                lng: stop.lng
              }}
              // label={stop.name}
              onClick={() => onInspect(stop)}
              visible={props.currentStop && props.currentStop.id === stop.id}
          >
            {markerId === stop.id && isOpen && (
                <InfoWindow onCloseClick={onToggleOpen}>
                  <div>
                    {stop.name}
                  </div>
                  {stopInfo && stopInfo.departures.map(item => (
                      <div>
                        {item.from} -> {item.to}
                        Scheduled: {new Date(item.scheduled)}
                        Estimated: {new Date(item.estimated)}

                        ETA: {item.min_until}min
                      </div>
                  ))}
                </InfoWindow>
            )}
          </Marker>
      ))}
    </GoogleMap>
  )
}))

export default GliderMap;
