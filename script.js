
document
  .getElementById('recommendationForm')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    const userId = document.getElementById('userId').value

    const song1 = document.getElementById('song1').value
    const artist1 = document.getElementById('artist1').value

    const song2 = document.getElementById('song2').value
    const artist2 = document.getElementById('artist2').value

    const song3 = document.getElementById('song3').value
    const artist3 = document.getElementById('artist3').value

    const seedGenres = document.getElementById('seedGenres').value
    const maxPopularity = document.getElementById('maxPopularity').value

    // Fetch song IDs
    Promise.all([
      fetch(`http://localhost:4000/search?artist=${artist1}&song=${song1}`),
      fetch(`http://localhost:4000/search?artist=${artist2}&song=${song2}`),
      fetch(`http://localhost:4000/search?artist=${artist3}&song=${song3}`)
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        const seedTracks = data.map((item) => item.spotify_id).join(',')
        return fetch(
          `http://localhost:4000/${userId}/recommendations?seed_tracks=${seedTracks}&seed_genres=${seedGenres}&max_popularity=${maxPopularity}`,
          {
            method: 'POST'
          }
        )
      })
      .then((response) => response.json())
      //...
      .then((data) => {
        const resultDiv = document.getElementById('recommendationsResult')
        resultDiv.innerHTML = ''

        data.forEach((item) => {
          const ul = document.createElement('ul')
          for (const key in item) {
            const li = document.createElement('li')
            if (key === 'previewURL' && item[key]) {
              const audio = document.createElement('audio')
              audio.controls = true
              audio.src = item[key]
              li.appendChild(audio)
            } else {
              li.textContent = `${key}: ${item[key]}`
            }
            ul.appendChild(li)
          }

          // Add like button
          const likeButton = document.createElement('button')
          likeButton.textContent = 'Like'
          likeButton.addEventListener('click', function () {
            fetch(`http://localhost:4000/${userId}/${item.spotify_id}/like`, {
              method: 'POST'
            })
              .then((response) => response.json())
              .then((data) => console.log(data))
              .catch((error) => console.error('Error:', error))
          })

          ul.appendChild(likeButton)
          resultDiv.appendChild(ul)
        })
      })
  })

//open likes
const navLikes = document.getElementById('nav-likes')

const openLikes = async () => {
  let userId = '6478aa30dee0f9f07836b151'
  document.querySelector('main').innerHTML = '<h1>Likes</h1>'
  fetch(`http://localhost:4000/${userId}/likes`)
  .then((response) => response.json())
  .then((data) => {
    data.body.forEach((item) => {
      const resultDiv = document.querySelector('main')
      const ul = document.createElement('ul')
      for (const key in item) {
        if (key === '_id' || key === 'user' || key === '__v') continue;
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
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function () {
          fetch(`http://localhost:4000/${userId}/${item._id}/like`, {
            method: 'DELETE'
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error('Error:', error))
        });

        ul.appendChild(deleteButton);
        resultDiv.appendChild(ul);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

navLikes.addEventListener('click', openLikes);