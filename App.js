import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RoomInput from './src/components/RoomInput';
import FloorMap from './src/components/FloorMap';
import DirectionsPanel from './src/components/DirectionsPanel';
import { findShortestPath, findNearbyRooms } from './src/utils/pathfinder';
import { buildingData } from './src/data/buildingData';

const App = () => {
  const [startRoom, setStartRoom] = useState(null);
  const [endRoom, setEndRoom] = useState(null);
  const [pathResult, setPathResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    if (startRoom && endRoom) {
      calculatePath();
    } else {
      setPathResult(null);
      setShowDirections(false);
    }
  }, [startRoom, endRoom]);

  const calculatePath = async () => {
    if (!startRoom || !endRoom) return;
    
    setIsCalculating(true);
    
    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = findShortestPath(startRoom, endRoom);
      
      if (result.error) {
        Alert.alert('Navigation Error', result.error);
        setPathResult(null);
      } else {
        setPathResult(result);
        setShowDirections(true);
        
        // Auto-switch to floor containing start room
        const startRoomData = buildingData.rooms[startRoom];
        if (startRoomData) {
          setSelectedFloor(startRoomData.floor);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate path. Please try again.');
      setPathResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRoomPress = (roomId) => {
    if (!startRoom) {
      setStartRoom(roomId);
    } else if (!endRoom) {
      setEndRoom(roomId);
    } else {
      // If both rooms are selected, replace the end room
      setEndRoom(roomId);
    }
  };

  const swapRooms = () => {
    const temp = startRoom;
    setStartRoom(endRoom);
    setEndRoom(temp);
  };

  const clearAll = () => {
    setStartRoom(null);
    setEndRoom(null);
    setPathResult(null);
    setShowDirections(false);
  };

  const findNearby = () => {
    if (!startRoom) {
      Alert.alert('Select Start Room', 'Please select a starting room first.');
      return;
    }

    const nearby = findNearbyRooms(startRoom, 150);
    if (nearby.length === 0) {
      Alert.alert('No Nearby Rooms', 'No rooms found within reasonable distance.');
      return;
    }

    const nearbyList = nearby.slice(0, 5).map(room => 
      `${room.name} (${room.id}) - ${Math.round(room.distance)} units away`
    ).join('\n');

    Alert.alert(
      'Nearby Rooms', 
      `Rooms near ${buildingData.rooms[startRoom].name}:\n\n${nearbyList}`,
      [{ text: 'OK' }]
    );
  };

  const getFloorNumbers = () => {
    return Object.keys(buildingData.floors).map(Number).sort((a, b) => a - b);
  };

  const renderFloorSelector = () => (
    <View style={styles.floorSelector}>
      <Text style={styles.floorSelectorTitle}>View Floor:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {getFloorNumbers().map(floorNum => (
          <TouchableOpacity
            key={floorNum}
            style={[
              styles.floorButton,
              selectedFloor === floorNum && styles.floorButtonActive
            ]}
            onPress={() => setSelectedFloor(floorNum)}
          >
            <Text style={[
              styles.floorButtonText,
              selectedFloor === floorNum && styles.floorButtonTextActive
            ]}>
              {buildingData.floors[floorNum].name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.swapButton]}
        onPress={swapRooms}
        disabled={!startRoom || !endRoom}
      >
        <Text style={styles.actionButtonText}>🔄 Swap</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.nearbyButton]}
        onPress={findNearby}
        disabled={!startRoom}
      >
        <Text style={styles.actionButtonText}>📍 Nearby</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.clearButton]}
        onPress={clearAll}
        disabled={!startRoom && !endRoom}
      >
        <Text style={styles.actionButtonText}>🗑️ Clear</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPathSummary = () => {
    if (!pathResult) return null;

    return (
      <View style={styles.pathSummary}>
        <View style={styles.pathSummaryHeader}>
          <Text style={styles.pathSummaryTitle}>Route Found!</Text>
          <Text style={styles.pathSummaryDetails}>
            {pathResult.totalSteps} steps • {Math.round(pathResult.distance)} units
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.directionsToggle}
          onPress={() => setShowDirections(!showDirections)}
        >
          <Text style={styles.directionsToggleText}>
            {showDirections ? 'Hide' : 'Show'} Directions
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.appTitle}>🗺️ Room Finder</Text>
        <Text style={styles.appSubtitle}>Find the shortest path between rooms</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Room Selection */}
        <View style={styles.inputSection}>
          <RoomInput
            label="From (Starting Room)"
            value={startRoom}
            onRoomSelect={setStartRoom}
            placeholder="Select your current location..."
          />
          
          <RoomInput
            label="To (Destination Room)"
            value={endRoom}
            onRoomSelect={setEndRoom}
            placeholder="Where do you want to go..."
          />
          
          {renderActionButtons()}
        </View>

        {/* Loading Indicator */}
        {isCalculating && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Calculating shortest path...</Text>
          </View>
        )}

        {/* Path Summary */}
        {renderPathSummary()}

        {/* Directions Panel */}
        {showDirections && pathResult && (
          <DirectionsPanel
            directions={pathResult.directions}
            distance={pathResult.distance}
            totalSteps={pathResult.totalSteps}
            startRoom={startRoom}
            endRoom={endRoom}
            onClose={() => setShowDirections(false)}
          />
        )}

        {/* Floor Selector */}
        {renderFloorSelector()}

        {/* Floor Map */}
        <FloorMap
          floorNumber={selectedFloor}
          path={pathResult?.path || []}
          startRoom={startRoom}
          endRoom={endRoom}
          onRoomPress={handleRoomPress}
        />

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>How to use:</Text>
          <Text style={styles.helpText}>
            1. Select your starting room (where you are now){'\n'}
            2. Select your destination room{'\n'}
            3. View the calculated path on the map{'\n'}
            4. Follow the turn-by-turn directions{'\n'}
            5. Tap rooms on the map to select them quickly
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  swapButton: {
    backgroundColor: '#2196F3',
  },
  nearbyButton: {
    backgroundColor: '#FF9800',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  pathSummary: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  pathSummaryHeader: {
    marginBottom: 12,
  },
  pathSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  pathSummaryDetails: {
    fontSize: 14,
    color: '#388e3c',
  },
  directionsToggle: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  directionsToggleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  floorSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  floorSelectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  floorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  floorButtonActive: {
    backgroundColor: '#2196F3',
  },
  floorButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  floorButtonTextActive: {
    color: '#fff',
  },
  helpSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default App;