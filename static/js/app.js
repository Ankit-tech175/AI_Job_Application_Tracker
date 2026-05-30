// =========================
// REGISTER FORM
// =========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const messageDiv = document.getElementById("message");

        try {

            const response = await fetch("/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    email,
                    password
                })

            });

            const data = await response.json();

            if (data.success) {

                messageDiv.innerHTML =
                    `<span class="text-success">${data.message}</span>`;

                registerForm.reset();

            } else {

                messageDiv.innerHTML =
                    `<span class="text-danger">${data.message}</span>`;
            }

        } catch (error) {

            messageDiv.innerHTML =
                `<span class="text-danger">Something went wrong</span>`;
        }

    });

}


// =========================
// LOGIN FORM
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const messageDiv = document.getElementById("message");

        try {

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (data.success) {

                // Store JWT token
                localStorage.setItem(
                    "access_token",
                    data.data.access_token
                );

                messageDiv.innerHTML =
                    `<span class="text-success">${data.message}</span>`;

                // Redirect later
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);

            } else {

                messageDiv.innerHTML =
                    `<span class="text-danger">${data.message}</span>`;
            }

        } catch (error) {

            messageDiv.innerHTML =
                `<span class="text-danger">Something went wrong</span>`;
        }

    });

}