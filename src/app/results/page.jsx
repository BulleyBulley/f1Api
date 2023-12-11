"use client"; // Use the client-side API
import React from "react";
import { useState, useEffect } from "react";
import {
  fetchSeasons,
  fetchSeasonEndDriverStandings,
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

  const handleSelectedSeason = (event) => {
    //clear the data grid
    setSeasonEndDriverStandings([]);
    setSelectedSeason(event.target.value);
    //populate the data grid with the selected season
    fetchSeasonEndDriverStandings(event.target.value)
      .then((data) => setSeasonEndDriverStandings(data))
      .catch((error) => console.error(error));
  };

  const flattenData = (data) => {
    return data.map((item) => ({
      fullName: item.Driver.givenName + " " + item.Driver.familyName,
      familyName: item.Driver.familyName,
      id: item.Driver.driverId,
      points: item.points,
      position: item.position,
      // Add other fields as needed
    }));
  };
  
  const flattenedSeasonEndDriverStandings = flattenData(seasonEndDriverStandings);
  

  useEffect(() => {
    fetchSeasons()
      .then((data) => setSeasons(data))
      .catch((error) => console.error(error));
  }, []);
  
  //setup columns for data grid
  const columns = [
    { field: "fullName", headerName: "Driver", width: 200 },
    { field: "points", headerName: "Points", width: 130 },
    
  ];
  

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
          value={seasons}
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
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        autoHeight
        disableSelectionOnClick></DataGrid>        
      </div>
    </div>
  );
};

export default Results;
