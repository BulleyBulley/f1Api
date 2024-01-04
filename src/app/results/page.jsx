"use client"; // Use the client-side API
import React from "react";
import { useState, useEffect } from "react";
import {
  fetchSeasons,
  fetchSeasonEndDriverStandings,
  fetchCircuitsWithinAYear,
  fetchRaceResult,
  fetchFlagUrls,
} from "../../controllers/resultsController";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import { DriverSeasonResult } from "../objects/DriverSeasonResult.js";
import { DriverSeasonRaceResults } from "../objects/DriverSeasonRaceResults.js";
import styles from "../globals.css";

const Results = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [seasonEndDriverStandings, setSeasonEndDriverStandings] = useState([]);
  const [circuitsWithinASeason, setCircuitsWithinASeason] = useState([]);
  const columns = [];
  const [raceResults, setRaceResults] = useState([]);
  const [rowsCombined, setRowsCombined] = useState([]);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seasonWinner, setSeasonWinner] = useState("");
  const [winningDriverImage, setWinningDriverImage] = useState("");

  // gets driver standings, then gets circuits for the season and sets selected season
  const handleSelectedSeason = async (event) => {
    console.log("IN handleSelectedSeason");

    initializePage();

    const year = event.target.value;
    setSelectedSeason(event.target.value);

    try {
      const { driverStandings, numberOfRaces } =
        await fetchSeasonEndDriverStandings(year);
      const raceResultsForSeason = await getRaceResultsForSeason(
        year,
        numberOfRaces
      );

      const resultsWithFlags = await fetchFlagUrls(raceResultsForSeason);

      //generate dynamic columns
      const combinedDriverStandingsAndRaceResults =
        combineDriverStandingsAndRaceResults(driverStandings, resultsWithFlags);

      //update season winner
      updateSeasonWinner(driverStandings);

      handleUpdatedDriverStandingsAndRaceResults(
        combinedDriverStandingsAndRaceResults
      );
      console.log("OUT handleSelectedSeason");
    } catch (error) {
      console.error(error);
    }
  };

  const initializePage = () => {
    console.log("IN initializePage");
    setSeasonEndDriverStandings([]);
    setCircuitsWithinASeason([]);
    setRaceResults([]);
    setSeasonWinner("");
    setRowsCombined([]);
    setDynamicColumns([]);
    console.log("OUT initializePage");
  };

  const getRaceResultsForSeason = async (year, numberOfRaces) => {
    console.log("IN getRaceResultsForSeason");
    try {
      const promises = Array.from({ length: numberOfRaces }, (_, i) =>
        fetchRaceResult(year, i + 1)
      );
      const raceResultsArray = await Promise.all(promises);
      console.log("OUT getRaceResultsForSeason");
      return raceResultsArray;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const combineDriverStandingsAndRaceResults = (standings, results) => {
    console.log("IN combineDriverStandingsAndRaceResults");
    // Create a map for easier lookup of driver standings
    const standingsMap = standings.reduce((map, driver) => {
      map[driver.id] = {
        fullName: driver.fullName,
        constructor: driver.team,
        seasonEndPoints: parseFloat(driver.seasonEndPoints),
      };
      return map;
    }, {});

    // Generate dynamic column definitions:
    const dynamicColumns = [
      { field: "fullName", headerName: "Driver", width: 180 },
      { field: "constructor", headerName: "Team", width: 120 },
      { field: "seasonEndPoints", headerName: "Points", width: 100 },
    ];

    // Generate columns for each circuit
    results.forEach((race) => {
      console.log(race.country);
      const existingColumn = dynamicColumns.find(
        (column) => column.field === race.friendlyName
      );
      if (!existingColumn) {
        const flagUrl = race.flagUrl;
        // Format the date to be displayed in the column header
        const formattedDate = new Date(race.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });

        dynamicColumns.push({
          field: race.friendlyName,
          headerName: race.friendlyName,
          width: 120,
          renderHeader: (params) => (
            //set div background image to flagUrl
            <div
              className="race-name-header"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1em",
                backgroundColor: "#f5f5f5",
                padding: "25%, 25%, 25%, 25%",
                borderRadius: "10px",
                margin: "5px, 5px, 5px, 5px",
                align: "center",
              }}
            >
              <h3>{race.friendlyName}</h3>
              <img src={flagUrl} width="30%" />
              <h4>{formattedDate}</h4>
            </div>
          ),
        });
      }
    });

    // Iterate through race results and update the standings map
    results.forEach((race) => {
      race.results.forEach((result) => {
        const driverId = result.driverId;

        // Ensure that the driver exists in standingsMap
        if (!standingsMap[driverId]) {
          standingsMap[driverId] = {
            fullName: result.driverName, // Assuming result.driverName is available
            seasonEndPoints: 0,
          };
        }
        // Update the races map with the circuitName and position

        standingsMap[driverId][race.friendlyName] = result.position;
      });
    });

    // Convert the standings map to an array
    const combinedData = Object.values(standingsMap);
    return { dynamicColumns, combinedData };
  };

  const handleUpdatedDriverStandingsAndRaceResults = (
    combinedDriverStandingsAndRaceResults
  ) => {
    setDynamicColumns(combinedDriverStandingsAndRaceResults.dynamicColumns);
    setRowsCombined(combinedDriverStandingsAndRaceResults.combinedData);
  };

  const updateSeasonWinner = (driverStandings) => {
    console.log("IN updateSeasonWinner");
    const seasonWinner = driverStandings[0].fullName;
    console.log(driverStandings[0]);
    //const winningDriverImage = driverStandings[0].driverImage;
    setSeasonWinner(seasonWinner);
    console.log("OUT updateSeasonWinner");
  };

  // fetches the seasons
  useEffect(() => {
    fetchSeasons()
      .then((data) => setSeasons(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Access rowsCombined here or perform any other actions after the state is updated
  }, [rowsCombined]);

  useEffect(() => {
    // Access dynamicColumns here or perform any other actions after the state is updated
  }, [dynamicColumns]);

  return (
    <div className="main-container">
      <div className="title-container">
        <div className="title-divider-left">
          <div className="title-text-container">
            <h1>Driver Results By Season</h1>
          </div>

          <div className="season-container">
            <FormControl
              className="select-season"
              variant="outlined"
              focused="true"
              
            >
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
          </div>
        </div>

        <div className="title-divider-right">
          <div className="winner-container">
            <h2>Winner: {seasonWinner}</h2>
            <image src={winningDriverImage} />
          </div>
        </div>
      </div>

      <div className="data-grid-container">
        <DataGrid
          getRowId={(row) => `${row.fullName}:${row.seasonEndPoints}`}
          getColumnId={(column) => column.field}
          rows={rowsCombined}
          columns={dynamicColumns}
          pageSize={20}
          rowHeight={50}
          columnHeaderHeight={80}
        />
      </div>
    </div>
  );
};

export default Results;
