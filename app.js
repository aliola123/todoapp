// AUTHENTICATION PAGE

const signinPage = document.querySelector(".signin-page");
const signupPage = document.querySelector(".signup-page");
const resetPasswordPage = document.querySelector(".reset-password");

const showSignup = document.querySelector("#show-signup");
const showReset = document.querySelector("#show-reset");
const signupBackLogin = document.querySelector("#signup-back-login");
const resetBackLogin = document.querySelector("#reset-back-login");


// This function displays one authentication page
function showAuthPage(page) {

    signinPage.classList.remove("active");
    signupPage.classList.remove("active");
    resetPasswordPage.classList.remove("active");

    page.classList.add("active");

}


// Check if we are on the authentication page
if (signinPage) {

    showSignup.addEventListener("click", function(event) {

        event.preventDefault();

        showAuthPage(signupPage);

    });


    showReset.addEventListener("click", function(event) {

        event.preventDefault();

        showAuthPage(resetPasswordPage);

    });


    signupBackLogin.addEventListener("click", function(event) {

        event.preventDefault();

        showAuthPage(signinPage);

    });


    resetBackLogin.addEventListener("click", function(event) {

        event.preventDefault();

        showAuthPage(signinPage);

    });

}

// PASSWORD REVEAL BUTTON

const passwordButtons = document.querySelectorAll(".password-toggle");


passwordButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const passwordInput = document.querySelector("#" + button.dataset.password);


        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            button.textContent = "Hide";

        } else {

            passwordInput.type = "password";
            button.textContent = "Show";

        }

    });

});


// LOGIN FORM

const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginMessage = document.querySelector("#login-message");


if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();


        if (email === "") {

            loginMessage.textContent = "Please enter your email.";
            loginMessage.style.color = "red";

            return;

        }


        if (password === "") {

            loginMessage.textContent = "Please enter your password.";
            loginMessage.style.color = "red";

            return;

        }


        loginMessage.textContent = "Logging in...";
        loginMessage.style.color = "#2563eb";


        const { data, error } = await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            loginMessage.textContent = error.message;
            loginMessage.style.color = "red";

            return;

        }


        loginMessage.textContent = "Login successful.";
        loginMessage.style.color = "green";

        console.log(data);

        window.location.href = "dashboard.html";

    });

}


// SIGNUP FORM
// Teaching path:
// 1. Select the signup form and all signup inputs.
// 2. Wait for the user to submit the form.
// 3. Stop the page from refreshing.
// 4. Collect the values typed by the user.
// 5. Check the values one by one.
// 6. Send the email and password to Supabase.
// 7. Show either an error message or success message.

const signupForm = document.querySelector("#signup-form");
const signupFullname = document.querySelector("#signup-fullname");
const signupEmail = document.querySelector("#signup-email");
const signupPassword = document.querySelector("#signup-password");
const signupConfirmPassword = document.querySelector("#signup-confirm-password");
const signupMessage = document.querySelector("#signup-message");


if (signupForm) {

    // Step 1: Listen for the signup form submission.
    signupForm.addEventListener("submit", async function(event) {

        // Step 2: Stop the browser from reloading the page.
        event.preventDefault();

        // Step 3: Get what the user typed into the form.
        const fullname = signupFullname.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value.trim();
        const confirmPassword = signupConfirmPassword.value.trim();


        // Step 4: Validate the full name.
        if (fullname === "") {

            signupMessage.textContent = "Please enter your full name.";
            signupMessage.style.color = "red";

            return;

        }


        if (fullname.length < 3) {

            signupMessage.textContent = "Full name must be at least 3 characters.";
            signupMessage.style.color = "red";

            return;

        }


        // Step 5: Validate the email.
        if (email === "") {

            signupMessage.textContent = "Please enter your email.";
            signupMessage.style.color = "red";

            return;

        }


        if (!email.includes("@")) {

            signupMessage.textContent = "Please enter a valid email.";
            signupMessage.style.color = "red";

            return;

        }


        // Step 6: Validate the password.
        if (password === "") {

            signupMessage.textContent = "Please enter a password.";
            signupMessage.style.color = "red";

            return;

        }


        if (password.length < 8) {

            signupMessage.textContent = "Password must be at least 8 characters.";
            signupMessage.style.color = "red";

            return;

        }


        // Step 7: Make sure both passwords are the same.
        if (confirmPassword === "") {

            signupMessage.textContent = "Please confirm your password.";
            signupMessage.style.color = "red";

            return;

        }


        if (password !== confirmPassword) {

            signupMessage.textContent = "Passwords do not match.";
            signupMessage.style.color = "red";

            return;

        }


        signupMessage.textContent = "Creating account...";
        signupMessage.style.color = "#2563eb";


        // Step 8: Send the signup details to Supabase Auth.
        const { data, error } = await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {
                    fullname: fullname
                }

            }
        });


        // Step 9: If Supabase returns an error, show it and stop.
        if (error) {

            signupMessage.textContent = error.message;
            signupMessage.style.color = "red";

            return;

        }


        // Step 10: If there is no error, tell the user what happened.
        if (data.session) {

            signupMessage.textContent = "Account created successfully.";

        } else {

            signupMessage.textContent = "Account created. Check your email to confirm your account.";

        }


        signupMessage.style.color = "green";

        signupForm.reset();

        console.log(data);

    });

}


