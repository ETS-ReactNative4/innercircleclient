import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMovies, removeMovie, updateMovie } from "../store/actions/movies";
import { fetchTvshows, removeTvshow, updateTvshow } from "../store/actions/tvshows";
import { fetchMeals, removeMeal, updateMeal } from "../store/actions/meals";
import MovieItem from "../components/MovieItem";
import TvshowItem from "../components/TvshowItem";
import MealItem from "../components/MealItem";
import { Link } from "react-router-dom"

class RecommendationsFeedList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      filterMenu: true,
      showMovies: true,
      showMoviesOnly: false,
      showTvshows: true,
      showTvshowsOnly: false,
      showMeals: true,
      showMealsOnly: false,
      singleUserContent: "",
      showRecommendations: true,
      showBookmarks: true
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleFilterMenu = this.toggleFilterMenu.bind(this)
  }

   handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  toggleFilterMenu() {
    this.setState((prevState) => ({
      filterMenu: !prevState.filterMenu
    }))
  }

  componentDidMount() {
    const { currentUser } = this.props
    this.props.fetchMovies(currentUser);
    this.props.fetchTvshows(currentUser);
    this.props.fetchMeals(currentUser);
  }

  render() {
    const { movies, removeMovie, updateMovie, tvshows, removeTvshow, updateTvshow, meals, removeMeal, updateMeal, currentUser } = this.props;

    let items = [...movies, ...tvshows, ...meals]

    if (!this.state.showMovies) {
      items = items.filter(item => item.category !== "movie")
    }

    if (this.state.showMoviesOnly) {
      items = items.filter(item => item.category === "movie")
    }

    if (!this.state.showTvshows) {
      items = items.filter(item => item.category !== "tv show")
    }

    if (this.state.showTvshowsOnly) {
    items = items.filter(item => item.category === "tv show")
    }

    if (!this.state.showMeals) {
      items = items.filter(item => item.category !== "meal")
    }

    if (this.state.showMealsOnly) {
    items = items.filter(item => item.category === "meal")
    }

    if (this.state.singleUserContent) {
      items = items.filter(item => item.user.username === this.state.singleUserContent)
    }

    if (!this.state.showRecommendations) {
      items = items.filter(item => item.status !== 'recommendation')
    }

    if (!this.state.showBookmarks) {
      items = items.filter(item => item.status !== 'bookmark')
    }

    let sortedItems = items.sort((a, b) => (a.updatedAt > b.updatedAt) ? -1 : 1)
    let feedList = sortedItems.map(m => {
      if (m.category === 'tv show'){
      return (<TvshowItem
          key={m._id}
          date={m.updatedAt}
          category={m.category}
          title={m.title}
          availableOn={m.availableOn}
          impressions={m.impressions}
          status={m.status}
          tvshowId={m._id}
          username={m.user.username}
          userId={m.user._id}
          profileImageUrl={m.user.profileImageUrl}
          removeTvshow={removeTvshow.bind(this, m.user._id, m._id)}
          updateTvshow={updateTvshow.bind(this, m.user._id, m._id)}
          currentUser={currentUser}
          isCorrectUser={currentUser === m.user._id}
      />)}
      else if (m.category === 'movie') {
      return (<MovieItem
        key={m._id}
        date={m.updatedAt}
        category={m.category}
        title={m.title}
        availableOn={m.availableOn}
        impressions={m.impressions}
        status={m.status}
        movieId={m._id}
        username={m.user.username}
        userId={m.user._id}
        profileImageUrl={m.user.profileImageUrl}
        removeMovie={removeMovie.bind(this, m.user._id, m._id)}
        updateMovie={updateMovie.bind(this, m.user._id, m._id)}
        currentUser={currentUser}
        isCorrectUser={currentUser === m.user._id}
      />)}

      else if (m.category === 'meal') {
      return (<MealItem
        key={m._id}
        date={m.updatedAt}
        category={m.category}
        name={m.name}
        restaurant={m.restaurant}
        imageUrl={m.imageUrl}
        impressions={m.impressions}
        status={m.status}
        mealId={m._id}
        username={m.user.username}
        userId={m.user._id}
        profileImageUrl={m.user.profileImageUrl}
        removeMeal={removeMeal.bind(this, m.user._id, m._id)}
        updateMeal={updateMeal.bind(this, m.user._id, m._id)}
        currentUser={currentUser}
        isCorrectUser={currentUser === m.user._id || currentUser === m.user}
      />)}

    }
  );

    const filterMenu = (
      <div className="filterMenu">
          <p className="friendFilter"><strong>Friend: </strong>
            <input
              type="text"
              onChange={this.handleInputChange}
              name="singleUserContent"
              value={this.state.singleUserContent}
              />
          </p>

            <p className="typeFilter">Type:
              <input
                className="filterCheckbox"
                type="checkbox"
                onChange={this.handleInputChange}
                name="showRecommendations"
                checked={this.state.showRecommendations}
                />
              Recommendations
              <input
                className="filterCheckbox"
                type="checkbox"
                onChange={this.handleInputChange}
                name="showBookmarks"
                checked={this.state.showBookmarks}
                />
              Bookmarks
            </p>

          <p className="includeFilter">
          Include: (choose multiple)
          <input
            className="filterCheckbox"
            type="checkbox"
            onChange={this.handleInputChange}
            name="showMovies"
            checked={this.state.showMovies}
            />
          Movies
          <input
            className="filterCheckbox"
            type="checkbox"
            onChange={this.handleInputChange}
            name="showTvshows"
            checked={this.state.showTvshows}
            />
          TV Shows
          <input
            className="filterCheckbox"
            type="checkbox"
            onChange={this.handleInputChange}
            name="showMeals"
            checked={this.state.showMeals}
            />
          Meals
          </p>

          <p className="onlyFilter">
          Show Only: (choose one)
          <input
            className="filterCheckbox"
            type="checkbox"
            onChange={this.handleInputChange}
            name="showMoviesOnly"
            checked={this.state.showMoviesOnly}
            />
          Movies

          <input
            className="filterCheckbox"
            type="checkbox"
            onChange={this.handleInputChange}
            name="showTvshowsOnly"
            checked={this.state.showTvshowsOnly}
            />
          TV Shows
          <input
            className="filterCheckbox"
            type="checkbox"
            onChange={this.handleInputChange}
            name="showMealsOnly"
            checked={this.state.showMealsOnly}
            />
          Meals
          </p>
        </div>
    )
    return (
      <div className="feed">
        <br/>
        <button className="customButton2" onClick={this.toggleFilterMenu}>Search/Filter</button>
        {this.state.filterMenu ? filterMenu : null}
        <div>
          <ul className="list-group">
            {feedList}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    movies: state.movies,
    tvshows: state.tvshows,
    meals: state.meals,
    currentUser: state.currentUser.user.id
  };
}

export default connect(mapStateToProps, {
  fetchMovies,
  removeMovie,
  updateMovie,
  fetchTvshows,
  removeTvshow,
  updateTvshow,
  fetchMeals,
  removeMeal,
  updateMeal
})(
  RecommendationsFeedList
);
