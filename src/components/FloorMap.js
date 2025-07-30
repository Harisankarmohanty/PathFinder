import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { 
  Rect, 
  Circle, 
  Line, 
  Text as SvgText, 
  Path 
} from 'react-native-svg';
import { buildingData } from '../data/buildingData';

const { width: screenWidth } = Dimensions.get('window');
const MAP_WIDTH = screenWidth - 40;
const MAP_HEIGHT = 300;
const SCALE_X = MAP_WIDTH / 500;
const SCALE_Y = MAP_HEIGHT / 250;

const FloorMap = ({ 
  floorNumber, 
  path = [], 
  startRoom, 
  endRoom, 
  onRoomPress 
}) => {
  const floorData = buildingData.floors[floorNumber];
  
  if (!floorData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Floor {floorNumber} not found</Text>
      </View>
    );
  }

  const rooms = floorData.rooms.map(roomId => ({
    id: roomId,
    ...buildingData.rooms[roomId]
  }));

  const getRoomColor = (roomId, roomType) => {
    if (roomId === startRoom) return '#4CAF50'; // Green for start
    if (roomId === endRoom) return '#F44336'; // Red for end
    if (path.includes(roomId)) return '#FF9800'; // Orange for path
    return buildingData.roomTypeColors[roomType] || '#9E9E9E';
  };

  const isRoomOnPath = (roomId) => path.includes(roomId);

  const renderRoom = (room) => {
    const x = room.x * SCALE_X;
    const y = room.y * SCALE_Y;
    const isOnPath = isRoomOnPath(room.id);
    const isStart = room.id === startRoom;
    const isEnd = room.id === endRoom;
    
    return (
      <React.Fragment key={room.id}>
        <Rect
          x={x - 15}
          y={y - 15}
          width={30}
          height={30}
          fill={getRoomColor(room.id, room.type)}
          stroke={isOnPath ? '#333' : '#666'}
          strokeWidth={isOnPath ? 2 : 1}
          rx={4}
          onPress={() => onRoomPress && onRoomPress(room.id)}
        />
        
        {/* Room label */}
        <SvgText
          x={x}
          y={y + 25}
          fontSize="10"
          textAnchor="middle"
          fill="#333"
          fontWeight={isOnPath ? 'bold' : 'normal'}
        >
          {room.id}
        </SvgText>
        
        {/* Special markers for start/end */}
        {isStart && (
          <Circle
            cx={x + 10}
            cy={y - 10}
            r={4}
            fill="#fff"
            stroke="#4CAF50"
            strokeWidth={2}
          />
        )}
        
        {isEnd && (
          <Circle
            cx={x + 10}
            cy={y - 10}
            r={4}
            fill="#fff"
            stroke="#F44336"
            strokeWidth={2}
          />
        )}
      </React.Fragment>
    );
  };

  const renderConnections = () => {
    const connections = [];
    
    rooms.forEach(room => {
      const roomConnections = buildingData.connections[room.id] || [];
      const x1 = room.x * SCALE_X;
      const y1 = room.y * SCALE_Y;
      
      roomConnections.forEach(connectedRoomId => {
        const connectedRoom = buildingData.rooms[connectedRoomId];
        if (connectedRoom && connectedRoom.floor === floorNumber) {
          const x2 = connectedRoom.x * SCALE_X;
          const y2 = connectedRoom.y * SCALE_Y;
          
          const isPathConnection = path.includes(room.id) && path.includes(connectedRoomId) &&
            Math.abs(path.indexOf(room.id) - path.indexOf(connectedRoomId)) === 1;
          
          connections.push(
            <Line
              key={`${room.id}-${connectedRoomId}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isPathConnection ? '#FF9800' : '#ddd'}
              strokeWidth={isPathConnection ? 3 : 1}
              strokeDasharray={isPathConnection ? undefined : '2,2'}
            />
          );
        }
      });
    });
    
    return connections;
  };

  const renderPathArrows = () => {
    if (path.length < 2) return null;
    
    const arrows = [];
    const floorPath = path.filter(roomId => buildingData.rooms[roomId].floor === floorNumber);
    
    for (let i = 0; i < floorPath.length - 1; i++) {
      const currentRoom = buildingData.rooms[floorPath[i]];
      const nextRoom = buildingData.rooms[floorPath[i + 1]];
      
      if (currentRoom && nextRoom) {
        const x1 = currentRoom.x * SCALE_X;
        const y1 = currentRoom.y * SCALE_Y;
        const x2 = nextRoom.x * SCALE_X;
        const y2 = nextRoom.y * SCALE_Y;
        
        // Calculate arrow position (midpoint)
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // Calculate arrow direction
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowLength = 8;
        const arrowAngle = Math.PI / 6;
        
        const arrowX1 = midX - arrowLength * Math.cos(angle - arrowAngle);
        const arrowY1 = midY - arrowLength * Math.sin(angle - arrowAngle);
        const arrowX2 = midX - arrowLength * Math.cos(angle + arrowAngle);
        const arrowY2 = midY - arrowLength * Math.sin(angle + arrowAngle);
        
        arrows.push(
          <Path
            key={`arrow-${i}`}
            d={`M ${midX} ${midY} L ${arrowX1} ${arrowY1} M ${midX} ${midY} L ${arrowX2} ${arrowY2}`}
            stroke="#FF9800"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      }
    }
    
    return arrows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.floorTitle}>{floorData.name}</Text>
        {path.length > 0 && (
          <Text style={styles.pathInfo}>
            Path shown: {path.filter(roomId => buildingData.rooms[roomId].floor === floorNumber).length} rooms
          </Text>
        )}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.mapContainer}
      >
        <Svg width={MAP_WIDTH} height={MAP_HEIGHT} style={styles.svg}>
          {/* Grid background */}
          <Rect
            x={0}
            y={0}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            fill="#f8f9fa"
            stroke="#e9ecef"
            strokeWidth={1}
          />
          
          {/* Room connections */}
          {renderConnections()}
          
          {/* Path arrows */}
          {renderPathArrows()}
          
          {/* Rooms */}
          {rooms.map(renderRoom)}
        </Svg>
      </ScrollView>
      
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendItem, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Start</Text>
          
          <View style={[styles.legendItem, { backgroundColor: '#F44336' }]} />
          <Text style={styles.legendText}>End</Text>
          
          <View style={[styles.legendItem, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Path</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  floorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  pathInfo: {
    fontSize: 12,
    color: '#666',
  },
  mapContainer: {
    marginBottom: 12,
  },
  svg: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendItem: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
    marginLeft: 16,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    padding: 20,
  },
});

export default FloorMap;