import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useViolations } from '../context/ViolationsContext';
import { formatDate } from '../utils/time';
import ErrorMessage from '../components/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'ViolationDetails'>;

const ViolationDetailScreen = ({ route }: Props) => {
  const { violationId } = route.params;
  const {
    violations,
    toggleViolationStatus,
    errorMessage,
    dismissError,
  } = useViolations();

  const violation = violations.find(v => v.id === violationId);

  if (!violation) {
    return (
      <View style={styles.container}>
        <ErrorMessage message="Violation not found" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ErrorMessage message={errorMessage} onDismiss={dismissError} />

      <View style={styles.card}>
        <Text style={styles.title}>License Plate</Text>
        <Text style={styles.value}>{violation.car.plate}</Text>

        <Text style={styles.title}>State</Text>
        <Text style={styles.value}>{violation.car.state}</Text>

        <Text style={styles.title}>Location</Text>
        <Text style={styles.value}>{violation.location}</Text>

        <Text style={styles.title}>Date & Time</Text>
        <Text style={styles.value}>{formatDate(violation.date)}</Text>

        <View style={styles.resolvedContainer}>
          <Text style={styles.title}>Status</Text>
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, violation.resolved ? styles.resolvedText : styles.unresolvedText]}>
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    color: '#757575',
    marginTop: 16,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#212121',
    marginBottom: 8,
  },
  resolvedContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
  },
  resolvedText: {
    color: '#2e7d32',
  },
  unresolvedText: {
    color: '#c62828',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolvedButton: {
    backgroundColor: '#e57373',
  },
  unresolvedButton: {
    backgroundColor: '#81c784',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default ViolationDetailScreen; 