// RESET PASSWORD FORM
// Teaching path:
// 1. Get the reset password form.
// 2. Collect the email address.
// 3. Ask Supabase to send a reset link.
// 4. The reset link opens update-password.html.

const resetForm = document.querySelector("#reset-form");
const resetEmail = document.querySelector("#reset-email");
const resetMessage = document.querySelector("#reset-message");


if (resetForm) {

    // Step 1: Listen for the reset form submission.
    resetForm.addEventListener("submit", async function(event) {

        // Step 2: Stop page reload.
        event.preventDefault();

        // Step 3: Get the email from the form.
        const email = resetEmail.value.trim();


        // Step 4: Check that the email is not empty.
        if (email === "") {

            resetMessage.textContent = "Please enter your email.";
            resetMessage.style.color = "red";

            return;

        }


        if (!email.includes("@")) {

            resetMessage.textContent = "Please enter a valid email.";
            resetMessage.style.color = "red";

            return;

        }


        resetMessage.textContent = "Sending reset link...";
        resetMessage.style.color = "#2563eb";


        // Step 5: Tell Supabase where to send the user after clicking the email link.
        const resetPageUrl = window.location.origin + "/update-password.html";


        // Step 6: Ask Supabase to send the reset email.
        const { error } = await supabaseClient.auth.resetPasswordForEmail(

            email,

            {
                redirectTo: resetPageUrl
            }

        );


        // Step 7: Show any Supabase error.
        if (error) {

            resetMessage.textContent = error.message;
            resetMessage.style.color = "red";

            return;

        }


        // Step 8: If there is no error, ask the user to check their email.
        resetMessage.textContent = "Check your email for the password reset link.";
        resetMessage.style.color = "green";

        resetForm.reset();

    });

}


// UPDATE PASSWORD FORM
// Teaching path:
// 1. The user reaches this page from the email reset link.
// 2. They type a new password twice.
// 3. We check both passwords.
// 4. Supabase updates the password.
// 5. We send the user back to login.

const updatePasswordForm = document.querySelector("#update-password-form");
const newPassword = document.querySelector("#new-password");
const confirmNewPassword = document.querySelector("#confirm-new-password");
const updatePasswordMessage = document.querySelector("#update-password-message");


if (updatePasswordForm) {

    // Step 1: Listen for the update password form submission.
    updatePasswordForm.addEventListener("submit", async function(event) {

        // Step 2: Stop page reload.
        event.preventDefault();

        // Step 3: Get the new password values.
        const password = newPassword.value.trim();
        const confirmPassword = confirmNewPassword.value.trim();


        // Step 4: Validate the new password.
        if (password === "") {

            updatePasswordMessage.textContent = "Please enter your new password.";
            updatePasswordMessage.style.color = "red";

            return;

        }


        if (password.length < 8) {

            updatePasswordMessage.textContent = "Password must be at least 8 characters.";
            updatePasswordMessage.style.color = "red";

            return;

        }


        // Step 5: Confirm both password fields match.
        if (confirmPassword === "") {

            updatePasswordMessage.textContent = "Please confirm your new password.";
            updatePasswordMessage.style.color = "red";

            return;

        }


        if (password !== confirmPassword) {

            updatePasswordMessage.textContent = "Passwords do not match.";
            updatePasswordMessage.style.color = "red";

            return;

        }


        updatePasswordMessage.textContent = "Updating password...";
        updatePasswordMessage.style.color = "#2563eb";


        // Step 6: Ask Supabase to save the new password.
        const { error } = await supabaseClient.auth.updateUser({

            password: password

        });


        // Step 7: Show any Supabase error.
        if (error) {

            updatePasswordMessage.textContent = error.message;
            updatePasswordMessage.style.color = "red";

            return;

        }


        updatePasswordMessage.textContent = "Password updated successfully.";
        updatePasswordMessage.style.color = "green";

        updatePasswordForm.reset();

        // Step 8: Wait a little so the user sees the success message.
        setTimeout(function() {

            window.location.href = "index.html";

        }, 1500);

    });

}


