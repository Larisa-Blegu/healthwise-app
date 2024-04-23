import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Main.css';
import person_icon from '../Assets/person.png';

function Main() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=ee92c84a592147798c9a9372285db418');
        setArticles(response.data.articles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this effect will run once when the component mounts

  return (
    <div>

      
      {/* Numele companiei și motto-ul */}
      <div className='title'>
        <h1>Healthwise</h1>
        <p>Împreună spre sănătate: Informație, îngrijire și inspirație</p>
      </div>

      {/* Articole de știri */}
      <div className='images'>
  {articles
    .slice(3, 12)
    .filter(article => article.title !== "[Removed]" && article.url !== "https://removed.com")
    .map((article, index) => (
      <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="image-link">
        <div className="image-overlay">
          <img src={article.urlToImage} alt={article.title} className="image" />
          <div className="overlay">
            <div className="text">{article.title}</div>
          </div>
        </div>
        <button className="read-more-button">Află mai multe...</button>
      </a>
    ))}
</div>

    </div>
  );
}

export default Main;
