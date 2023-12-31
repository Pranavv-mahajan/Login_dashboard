import React from "react";

const YesterdayDetails = ({ sessions }) => (
  <div>
    <h2>Yesterday's Login Details:</h2>
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Created Time</th>
          <th>End Time</th>
          <th>Time Spent (milliseconds)</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => (
          <tr key={session.id}>
            <td>{session.email}</td>
            <td>{session.createdTime.toString()}</td>
            <td>{session.endTime ? session.endTime.toString() : ""}</td>
            <td>{session.timeSpent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default YesterdayDetails;
