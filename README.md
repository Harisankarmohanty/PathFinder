# 🗺️ Room Finder - Mobile Navigation App

A React Native mobile application that helps users find the shortest path between rooms in a building using advanced pathfinding algorithms.

## ✨ Features

### 🎯 Core Functionality
- **Smart Room Search**: Autocomplete search with room names and IDs
- **Shortest Path Calculation**: Uses Dijkstra's algorithm for optimal routing
- **Multi-Floor Navigation**: Seamlessly navigate between different floors
- **Turn-by-Turn Directions**: Clear, step-by-step navigation instructions
- **Interactive Floor Maps**: Visual representation of building layout with path highlighting

### 🚀 Advanced Features
- **Nearby Room Discovery**: Find rooms within a specified distance
- **Room Swapping**: Quickly swap start and destination rooms
- **Real-time Path Visualization**: See your route highlighted on interactive maps
- **Walking Time Estimation**: Get estimated walking time for your route
- **Floor-by-Floor View**: Switch between different building floors
- **Touch-to-Select**: Tap rooms directly on the map to select them

### 🏢 Building Layout
The app includes a comprehensive 3-floor building with:
- **Ground Floor**: Entrance, reception, cafeteria, meeting rooms, elevators, stairs
- **First Floor**: Offices, conference rooms, break room, server room
- **Second Floor**: Training rooms, HR office, board room, library, CEO office

## 🛠️ Technology Stack

- **Framework**: React Native 0.72.0
- **UI Library**: React Native Paper
- **Graphics**: React Native SVG for floor maps
- **Navigation**: React Navigation
- **Algorithm**: Dijkstra's shortest path algorithm
- **Development**: Expo CLI for easy development and testing

## 📱 Installation & Setup

### Prerequisites
- Node.js (>= 16)
- npm or yarn
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd room-finder-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on your device**
   
   For Android:
   ```bash
   npm run android
   # or
   yarn android
   ```
   
   For iOS:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

   For Web (development):
   ```bash
   npm run web
   # or
   yarn web
   ```

### Development Setup

1. **Install Expo CLI globally** (optional but recommended)
   ```bash
   npm install -g @expo/cli
   ```

2. **Run with Expo**
   ```bash
   expo start
   ```

## 🎮 How to Use

### Basic Navigation
1. **Select Starting Room**: Use the search field to find your current location
2. **Choose Destination**: Search and select where you want to go
3. **View Path**: The app automatically calculates and displays the shortest route
4. **Follow Directions**: Get turn-by-turn navigation instructions
5. **Interactive Maps**: View your path on detailed floor maps

### Advanced Features
- **🔄 Swap Rooms**: Quickly reverse your route
- **📍 Find Nearby**: Discover rooms close to your current location  
- **🗑️ Clear All**: Reset all selections to start over
- **👆 Tap to Select**: Touch rooms directly on the map for quick selection
- **🏢 Floor Navigation**: Switch between building floors to see different levels

### Room Types & Color Coding
- 🟢 **Entrance**: Main building entrances
- 🔵 **Office**: Individual and shared office spaces
- 🟠 **Meeting**: Conference and meeting rooms
- 🟣 **Facility**: Cafeteria, break rooms, libraries
- ⚫ **Restroom**: Bathroom facilities
- 🔴 **Elevator**: Vertical transportation
- 🟤 **Stairs**: Stairwells for floor changes
- ⚪ **Storage**: Storage and archive rooms
- 🟦 **Technical**: Server rooms, IT facilities
- 🟦 **Training**: Training and education rooms

## 🏗️ Project Structure

```
room-finder-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── RoomInput.js     # Room search and selection
│   │   ├── FloorMap.js      # Interactive floor visualization
│   │   └── DirectionsPanel.js # Navigation instructions
│   ├── data/
│   │   └── buildingData.js  # Building layout and room data
│   └── utils/
│       └── pathfinder.js    # Pathfinding algorithms
├── App.js                   # Main application component
├── index.js                 # Entry point
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🧠 Algorithm Details

### Dijkstra's Algorithm Implementation
The app uses a custom implementation of Dijkstra's algorithm optimized for building navigation:

- **Multi-floor Support**: Handles vertical movement between floors
- **Weighted Distances**: Accounts for floor changes with penalties
- **Real-time Calculation**: Fast pathfinding for immediate results
- **Connection-based**: Uses room adjacency for realistic routing

### Distance Calculation
- **2D Euclidean Distance**: For same-floor navigation
- **Floor Change Penalty**: Additional cost for using elevators/stairs
- **Walking Time Estimation**: Based on average walking speed (1.4 m/s)

## 🎨 UI/UX Features

### Modern Design
- **Material Design**: Clean, intuitive interface
- **Responsive Layout**: Works on various screen sizes
- **Smooth Animations**: Engaging user interactions
- **Accessibility**: Screen reader friendly

### Interactive Elements
- **Autocomplete Search**: Smart room finding
- **Touch Gestures**: Tap-to-select functionality
- **Visual Feedback**: Clear indication of selections and paths
- **Loading States**: Progress indicators for calculations

## 🔧 Customization

### Adding New Rooms
Edit `src/data/buildingData.js` to add new rooms:

```javascript
// Add to rooms object
'NEW_ROOM_ID': { 
  name: 'New Room Name', 
  floor: 1, 
  x: 100, 
  y: 150, 
  type: 'office' 
},

// Add connections
'NEW_ROOM_ID': ['CONNECTED_ROOM_1', 'CONNECTED_ROOM_2'],
```

### Modifying Building Layout
- Update room coordinates for different layouts
- Add new floors to the `floors` object
- Modify room types and colors as needed

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build problems**
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

3. **iOS build issues**
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

4. **Dependency conflicts**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Dijkstra's algorithm for efficient pathfinding
- Material Design for UI inspiration
- Building navigation research and best practices

---

**Made with ❤️ for better indoor navigation**