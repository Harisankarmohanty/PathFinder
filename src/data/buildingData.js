// Building layout data with rooms and their connections
export const buildingData = {
  rooms: {
    // Ground Floor
    'G001': { name: 'Main Entrance', floor: 0, x: 50, y: 200, type: 'entrance' },
    'G002': { name: 'Reception', floor: 0, x: 150, y: 200, type: 'office' },
    'G003': { name: 'Security Office', floor: 0, x: 250, y: 200, type: 'office' },
    'G004': { name: 'Cafeteria', floor: 0, x: 350, y: 200, type: 'facility' },
    'G005': { name: 'Restroom G', floor: 0, x: 450, y: 200, type: 'restroom' },
    'G006': { name: 'Elevator G', floor: 0, x: 300, y: 100, type: 'elevator' },
    'G007': { name: 'Stairs G', floor: 0, x: 350, y: 100, type: 'stairs' },
    'G008': { name: 'Meeting Room A', floor: 0, x: 150, y: 100, type: 'meeting' },
    'G009': { name: 'Storage G', floor: 0, x: 50, y: 100, type: 'storage' },
    'G010': { name: 'IT Support', floor: 0, x: 450, y: 100, type: 'office' },

    // First Floor
    'F101': { name: 'Office 101', floor: 1, x: 50, y: 200, type: 'office' },
    'F102': { name: 'Office 102', floor: 1, x: 150, y: 200, type: 'office' },
    'F103': { name: 'Office 103', floor: 1, x: 250, y: 200, type: 'office' },
    'F104': { name: 'Conference Room B', floor: 1, x: 350, y: 200, type: 'meeting' },
    'F105': { name: 'Restroom F1', floor: 1, x: 450, y: 200, type: 'restroom' },
    'F106': { name: 'Elevator F1', floor: 1, x: 300, y: 100, type: 'elevator' },
    'F107': { name: 'Stairs F1', floor: 1, x: 350, y: 100, type: 'stairs' },
    'F108': { name: 'Break Room', floor: 1, x: 150, y: 100, type: 'facility' },
    'F109': { name: 'Server Room', floor: 1, x: 50, y: 100, type: 'technical' },
    'F110': { name: 'Manager Office', floor: 1, x: 450, y: 100, type: 'office' },

    // Second Floor
    'F201': { name: 'Training Room 1', floor: 2, x: 50, y: 200, type: 'training' },
    'F202': { name: 'Training Room 2', floor: 2, x: 150, y: 200, type: 'training' },
    'F203': { name: 'HR Office', floor: 2, x: 250, y: 200, type: 'office' },
    'F204': { name: 'Board Room', floor: 2, x: 350, y: 200, type: 'meeting' },
    'F205': { name: 'Restroom F2', floor: 2, x: 450, y: 200, type: 'restroom' },
    'F206': { name: 'Elevator F2', floor: 2, x: 300, y: 100, type: 'elevator' },
    'F207': { name: 'Stairs F2', floor: 2, x: 350, y: 100, type: 'stairs' },
    'F208': { name: 'Library', floor: 2, x: 150, y: 100, type: 'facility' },
    'F209': { name: 'Archive', floor: 2, x: 50, y: 100, type: 'storage' },
    'F210': { name: 'CEO Office', floor: 2, x: 450, y: 100, type: 'office' },
  },

  // Define connections between rooms (adjacency list)
  connections: {
    // Ground Floor connections
    'G001': ['G002', 'G009'],
    'G002': ['G001', 'G003', 'G008'],
    'G003': ['G002', 'G004', 'G006'],
    'G004': ['G003', 'G005'],
    'G005': ['G004', 'G010'],
    'G006': ['G003', 'G007', 'G008', 'F106'], // Elevator connects floors
    'G007': ['G006', 'G010', 'F107'], // Stairs connect floors
    'G008': ['G002', 'G006', 'G009'],
    'G009': ['G001', 'G008'],
    'G010': ['G005', 'G007'],

    // First Floor connections
    'F101': ['F102', 'F109'],
    'F102': ['F101', 'F103', 'F108'],
    'F103': ['F102', 'F104', 'F106'],
    'F104': ['F103', 'F105'],
    'F105': ['F104', 'F110'],
    'F106': ['F103', 'F107', 'F108', 'G006', 'F206'], // Elevator connects floors
    'F107': ['F106', 'F110', 'G007', 'F207'], // Stairs connect floors
    'F108': ['F102', 'F106', 'F109'],
    'F109': ['F101', 'F108'],
    'F110': ['F105', 'F107'],

    // Second Floor connections
    'F201': ['F202', 'F209'],
    'F202': ['F201', 'F203', 'F208'],
    'F203': ['F202', 'F204', 'F206'],
    'F204': ['F203', 'F205'],
    'F205': ['F204', 'F210'],
    'F206': ['F203', 'F207', 'F208', 'F106'], // Elevator connects floors
    'F207': ['F206', 'F210', 'F107'], // Stairs connect floors
    'F208': ['F202', 'F206', 'F209'],
    'F209': ['F201', 'F208'],
    'F210': ['F205', 'F207'],
  },

  // Floor layouts for visualization
  floors: {
    0: { name: 'Ground Floor', rooms: ['G001', 'G002', 'G003', 'G004', 'G005', 'G006', 'G007', 'G008', 'G009', 'G010'] },
    1: { name: 'First Floor', rooms: ['F101', 'F102', 'F103', 'F104', 'F105', 'F106', 'F107', 'F108', 'F109', 'F110'] },
    2: { name: 'Second Floor', rooms: ['F201', 'F202', 'F203', 'F204', 'F205', 'F206', 'F207', 'F208', 'F209', 'F210'] },
  },

  // Room type colors for visualization
  roomTypeColors: {
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
  },
};

// Get all room IDs for autocomplete
export const getAllRooms = () => {
  return Object.keys(buildingData.rooms).map(id => ({
    id,
    name: buildingData.rooms[id].name,
    floor: buildingData.rooms[id].floor,
    type: buildingData.rooms[id].type,
  }));
};

// Search rooms by name or ID
export const searchRooms = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return getAllRooms().filter(room => 
    room.id.toLowerCase().includes(lowercaseQuery) ||
    room.name.toLowerCase().includes(lowercaseQuery)
  );
};