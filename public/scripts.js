const fetchMarsList = async () => {
  try {
    let response = await fetch('/api/v1/marslist')
    let marsList = await response.json()
    let appendMarsList = marsList.map(listItem => {
      let isPacked;
      if (listItem.packed) {
        isPacked = 'checked';
      } else {
        isPacked = null;
      } 

      console.log(isPacked);
      return (`
        <div class="card" id=${listItem.id}>
          <h3 class="title">${listItem.title}</h3>
          <input class="Packed-check" type="checkbox" value="Packed" ${isPacked}>
          <label for="Packed">Packed</label>
          <button class="delete-button">delete</button>
        </div>
      `)
    })
    $('.cards-container').append(appendMarsList)

  } catch (error) {
    console.log('fetchMarsList error: ', error)
  }
}

const appendMarsItem = (title, packed, id) => {
  let isPacked;
  if (packed) {
    isPacked = 'checked';
  } else {
    isPacked = null;
  }

  $('.cards-container').append(`
      <div class="card" id=${id}>
        <h3 class="title">${title}</h3>
        <input class="Packed-check" type="checkbox" value="Packed" ${isPacked}>
        <label for="Packed">Packed</label>
        <button class="delete-button">delete</button>
      </div>
    `)
}

const addMarsItem = async (e) => {
  e.preventDefault()

  try {
    let title = $('.item-title').val()
    let packed = false;
    let response = await fetch('/api/v1/marslist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        packed
      })
    })
    let id = await response.json()
    if (id.id) {
      appendMarsItem(title, packed, id.id)
      $('.item-title').val('')
    }
  } catch (error) {
    console.log('addMarsItem error: ', error);
  }
}

fetchMarsList();
