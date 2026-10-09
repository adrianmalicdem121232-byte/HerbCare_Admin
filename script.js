// ========================================
// HERBCARE ADMIN
// ========================================


// ========================================
// LOGIN ELEMENTS
// ========================================

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginPage = document.getElementById("loginPage");
const adminPage = document.getElementById("adminPage");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");


// ========================================
// LOGIN
// ========================================

loginBtn.addEventListener("click", function () {

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === "admin" && password === "admin123") {

        loginPage.style.display = "none";
        adminPage.style.display = "block";

        loginMessage.textContent = "";

        showSection("dashboard");

    } else {

        loginMessage.textContent =
            "Incorrect username or password.";

    }

});


// ========================================
// LOGOUT
// ========================================

function logout() {

    adminPage.style.display = "none";
    loginPage.style.display = "flex";

    usernameInput.value = "";
    passwordInput.value = "";

}

logoutBtn.addEventListener("click", logout);


// ========================================
// SECTIONS
// ========================================

const dashboardBtn =
    document.getElementById("dashboardBtn");

const addDatasetBtn =
    document.getElementById("addDatasetBtn");

const recordsBtn =
    document.getElementById("recordsBtn");

const dashboardSection =
    document.getElementById("dashboardSection");

const addDatasetSection =
    document.getElementById("addDatasetSection");

const recordsSection =
    document.getElementById("recordsSection");


// ========================================
// SIDEBAR BUTTONS
// ========================================

dashboardBtn.addEventListener("click", function () {
    showSection("dashboard");
});

addDatasetBtn.addEventListener("click", function () {
    showSection("addDataset");
});

recordsBtn.addEventListener("click", function () {
    showSection("records");
});


// ========================================
// SHOW SECTION
// ========================================

function showSection(section) {

    dashboardSection.style.display = "none";
    addDatasetSection.style.display = "none";
    recordsSection.style.display = "none";

    dashboardBtn.classList.remove("active");
    addDatasetBtn.classList.remove("active");
    recordsBtn.classList.remove("active");


    if (section === "dashboard") {

        dashboardSection.style.display = "block";
        dashboardBtn.classList.add("active");

        updateDashboard();

    }


    if (section === "addDataset") {

        addDatasetSection.style.display = "block";
        addDatasetBtn.classList.add("active");

    }


    if (section === "records") {

        recordsSection.style.display = "block";
        recordsBtn.classList.add("active");

        displayDatasets();

    }

}


// ========================================
// DATASET STORAGE
// ========================================

let datasets =
    JSON.parse(
        localStorage.getItem("herbcareDatasets")
    ) || [];


// ========================================
// ADD DATASET
// ========================================

const saveDatasetBtn =
    document.getElementById("saveDatasetBtn");

saveDatasetBtn.addEventListener("click", function () {

    const imageInput =
        document.getElementById("plantImage");

    const plantName =
        document.getElementById("plantName").value;

    const plantCondition =
        document.getElementById("plantCondition").value;

    const description =
        document.getElementById("description").value.trim();


    // Check image

    if (imageInput.files.length === 0) {

        alert("Please upload a plant image.");

        return;

    }


    // Check description

    if (description === "") {

        alert("Please enter a description.");

        return;

    }


    const file =
        imageInput.files[0];

    const reader =
        new FileReader();


    reader.onload = function (event) {

        const dataset = {

            id: Date.now(),

            image: event.target.result,

            plantName: plantName,

            condition: plantCondition,

            description: description

        };


        datasets.push(dataset);


        localStorage.setItem(
            "herbcareDatasets",
            JSON.stringify(datasets)
        );


        // Success message

        document.getElementById(
            "datasetMessage"
        ).textContent =
            "Dataset saved successfully!";


        // Clear form

        imageInput.value = "";

        document.getElementById(
            "description"
        ).value = "";


        // Update dashboard

        updateDashboard();


        // Show records

        displayDatasets();

    };


    reader.readAsDataURL(file);

});


// ========================================
// DISPLAY DATASETS
// ========================================

