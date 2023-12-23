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
import { DriverSeasonRaceResults } from "../objects/DriverSeasonRaceResults.js";

const Results = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonEndDriverStandings, setSeasonEndDriverStandings] = useState([]);
  const [circuitsWithinASeason, setCircuitsWithinASeason] = useState([]);
  const columns = [];
  const [circuitColumns, setCircuitColumns] = useState([]);
  const [raceResults, setRaceResults] = useState([]);
  const [rowsCombined, setRowsCombined] = useState([]);
  const [dynamicColumns, setDynamicColumns] = useState([
    { field: "fullName", headerName: "Driver", width: 130 },
    { field: "seasonEndPoints", headerName: "Points", width: 130 },
  ]);

  // gets driver standings, then gets circuits for the season and sets selected season
  const handleSelectedSeason = async (event) => {
    const year = event.target.value;
    setSeasonEndDriverStandings([]);
    setCircuitsWithinASeason([]);
    setSelectedSeason(event.target.value);
    setRaceResults([]);
    setRowsCombined([]);
    setDynamicColumns([
      // Reset dynamicColumns to base columns
      { field: "fullName", headerName: "Driver", width: 130 },
      { field: "seasonEndPoints", headerName: "Points", width: 130 },
    ]);

    try {
      const driverStandings = await fetchSeasonEndDriverStandings(year);
      const circuits = await fetchCircuitsWithinAYear(year);

      const numberOfRaces = circuits.length;

      const raceResultsForSeason = await getRaceResultsForSeason(
        year,
        numberOfRaces
      );
      // Call combineDriverStandingsAndRaceResults to generate dynamic columns
      combineDriverStandingsAndRaceResults(driverStandings,raceResultsForSeason);
    } catch (error) {
      console.error(error);
    }
  };

  const getRaceResultsForSeason = async (year, numberOfRaces) => {
    const raceResultArray = [];
    for (let i = 0; i < numberOfRaces; i++) {
      const round = i + 1;
      const raceResult = await fetchRaceResult(year, round);
      //console.log("raceResult: " + JSON.stringify(raceResult));
      raceResultArray.push(raceResult);
    }
    return raceResultArray;
    // console.log("raceResultArray: " + JSON.stringify(raceResultArray));
  };

  const combineDriverStandingsAndRaceResults = (standings, results) => {
    // Create a map for easier lookup of driver standings
    const standingsMap = standings.reduce((map, driver) => {
      map[driver.id] = {
        fullName: driver.fullName,
        seasonEndPoints: parseFloat(driver.seasonEndPoints),
        races: {}, // Initialize races as an object
      };
      return map;
    }, {});

    // Generate dynamic column definitions:
    const dynamicColumns = [
      { field: "fullName", headerName: "Driver", width: 130 },
      { field: "seasonEndPoints", headerName: "Points", width: 130 },
    ];

    results.forEach((race) => {
      const existingColumn = dynamicColumns.find(
        (column) => column.field === race.circuitName
      );

      if (!existingColumn) {
        // Add a new column only if it doesn't already exist
        dynamicColumns.push({
          field: race.circuitName,
          headerName: race.circuitName,
          width: 150,
        });
      }
    });

    // Iterate through race results and update the standings map
    results.forEach((race) => {
      race.results.forEach((result) => {
        const driverId = result.driverId;

        // Ensure that the races property is an object and not an array
        standingsMap[driverId].races = standingsMap[driverId].races || {};

        // Update the races map with the circuitName and position
        standingsMap[driverId].races[race.circuitName] = result.position;
      });
    });

    // Convert the standings map to an array
    const combinedData = Object.values(standingsMap);

    // Set dynamicColumns and rowsCombined
    setDynamicColumns(dynamicColumns);
    setRowsCombined(combinedData);
  };

  // fetches the seasons
  useEffect(() => {
    fetchSeasons()
      .then((data) => setSeasons(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Access rowsCombined here or perform any other actions after the state is updated
    //console.log("Rows Combined: ", rowsCombined);
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
        {/* {console.log("rowsCombined: " + JSON.stringify(rowsCombined))}
        {console.log("dynamicColumns: " + JSON.stringify(dynamicColumns))} */}

        <DataGrid
          getRowId={(row) => row.fullName}
          getColumnId={(column) => column.field}
          rows={rowsCombined}
          columns={dynamicColumns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight
          disableSelectionOnClick
          // Add logs directly here
        />
      </div>
    </div>
  );
};

export default Results;
