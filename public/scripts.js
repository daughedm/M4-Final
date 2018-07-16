window.onload = () => {
  fetchMarsList();
}

const fetchMarsList = async () => {
  try {
    let response = await fetch('/api/v1/marslist')
    let marsList = await response.json()
    let appendMarsList = marsList.map(listItem => {
      let isPacked;
      let className;
      if (listItem.packed) {
        isPacked = 'checked';
        className = 'checked';
      } else {
        isPacked = null;
        className = 'unchecked';
      } 

      console.log(isPacked);
      return (`
        <div class="card" id=${listItem.id}>
          <h3 class="title">${listItem.title}</h3>
          <input class="checkbox ${className}" type="checkbox" value="Packed" ${isPacked}>
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
  let className;
  if (packed) {
    isPacked = 'checked';
    className = 'checked';
  } else {
    isPacked = null;
    className = 'unchecked';
  }

  $('.cards-container').append(`
      <div class="card" id=${id}>
        <h3 class="title">${title}</h3>
        <input class="checkbox ${className}" type="checkbox" value="Packed" ${isPacked}>
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

const deleteMarsItem = async (event) => {
  if ($(event.target).hasClass('delete-button')) {
    let marsItem = ($(event.target).parent())
    let id = $(marsItem).attr('id')
    try {
      fetch(`/api/v1/marslist/${id}`, {
        method: 'DELETE'
      })
      $(marsItem).remove()
    } catch (error) {
      console.log('deleteMarsItem error: ', error);
    }
  }
}

const updatePackedItem = async (event) => {
  let checkedItem = ($(event.target).parent())
  let id = $(checkedItem).attr('id')
  let title = ($(event.target).closest('h3').innerText)
  let packed;
  
  if ($(event.target).hasClass('unchecked')) {
    packed = true;
    $(event.target).addClass('checked');
    $(event.target).removeClass('unchecked');

    try {
      fetch(`/api/v1/marslist/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          title,
          packed
        })
      })
    } catch (error) {
      console.log('updatePackedItem  error: ', error);
    }
  } else if (($(event.target).hasClass('checked'))) {
    packed = false;
    $(event.target).addClass('unchecked');
    $(event.target).removeClass('checked');

    try {
      fetch(`/api/v1/marslist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          packed
        })
      })
    } catch (error) {
      console.log('updatePackedItem  error: ', error);
    }
  }
}

$('.add-item-btn').click(addMarsItem)
$(this).click(deleteMarsItem)
$(this).click(updatePackedItem)
