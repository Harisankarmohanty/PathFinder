import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { estimateWalkingTime } from '../utils/pathfinder';

const DirectionsPanel = ({ 
  directions = [], 
  distance, 
  totalSteps, 
  startRoom, 
  endRoom,
  onClose 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));

  if (directions.length === 0) {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(fadeAnim, {
      toValue: isExpanded ? 0.7 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const getStepIcon = (direction) => {
    if (direction.includes('elevator')) return '🛗';
    if (direction.includes('stairs')) return '🪜';
    if (direction.includes('Start at')) return '🚀';
    if (direction.includes('Arrive at')) return '🎯';
    if (direction.includes('north')) return '⬆️';
    if (direction.includes('south')) return '⬇️';
    if (direction.includes('east')) return '➡️';
    if (direction.includes('west')) return '⬅️';
    return '👣';
  };

  const formatDistance = (dist) => {
    if (dist < 100) {
      return `${Math.round(dist)} units`;
    } else {
      return `${(dist / 100).toFixed(1)} floors`;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Navigation Directions</Text>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {totalSteps} steps • {formatDistance(distance)} • {estimateWalkingTime(distance)}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <Text style={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </Text>
          {onClose && (
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView 
          style={styles.directionsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.routeOverview}>
            <View style={styles.routePoint}>
              <View style={[styles.routeMarker, styles.startMarker]} />
              <Text style={styles.routePointText}>{startRoom}</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeMarker, styles.endMarker]} />
              <Text style={styles.routePointText}>{endRoom}</Text>
            </View>
          </View>

          <View style={styles.directionsList}>
            {directions.map((direction, index) => (
              <View key={index} style={styles.directionItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepIcon}>
                      {getStepIcon(direction)}
                    </Text>
                    <Text style={styles.stepText}>{direction}</Text>
                  </View>
                  
                  {index < directions.length - 1 && (
                    <View style={styles.stepConnector} />
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <Text style={styles.footerText}>
                🎯 You'll arrive at your destination in approximately {estimateWalkingTime(distance)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  directionsContainer: {
    maxHeight: 400,
  },
  routeOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  routePoint: {
    alignItems: 'center',
  },
  routeMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  startMarker: {
    backgroundColor: '#4CAF50',
  },
  endMarker: {
    backgroundColor: '#F44336',
  },
  routePointText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  directionsList: {
    padding: 16,
  },
  directionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    position: 'relative',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  stepConnector: {
    position: 'absolute',
    left: -18,
    top: 28,
    width: 2,
    height: 16,
    backgroundColor: '#e0e0e0',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerInfo: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  footerText: {
    fontSize: 14,
    color: '#2e7d32',
    textAlign: 'center',
  },
});

export default DirectionsPanel;