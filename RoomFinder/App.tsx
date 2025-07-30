import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Sample building data - in a real app, this would come from a database
const buildingData = {
  rooms: [
    { id: '101', name: 'Room 101', floor: 1, x: 50, y: 50 },
    { id: '102', name: 'Room 102', floor: 1, x: 150, y: 50 },
    { id: '103', name: 'Room 103', floor: 1, x: 250, y: 50 },
    { id: '201', name: 'Room 201', floor: 2, x: 50, y: 150 },
    { id: '202', name: 'Room 202', floor: 2, x: 150, y: 150 },
    { id: '203', name: 'Room 203', floor: 2, x: 250, y: 150 },
    { id: '301', name: 'Room 301', floor: 3, x: 50, y: 250 },
    { id: '302', name: 'Room 302', floor: 3, x: 150, y: 250 },
    { id: '303', name: 'Room 303', floor: 3, x: 250, y: 250 },
    { id: 'lobby', name: 'Main Lobby', floor: 1, x: 100, y: 0 },
    { id: 'elevator1', name: 'Elevator 1', floor: 1, x: 200, y: 0 },
    { id: 'elevator2', name: 'Elevator 2', floor: 2, x: 200, y: 100 },
    { id: 'elevator3', name: 'Elevator 3', floor: 3, x: 200, y: 200 },
    { id: 'stairs1', name: 'Stairs 1', floor: 1, x: 0, y: 0 },
    { id: 'stairs2', name: 'Stairs 2', floor: 2, x: 0, y: 100 },
    { id: 'stairs3', name: 'Stairs 3', floor: 3, x: 0, y: 200 },
  ],
  connections: [
    // Floor 1 connections
    { from: 'lobby', to: '101', distance: 50 },
    { from: 'lobby', to: '102', distance: 100 },
    { from: 'lobby', to: '103', distance: 150 },
    { from: 'lobby', to: 'elevator1', distance: 100 },
    { from: 'lobby', to: 'stairs1', distance: 100 },
    { from: '101', to: '102', distance: 100 },
    { from: '102', to: '103', distance: 100 },
    { from: 'elevator1', to: 'elevator2', distance: 100 },
    { from: 'stairs1', to: 'stairs2', distance: 100 },
    
    // Floor 2 connections
    { from: 'elevator2', to: '201', distance: 50 },
    { from: 'elevator2', to: '202', distance: 100 },
    { from: 'elevator2', to: '203', distance: 150 },
    { from: 'stairs2', to: '201', distance: 50 },
    { from: 'stairs2', to: '202', distance: 100 },
    { from: 'stairs2', to: '203', distance: 150 },
    { from: '201', to: '202', distance: 100 },
    { from: '202', to: '203', distance: 100 },
    { from: 'elevator2', to: 'elevator3', distance: 100 },
    { from: 'stairs2', to: 'stairs3', distance: 100 },
    
    // Floor 3 connections
    { from: 'elevator3', to: '301', distance: 50 },
    { from: 'elevator3', to: '302', distance: 100 },
    { from: 'elevator3', to: '303', distance: 150 },
    { from: 'stairs3', to: '301', distance: 50 },
    { from: 'stairs3', to: '302', distance: 100 },
    { from: 'stairs3', to: '303', distance: 150 },
    { from: '301', to: '302', distance: 100 },
    { from: '302', to: '303', distance: 100 },
  ]
};

// Dijkstra's algorithm for finding shortest path
function findShortestPath(startRoom: string, endRoom: string) {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const unvisited = new Set<string>();
  
  // Initialize distances
  buildingData.rooms.forEach(room => {
    distances[room.id] = room.id === startRoom ? 0 : Infinity;
    unvisited.add(room.id);
  });
  
  while (unvisited.size > 0) {
    // Find room with minimum distance
    let currentRoom = '';
    let minDistance = Infinity;
    
    for (const roomId of unvisited) {
      if (distances[roomId] < minDistance) {
        minDistance = distances[roomId];
        currentRoom = roomId;
      }
    }
    
    if (currentRoom === '' || minDistance === Infinity) break;
    
    unvisited.delete(currentRoom);
    
    // Check all connections from current room
    buildingData.connections.forEach(connection => {
      if (connection.from === currentRoom) {
        const neighbor = connection.to;
        const newDistance = distances[currentRoom] + connection.distance;
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentRoom;
        }
      }
      if (connection.to === currentRoom) {
        const neighbor = connection.from;
        const newDistance = distances[currentRoom] + connection.distance;
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentRoom;
        }
      }
    });
  }
  
  // Reconstruct path
  const path: string[] = [];
  let current = endRoom;
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current] || null;
  }
  
  return path.length > 1 ? path : [];
}

