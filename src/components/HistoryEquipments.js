import React from "react";
import equipmentStateHistory from "../data/equipmentStateHistory.json";
import equipmentState from "../data/equipmentState.json";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const HistoryTable = ({ equipmentId }) => {
  const history = equipmentStateHistory.find(
    (item) => item.equipmentId === equipmentId,
  );

  if (!history) {
    return <p>Não há histórico para esse equipamento.</p>;
  }

  const sortedStates = history.states.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? 1 : -1,
  );

  return (
    <table className="mt-5 table table-dark table-striped">
      <thead>
        <tr>
          <th scope="row">Data</th>
          <th scope="row">Estado</th>
        </tr>
      </thead>
      <tbody>
        {sortedStates.map((state, index) => {
          const stateDetails = equipmentState.find(
            (s) => s.id === state.equipmentStateId,
          );
          return (
            <tr key={index}>
              <td>{formatDate(state.date)}</td>
              <td
                style={{ color: stateDetails ? stateDetails.color : "#000000" }}
              >
                {stateDetails ? stateDetails.name : "Unknown State"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default HistoryTable;
