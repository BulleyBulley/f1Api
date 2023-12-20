"use client"; // Use the client-side API
import React from "react";
import { useState, useEffect } from "react";
import {
  fetchSeasons,
  fetchSeasonEndDriverStandings,
  fetchCircuitsWithinAYear,
  fetchRaceResult,
} from "../../controllers/resultsController";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import { DriverSeasonResult } from "../objects/DriverSeasonResult.js";

const Results = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonEndDriverStandings, setSeasonEndDriverStandings] = useState([]);
  const [circuitsWithinASeason, setCircuitsWithinASeason] = useState([]);
  const columns = [];
  const [circuitColumns, setCircuitColumns] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [rowsCombined, setRowsCombined] = useState([]);

  // gets driver standings, then gets circuits for the season and sets selected season
  const handleSelectedSeason = async (event) => {
    const year = event.target.value;
    setSeasonEndDriverStandings([]);
    setCircuitsWithinASeason([]);
    setSelectedSeason(event.target.value);
    setRaceResults([]);
    setRowsCombined([]);
  
    try {
      const driverStandings = await fetchSeasonEndDriverStandings(year);
      setSeasonEndDriverStandings(driverStandings);
  
      const circuits = await fetchCircuitsWithinAYear(year);
      setCircuitsWithinASeason(circuits);
  
      setupCircuitColumns(circuits);
  
      const numberOfRaces = circuits.length;
  
      const raceResultsForSeason = await getRaceResultsForSeason(year, numberOfRaces);
      setRaceResults(raceResultsForSeason);
  
      // Combine driver standings and race results after both are fetched
      combineDriverStandingsAndRaceResults(driverStandings, raceResultsForSeason);
  
    } catch (error) {
      console.error(error);
    }
  };

  const getRaceResultsForSeason = async (year, numberOfRaces) => {
    const raceResultArray = [];
    for (let i = 0; i < numberOfRaces; i++) {
      const round = i + 1;
      const raceResult = await fetchRaceResult(year, round);
      // console.log("raceResult: " + JSON.stringify(raceResult));
      raceResultArray.push({
        raceRound: round.toString(),
        ...raceResult, // Spread the properties of raceResult
      });
    }
    return raceResultArray;
    // console.log("raceResultArray: " + JSON.stringify(raceResultArray));
  };
  
  
  const flattenRaceResultsData = (data) => {
    const flattenedResults = data.map((item, raceRound) => ({
      raceRound: raceRound + 1, // Assuming raceRound starts from 1
      racePosition: item[0].position,
      driverId: item[0].Driver.driverId,
    }));
  
    console.log("flattenedRaceResults: ", flattenedResults);
    return flattenedResults;
  };
  
  
  
  const combineDriverStandingsAndRaceResults = (standings, results) => {
    // console.log("standings: ", standings);
    // console.log("results: ", results);
  
    const flattenedResults = flattenRaceResultsData(results);
  
    const combinedData = standings.map((standing) => {
      const driverId = standing.driverId;
      const raceResult = flattenedResults.find((result) => result.driverId === driverId);
      return {
        ...standing,
        ...raceResult,
      };
    });
  
    console.log("combinedData: ", combinedData);
    setRowsCombined(combinedData);
  };
  

  // sets up the circuit columns
  const setupCircuitColumns = (circuits) => {
    const newColumns = [
      { field: "fullName", headerName: "Driver", width: 130 },
      { field: "seasonEndPoints", headerName: "Points", width: 130 },
    ];
    circuits.forEach((circuit) => {
      newColumns.push({
        field: circuit.circuitName,
        headerName: circuit.circuitName,
        width: 100,
      });
    });

    setCircuitColumns(newColumns);
  };

  // fetches the seasons
  useEffect(() => {
    fetchSeasons()
      .then((data) => setSeasons(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Access rowsCombined here or perform any other actions after the state is updated
    console.log("Rows Combined: ", rowsCombined);
  }, [rowsCombined]);

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
          getRowId={(row) => row.id}
          rows={rowsCombined}
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
