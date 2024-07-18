import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface Workout {
  username: string;
  type: string;
  minutes: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  newWorkout: Workout = { username: '', type: '', minutes: 0 };
  title: string="Workout-Tracker";
  workouts: any[] = [];
  showWorkoutList: boolean = false;
  searchName: string = '';
  filterType: string = '';
  paginatedWorkouts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  constructor(public toastr: ToastrService) {}



  addWorkout() {
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const workoutTypeInput = document.getElementById('workout-type') as HTMLSelectElement;
    const workoutMinutesInput = document.getElementById('workout-minutes') as HTMLInputElement;

    const username = usernameInput.value;
    const type = workoutTypeInput.value;
    const minutes = workoutMinutesInput.value;

    if (this.newWorkout.username && this.newWorkout.type && this.newWorkout.minutes) {
      this.workouts.push({ ...this.newWorkout });
      this.newWorkout = { username: '', type: '', minutes: 0 };
    }

    if (username && type && minutes) {
      const workout = {
        username,
        type,
        minutes: parseInt(minutes, 10)
      };

      this.workouts.push(workout);
      localStorage.setItem('workouts', JSON.stringify(this.workouts));
      this.toastr.success('Workout saved!', 'Success');

      // Clear input fields
      usernameInput.value = '';
      workoutTypeInput.value = '';
      workoutMinutesInput.value = '';
      this.updatePaginatedWorkouts();
      this.filterWorkouts();
    } else {
      this.toastr.error('Please fill out all fields.', 'Error'); 
    }
  }

  toggleWorkoutList() {
    this.showWorkoutList = !this.showWorkoutList;
  }
  updatePaginatedWorkouts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedWorkouts = this.workouts.slice(startIndex, endIndex);
  }

  clearAll() {
    this.workouts = [];
    localStorage.removeItem('workouts');
    this.updatePaginatedWorkouts();
    this.toastr.success('Cleared all Workouts!');
  }

  filterWorkouts() {
    let filteredWorkouts = this.workouts;

    if (this.searchName) {
      filteredWorkouts = filteredWorkouts.filter(workout =>
        workout.username.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }

    if (this.filterType) {
      filteredWorkouts = filteredWorkouts.filter(workout =>
        workout.type === this.filterType
      );
    }

    this.totalPages = Math.ceil(filteredWorkouts.length / this.itemsPerPage);
    this.paginateWorkouts(filteredWorkouts);
  }

  paginateWorkouts(filteredWorkouts: any[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedWorkouts = filteredWorkouts.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedWorkouts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedWorkouts();
    }
  }

  toggleDisplayList() {
    this.showWorkoutList = !this.showWorkoutList;
  }

  ngOnInit() {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      this.workouts = JSON.parse(savedWorkouts);
      this.filterWorkouts();
    }
  }
}
