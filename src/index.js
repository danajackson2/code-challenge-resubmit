let currentDog = {} 

function getDog(id){
    fetch(`http://localhost:3000/images/${id}`)
    .then(res => res.json())
    .then(dog => {
        renderDog(dog)
        document.querySelector('.like-button').addEventListener('click', () => editLikes(currentDog, 1))
        document.querySelector('.unlike-button').addEventListener('click', () => editLikes(currentDog, -1))
        document.querySelector('.comment-form').addEventListener('submit', addComment)
    })
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
    .then(dog => renderDog(dog))
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
    .then((comment) => {
        e.target.querySelector('input').value = ""
        renderComment(comment)
    })
    .then(() => {
        fetch(`http://localhost:3000/images/1`)
            .then(res => res.json())
            .then(dog => {currentDog = dog})
    })
    document.querySelector('form input').placeholder = "Add a comment..."
}

function deleteComment(comment){
    fetch(`http://localhost:3000/comments/${comment.id}`,{
        method: 'DELETE',
        headers: {'content-type':'application/json'},
    })
    .then(() => {
        fetch(`http://localhost:3000/images/1`)
            .then(res => res.json())
            .then(dog => {currentDog = dog})
    })
    document.querySelector('.comments').firstChild ? document.querySelector('form input').placeholder = "Add a comment..." : document.querySelector('form input').placeholder = "Be the first to comment!"
}

function renderDog(dog){
    currentDog = dog
    let dogDiv = document.querySelector('div.image-card')
    dogDiv.querySelector('h2.title').textContent = dog.title
    dogDiv.querySelector('img.image').src = dog.image
    dogDiv.querySelector('span.likes').textContent = `${dog.likes} likes`
    dogDiv.querySelector('form.comment-form').id = `form-${dog.id}`
    document.querySelector('ul.comments').innerHTML = ""
    if (dog.comments.length === 0){
        dogDiv.querySelector('form input').placeholder = "Be the first to comment!"
    } else {
        dogDiv.querySelector('form input').placeholder = "Add a comment..."
        dog.comments.forEach((comment) => {renderComment(comment)})
    }
}

function renderComment(comment){
    let dogDiv = document.querySelector('div.image-card')
    let button = document.createElement('button')
    button.textContent = "delete"
    // button.style = "position:absolute; right:0px" Button on right of card??
    let li = document.createElement('li')
    li.textContent = comment.content
    li.appendChild(button)
    dogDiv.querySelector('ul.comments').appendChild(li)
    button.addEventListener('click', () => {
        li.remove()
        deleteComment(comment)
    })
}

getDog(1)