export default function App() {
  const [startRoom, setStartRoom] = useState('');
  const [endRoom, setEndRoom] = useState('');
  const [path, setPath] = useState<string[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);

  const findPath = () => {
    if (!startRoom || !endRoom) {
      Alert.alert('Error', 'Please enter both start and end rooms');
      return;
    }

    const startRoomData = buildingData.rooms.find(room => 
      room.id.toLowerCase() === startRoom.toLowerCase() || 
      room.name.toLowerCase().includes(startRoom.toLowerCase())
    );
    
    const endRoomData = buildingData.rooms.find(room => 
      room.id.toLowerCase() === endRoom.toLowerCase() || 
      room.name.toLowerCase().includes(endRoom.toLowerCase())
    );

    if (!startRoomData) {
      Alert.alert('Error', `Start room "${startRoom}" not found`);
      return;
    }

    if (!endRoomData) {
      Alert.alert('Error', `End room "${endRoom}" not found`);
      return;
    }

    const shortestPath = findShortestPath(startRoomData.id, endRoomData.id);
    
    if (shortestPath.length === 0) {
      Alert.alert('Error', 'No path found between the selected rooms');
      return;
    }

    // Calculate total distance
    let distance = 0;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      const connection = buildingData.connections.find(conn => 
        (conn.from === shortestPath[i] && conn.to === shortestPath[i + 1]) ||
        (conn.from === shortestPath[i + 1] && conn.to === shortestPath[i])
      );
      if (connection) {
        distance += connection.distance;
      }
    }

    setPath(shortestPath);
    setTotalDistance(distance);
  };

  const clearPath = () => {
    setPath([]);
    setTotalDistance(0);
    setStartRoom('');
    setEndRoom('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🏢 Room Finder</Text>
          <Text style={styles.subtitle}>Find the shortest path to any room</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>📍 Start Room</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter current room (e.g., 101, lobby)"
              placeholderTextColor="#999"
              value={startRoom}
              onChangeText={setStartRoom}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>🎯 Destination Room</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination room (e.g., 203, elevator)"
              placeholderTextColor="#999"
              value={endRoom}
              onChangeText={setEndRoom}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.findButton} onPress={findPath}>
              <Text style={styles.buttonText}>🔍 Find Path</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clearButton} onPress={clearPath}>
              <Text style={styles.clearButtonText}>🗑️ Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {path.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>📍 Route Found</Text>
            <Text style={styles.distanceText}>
              Total Distance: {totalDistance} units
            </Text>
            
            <ScrollView style={styles.pathContainer}>
              {path.map((roomId, index) => {
                const room = buildingData.rooms.find(r => r.id === roomId);
                return (
                  <View key={roomId} style={styles.pathStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepInfo}>
                      <Text style={styles.roomName}>{room?.name || roomId}</Text>
                      <Text style={styles.roomFloor}>Floor {room?.floor}</Text>
                    </View>
                    {index < path.length - 1 && (
                      <View style={styles.arrow}>
                        <Text style={styles.arrowText}>↓</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.availableRooms}>
          <Text style={styles.availableTitle}>Available Rooms:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.roomList}>
              {buildingData.rooms.map(room => (
                <TouchableOpacity
                  key={room.id}
                  style={styles.roomChip}
                  onPress={() => setEndRoom(room.id)}
                >
                  <Text style={styles.roomChipText}>{room.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  findButton: {
    backgroundColor: '#667eea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  distanceText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 15,
  },
  pathContainer: {
    maxHeight: 200,
  },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  roomFloor: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    marginLeft: 10,
  },
  arrowText: {
    fontSize: 20,
    color: '#667eea',
  },
  availableRooms: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  availableTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  roomList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roomChip: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  roomChipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
