import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        FormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should add a workout', () => {
    // Initialize newWorkout object
    component.newWorkout = { username: 'testUser', type: 'Running', minutes: 30 };
    
    // Trigger the addWorkout method
    component.addWorkout();

    // Validate that the workout was added correctly
    expect(component.workouts.length).toBe(1);
    expect(component.workouts[0].username).toBe('testUser');
    expect(component.workouts[0].type).toBe('Running');
    expect(component.workouts[0].minutes).toBe(30);
  });
  it('should toggle workout list', () => {
    const initialState = component.showWorkoutList;
    component.toggleWorkoutList();
    expect(component.showWorkoutList).toBe(!initialState);
  });

  it('should update paginated workouts', () => {
    component.workouts = Array(15).fill({ username: 'John', type: 'Running', minutes: 30 });
    component.itemsPerPage = 5;
    component.currentPage = 1;
    component.updatePaginatedWorkouts();

    expect(component.paginatedWorkouts.length).toBe(5);
  });

  it('should clear all workouts', () => {
    spyOn(component.toastr, 'success');
    component.workouts = [{ username: 'John', type: 'Running', minutes: 30 }];
    component.clearAll();

    expect(component.workouts.length).toBe(0);
    expect(component.toastr.success).toHaveBeenCalledWith('Cleared all Workouts!');
  });

  it('should filter workouts by name', () => {
    component.workouts = [
      { username: 'John', type: 'Running', minutes: 30 },
      { username: 'Jane', type: 'Swimming', minutes: 45 }
    ];
    component.searchName = 'John';
    component.filterWorkouts();

    expect(component.paginatedWorkouts.length).toBe(1);
    expect(component.paginatedWorkouts[0].username).toBe('John');
  });

  it('should filter workouts by type', () => {
    component.workouts = [
      { username: 'John', type: 'Running', minutes: 30 },
      { username: 'Jane', type: 'Swimming', minutes: 45 }
    ];
    component.filterType = 'Swimming';
    component.filterWorkouts();

    expect(component.paginatedWorkouts.length).toBe(1);
    expect(component.paginatedWorkouts[0].type).toBe('Swimming');
  });

  it('should paginate workouts', () => {
    const workouts = Array(10).fill({ username: 'John', type: 'Running', minutes: 30 });
    component.itemsPerPage = 5;
    component.currentPage = 2;
    component.paginateWorkouts(workouts);

    expect(component.paginatedWorkouts.length).toBe(5);
  });

  it('should go to the previous page', () => {
    component.currentPage = 2;
    spyOn(component, 'updatePaginatedWorkouts');
    component.previousPage();

    expect(component.currentPage).toBe(1);
    expect(component.updatePaginatedWorkouts).toHaveBeenCalled();
  });

  it('should go to the next page', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    spyOn(component, 'updatePaginatedWorkouts');
    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(component.updatePaginatedWorkouts).toHaveBeenCalled();
  });

  it('should toggle display list', () => {
    const initialState = component.showWorkoutList;
    component.toggleDisplayList();
    expect(component.showWorkoutList).toBe(!initialState);
  });

  it('should initialize workouts from localStorage', () => {
    const storedWorkouts = [{ username: 'John', type: 'Running', minutes: 30 }];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(storedWorkouts));
    component.ngOnInit();

    expect(component.workouts).toEqual(storedWorkouts);
  });

  // Add more tests as needed
});
