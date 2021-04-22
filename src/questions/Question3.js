import React, {useEffect, useState} from "react";
import Endpoints from "../util/Endpoints";
import GliderMap from "../components/GliderMap";
import busIcon from "../assets/bus-icon.png"

export default function Question3 (props) {
  // Displaying real-time metrics for our devices' locations and statuses is a critical component of our reporting strategy.
  // This allows us to provide accurate, live data to our clients.
  //
  // Using Translink's JourneyPlanner API, implement an MVP in React for a real-time reporting dashboard.
  // What exactly this consists of is up to you, but preferably it will include:
  // - A map component (or a *very* pretty table, lol)
  // - A way to locate/inspect stops
  // - A way to track buses
  // - Information about the routes available
  //
  // As Translink's JourneyPlanner API is supposedly quite complex and undocumented (surprise surprise!) you may find this package useful:
  // https://github.com/McPo/belfast-glider-api-server
  //
  // This file contains the map component and two endpoints to obtain Stop data.


  const [stops, setStops] = useState([]);

  const [currentStop, setCurrentStop] = useState(undefined)
  const [showAllStops, setShowAllStops] = useState(true)

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchStops().then(newStops => setCurrentStop(newStops[0]))
  }, [])

    const handleSearchTextChange = (e) => setSearchText(e.target.value)

    const handleShowAllStops = () => {
      console.log(showAllStops)
      setShowAllStops(!showAllStops)
  }

    const handleStopClick = (stop) => {
      console.log('current stop clicked', stop)
      if (!currentStop) setCurrentStop(stop)
      else if (currentStop.id === stop.id) setCurrentStop(undefined)
      else setCurrentStop(stop)
    }

  const fetchStops = () =>
    fetch(Endpoints.STOPS)
      .then(res => {
          let newStops = res.json()
          console.log(newStops)
          return newStops
      })
      .then(newStops => {
        if (newStops.stops.length) {
          setStops(newStops.stops);
          return newStops
        }
      })
      .catch(e => console.log(e))


  const fetchStopInfo = (stop) =>
    fetch(Endpoints.STOP_INFO + '/' + stop.id)
      .then(res => res.json())
      .catch(e => console.log(e))

  return (
    <div style={styles.root}>
        <div style={styles.leftPanel}>
            <button style={{ marginBottom: 8 }} onClick={handleShowAllStops}>Toggle Show All Stops</button>
            <div style={{ marginBottom: 8 }}>Search</div>
            <input style={{ marginBottom: 8 }} value={searchText} onChange={handleSearchTextChange}/>
            {stops && stops.map((stop, index) => {
                if (stop.name.toUpperCase().includes(searchText.toUpperCase()))
                    return (
                        <div style={currentStop && currentStop.id === stop.id ? {...styles.stopItem, ...styles.stopItemSelected} : styles.stopItem } key={stop.id} onClick={() => handleStopClick(stop)}>
                            <div style={styles.stopIcon}>
                                <div style={styles.stopNumber}>{index}</div>
                            </div>
                            <div style={styles.stopLabel}>
                                {stop.name}
                            </div>
                        </div>
                    )
            })}
        </div>
        <div style={styles.rightPanel}>
            <div>Current Stop: {currentStop && currentStop.name}</div>
            <GliderMap
                stops={stops}
                showAllStops={showAllStops}
                currentStop={currentStop}
                fetchStopInfo={fetchStopInfo}
                googleMapURL={'https://maps.googleapis.com/maps/api/js?key=AIzaSyBkHRuOEvL8BERtTR0oIB-mw8e0QkMVA2U&v=3.exp&libraries=geometry,drawing,places'}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `800px`, margin: 20 }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    </div>
  );
}

const styles = {
    root: {
        display: 'flex',
        backgroundColor: '#f5f5f5',
    },
    leftPanel: {
        flex: 1,
        margin: 16,
    },
    rightPanel: {
        flex: 2,
    },
    stopItem: {
        display: 'flex',
        backgroundColor: '#ffffff',
        marginBottom: 8,
        borderRadius: 10,
        cursor: 'pointer',
    },
    stopItemSelected: {
        backgroundColor: '#1b5292',
        color: '#ffffff'
    },
    stopIcon: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 16,
    },
    stopNumber: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 26,
        height: 26,
        backgroundColor: '#1b5292',
        borderRadius: 10,
        color: '#fff'
    },
    busIcon: {
        width: 14,
        hidden: 14,
        margin: 10,
    },
    stopLabel: {
        flex: 1,
        textAlign: 'left',
        margin: 10,
    },
}
