import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import equipmentPositionHistory from "../data/equipmentPositionHistory.json";
import equipmentData from "../data/equipment.json";
import equipmentDetails from "../data/equipmentModel.json";
import equipmentState from "../data/equipmentState.json";
import equipmentStateHistory from "../data/equipmentStateHistory.json";

let DefaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ onMarkerClick }) => {
  const [latestPositions, setLatestPositions] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const getEquipmentDetails = (equipmentId) => {
    const equipment = equipmentData.find((item) => item.id === equipmentId);
    const equipmentModel = equipment ? equipment.name : "Unknown Model";
    if (equipment) {
      const equipmentDetail = equipmentDetails.find(
        (detail) => detail.id === equipment.equipmentModelId,
      );
      const equipmentName = equipmentDetail
        ? equipmentDetail.name
        : "Unknown Equipment";
      return { model: equipmentModel, name: equipmentName };
    }
    return { model: "Unknown Model", name: "Unknown Equipment" };
  };

  const getEquipmentCurrentState = (equipmentId) => {
    const history = equipmentStateHistory.find(
      (item) => item.equipmentId === equipmentId,
    );
    if (history) {
      const latestState = history.states.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date)
          ? current
          : latest;
      });
      const stateDetails = equipmentState.find(
        (state) => state.id === latestState.equipmentStateId,
      );
      return stateDetails
        ? { name: stateDetails.name, color: stateDetails.color }
        : { name: "Unknown State", color: "#000000" };
    }
    return { name: "Unknown State", color: "#000000" };
  };

  useEffect(() => {
    const findLatestPositions = () => {
      const latestPositionsData = equipmentPositionHistory.map((equipment) => {
        const positions = equipment.positions;
        const latestPosition = positions.reduce((latest, current) => {
          return new Date(current.date) > new Date(latest.date)
            ? current
            : latest;
        });
        return {
          equipmentId: equipment.equipmentId,
          lat: latestPosition.lat,
          lon: latestPosition.lon,
          positions: positions,
        };
      });
      setLatestPositions(latestPositionsData);
    };
    findLatestPositions();
  }, []);

  const handleMarkerClick = (equipmentId) => {
    setSelectedEquipment(equipmentId);
    const { model, name } = getEquipmentDetails(equipmentId);
    onMarkerClick(equipmentId, name, model);
  };

  const clearSelectionLocal = () => {
    setSelectedEquipment(null); // Limpa a seleção do equipamento
  };

  return (
    <MapContainer center={[-19.126536, -45.947756]} zoom={9} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latestPositions.map((position) => {
        const { model, name } = getEquipmentDetails(position.equipmentId);
        const { name: stateName, color: stateColor } = getEquipmentCurrentState(
          position.equipmentId,
        );

        const polylinePositions = position.positions.map((pos) => [
          pos.lat,
          pos.lon,
        ]); // Extrair coordenadas

        // Mostrar somente o marcador e trajeto do equipamento selecionado
        if (selectedEquipment && selectedEquipment !== position.equipmentId) {
          return null;
        }

        return (
          <React.Fragment key={position.equipmentId}>
            <Marker
              position={[position.lat, position.lon]}
              eventHandlers={{
                click: () => handleMarkerClick(position.equipmentId), // Clicar para selecionar o equipamento
              }}
            >
              <Popup>
                {name} <br />
                Modelo: {model} <br />
                Estado: <span style={{ color: stateColor }}>
                  {stateName}
                </span>{" "}
                <br />
                Latitude: {position.lat}, Longitude: {position.lon}
                <br />
                <button
                  className="btn btn-danger mt-2 pt-0 p-1"
                  style={{ height: "1.2rem", fontSize: "0.8rem" }}
                  onClick={clearSelectionLocal} // Fechar e limpar a seleção
                >
                  Fechar
                </button>
              </Popup>
            </Marker>
            {/* Exibir o Polyline apenas se o equipamento estiver selecionado */}
            {selectedEquipment === position.equipmentId && (
              <Polyline positions={polylinePositions} color="blue" />
            )}
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
