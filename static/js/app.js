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
// =========================
// ADD JOB APPLICATION
// =========================

const addJobForm = document.getElementById("addJobForm");

if (addJobForm) {

    addJobForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const company_name =
            document.getElementById("company_name").value;

        const job_title =
            document.getElementById("job_title").value;

        const job_link =
            document.getElementById("job_link").value;

        const status =
            document.getElementById("status").value;

        const notes =
            document.getElementById("notes").value;

        const messageDiv =
            document.getElementById("jobMessage");

        // Get JWT token
        const token =
            localStorage.getItem("access_token");

        // Check token
        if (!token) {

            window.location.href = "/login";

            return;
        }

        try {

            const response = await fetch(
                "/api/jobs/add",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        company_name,
                        job_title,
                        job_link,
                        status,
                        notes
                    })

                }
            );

            const data = await response.json();

            if (data.success) {

                messageDiv.innerHTML = `
                    <div class="alert alert-success">
                        ${data.message}
                    </div>
                `;

                addJobForm.reset();
                fetchUserJobs();
                fetchAnalytics();

            } else {

                messageDiv.innerHTML = `
                    <div class="alert alert-danger">
                        ${data.message}
                    </div>
                `;
            }

        } catch (error) {

            messageDiv.innerHTML = `
                <div class="alert alert-danger">
                    Something went wrong
                </div>
            `;
        }

    });

}


// =========================
// LOGOUT FUNCTION
// =========================

function logoutUser() {

    localStorage.removeItem("access_token");

    window.location.href = "/login";
}
// =========================
// FETCH USER JOBS
// =========================

async function fetchUserJobs() {

    const token =
        localStorage.getItem("access_token");

    // Redirect if token missing
    if (!token) {

        window.location.href = "/login";

        return;
    }

    try {

        const response = await fetch(
            "/api/jobs/my-jobs",
            {

                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }

            }
        );

        const data = await response.json();

        const tableBody =
            document.getElementById("jobsTableBody");

        // Skip if table not found
        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";

        if (data.success && data.data.length > 0) {

            data.data.forEach((job) => {

                tableBody.innerHTML += `

    <tr>

    <td>${job.company_name}</td>

    <td>${job.job_title}</td>

    <td>
        <span class="badge bg-primary">
            ${job.status}
        </span>
    </td>

    <td>

        <select
            class="form-select"
            onchange="updateJobStatus(${job.id}, this.value)"
        >

            <option value="">
                Change Status
            </option>

            <option value="Applied">
                Applied
            </option>

            <option value="Interview">
                Interview
            </option>

            <option value="Rejected">
                Rejected
            </option>

            <option value="Offer">
                Offer
            </option>

        </select>

    </td>

    <td>${job.created_at}</td>

    <td>${job.notes || "-"}</td>

    <td>

        <button
            class="btn btn-danger btn-sm"
            onclick="deleteJob(${job.id})"
        >
            Delete
        </button>

    </td>

</tr>

                `;
            });

        } else {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="5" class="text-center">
                        No job applications found
                    </td>

                </tr>

            `;
        }

    } catch (error) {

        console.error(
            "Error fetching jobs:",
            error
        );
    }

}


// =========================
// LOAD JOBS ON DASHBOARD
// =========================

fetchUserJobs();
fetchAnalytics();

// =========================
// UPDATE JOB STATUS
// =========================

async function updateJobStatus(jobId, status) {

    // Ignore empty option
    if (!status) {
        return;
    }

    const token =
        localStorage.getItem("access_token");

    try {

        const response = await fetch(
            `/api/jobs/update-status/${jobId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: status
                })

            }
        );

        const data = await response.json();

        if (data.success) {

            // Refresh jobs automatically
            fetchUserJobs();
            fetchAnalytics();

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.error(
            "Error updating status:",
            error
        );
    }
}

// =========================
// DELETE JOB APPLICATION
// =========================

async function deleteJob(jobId) {

    // Confirmation prompt
    const confirmDelete = confirm(
        "Are you sure you want to delete this job application?"
    );

    if (!confirmDelete) {
        return;
    }

    const token =
        localStorage.getItem("access_token");

    try {

        const response = await fetch(
            `/api/jobs/delete/${jobId}`,
            {

                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }

            }
        );

        const data = await response.json();

        if (data.success) {

            // Refresh jobs table
            fetchUserJobs();
            fetchAnalytics();

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.error(
            "Error deleting job:",
            error
        );
    }
}

// =========================
// FETCH DASHBOARD ANALYTICS
// =========================

async function fetchAnalytics() {

    const token =
        localStorage.getItem("access_token");

    // Redirect if token missing
    if (!token) {

        window.location.href = "/login";

        return;
    }

    try {

        const response = await fetch(
            "/api/jobs/analytics",
            {

                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }

            }
        );

        const data = await response.json();

        if (data.success) {

            document.getElementById(
                "totalApplications"
            ).innerText =
                data.data.total_applications;

            document.getElementById(
                "appliedCount"
            ).innerText =
                data.data.applied_count;

            document.getElementById(
                "interviewCount"
            ).innerText =
                data.data.interview_count;

            document.getElementById(
                "offerCount"
            ).innerText =
                data.data.offer_count;
        }

    } catch (error) {

        console.error(
            "Error fetching analytics:",
            error
        );
    }
}