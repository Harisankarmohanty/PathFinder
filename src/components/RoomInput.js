import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import { searchRooms, getAllRooms } from '../data/buildingData';

const RoomInput = ({ 
  label, 
  value, 
  onRoomSelect, 
  placeholder = "Search for a room...",
  style 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (value) {
      const allRooms = getAllRooms();
      const room = allRooms.find(r => r.id === value);
      setSelectedRoom(room);
      setSearchQuery(room ? `${room.name} (${room.id})` : '');
    }
  }, [value]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    if (text.length > 0) {
      const results = searchRooms(text);
      setSuggestions(results.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSearchQuery(`${room.name} (${room.id})`);
    setShowSuggestions(false);
    onRoomSelect(room.id);
  };

  const clearSelection = () => {
    setSelectedRoom(null);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onRoomSelect(null);
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleRoomSelect(item)}
    >
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionDetails}>
          {item.id} • Floor {item.floor} • {item.type}
        </Text>
      </View>
      <View style={[styles.roomTypeIndicator, { backgroundColor: getRoomTypeColor(item.type) }]} />
    </TouchableOpacity>
  );

  const getRoomTypeColor = (type) => {
    const colors = {
      entrance: '#4CAF50',
      office: '#2196F3',
      meeting: '#FF9800',
      facility: '#9C27B0',
      restroom: '#607D8B',
      elevator: '#F44336',
      stairs: '#795548',
      storage: '#9E9E9E',
      technical: '#3F51B5',
      training: '#00BCD4',
    };
    return colors[type] || '#9E9E9E';
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        
        {selectedRoom && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearSelection}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedRoom && (
        <View style={styles.selectedRoomInfo}>
          <View style={[styles.roomTypeIndicator, { backgroundColor: getRoomTypeColor(selectedRoom.type) }]} />
          <Text style={styles.selectedRoomText}>
            Floor {selectedRoom.floor} • {selectedRoom.type}
          </Text>
        </View>
      )}

      <Modal
        visible={showSuggestions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuggestions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSuggestions(false)}
        >
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 12,
    paddingLeft: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  selectedRoomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  selectedRoomText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    width: '90%',
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  suggestionDetails: {
    fontSize: 14,
    color: '#666',
  },
  roomTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
});

export default RoomInput;