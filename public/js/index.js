document.addEventListener('DOMContentLoaded', () => {
    // Manejar la creación de usuario
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

    // Manejar la búsqueda de usuario
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userId = document.getElementById('searchId').value;
        
        try {
            const response = await fetch(`/api/users/${userId}`);
            const result = await response.json();
            
            if (response.ok) {
                mostrarDatosUsuario(result);
            } else {
                mostrarError(result.message || 'Ocurrió un error');
            }
        } catch (error) {
            mostrarError('Se produjo un error inesperado. Por favor, inténtalo de nuevo.');
        }
    });

    // Manejar la actualización de usuario
    document.getElementById('updateForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userId = document.getElementById('updateId').value;
        const updatedData = {
            name: document.getElementById('updateName').value,
            surname: document.getElementById('updateSurname').value,
            age: document.getElementById('updateAge').value,
            email: document.getElementById('updateEmail').value
        };
        
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
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

    // Manejar la eliminación de usuario
    document.getElementById('deleteForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userId = document.getElementById('deleteId').value;
        
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                mostrarDatosUsuario({ _id: userId, ...result });
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
            <h2>Datos del Usuario</h2>
            <p><strong>ID:</strong> ${usuario._id || 'No disponible'}</p>
            <p><strong>Nombre:</strong> ${usuario.name || 'No disponible'}</p>
            <p><strong>Apellido:</strong> ${usuario.surname || 'No disponible'}</p>
            <p><strong>Edad:</strong> ${usuario.age || 'No disponible'}</p>
            <p><strong>Email:</strong> ${usuario.email || 'No disponible'}</p>
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
});
