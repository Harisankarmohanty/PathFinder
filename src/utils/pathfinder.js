import { buildingData } from '../data/buildingData';

// Calculate Euclidean distance between two rooms
const calculateDistance = (room1Id, room2Id) => {
  const room1 = buildingData.rooms[room1Id];
  const room2 = buildingData.rooms[room2Id];
  
  if (!room1 || !room2) return Infinity;
  
  // If rooms are on different floors, add floor change penalty
  const floorPenalty = Math.abs(room1.floor - room2.floor) * 50;
  
  // Calculate 2D distance
  const dx = room1.x - room2.x;
  const dy = room1.y - room2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance + floorPenalty;
};

// Dijkstra's algorithm implementation
export const findShortestPath = (startRoomId, endRoomId) => {
  if (!buildingData.rooms[startRoomId] || !buildingData.rooms[endRoomId]) {
    return { path: [], distance: Infinity, error: 'Invalid room ID' };
  }
  
  if (startRoomId === endRoomId) {
    return { 
      path: [startRoomId], 
      distance: 0, 
      directions: ['You are already at your destination!'] 
    };
  }
  
  // Initialize distances and previous nodes
  const distances = {};
  const previous = {};
  const visited = new Set();
  const unvisited = new Set();
  
  // Initialize all rooms
  Object.keys(buildingData.rooms).forEach(roomId => {
    distances[roomId] = Infinity;
    previous[roomId] = null;
    unvisited.add(roomId);
  });
  
  // Set starting room distance to 0
  distances[startRoomId] = 0;
  
  while (unvisited.size > 0) {
    // Find unvisited room with minimum distance
    let currentRoom = null;
    let minDistance = Infinity;
    
    for (const roomId of unvisited) {
      if (distances[roomId] < minDistance) {
        minDistance = distances[roomId];
        currentRoom = roomId;
      }
    }
    
    if (currentRoom === null || minDistance === Infinity) {
      break; // No path exists
    }
    
    // Remove current room from unvisited
    unvisited.delete(currentRoom);
    visited.add(currentRoom);
    
    // If we reached the destination, we can stop
    if (currentRoom === endRoomId) {
      break;
    }
    
    // Check all neighbors
    const neighbors = buildingData.connections[currentRoom] || [];
    
    for (const neighborId of neighbors) {
      if (visited.has(neighborId)) continue;
      
      const distance = calculateDistance(currentRoom, neighborId);
      const newDistance = distances[currentRoom] + distance;
      
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previous[neighborId] = currentRoom;
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let currentRoom = endRoomId;
  
  while (currentRoom !== null) {
    path.unshift(currentRoom);
    currentRoom = previous[currentRoom];
  }
  
  // If path doesn't start with startRoomId, no path exists
  if (path[0] !== startRoomId) {
    return { 
      path: [], 
      distance: Infinity, 
      error: 'No path found between the specified rooms' 
    };
  }
  
  // Generate turn-by-turn directions
  const directions = generateDirections(path);
  
  return {
    path,
    distance: distances[endRoomId],
    directions,
    totalSteps: path.length - 1
  };
};

// Generate human-readable directions
const generateDirections = (path) => {
  if (path.length <= 1) return [];
  
  const directions = [];
  let currentFloor = buildingData.rooms[path[0]].floor;
  
  directions.push(`Start at ${buildingData.rooms[path[0]].name} (${path[0]})`);
  
  for (let i = 1; i < path.length; i++) {
    const currentRoom = buildingData.rooms[path[i]];
    const previousRoom = buildingData.rooms[path[i - 1]];
    
    // Check for floor changes
    if (currentRoom.floor !== currentFloor) {
      if (currentRoom.type === 'elevator') {
        directions.push(`Take the elevator to ${buildingData.floors[currentRoom.floor].name}`);
      } else if (currentRoom.type === 'stairs') {
        const floorDirection = currentRoom.floor > currentFloor ? 'up' : 'down';
        directions.push(`Take the stairs ${floorDirection} to ${buildingData.floors[currentRoom.floor].name}`);
      }
      currentFloor = currentRoom.floor;
    }
    
    // Add room-to-room direction
    if (i === path.length - 1) {
      directions.push(`Arrive at ${currentRoom.name} (${path[i]})`);
    } else {
      const direction = getDirection(previousRoom, currentRoom);
      directions.push(`Go ${direction} to ${currentRoom.name} (${path[i]})`);
    }
  }
  
  return directions;
};

// Calculate relative direction between two rooms
const getDirection = (fromRoom, toRoom) => {
  const dx = toRoom.x - fromRoom.x;
  const dy = toRoom.y - fromRoom.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'east' : 'west';
  } else {
    return dy > 0 ? 'south' : 'north';
  }
};

// Find nearby rooms within a certain distance
export const findNearbyRooms = (roomId, maxDistance = 100) => {
  const targetRoom = buildingData.rooms[roomId];
  if (!targetRoom) return [];
  
  const nearbyRooms = [];
  
  Object.keys(buildingData.rooms).forEach(id => {
    if (id === roomId) return;
    
    const room = buildingData.rooms[id];
    const distance = calculateDistance(roomId, id);
    
    if (distance <= maxDistance) {
      nearbyRooms.push({
        id,
        name: room.name,
        distance,
        floor: room.floor,
        type: room.type
      });
    }
  });
  
  return nearbyRooms.sort((a, b) => a.distance - b.distance);
};

// Get rooms on the same floor
export const getRoomsOnFloor = (floorNumber) => {
  return buildingData.floors[floorNumber]?.rooms.map(roomId => ({
    id: roomId,
    ...buildingData.rooms[roomId]
  })) || [];
};

// Calculate total walking time estimate (assuming 1.4 m/s walking speed)
export const estimateWalkingTime = (distance) => {
  const walkingSpeedMeterPerSecond = 1.4;
  const distanceInMeters = distance / 10; // Convert pixels to approximate meters
  const timeInSeconds = distanceInMeters / walkingSpeedMeterPerSecond;
  
  if (timeInSeconds < 60) {
    return `${Math.round(timeInSeconds)} seconds`;
  } else {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.round(timeInSeconds % 60);
    return `${minutes}m ${seconds}s`;
  }
};