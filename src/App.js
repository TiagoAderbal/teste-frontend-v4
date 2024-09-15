import "./App.css";
import React, { useState } from "react";
import Map from "./components/MapEquipments";
import HistoryTable from "./components/HistoryEquipments";

function App() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleMarkerClick = (equipmentId, equipmentName, equipmentModel) => {
    setSelectedEquipment({
      id: equipmentId,
      name: equipmentName,
      model: equipmentModel,
    });
    setShowHistory(false);
  };

  const handleShowHistory = () => {
    setShowHistory((prevShowHistory) => !prevShowHistory);
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <img className="logo" src="/assets/img/aiko.png" alt="logo empresa Aiko" />
        </nav>
        <Map onMarkerClick={handleMarkerClick}></Map>
        <button
          className="btn btn-success mt-4"
          onClick={handleShowHistory}
          disabled={!selectedEquipment}
        >
          {showHistory ? "Ocultar Histórico" : "Mostrar Histórico"}
        </button>
        {selectedEquipment && showHistory && (
          <div className="mt-4 text-center w-50">
            <div>
              <h2>
                Equipamento Selecionado: {selectedEquipment.name}{" "}
                {selectedEquipment.model}
              </h2>
            </div>
            <div className="table-container mt-4">
              <HistoryTable equipmentId={selectedEquipment.id} />
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
