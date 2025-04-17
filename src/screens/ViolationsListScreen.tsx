import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { Violation } from '../types/models';
import { useViolations } from '../context/ViolationsContext';
import ViolationCard from '../components/ViolationCard';
import ErrorMessage from '../components/ErrorMessage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ViolationsList'>;

const ViolationsListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    filteredViolations,
    isLoading,
    errorMessage,
    searchTerm,
    updateSearchTerm,
    fetchViolations,
    isPendingUpdate,
    toggleViolationStatus,
    dismissError,
  } = useViolations();

  const handleViolationPress = useCallback((violation: Violation) => {
    navigation.navigate('ViolationDetails', { violationId: violation.id });
  }, [navigation]);

  const renderItem = useCallback(({ item }: { item: Violation }) => (
    <ViolationCard
      violation={item}
      onPress={() => handleViolationPress(item)}
      isPending={isPendingUpdate(item.id)}
      toggleViolationStatus={toggleViolationStatus}
    />
  ), [handleViolationPress, isPendingUpdate, toggleViolationStatus]);

  const keyExtractor = useCallback((item: Violation) => item.id, []);

  if (isLoading && filteredViolations.length === 0) {
    return (
      <View style={styles.centered} testID="loading-indicator">
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by plate number..."
          value={searchTerm}
          onChangeText={updateSearchTerm}
          autoCapitalize="characters"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ErrorMessage message={errorMessage} onDismiss={dismissError} />

      <FlatList
        data={filteredViolations}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchViolations} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchTerm.trim()
                ? 'No violations found matching your search.'
                : 'No violations found.'}
            </Text>
          </View>
        }
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
});

export default ViolationsListScreen; 