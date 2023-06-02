let userId = '6478aa30dee0f9f07836b151'
const navRecs = document.getElementById('nav-get-recs')
const navLikes = document.getElementById('nav-likes')
const navBatches = document.getElementById('nav-batches')
const resultDiv = document.querySelector('main')

document
  .getElementById('recommendationForm')
  .addEventListener('submit', function (event) {
    event.preventDefault()

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
      fetch(
        `https://spotify-rec-backend.herokuapp.com/search?artist=${artist1}&song=${song1}`
      ),
      fetch(
        `https://spotify-rec-backend.herokuapp.com/search?artist=${artist2}&song=${song2}`
      ),
      fetch(
        `https://spotify-rec-backend.herokuapp.com/search?artist=${artist3}&song=${song3}`
      )
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        const seedTracks = data.map((item) => item.spotify_id).join(',')
        return fetch(
          `https://spotify-rec-backend.herokuapp.com/${userId}/recommendations?seed_tracks=${seedTracks}&seed_genres=${seedGenres}&max_popularity=${maxPopularity}`,
          {
            method: 'POST'
          }
        )
      })
      .then((response) => response.json())
      .then((data) => {
        const resultDiv = document.getElementById('recommendationsResult')
        resultDiv.innerHTML = ''

        data.forEach((item) => {
          const ul = document.createElement('ul')
          ul.className = 'song-card'
          for (const key in item) {
            const li = document.createElement('li')
            if (key === 'previewURL' && item[key]) {
              const audio = document.createElement('audio')
              audio.controls = true
              audio.src = item[key]
              li.appendChild(audio)
            } else if (key === 'artURL' && item[key]) {
              const img = document.createElement('img')
              img.src = item[key]
              img.alt = 'Artwork'
              li.appendChild(img)
            } else {
              li.textContent = `${key}: ${item[key]}`
            }
            ul.appendChild(li)
          }

          // Add like button
          const likeButton = document.createElement('button')
          likeButton.textContent = 'Like'
          likeButton.addEventListener('click', function () {
            fetch(
              `https://spotify-rec-backend.herokuapp.com/${userId}/${item.spotify_id}/like`,
              {
                method: 'POST'
              }
            )
              .then((response) => response.json())
              .then((data) => console.log(data))
              .catch((error) => console.error('Error:', error))
          })

          ul.appendChild(likeButton)
          resultDiv.appendChild(ul)
        })
      })
  })

const openLikes = async () => {
  document.querySelector('main').innerHTML = '<h1>Likes</h1>'
  fetch(`https://spotify-rec-backend.herokuapp.com/${userId}/likes`)
    .then((response) => response.json())
    .then((data) => {
      data.body.forEach((item) => {
        const ul = document.createElement('ul')
        ul.className = 'song-card'
        for (const key in item) {
          if (key === '_id' || key === 'user' || key === '__v') continue
          const li = document.createElement('li')
          if (key === 'previewURL' && item[key]) {
            const audio = document.createElement('audio')
            audio.controls = true
            audio.src = item[key]
            li.appendChild(audio)
          } else if (key === 'artURL' && item[key]) {
            const img = document.createElement('img')
            img.src = item[key]
            img.alt = 'Artwork'
            li.appendChild(img)
          } else {
            li.textContent = `${key}: ${item[key]}`
          }
          ul.appendChild(li)
        }
        // Add delete button
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', function () {
          fetch(
            `https://spotify-rec-backend.herokuapp.com/${userId}/${item._id}/like`,
            {
              method: 'DELETE'
            }
          )
            .then((response) => response.json())
            .then((data) => console.log(data))
            .then(openLikes)
            .catch((error) => console.error('Error:', error))
        })

        ul.appendChild(deleteButton)
        resultDiv.appendChild(ul)
      })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

const openBatches = async () => {
  document.querySelector('main').innerHTML = '<h1>Batches</h1>'
  fetch(`https://spotify-rec-backend.herokuapp.com/${userId}/batches`)
    .then((response) => response.json())
    .then((data) => {
      data.body.forEach((item) => {
        const div = document.createElement('div')
        div.className = 'batch-div'
        div.innerHTML = item.name

        div.addEventListener('click', function () {
          listBatch(item._id)
        })

        // Add delete button
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', function (event) {
          event.stopPropagation()
          fetch(
            `https://spotify-rec-backend.herokuapp.com/${userId}/batch/${item._id}`,
            {
              method: 'DELETE'
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data)
            })
            .then(openBatches)
            .catch((error) => console.error('Error:', error))
        })

        div.appendChild(deleteButton)
        resultDiv.appendChild(div)
      })
    })
}

const listBatch = async (batchId) => {
  document.querySelector('main').innerHTML = '<h1>Songs in Batch</h1>'
  fetch(
    `https://spotify-rec-backend.herokuapp.com/${userId}/batches/${batchId}`
  )
    .then((response) => response.json())
    .then((batch) => {
      const songIds = batch.body[0].songs
      const songPromises = songIds.map((id) =>
        fetch(`https://spotify-rec-backend.herokuapp.com/song/${id}`)
      )

      Promise.all(songPromises)
        .then((responses) =>
          Promise.all(responses.map((response) => response.json()))
        )
        .then((songs) => {
          songs.forEach((item) => {
            const ul = document.createElement('ul')
            ul.className = 'song-card'
            for (const key in item.body) {
              if (key === '_id' || key === 'user' || key === '__v') continue
              const li = document.createElement('li')
              if (key === 'previewURL' && item.body[key]) {
                const audio = document.createElement('audio')
                audio.controls = true
                audio.src = item.body[key]
                li.appendChild(audio)
              } else if (key === 'artURL' && item.body[key]) {
                const img = document.createElement('img')
                img.src = item.body[key]
                img.alt = 'Artwork'
                li.appendChild(img)
              } else {
                li.textContent = `${key}: ${item.body[key]}`
              }
              ul.appendChild(li)
            }
            // Add like button
            const likeButton = document.createElement('button')
            likeButton.textContent = 'Like'
            likeButton.addEventListener('click', function () {
              fetch(
                `https://spotify-rec-backend.herokuapp.com/${userId}/${item.body.spotify_id}/like`,
                {
                  method: 'POST'
                }
              )
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error('Error:', error))
            })

            ul.appendChild(likeButton)
            resultDiv.appendChild(ul)
          })
        })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

navLikes.addEventListener('click', openLikes)
navRecs.addEventListener('click', function () {
  location.reload()
})
navBatches.addEventListener('click', openBatches)
