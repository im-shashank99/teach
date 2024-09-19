import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Fetch schedule data from the backend
    axios.get('http://localhost:5001/schedule')
      .then((res) => setSchedule(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Session Schedule</h2>
      <ul>
        {schedule.map((session, idx) => (
          <li key={idx}>
            {session.time}: {session.topic}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
