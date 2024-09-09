document.addEventListener('DOMContentLoaded', () => {
    let currentForm = null; // Para rastrear el formulario actualmente visible

    // Manejo de los botones del menú
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', () => {
            const formToShow = button.getAttribute('data-form');
            if (currentForm === formToShow) {
                // Si el formulario ya está visible, ocultarlo
                ocultarFormulario();
                currentForm = null;
            } else {
                // Mostrar el formulario seleccionado y ocultar los demás
                mostrarFormulario(formToShow);
                currentForm = formToShow;
            }
        });
    });

    function mostrarFormulario(formId) {
        document.querySelectorAll('.form-section').forEach(section => {
            if (section.id === formId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
        document.getElementById('response').style.display = 'none'; // Ocultar respuestas
    }

    function ocultarFormulario() {
        document.querySelectorAll('.form-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById('response').style.display = 'none'; // Ocultar respuestas
    }

    // Manejar la creación de usuario
    document.getElementById('createUserForm').addEventListener('submit', async (event) => {
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
                mostrarDatosUsuario(result.mongoUser);
            } else {
                mostrarError(result.message || 'Ocurrió un error');
            }
        } catch (error) {
            mostrarError('Se produjo un error inesperado. Por favor, inténtalo de nuevo.');
        }
    });

    // Manejar la búsqueda de usuario
    document.getElementById('searchUserForm').addEventListener('submit', async (event) => {
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
    document.getElementById('updateUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const userId = document.getElementById('updateId').value;
        const updatedData = {
            name: document.getElementById('updateName').value,
            surname: document.getElementById('updateSurname').value,
            age: document.getElementById('updateAge').value,
            email: document.getElementById('updateEmail').value
        };
        
        console.log("afuera");
        try {
            const [sqliteResponse, mongoResponse] = await Promise.all([
                fetch(`/api/users/sqlite/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                }),
                fetch(`/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                })
            ]);
        
            const sqliteResult = await sqliteResponse.json();
            const mongoResult = await mongoResponse.json();
        
            console.log("adentro");
            if (sqliteResponse.ok && mongoResponse.ok) {
                mostrarDatosUsuario(mongoResult.user);
            } else {
                mostrarError(
                    `SQLite: ${sqliteResult.message || 'Error en SQLite'}, MongoDB: ${mongoResult.message || 'Error en MongoDB'}`
                );
            }
        } catch (error) {
            mostrarError('Se produjo un error inesperado. Por favor, inténtalo de nuevo.');
        }        
    });

    // Manejar la eliminación de usuario
    document.getElementById('deleteUserForm').addEventListener('submit', async (event) => {
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
        responseDiv.style.display = 'block';
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
        responseDiv.style.display = 'block';
        responseDiv.innerHTML = `
            <h2>Error</h2>
            <p>${mensaje}</p>
        `;
    }
});