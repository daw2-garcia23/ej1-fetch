function sacarUsuarios() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(resp => resp.json())
        .then(usuarios => {
            for (let i = 0; i < 5; i++) {
                const user = usuarios[i];
                const id = user.id;
                const nombre = user.name;
                const username = user.username;
                const email = user.email;
                console.log('Nombre:', nombre);
                console.log('Email:', email);
                document.querySelector('#inyectarUsuarios').innerHTML +=
                    `
                <tr class="usuarios" data-id="${id}">
                    <td>${id}</td>
                    <td>${nombre}</td>
                    <td>${username}</td>
                    <td>${email}</td>
                </tr>
                `;
            }

            document.querySelector('tbody').addEventListener('click', (event) => {
                event.preventDefault();
                const tr = event.target.closest('.usuarios');
                if (tr) {
                    const userId = parseInt(tr.getAttribute('data-id'));
                    const usuarioSeleccionado = usuarios.find(user => user.id === userId);
                    if (usuarioSeleccionado) {
                        const nombre = usuarioSeleccionado.name;
                        const apellido = usuarioSeleccionado.username;
                        const mail = usuarioSeleccionado.email;
                        const web = usuarioSeleccionado.website;
                        console.log(nombre);
                        document.querySelector('#fichaUsuario').innerHTML = `
                        <p><strong>Nombre:</strong> <span>${nombre}</span></p>
                        <p><strong>Apellido:</strong> <span>${apellido}</span></p>
                        <p><strong>Email:</strong> <span>${mail}</span></p>
                        <a href="#" class="card-link">${web}</a>
                        `;

                        mostrarPosts(userId); // aqui llamo a la funcion mostrarPosts que depenederá del tr clickado, se saber a través del id
                    }
                }
            });
        })
}

function mostrarPosts(userId) {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
        .then(resp => resp.json())
        .then(posts => {
            const postsDiv = document.getElementById('mostrarComentarios');
            postsDiv.innerHTML = '<h3>Publicaciones</h3>';
            posts.slice(0, 5).forEach(post => {
                const postCard = document.createElement('div');
                postCard.classList.add('card', 'mt-2');
                postCard.innerHTML = `
                    <div class="card-body">
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.body}</p>
                        <div class="comentarios-container" id="comentarios-${post.id}"></div>
                    </div>`;
                postsDiv.appendChild(postCard);
            });

            // Obtener los postIds para mostrar los comentarios después de mostrar los posts
            const postIds = posts.map(post => post.id);
            mostrarComentariosPosts(postIds);
        })
}

function mostrarComentariosPosts(postIds) {
    const fetches = postIds.map(postId =>
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(resp => resp.json())
    );
    // Esperar a que todas las llamadas fetch se completen
    Promise.all(fetches)
        .then(comentariosArrays => {
            const comentariosDiv = document.getElementById('mostrarComentariosPosts');
            comentariosDiv.innerHTML = ''; 

            comentariosArrays.forEach(comentarios => {
                comentarios.slice(0, 2).forEach(comment => {
                    const commentCard = document.createElement('div');
                    commentCard.classList.add('card', 'mt-2');
                    commentCard.innerHTML = `
                        <div class="card-body">
                            <h4><strong>Comentarios</strong></h4>
                            <h6 class="card-subtitle mb-2 text-muted">${comment.email}</h6>
                            <p class="card-text">${comment.body}</p> 
                        </div>`;
                    comentariosDiv.appendChild(commentCard);
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener comentarios:', error);
        });
}


sacarUsuarios();

