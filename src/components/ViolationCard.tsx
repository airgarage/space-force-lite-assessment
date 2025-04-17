import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Violation } from '../types/models';
import { formatShortDate } from '../utils/time';

interface ViolationCardProps {
  violation: Violation;
  onPress: () => void;
  isPending?: boolean;
  testID?: string;
  toggleViolationStatus: (id: string, resolved: boolean) => void;
}

const ViolationCard = ({
  violation,
  onPress,
  isPending = false,
  testID,
  toggleViolationStatus
}: ViolationCardProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        violation.resolved ? styles.resolvedCard : null,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isPending}
      testID={testID}
    >
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.licensePlateContainer}>
            <Text style={styles.licensePlate}>
              {violation.car.plate}
            </Text>
            <Text style={styles.state}>{violation.car.state}</Text>
          </View>
          <Text style={styles.location} numberOfLines={1}>
            {violation.location}
          </Text>
          <Text style={styles.date}>{formatShortDate(violation.date)}</Text>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.statusLabel}>
            {violation.resolved ? 'Resolved' : 'Unresolved'}
          </Text>
          <Switch
            value={violation.resolved}
            onValueChange={() => toggleViolationStatus(violation.id, !violation.resolved)}
            trackColor={{ false: '#d3d3d3', true: '#4CAF50' }}
            thumbColor="#fff"
            ios_backgroundColor="#d3d3d3"
            testID={`switch-${violation.id}`}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resolvedCard: {
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  licensePlate: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  location: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  switchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  licensePlateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  state: {
    fontSize: 16,
    fontWeight: 'normal',
    marginLeft: 4,
    color: '#555',
  },
});

export default ViolationCard;