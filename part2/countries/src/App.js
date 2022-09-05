import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        console.log("Promise fulfilled")
        setCountries(response.data)
      })
  }, [])

  const filterCountries = (countries, searchQuery) => {
    return countries.filter(country => country.name.official.includes(searchQuery));
  }  
  
  const searchQueryChanged = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    console.log("Search Query: ", newSearchQuery);

    // check if Search Query leads to only one country to be shown
    const filteredCountries = filterCountries(countries, newSearchQuery);
    if (filteredCountries.length === 1){
      updateSelectedCountry(filteredCountries[0].name.official);
    } else {
      // Remove the country details after additional input in search field
      updateSelectedCountry(null);
    }
  }

  const onShowCountry = (event) => {
    updateSelectedCountry(event.target.value);
  }

  const updateSelectedCountry = (countryName) => {
    if (countryName === null){
      setSelectedCountry({});
    } else {
      const selectedCountry = countries.filter(country => country.name.official === countryName)[0];
      setSelectedCountry(selectedCountry);
    }
  }

  return (
    <div>
      <SearchBar searchQuery={searchQuery} searchQueryChanged={searchQueryChanged}/>
      <Results countries={filterCountries(countries, searchQuery)} onShowCountry={onShowCountry}/>
      <CountryInfo selectedCountry={selectedCountry} />
    </div>
  );
}

const SearchBar = (props) => {

  const searchQuery = props.searchQuery;
  const searchQueryChanged = props.searchQueryChanged;

  return (
    <div>find countries <input value={searchQuery} onChange={searchQueryChanged}/></div>
  );
}

const Results = (props) => {
  const countries = props.countries;
  const onShowCountry = props.onShowCountry;

  let result = <></>;

  if (countries.length === 0) {
    return;
  } else if (countries.length >= 10) {
    result = <p> too many countries </p>;
  } else {
    result = countries.map(
      country => 
        <div key={country.name.official}>
          {country.name.official}
          {countries.length > 1 ? <button onClick={onShowCountry} value={country.name.official}>show</button> : <></>}
        </div>
      );
  }
  
  return result;
}

const CountryInfo = (props) => {
  const countryObject = props.selectedCountry;

  if (Object.keys(countryObject).length === 0) {
    return;
  }
  return (
    <div>
      <h1>{countryObject.name.official}</h1>
      <p>capital {countryObject.capital[0]}</p>
      <p>area {countryObject.area}</p>
      <p style={{fontWeight: "bold"}}>languages:</p>
      <ul>
        {Object.keys(countryObject.languages).map(key => <li key={key}>{countryObject.languages[key]}</li>)}
      </ul>
      <img src={countryObject.flags["png"]} alt={`Flag of ${countryObject.name.official}`}/>
    </div>
  )
}

export default App;
