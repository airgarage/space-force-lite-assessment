import { Violation } from '../types/models';

/**
 * Mock data for parking violations used in development environments
 */
export const mockViolations: Violation[] = [
  {
    id: '1',
    car: {
      plate: 'ABC123',
      state: 'AZ'
    },
    location: '123 Main St, Phoenix',
    date: '2023-04-15T10:30:00Z',
    resolved: false,
  },
  {
    id: '2',
    car: {
      plate: 'XYZ789',
      state: 'FL'
    },
    location: '456 Oak Ave, Miami',
    date: '2023-04-14T14:45:00Z',
    resolved: true,
  },
  {
    id: '3',
    car: {
      plate: 'DEF456',
      state: 'CA'
    },
    location: '789 Pine Rd, San Francisco',
    date: '2023-04-16T09:15:00Z',
    resolved: false,
  },
  {
    id: '4',
    car: {
      plate: 'GHI789',
      state: 'NY'
    },
    location: '321 Elm St, New York',
    date: '2023-04-13T16:20:00Z',
    resolved: false,
  },
  {
    id: '5',
    car: {
      plate: 'JKL012',
      state: 'TX'
    },
    location: '654 Maple Dr, Austin',
    date: '2023-04-12T11:10:00Z',
    resolved: true,
  },
  {
    id: '6',
    car: {
      plate: 'MNO345',
      state: 'CA'
    },
    location: '765 Cedar St, Los Angeles',
    date: '2023-04-11T13:30:00Z',
    resolved: false,
  },
  {
    id: '7',
    car: {
      plate: 'PQR678',
      state: 'IL'
    },
    location: '123 Main St, Chicago',
    date: '2023-04-15T10:30:00Z',
    resolved: false,
  },
  {
    id: '8',
    car: {
      plate: 'STU901',
      state: 'TX'
    },
    location: '765 Cedar St, Dallas',
    date: '2023-04-11T13:30:00Z',
    resolved: false,
  },
];

export function mockGetViolations(): Promise<Violation[]> {
  return new Promise(resolve => setTimeout(() => resolve(mockViolations), 300));
};

export function mockUpdateViolationStatus(id: string, resolved: boolean, { failureRate }: { failureRate: number }): Promise<Violation> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() <= failureRate) {
        reject(new Error("Failed to update violation status"));
      } else {
        const violation = mockViolations.find(v => v.id === id);
        if (violation) {
          violation.resolved = resolved;
          resolve(violation);
        } else {
          reject(new Error('Violation not found'));
        }
      }
    }, 1000);
  });
};