function displayDatasets() {

    const recordsContainer =
        document.getElementById("datasetRecords");


    recordsContainer.innerHTML = "";


    if (datasets.length === 0) {

        recordsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🌱
                </div>

                <h3>
                    No datasets yet
                </h3>

                <p>
                    Add your first plant dataset
                    to get started.
                </p>

            </div>

        `;

        return;

    }


    datasets.forEach(function (dataset) {

        const card =
            document.createElement("div");

        card.className = "dataset-card";


        card.innerHTML = `

            <img
                src="${dataset.image}"
                alt="Plant Image"
            >

            <h3>
                ${dataset.plantName}
            </h3>

            <p>
                <strong>Condition:</strong>
                ${dataset.condition}
            </p>

            <p>
                <strong>Description:</strong>
                ${dataset.description}
            </p>

            <button
                class="delete-btn"
                onclick="deleteDataset(${dataset.id})"
            >
                Delete
            </button>

        `;


        recordsContainer.appendChild(card);

    });

}


// ========================================
// DELETE DATASET
// ========================================

function deleteDataset(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this dataset?"
        );


    if (!confirmDelete) {
        return;
    }


    datasets =
        datasets.filter(function (dataset) {

            return dataset.id !== id;

        });


    localStorage.setItem(
        "herbcareDatasets",
        JSON.stringify(datasets)
    );


    displayDatasets();

    updateDashboard();

}


// ========================================
// DASHBOARD COUNTERS
// ========================================

function updateDashboard() {

    const total =
        datasets.length;


    const good =
        datasets.filter(function (dataset) {

            return dataset.condition === "Good";

        }).length;


    const attention =
        datasets.filter(function (dataset) {

            return dataset.condition === "Attention";

        }).length;


    const poor =
        datasets.filter(function (dataset) {

            return dataset.condition === "Poor";

        }).length;


    document.getElementById(
        "totalDatasets"
    ).textContent = total;


    document.getElementById(
        "goodDatasets"
    ).textContent = good;


    document.getElementById(
        "attentionDatasets"
    ).textContent = attention;


    document.getElementById(
        "poorDatasets"
    ).textContent = poor;


    updateRecentRecords();

}


// ========================================
// RECENT RECORDS
// ========================================

function updateRecentRecords() {

    const recentRecords =
        document.getElementById("recentRecords");


    if (!recentRecords) {
        return;
    }


    recentRecords.innerHTML = "";


    if (datasets.length === 0) {

        recentRecords.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🌱
                </div>

                <h3>
                    No datasets yet
                </h3>

                <p>
                    Add your first plant dataset
                    to get started.
                </p>

            </div>

        `;

        return;

    }


    const recent =
        datasets.slice(-3).reverse();


    recent.forEach(function (dataset) {

        const item =
            document.createElement("div");

        item.className = "recent-item";


        item.innerHTML = `

            <img
                src="${dataset.image}"
                alt="Plant"
            >

            <div>

                <strong>
                    ${dataset.plantName}
                </strong>

                <span>
                    ${dataset.condition}
                </span>

            </div>

        `;


        recentRecords.appendChild(item);

    });

}


// ========================================
// VIEW ALL RECORDS
// ========================================

const viewRecordsBtn =
    document.getElementById("viewRecordsBtn");

if (viewRecordsBtn) {

    viewRecordsBtn.addEventListener(
        "click",
        function () {

            showSection("records");

        }
    );

}


// ========================================
// QUICK ADD DATASET
// ========================================

const quickAddDataset =
    document.getElementById("quickAddDataset");

if (quickAddDataset) {

    quickAddDataset.addEventListener(
        "click",
        function () {

            showSection("addDataset");

        }
    );

}


// ========================================
// QUICK VIEW RECORDS
// ========================================

const quickViewRecords =
    document.getElementById("quickViewRecords");

if (quickViewRecords) {

    quickViewRecords.addEventListener(
        "click",
        function () {

            showSection("records");

        }
    );

}


// ========================================
// QUICK LOGOUT
// ========================================

const quickLogout =
    document.getElementById("quickLogout");

if (quickLogout) {

    quickLogout.addEventListener(
        "click",
        logout
    );

}


// ========================================
// INITIAL LOAD
// ========================================

updateDashboard();

showSection("dashboard");