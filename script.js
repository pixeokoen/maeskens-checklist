const GITHUB_USERNAME = "pixeokoen";  // Replace with your actual username
const REPO_NAME = "maeskens-checklist";  // Replace with your repository name
const WORKFLOW_FILE = "update-checklist.yml";  // The GitHub Actions file

// Load checklist state from GitHub
async function loadChecklist() {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/checklist.json`);
        if (!response.ok) throw new Error("Failed to load checklist.");
        
        const fileContent = await response.json();
        document.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
            checkbox.checked = fileContent[index] || false;
        });
    } catch (error) {
        console.error("Error loading checklist:", error);
    }
}

// Save checklist state by triggering GitHub Actions
async function saveChecklist() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");
    const checklistState = Array.from(checkboxes).map(c => c.checked);

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `Bearer GITHUB_PAT_HERE`  // ⚠️ This should be set in GitHub Actions, NOT here.
            },
            body: JSON.stringify({
                ref: "main",
                inputs: { checklist: JSON.stringify(checklistState) }
            })
        });

        if (!response.ok) throw new Error("Failed to trigger GitHub Actions.");
        console.log("GitHub Actions triggered successfully!");
    } catch (error) {
        console.error("Error saving checklist:", error);
    }
}

// Attach event listeners to checkboxes
document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", saveChecklist);
});

// Load checklist when the page loads
loadChecklist();