// PROTECT DASHBOARD
// Teaching path:
// 1. Check if the user is logged in.
// 2. If the user is not logged in, send them back to auth.html.
// 3. If the user is logged in, show their name on the dashboard.
// 4. Return the user so the task code can use the user's id.

const dashboardContent = document.querySelector(".dashboard-content");
let currentUser = null;


async function protectDashboard() {

    // Step 1: Ask Supabase for the current logged-in user.
    const { data, error } = await supabaseClient.auth.getUser();


    // Step 2: If there is no user, protect the dashboard by redirecting.
    if (error || !data.user) {

        window.location.href = "index.html";

        return null;

    }


    // Step 3: Save the logged-in user in a variable.
    const user = data.user;

    const username = document.querySelector("#username");


    // Step 4: Show the user's full name if we have it, otherwise show their email.
    if (username) {

        const fullname = user.user_metadata.fullname;


        if (fullname) {

            username.textContent = fullname;

        } else {

            username.textContent = user.email;

        }

    }


    // Step 5: Give the user back to the dashboard task code.
    return user;

}


// DASHBOARD TASKS
// Teaching path:
// 1. Select all task elements from dashboard.html.
// 2. When the dashboard starts, get the logged-in user.
// 3. Read that user's tasks from Supabase.
// 4. Show the tasks on the page.
// 5. Save a new task or update an old task.
// 6. Mark a task as done or undo it.
// 7. Delete a task.

const openTaskModal = document.querySelector("#open-task-modal");
const closeTaskModal = document.querySelector("#close-task-modal");
const cancelTask = document.querySelector("#cancel-task");
const modalOverlay = document.querySelector("#modal-overlay");
const modalTitle = document.querySelector("#modal-title");

const taskForm = document.querySelector("#task-form");
const taskId = document.querySelector("#task-id");
const taskTitle = document.querySelector("#task-title");
const taskDescription = document.querySelector("#task-description");
const taskPriority = document.querySelector("#task-priority");
const taskDeadline = document.querySelector("#task-deadline");
const taskMessage = document.querySelector("#task-message");

const taskList = document.querySelector("#task-list");
const filterTasks = document.querySelector("#filter-tasks");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const pendingTasks = document.querySelector("#pending-tasks");

let tasks = [];


// This starts the dashboard after the page loads.
async function startDashboard() {

    // Step 1: Check login and get the current user.
    currentUser = await protectDashboard();

    if (!currentUser) {

        return;

    }


    // Step 2: Load only this user's tasks.
    loadTasks();

}


// This opens the task form modal.
function openModal() {

    modalOverlay.classList.add("active");
    taskMessage.textContent = "";

}


// This closes and clears the task form modal.
function closeModal() {

    modalOverlay.classList.remove("active");
    taskForm.reset();
    taskId.value = "";
    modalTitle.textContent = "Add Task";
    taskMessage.textContent = "";

}


// READ: Get tasks from the Supabase tasks table.
async function loadTasks() {

    // Step 1: Select all columns from tasks.
    // Step 2: Only bring tasks where user_id matches the current user.
    const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });


    // Step 3: If Supabase returns an error, show it and stop.
    if (error) {

        alert(error.message);

        return;

    }


    // Step 4: Store the tasks in our tasks array.
    tasks = data;

    // Step 5: Show the tasks in the HTML.
    showTasks();

}


