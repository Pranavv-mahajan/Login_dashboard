// OverallTable.js
import React from "react";

const OverallTable = ({ sessions }) => {
  return (
    <div>
      <h3>Overall Data</h3>
      <table>
        {/* Render table rows based on sessions data */}
        <thead>
          <tr>
            <th>Email</th>
            <th>Created Time</th>
            <th>End Time</th>
            <th>Time Spent</th>
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
};

export default OverallTable;
