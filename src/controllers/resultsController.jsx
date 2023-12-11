// Import the getSeasons function from the API module
import { getSeasons, getSeasonEndDriverStandings } from '../utilities/api';

// Define the fetchSeasons function
const fetchSeasons = async () => {
  try {
    // Call the getSeasons function to fetch the data from the API
    const seasons = await getSeasons();

    // Convert the seasons object to an array
    const seasonsArray = Object.values(seasons);

    // Return the seasonsArray as props to the results page
    return seasonsArray;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return [];
  }
};

const fetchSeasonEndDriverStandings =  async (year) => {
  try {
    const standings = await getSeasonEndDriverStandings(year);
    console.log(standings);
    return standings;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export { fetchSeasons, fetchSeasonEndDriverStandings };
