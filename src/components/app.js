import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";

const API_URL = "http://www.omdbapi.com/?apikey=903013cf";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    
    searchMovies("Avengers", 1); // Use a broad term to get more results
  }, []);

  const searchMovies = async (title, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMovies(data.Search || []);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    searchMovies(searchTerm, newPage);
  };

  return (
    <div className="app">
      <h1>Watch One</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
          aria-label="Search for movies"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
          aria-label="Search"
        />
      </div>

      {loading && <div className="loading">Loading...</div>}

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="empty">
            <h2>No movies found</h2>
          </div>
        )
      )}

      {totalResults > 10 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page * 10 >= totalResults}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
