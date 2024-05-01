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
    try {
      initializePage();

      const year = event.target.value;
      setSelectedSeason(event.target.value);

      // get driver standings
      const { driverStandings, numberOfRaces } =
        await fetchSeasonEndDriverStandings(year);
      const raceResultsForSeason = await getRaceResultsForSeason(
        year,
        numberOfRaces
      );

      // add flags to the results
      const resultsWithFlags = await fetchFlagUrls(raceResultsForSeason);

      //generate dynamic columns
      const combinedDriverStandingsAndRaceResults =
        combineDriverStandingsAndRaceResults(driverStandings, resultsWithFlags);

      //update season winner from diver standings
      updateSeasonWinner(driverStandings);

      //put all the results together
      handleUpdatedDriverStandingsAndRaceResults(
        combinedDriverStandingsAndRaceResults
      );
      console.log("OUT handleSelectedSeason");
    } catch (error) {
      console.error(error);
    }
  };

  // resets the page state
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

  //makes an array of race results for the season
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
      { field: "seasonEndPoints", headerName: "Points", width: 100, renderCell: (params) => {
        return (
          pointsCellFormatter(params)
        )
      } },
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
          width: 100,
          disableColumnFilter: true,
          disableColumnSort: true,
          renderHeader: (params) => (
            //set div background image to flagUrl
            <div className="race-name-header-container">
              <div className="race-name-header-text">
              <h3>{race.friendlyName}</h3>
              <h4>{formattedDate}</h4>
              </div>
              <div className="race-flag-image">
              <img src={flagUrl} />

              </div>
            </div>
          ),
          renderCell: (params) => {
            return raceCellFormatter(params);
          }
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
            fullName: result.driverName,
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

  //populate the DataGrid
  const handleUpdatedDriverStandingsAndRaceResults = (
    combinedDriverStandingsAndRaceResults
  ) => {
    setDynamicColumns(combinedDriverStandingsAndRaceResults.dynamicColumns);
    setRowsCombined(combinedDriverStandingsAndRaceResults.combinedData);
  };

  //updates the season winner text
  const updateSeasonWinner = (driverStandings) => {
    console.log("IN updateSeasonWinner");
    const seasonWinner = driverStandings[0].fullName;
    setSeasonWinner(seasonWinner);
    console.log("OUT updateSeasonWinner");
  };

  const raceCellFormatter = (params) => {
    return (
      <span className="race-cell-value">{params.value}</span>
    )
  }
  
  const pointsCellFormatter = (params) => {
    return (
      <span className="points-cell-value">{params.value}</span>
    )
  }


  // fetches the seasons
  useEffect(() => {
    fetchSeasons()
      .then((data) => setSeasons(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // update page when rowsCombined is updated
  }, [rowsCombined]);

  useEffect(() => {
    // update page when dynamicColumns is updated
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
            <img src={winningDriverImage} />
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
          disableColumnMenu={true}
          disableColumnFilter={true}
          disableColumnSort={true}
          rowsPerPageOptions={[10]}
          hideFooter={true}
          sx={{
            // add a box shadow
            "& .MuiDataGrid-cell": {
              boxShadow: "2px 0px 1px 0px rgba(0,0,0,0.75)",
            },
            boxShadow: "1px 8px 25px 10px rgba(0,0,0,0.3)",
            
          }}
        />
      </div>
    </div>
  );
};

export default Results;
