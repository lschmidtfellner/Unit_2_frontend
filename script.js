document.getElementById("recommendationForm").addEventListener("submit", function(event) {
  event.preventDefault(); 

  const userId = document.getElementById("userId").value;
  
  const song1 = document.getElementById("song1").value;
  const artist1 = document.getElementById("artist1").value;

  const song2 = document.getElementById("song2").value;
  const artist2 = document.getElementById("artist2").value;

  const song3 = document.getElementById("song3").value;
  const artist3 = document.getElementById("artist3").value;

  const seedGenres = document.getElementById("seedGenres").value;
  const maxPopularity = document.getElementById("maxPopularity").value;

  // Fetch song IDs
  Promise.all([
      fetch(`http://localhost:4000/search?artist=${artist1}&song=${song1}`),
      fetch(`http://localhost:4000/search?artist=${artist2}&song=${song2}`),
      fetch(`http://localhost:4000/search?artist=${artist3}&song=${song3}`)
  ])
  .then(responses => Promise.all(responses.map(response => response.json())))
  .then(data => {
      const seedTracks = data.map(item => item.spotify_id).join(',');
      return fetch(`http://localhost:4000/${userId}/recommendations?seed_tracks=${seedTracks}&seed_genres=${seedGenres}&max_popularity=${maxPopularity}`, {
          method: "POST",
      });
  })
  .then(response => response.json())
  .then(data => {
      // Create an unordered list (ul) from the recommendations
      const resultDiv = document.getElementById("recommendationsResult");
      resultDiv.innerHTML = ''
      
      data.forEach(item => {
          const ul = document.createElement('ul');
          for (const key in item) {
              const li = document.createElement('li');
              if (key === 'previewURL' && item[key]) {
                  const audio = document.createElement('audio');
                  audio.controls = true;
                  audio.src = item[key];
                  li.appendChild(audio);
              } else {
                  li.textContent = `${key}: ${item[key]}`;
              }
              ul.appendChild(li);
          }
          resultDiv.appendChild(ul);
      });
  })
  .catch(error => console.error('Error:', error));
});
