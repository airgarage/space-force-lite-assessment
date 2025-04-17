# Space Force Lite

## Overview

You'll be building a parking violation management app that allows enforcers to track and update the status of parking violations.

The challenge is designed to test your ability to:
- Work with React Context for state management
- Implement data fetching and updates
- Handle loading and error states
- Implement filtering functionality
- Knowledge of advance concepts like Optimistic UI updates and state rollback

## Time Limit

This challenge is designed to be completed **under 1 hour**

## Requirements

### Main Focus: ViolationsContext Implementation

The main task is implementing the `ViolationsContext.tsx` file which provides state management for the application. Your implementation should expose the following interface:

**State:**
- `violations`: list of violation objects fetched from the API.
- `isLoading`: Boolean that indicates when data is being fetched.
- `errorMessage`: String that stores any API error message.
- `searchTerm`: String that stores the current search input.
- `pendingUpdates`: violation IDs that are currently being updated.

**Computed:**
- `filteredViolations`: Violations filtered by searchTerm.
- `isPendingUpdate`: Function that returns whether a specific violation is being updated.

**Actions:**
- `fetchViolations`: Fetches violations from the API and updates state accordingly.
- `toggleViolationStatus`: Updates a violation's resolved status with optimistic UI and error rollback.
- `updateSearchTerm`: Updates the search term used for filtering violations.
- `dismissError`: Clears the current error message.

### App Core Features

1. **List View**: Display a list of parking violations
   - Each violation shows license plate, state, and location
   - Optimistic Toggle resolved/unresolved status
   - Pull-to-refresh functionality

2. **Search Functionality**: Filter violations by license plate
   - Case-insensitive searching
   - Update filtered results as user types

3. **Detail View**: Show detailed information about a selected violation
   - Display all violation properties
   - Allow toggling resolved status

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Context for state management (focus area)
├── mocks/          # Mock data for development
├── navigation/     # Navigation setup
├── screens/        # Application screens
├── services/       # API service layer
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (^18)
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Running the App

```bash
npm start
```

Then, use the Expo Go app on your device to scan the QR code, or press 'a' to run on an Android emulator or 'i' to run on an iOS simulator.

## Testing Your Implementation

The project includes comprehensive test files that can be used to validate your implementation:

```bash
npm test
```

These tests will verify that your context implementation meets the requirements.

## Evaluation Criteria

Your submission will be evaluated based on:

1. **Functionality**: Does it work as expected? All tests are passing?
2. **Code Quality**: Is the code well-structured and maintainable?
3. **React Knowledge**: Proper use of hooks, context, and component patterns
4. **TypeScript**: Correct use of types and interfaces
5. **Error Handling**: Appropriate handling of edge cases and errors
6. **Performance**: Consideration of performance implications

Good luck! 