const GITHUB_USERNAME = "pixeokoen";
const REPO_NAME = "maeskens-checklist";

// Load checklist from GitHub
async function loadChecklist() {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/checklist.json`);
    if (!response.ok) return;

    const fileContent = await response.json();
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
        checkbox.checked = fileContent[index] || false;
    });
}

// Save checklist by triggering GitHub Actions
async function saveChecklist() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checklistState = Array.from(checkboxes).map(c => c.checked);

    await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/actions/workflows/update-checklist.yml/dispatches`, {
        method: "POST",
        headers: {
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({ ref: "main" })
    });
}

// Attach event listeners to checkboxes
document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", saveChecklist);
});

// Load checklist when the page loads
loadChecklist();
