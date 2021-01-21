function getDog(id){
    fetch(`http://localhost:3000/images/${id}`)
    .then(res => res.json())
    .then(dog => renderDog(dog))
}

function editLikes(dog, increment){
    fetch(`http://localhost:3000/images/${dog.id}`, {
        method: 'PATCH',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({
            title: dog.title,
            likes: dog.likes + increment,
            image: dog.image,
            comments: dog.comments
        })
    })
    .then(res => res.json())
    .then(dog => getDog(dog.id))
}

function addComment(e){
    e.preventDefault()
    dogId = parseInt(e.target.id.split('-')[1])
    fetch('http://localhost:3000/comments',{
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({
            imageId: dogId,
            content: e.target.querySelector('input').value
        })
    })
    .then(res => res.json())
    .then(() => {
        e.target.querySelector('input').value = ""
        getDog(dogId)
    })
}

function deleteComment(comment){
    fetch(`http://localhost:3000/comments/${comment.id}`,{
        method: 'DELETE',
        headers: {'content-type':'application/json'},
    })
    .then(() => getDog(comment.imageId))
}

function renderDog(dog){
    let dogDiv = document.querySelector('div.image-card')
    dogDiv.querySelector('h2.title').textContent = dog.title
    dogDiv.querySelector('img.image').src = dog.image
    dogDiv.querySelector('span.likes').textContent = `${dog.likes} likes`
    dogDiv.querySelector('button.like-button').addEventListener('click', () => editLikes(dog, 1))
    dogDiv.querySelector('button.unlike-button').addEventListener('click', () => editLikes(dog, -1))
    dogDiv.querySelector('form.comment-form').id = `form-${dog.id}`
    dogDiv.querySelector('.comment-form').addEventListener('submit', addComment)
    document.querySelector('ul.comments').innerHTML = ""
    if (dog.comments.length === 0){
        dogDiv.querySelector('form input').placeholder = "Be the first to comment!"
    } else {
        dogDiv.querySelector('form input').placeholder = "Add a comment..."
        dog.comments.forEach(comment => {
            let button = document.createElement('button')
            button.addEventListener('click', () => deleteComment(comment))
            button.textContent = "delete"
            // button.style = "margin-right:auto" Button on right of card??
            let li = document.createElement('li')
            li.textContent = comment.content
            li.appendChild(button)
            dogDiv.querySelector('ul.comments').appendChild(li)
        })
    }
}

getDog(1)