document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            mostrarDatosUsuario(result.user);
        } else {
            mostrarError(result.message || 'Ocurrió un error');
        }
    } catch (error) {
        mostrarError('Se produjo un error inesperado. Por favor, inténtalo de nuevo.');
    }
});

function mostrarDatosUsuario(usuario) {
    const responseDiv = document.getElementById('response');
    
    responseDiv.className = 'success';
    responseDiv.innerHTML = `
        <h2>Usuario creado con éxito</h2>
        <p><strong>Nombre:</strong> ${usuario.name}</p>
        <p><strong>Apellido:</strong> ${usuario.surname}</p>
        <p><strong>Edad:</strong> ${usuario.age}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>ID:</strong> ${usuario._id}</p>
    `;
}

function mostrarError(mensaje) {
    const responseDiv = document.getElementById('response');
    
    responseDiv.className = 'error';
    responseDiv.innerHTML = `
        <h2>Error</h2>
        <p>${mensaje}</p>
    `;
}
