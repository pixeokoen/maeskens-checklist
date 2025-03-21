const GITHUB_USERNAME = "pixeokoen";
const REPO_NAME = "maeskens-checklist";
const FILE_PATH = "checklist.json";

const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
const HEADERS = {
    "Accept": "application/vnd.github.v3+json"
};

// Load the checklist state from GitHub
async function loadChecklist() {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`);
    if (!response.ok) return;

    const fileContent = await response.json();
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
        checkbox.checked = fileContent[index] || false;
    });
}

// Trigger GitHub Actions to save the checklist state
async function saveChecklist() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checklistState = Array.from(checkboxes).map(c => c.checked);

    await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/actions/workflows/update-checklist.yml/dispatches`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,  // GitHub Actions will inject the token
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
            ref: "main",
            inputs: { checklist: JSON.stringify(checklistState) }
        })
    });
}

// Attach event listeners to checkboxes
document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", saveChecklist);
});

// Load checklist when the page loads
loadChecklist();
