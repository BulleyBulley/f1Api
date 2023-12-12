"use client"; // Use the client-side API
import React from "react";
import { useState, useEffect } from "react";
import {
  fetchSeasons,
  fetchSeasonEndDriverStandings,
  fetchCircuitsWithinAYear,
} from "../../controllers/resultsController";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";

const Results = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonEndDriverStandings, setSeasonEndDriverStandings] = useState([]);
  const [circuitsWithinASeason, setCircuitsWithinASeason] = useState([]);
  const columns = [];
  const [circuitColumns, setCircuitColumns] = useState([]);

  const handleSelectedSeason = async (event) => {
    setSeasonEndDriverStandings([]);
    setCircuitsWithinASeason([]);
    setSelectedSeason(event.target.value);

    try {
      const driverStandings = await fetchSeasonEndDriverStandings(event.target.value);
      setSeasonEndDriverStandings(driverStandings);

      const circuits = await fetchCircuitsWithinAYear(event.target.value);
      setCircuitsWithinASeason(circuits);

      setupCircuitColumns(circuits);
    } catch (error) {
      console.error(error);
    }
  };

  const flattenDriverData = (data) => {
    return data.map((item) => ({
      fullName: item.Driver.givenName + " " + item.Driver.familyName,
      familyName: item.Driver.familyName,
      id: item.Driver.driverId,
      points: item.points,
      position: item.position,
    }));
  };

  const flattenedSeasonEndDriverStandings = flattenDriverData(
    seasonEndDriverStandings
  );

  useEffect(() => {
    fetchSeasons()
      .then((data) => setSeasons(data))
      .catch((error) => console.error(error));
  }, []);

  const setupCircuitColumns = (circuits) => {
    const newColumns = [
      { field: "fullName", headerName: "Driver", width: 130 },
      { field: "points", headerName: "Points", width: 130 },
    ];

    circuits.forEach((circuit) => {
      newColumns.push({ field: circuit.circuitName, headerName: circuit.circuitName, width: 100 });
    });

    setCircuitColumns(newColumns);
  };


  

  return (
    <div className="main-container">
      <h1>Results Page</h1>
      <p>Welcome to the Results Page!</p>
      <h2>{selectedSeason}</h2>

      <FormControl>
        <InputLabel id="demo-simple-select-label">Season</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedSeason}
          label="Season"
          onChange={handleSelectedSeason}
        >
          {seasons
            .slice()
            .reverse()
            .map((season) => (
              <MenuItem key={season.season} value={season.season}>
                {season.season}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <div className="data-grid-container">
      <DataGrid
          getRowId={(row) => row.position}
          rows={flattenedSeasonEndDriverStandings}
          columns={circuitColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight
          disableSelectionOnClick
        ></DataGrid>
      </div>
    </div>
  );
};

export default Results;
