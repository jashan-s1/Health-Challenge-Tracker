import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


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
  showTable = false;
  selectedWorkout: Workout | null = null;
  chart: Chart | null = null; // Chart instance
  allWorkoutTypes: string[] = []; // List of all workout types

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

  toggleTableDisplay() {
    this.showTable = !this.showTable;
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

  visualizeWorkout(workout: Workout) {
    this.selectedWorkout = workout;
    this.renderChart(workout);
  }
  renderChart(workout: Workout) {
    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    this.allWorkoutTypes = Array.from(new Set(this.workouts.map(w => w.type)));

    // Initialize data for all workout types with 0 minutes
    const chartData = this.allWorkoutTypes.map(type => {
      if (type === workout.type) {
        return workout.minutes;
      }
      return 0;
    });

    // Destroy the previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.allWorkoutTypes,
        datasets: [{
          label: 'Minutes',
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 60 // Fixed y-axis range
          }
        }
      }
    });
  }

  ngOnInit() {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      this.workouts = JSON.parse(savedWorkouts);
      this.filterWorkouts();
    }
    // Render initial empty chart with all workout types
    this.allWorkoutTypes = Array.from(new Set(this.workouts.map(w => w.type)));
    this.renderChart({ username: '', type: '', minutes: 0 });
  }
}
