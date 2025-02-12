import React, { useState, useEffect } from 'react';
import { FaFireAlt, FaDumbbell } from 'react-icons/fa'; // Using icons for calories burn and workouts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [caloriesBurned, setCaloriesBurned] = useState(0); // State for total calories burned
  const [totalWorkouts, setTotalWorkouts] = useState(0); // State for total workouts
  const [isWorkoutDropdownOpen, setIsWorkoutDropdownOpen] = useState(false); // State for dropdown visibility
  const [selectedExercise, setSelectedExercise] = useState(null); // State for selected exercise
  const [totalReps, setTotalReps] = useState(0); // State for total reps input
  const [totalTime, setTotalTime] = useState(0); // State for total time input

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoints
        const workoutResponse = await fetch('https://your-backend-api.com/workouts/total'); 
        const workoutData = await workoutResponse.json();
        setTotalWorkouts(workoutData.total); // Assuming the API returns total workouts done

        const caloriesResponse = await fetch('https://your-backend-api.com/calories/burned'); 
        const caloriesData = await caloriesResponse.json();
        setCaloriesBurned(caloriesData.totalCalories); // Assuming the API returns total calories burned
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = [
    { name: 'Day 5', uv: 0, pv: 0, amt: 0 },
    { name: 'Day 10', uv: 0, pv: 0, amt: 0 },
    { name: 'Day 15', uv: 0, pv: 0, amt: 0 },
    { name: 'Day 20', uv: 0, pv: 0, amt: 0 },
    { name: 'Day 25', uv: 0, pv: 0, amt: 0 },
    { name: 'Day 30', uv: 0, pv: 0, amt: 0 },
    { name: 'Day 35', uv: 0, pv: 0, amt: 0 },
  ];

  const exercises = [
    "Push-ups", "Pull-ups", "Squats", "Lunges", "Plank",
    "Deadlifts", "Leg Press", "Crunches", "Jumping Jacks", "Burpees",
    "Mountain Climbers", "High Knees", "Tricep Dips", "Bicep Curls", "Chest Press",
    "Shoulder Press", "Lat Pulldown", "Leg Raises", "Russian Twists", "Kettlebell Swings"
  ];

  const toggleWorkoutDropdown = () => {
    setIsWorkoutDropdownOpen(!isWorkoutDropdownOpen); // Toggle the dropdown visibility
  };

  // Function to calculate calories burned based on total reps and time
  const calculateCalories = () => {
    const caloriesPerRep = 0.1; // Placeholder value, adjust based on the type of exercise
    const caloriesBurnedFromReps = totalReps * caloriesPerRep;
    const caloriesBurnedFromTime = totalTime * 0.05; // Placeholder value for calories per minute

    setCaloriesBurned(caloriesBurnedFromReps + caloriesBurnedFromTime);
  };

  // Handle selecting an exercise
  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setIsWorkoutDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Gym App</h2>
        <ul className="nav-links">
          <li className={`workout-dropdown ${isWorkoutDropdownOpen ? 'open' : ''}`}>
            <a href="#" onClick={toggleWorkoutDropdown}>Workouts</a>
            {isWorkoutDropdownOpen && ( // Conditionally render the dropdown
              <ul className="dropdown">
                {exercises.map((exercise, index) => (
                  <li key={index}>
                    <a href="#" onClick={() => handleExerciseSelect(exercise)}>
                      {exercise}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Main content area */}
      <div className="main-content">
        <div className="main-title">
          <h3>DASHBOARD</h3>
        </div>

        {/* Main Cards */}
        <div className="main-cards">
          {/* Card 1: Total Calories Burned */}
          <div className="card">
            <div className="card-inner">
              <h3>Total Calories Burned</h3>
              <FaFireAlt className="card_icon" />
            </div>
            <h1>{caloriesBurned} kcal</h1> {/* Display calories burned */}
          </div>

          {/* Card 2: Total Workouts */}
          <div className="card">
            <div className="card-inner">
              <h3>Total Workouts</h3>
              <FaDumbbell className="card_icon" />
            </div>
            <h1>{totalWorkouts}</h1> {/* Display total workouts */}
          </div>
        </div>

        {/* Input Section for Reps and Time (Only appears when an exercise is selected) */}
        {selectedExercise && (
          <div className="input-section">
            <h3>Enter details for {selectedExercise}</h3>
            <input
              type="number"
              placeholder="Total Reps"
              value={totalReps}
              onChange={(e) => setTotalReps(e.target.value)}
            />
            <input
              type="number"
              placeholder="Total Time (minutes)"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
            />
            <button onClick={calculateCalories}>Submit</button>
          </div>
        )}

        {/* Charts Section */}
        <div className="charts">
          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
