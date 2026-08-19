const SUPABASE_URL = "https://hbbxakflhrjcksfwwrry.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_GfmOtMEUg03ZDUShK0JYAg_csSgROO1";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function loadDashboard() {
    const worksResult = await db
        .from("daily_works")
        .select("work_date, status");

    const testsResult = await db
        .from("test_tracking")
        .select("item_type, result, status");

    if (worksResult.error) {
        console.error("Daily works error:", worksResult.error);
        return;
    }

    if (testsResult.error) {
        console.error(
            "Test tracking error:",
            testsResult.error
        );
        return;
    }

    const works = worksResult.data || [];
    const tests = testsResult.data || [];

    const totalWork = works.length;

    const doneWork = works.filter(
        item => item.status === "done"
    ).length;

    const totalTest = tests.filter(
        item => item.item_type === "test"
    ).length;

    const openTracking = tests.filter(
        item =>
            item.item_type === "tracking" &&
            item.status === "open"
    ).length;

    document.getElementById("totalWork").textContent =
        totalWork;

    document.getElementById("doneWork").textContent =
        doneWork;

    document.getElementById("totalTest").textContent =
        totalTest;

    document.getElementById("openTracking").textContent =
        openTracking;

    const daily = {};

    works.forEach(item => {
        daily[item.work_date] =
            (daily[item.work_date] || 0) + 1;
    });

    const labels = Object.keys(daily).sort();

    const values = labels.map(
        label => daily[label]
    );

    new Chart(
        document.getElementById("workChart"),
        {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "ຈຳນວນວຽກ",
                    data: values,
                    borderColor: "#2563eb",
                    backgroundColor: "#2563eb33",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        }
    );
}

loadDashboard();
