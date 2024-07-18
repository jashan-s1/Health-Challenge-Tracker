import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout-service.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get workouts', () => {
    const workouts = service.getWorkouts();
    expect(workouts).toBeDefined();
    // Add more assertions based on your service methods
  });

  // Add more tests for other service methods and behavior

});
