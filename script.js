// Replace with your actual Supabase credentials
const SUPABASE_URL = "https://hnqzjitjruoboxodznux.supabase.co"; // Example: https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucXpqaXRqcnVvYm94b2R6bnV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTkyNTEsImV4cCI6MjA1ODEzNTI1MX0.bkasKkiRo1eoJS-tzcz7ug9AXfQ-MJ-9J2bhUQq7LHQ"; 

// Ensure Supabase is defined before using it
document.addEventListener("DOMContentLoaded", async function () {
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Load checklist state from Supabase
    async function loadChecklist() {
        const { data, error } = await supabase.from("checklist").select("*");
        if (error) {
            console.error("Error loading checklist:", error);
            return;
        }

        // Apply state to checkboxes
        data.forEach(item => {
            const checkbox = document.getElementById(item.id_check);
            if (checkbox) checkbox.checked = item.checked;
        });
    }

    // Save checklist state to Supabase
    async function saveChecklist(event) {
        const checkbox = event.target;
        const id = checkbox.id;
        const checked = checkbox.checked;

        const { error } = await supabase
            .from("checklist")
            .upsert([{ id_check: id, checked }]); 

        if (error) {
            console.error("Error saving checklist:", error);
        } else {
            console.log(`Saved: ${id} -> ${checked}`);
        }
    }

    // Attach event listeners
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", saveChecklist);
    });

    // Load checklist on page load
    loadChecklist();
});
