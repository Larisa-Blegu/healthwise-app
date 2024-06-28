import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

function Main() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://newsdata.io/api/1/latest?country=ro&category=health&apikey=pub_4471825b0a6d721efecea8fb021cfa037b737"
        );
        setArticles(response.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div className="title_main">
        <h1>Healthwise</h1>
        <p>Împreună spre sănătate: Informație, îngrijire și inspirație</p>
      </div>

      <div className="images">
        {articles
          .slice(1, 9)
          .filter(
            (article) =>
              article.title !== "[Removed]" &&
              article.link !== "https://removed.com" &&
              article.image_url !== null
          )
          .map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="image-link"
            >
              <div className="image-overlay">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="image"
                />
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
