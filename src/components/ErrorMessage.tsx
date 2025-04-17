import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorMessageProps {
  message: string | null;
  onDismiss?: () => void;
}

const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <TouchableOpacity onPress={onDismiss} activeOpacity={0.7} style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    zIndex: 1000,
    backgroundColor: '#ffebee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#c62828',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default ErrorMessage; 