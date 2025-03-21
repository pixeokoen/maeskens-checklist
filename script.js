const GITHUB_USERNAME = "pixeokoen";
const REPO_NAME = "maeskens-checklist";
const FILE_PATH = "checklist.json";

const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
const HEADERS = {
    "Accept": "application/vnd.github.v3+json"
};

// Load the current checklist state from GitHub
async function loadChecklist() {
    const response = await fetch(API_URL, { headers: HEADERS });
    if (!response.ok) return;
    
    const data = await response.json();
    const fileContent = JSON.parse(atob(data.content)); // Decode base64
    
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
        checkbox.checked = fileContent[index] || false;
    });
}

// Save the updated checklist state to GitHub
async function saveChecklist() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checklistState = Array.from(checkboxes).map(c => c.checked);
    
    // Send data to GitHub Actions
    fetch("https://api.github.com/repos/" + GITHUB_USERNAME + "/" + REPO_NAME + "/actions/workflows/update-checklist.yml/dispatches", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GH_ACCESS_TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({ ref: "main", inputs: { checklist: JSON.stringify(checklistState) } })
    });
}

// Attach event listeners to checkboxes
document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", saveChecklist);
});

// Load checklist when the page loads
loadChecklist();
