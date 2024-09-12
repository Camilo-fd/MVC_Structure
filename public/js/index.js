document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Manejador del login
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch('/api/users/login/v1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (response.ok) {
                // const data = await response.json();
                window.location.href = "/menu";
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la conexión');
        }
    });

    // Manejador del registro
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("signupUsername").value;
        const password = document.getElementById("signupPassword").value;

        try {
            const response = await fetch('/api/users/signup/v1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (response.ok) {
                alert("Registro exitoso. Ahora puedes iniciar sesión.");
                signupForm.reset();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en la conexión');
        }
    });
});