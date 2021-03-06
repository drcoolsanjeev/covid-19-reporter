import React, { Component } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import "loaders.css/src/animations/ball-scale-multiple.scss";
import "./App.css";
import { countries } from "./components/CountryCompleter/countries";
import CountryDetails from "./components/CountryDetails";
import Loader from "./components/Loader";

const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === "") {
    return [];
  }
  const regex = new RegExp("^" + escapedValue, "i");
  const suggestions = countries.filter(language => regex.test(language.label));
  return suggestions;
};
export default class App extends Component {
  state = {
    data: "",
    country: "",
    suggestions: [],
    value: "",
    loading: true
  };

  handleEnter = event => {
    event.key === "Enter" && this.getCovidInformation();
  };

  handleInputChange = event => {
    this.setState({ country: event.target.value });
  };

  handleSearchClick = () => {
    this.getCovidInformation();
  };

  getCovidInformation() {
    this.setState({ loading: true });
    const request = {
      data: { country: this.state.country },
      method: "POST",
      url: "https://coronavirus-covid19.herokuapp.com/country"
    };

    axios(request)
      .then(response => this.setState({ data: response.data }))
      .catch(err => this.setState({ response: err.message }))
      .finally(() => this.setState({ loading: false }));
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      country: newValue
    });
  };

  getSuggestionValue = suggestion => {
    return suggestion.id;
  };

  renderSuggestion = suggestion => {
    return suggestion.id;
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  componentDidMount() {
    this.getCovidInformation();
  }

  render() {
    const { country, suggestions } = this.state;
   
    return (
      <div className="App">
        <h1 className="mb5">Covid - 19 Live Updates</h1>
        <div className="flex-center wrap mb5">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            inputProps={{
              value: country,
              onChange: (e, { newValue }) =>
                this.setState({ country: newValue })
            }}
          />
          <button
            type="button"
            onClick={this.handleSearchClick}
            className="Search-Button">
            Search
          </button>
        </div>
        <div>
          {this.state.loading ? (
            <div className="Loader">
              <Loader
                type="ball-scale-multiple"
                active
                innerClassName="flex-center"
                color="#DC143C"
              />
            </div>
          ) : (
            <CountryDetails
              data={this.state.data}
              country={this.state.country}
            />
          )}
        </div>
      </div>
    );
  }
}
