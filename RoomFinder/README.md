# 🏢 Room Finder App

A mobile application that helps users find the shortest path between rooms in a building. Built with React Native and Expo.

## ✨ Features

- **Smart Pathfinding**: Uses Dijkstra's algorithm to find the shortest route between any two rooms
- **Multi-floor Navigation**: Supports navigation across different floors using elevators and stairs
- **Modern UI**: Beautiful gradient design with intuitive user interface
- **Room Suggestions**: Quick selection from available rooms
- **Distance Calculation**: Shows total distance for the calculated route
- **Step-by-step Directions**: Clear numbered instructions for navigation

## 🏗️ Building Structure

The app includes a sample 3-floor building with:
- **Floor 1**: Rooms 101, 102, 103, Main Lobby, Elevator 1, Stairs 1
- **Floor 2**: Rooms 201, 202, 203, Elevator 2, Stairs 2  
- **Floor 3**: Rooms 301, 302, 303, Elevator 3, Stairs 3

## 🚀 How to Run

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd RoomFinder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (requires macOS)
   - **Web**: `npm run web`

### Using Expo Go App
1. Install Expo Go on your mobile device
2. Scan the QR code that appears in the terminal
3. The app will load on your device

## 📱 How to Use

1. **Enter Start Room**: Type your current location (e.g., "101", "lobby", "elevator")
2. **Enter Destination**: Type where you want to go (e.g., "203", "stairs")
3. **Find Path**: Tap "🔍 Find Path" to calculate the shortest route
4. **Follow Directions**: The app will show step-by-step navigation instructions
5. **Clear**: Use "🗑️ Clear" to reset and start over

## 🎯 Example Usage

**Scenario**: You're in Room 101 and want to go to Room 203
1. Enter "101" as start room
2. Enter "203" as destination
3. Tap "Find Path"
4. The app will show: Room 101 → Room 102 → Room 103 → Elevator 1 → Elevator 2 → Room 203

## 🔧 Technical Details

### Pathfinding Algorithm
- Uses **Dijkstra's algorithm** for optimal path calculation
- Considers room connections and distances
- Supports multi-floor navigation through elevators and stairs

### Data Structure
```typescript
interface Room {
  id: string;
  name: string;
  floor: number;
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  distance: number;
}
```

### Key Features
- **Real-time path calculation**
- **Distance measurement**
- **Floor-aware navigation**
- **Error handling for invalid rooms**
- **Responsive design**

## 🎨 UI Components

- **Gradient Background**: Modern purple gradient theme
- **Card-based Layout**: Clean, organized interface
- **Interactive Elements**: Touchable room chips for quick selection
- **Visual Feedback**: Clear step numbering and arrows
- **Responsive Design**: Works on various screen sizes

## 🔮 Future Enhancements

- **Real-time Location**: GPS integration for current position
- **Building Maps**: Visual floor plans and maps
- **Accessibility**: Voice navigation and screen reader support
- **Offline Support**: Local data storage for offline use
- **Custom Buildings**: User-defined building layouts
- **Navigation History**: Save and recall previous routes

## 📱 Supported Platforms

- ✅ Android
- ✅ iOS  
- ✅ Web (for testing)

## 🛠️ Development

### Project Structure
```
RoomFinder/
├── App.tsx              # Main application component
├── package.json         # Dependencies and scripts
├── app.json            # Expo configuration
└── README.md           # This file
```

### Dependencies
- `react-native`: Core framework
- `expo-linear-gradient`: Gradient backgrounds
- `expo-status-bar`: Status bar management
- `@react-navigation/*`: Navigation (for future use)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Room Finding! 🏢✨**