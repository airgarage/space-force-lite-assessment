import { Violation } from '../types/models';
import { mockGetViolations, mockUpdateViolationStatus } from '../mocks/violations';


export class ViolationService {

  public async getViolations(): Promise<Violation[]> {
    try {
      const response = await mockGetViolations();
      return response
    } catch (error) {
      console.error('Error getViolations:', error);
      throw error;
    }
  }

  public async updateViolationStatus(id: string, resolved: boolean): Promise<Violation> {
    try {
      const response = await mockUpdateViolationStatus(id, resolved, { failureRate: 0.2 });
      return response;
    } catch (error) {
      console.error('Error updateViolationStatus:', error);
      throw error;
    }
  }
} 