// DISPLAY: Put each task on the page.
function showTasks() {

    // Step 1: Clear the old task list before drawing the new one.
    taskList.innerHTML = "";

    let filteredTasks = tasks;


    // Step 2: If the filter is completed, show only completed tasks.
    if (filterTasks.value === "completed") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === true;

        });

    }


    // Step 3: If the filter is pending, show only unfinished tasks.
    if (filterTasks.value === "pending") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === false;

        });

    }


    // Step 4: If there are no tasks, show the empty message.
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("div");
        emptyMessage.className = "empty-task-message";

        emptyMessage.innerHTML = "<h2>No Tasks Yet</h2><p>Click Add New Task to create your first task.</p>";
        taskList.appendChild(emptyMessage);

    }


    // Step 5: Loop through the tasks and create one card for each task.
    filteredTasks.forEach(function(task) {

        const taskCard = document.createElement("div");
        taskCard.className = "task-card";


        // Step 6: Add a completed style when a task is done.
        if (task.completed) {

            taskCard.classList.add("completed-task");

        }


        const taskDetails = document.createElement("div");

        // Step 7: Create the text elements for title, description, priority, and deadline.
        const title = document.createElement("h2");
        title.className = "task-title";
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "No description";

        const priority = document.createElement("p");
        priority.textContent = "Priority: " + task.priority;

        const deadline = document.createElement("p");
        deadline.textContent = "Deadline: " + task.deadline;

        taskDetails.appendChild(title);
        taskDetails.appendChild(description);
        taskDetails.appendChild(priority);
        taskDetails.appendChild(deadline);


        const taskButtons = document.createElement("div");
        taskButtons.className = "task-buttons";

        // Step 8: Create the Done, Edit, and Delete buttons.
        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent = task.completed ? "Undo" : "Done";
        completeButton.addEventListener("click", function() {

            completeTask(task);

        });

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function() {

            editTask(task);

        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {

            deleteTask(task.id);

        });

        taskButtons.appendChild(completeButton);
        taskButtons.appendChild(editButton);
        taskButtons.appendChild(deleteButton);

        taskCard.appendChild(taskDetails);
        taskCard.appendChild(taskButtons);

        taskList.appendChild(taskCard);

    });


    // Step 9: Update the total, done, and pending numbers.
    updateTaskStats();

}


// STATS: Count all tasks, completed tasks, and pending tasks.
function updateTaskStats() {

    const doneTasks = tasks.filter(function(task) {

        return task.completed === true;

    });

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = doneTasks.length;
    pendingTasks.textContent = tasks.length - doneTasks.length;

}


// CREATE and UPDATE: Save the form data to Supabase.
async function saveTask(event) {

    // Step 1: Stop page reload.
    event.preventDefault();

    // Step 2: Put the form values inside one object.
    const taskData = {

        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        priority: taskPriority.value,
        deadline: taskDeadline.value

    };


    let error;


    // Step 3: If taskId has a value, we are editing an old task.
    if (taskId.value) {

        const result = await supabaseClient
            .from("tasks")
            .update(taskData)
            .eq("id", taskId.value)
            .eq("user_id", currentUser.id);

        error = result.error;

    } else {

        // Step 4: If taskId is empty, we are creating a new task.
        taskData.user_id = currentUser.id;
        taskData.completed = false;

        const result = await supabaseClient
            .from("tasks")
            .insert(taskData);

        error = result.error;

    }


    // Step 5: If Supabase returns an error, show it and stop.
    if (error) {

        alert(error.message);

        return;

    }


    // Step 6: Close the form and reload the tasks.
    closeModal();
    loadTasks();

}


// EDIT: Put the selected task back inside the form.
function editTask(task) {

    taskId.value = task.id;
    taskTitle.value = task.title;
    taskDescription.value = task.description || "";
    taskPriority.value = task.priority;
    taskDeadline.value = task.deadline;
    modalTitle.textContent = "Edit Task";

    openModal();

}


// UPDATE: Change a task from pending to done, or done back to pending.
async function completeTask(task) {

    const { error } = await supabaseClient
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", task.id)
        .eq("user_id", currentUser.id);


    if (error) {

        alert(error.message);

        return;

    }


    loadTasks();

}


// DELETE: Remove one task from Supabase.
async function deleteTask(id) {

    // Step 1: Ask before deleting.
    if (!confirm("Delete this task?")) {

        return;

    }


    // Step 2: Delete the task that belongs to the current user.
    const { error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", currentUser.id);


    if (error) {

        alert(error.message);

        return;

    }


    // Step 3: Reload tasks after deleting.
    loadTasks();

}


// These event listeners connect the dashboard buttons to the functions above.
if (dashboardContent) {

    startDashboard();

    openTaskModal.addEventListener("click", openModal);
    closeTaskModal.addEventListener("click", closeModal);
    cancelTask.addEventListener("click", closeModal);
    taskForm.addEventListener("submit", saveTask);
    filterTasks.addEventListener("change", showTasks);

}


// LOGOUT

const logoutButton = document.querySelector("#logout-button");


if (logoutButton) {

    logoutButton.addEventListener("click", async function() {

        logoutButton.textContent = "Logging out...";
        logoutButton.disabled = true;


        const { error } = await supabaseClient.auth.signOut();


        if (error) {

            alert(error.message);

            logoutButton.textContent = "Logout";
            logoutButton.disabled = false;

            return;

        }


        window.location.href = "index.html";

    });

}
