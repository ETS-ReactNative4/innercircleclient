import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchMovies, removeMovie, updateMovie } from "../store/actions/movies";
import { fetchTvshows, removeTvshow, updateTvshow } from "../store/actions/tvshows";
import MovieItem from "../components/MovieItem";
import TvshowItem from "../components/TvshowItem";

class RecommendationsFeedList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showMovies: true,
      showTvshows: true,
      singleUserContent: ""
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

   handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    const { currentUser } = this.props
    this.props.fetchMovies(currentUser);
    this.props.fetchTvshows(currentUser);
  }

  render() {
    const { movies, removeMovie, updateMovie, tvshows, removeTvshow, updateTvshow, currentUser } = this.props;
    let feedItems = []
    if (this.state.showMovies) {
      feedItems = [...movies]
    }
    if (this.state.showTvshows) {
      feedItems = [...feedItems, ...tvshows]
    }
    if (this.state.singleUserContent) {
      feedItems = feedItems.filter(item => item.user.username === this.state.singleUserContent)
    }
    let sortedFeedItems = feedItems.sort((a, b) => (a.updatedAt > b.updatedAt) ? -1 : 1)
    let feedList = sortedFeedItems.map(m => {
      if (m.category === 'tvshow'){
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
      />)}

    }
  );
    return (
      <div>
        <h5>Filters</h5>
        <p>
        <label>Username</label>
        <input
          type="text"
          onChange={this.handleInputChange}
          name="singleUserContent"
          value={this.state.singleUserContent}
          />
        </p>
        <p>
        <input
          type="checkbox"
          onChange={this.handleInputChange}
          name="showMovies"
          checked={this.state.showMovies}
          />
        Movies
        </p>
        <p>
        <input
          type="checkbox"
          onChange={this.handleInputChange}
          name="showTvshows"
          checked={this.state.showTvshows}
          />
        TV Shows
        </p>
        <div className="offset-1 col-sm-10">
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
    currentUser: state.currentUser.user.id
  };
}

export default connect(mapStateToProps, { fetchMovies, removeMovie, updateMovie, fetchTvshows, removeTvshow, updateTvshow })(
  RecommendationsFeedList
);
