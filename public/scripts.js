const fetchMarsList = async () => {
  try {
    let response = await fetch('/api/v1/marslist')
    let marsList = await response.json()
    let marsListToAppend = marsList.map(listItem => {
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
    $('.cards-container').append(marsListToAppend)

  } catch (error) {
    console.log('fetchMarsList error: ', error)
  }
}



fetchMarsList();
