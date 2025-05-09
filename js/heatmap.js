
// Sample heatmap data
const sampleData = [
  { community: "Lakeview", Jan: 92, Feb: 94, Mar: 91 },
  { community: "Willow Ridge", Jan: 88, Feb: 85, Mar: 87 },
  { community: "Maple Grove", Jan: 95, Feb: 94, Mar: 96 }
];

const months = ['Jan', 'Feb', 'Mar'];

function getHeatmapColorClass(value) {
  if (value >= 95) return "heatmap-95";
  if (value >= 90) return "heatmap-90";
  if (value >= 85) return "heatmap-85";
  if (value >= 80) return "heatmap-80";
  return "heatmap-75";
}

function renderHeatmap(data) {
  const tbody = document.querySelector("#occupancyHeatmap tbody");
  const tfoot = document.querySelector("#occupancyHeatmap tfoot tr");

  if (!tbody || !tfoot) {
    console.error("Table body or footer not found");
    return;
  }

  tbody.innerHTML = "";
  tfoot.innerHTML = "";

  // Render table rows
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.community}</td>`;
    months.forEach(month => {
      const val = row[month] || 0;
      tr.innerHTML += \`
        <td><div class="heatmap-cell \${getHeatmapColorClass(val)}">\${val}%</div></td>
      \`;
    });
    tbody.appendChild(tr);
  });

  // Render average footer
  let footerHTML = "<td><strong>Average</strong></td>";
  months.forEach(month => {
    const total = data.reduce((sum, row) => sum + (row[month] || 0), 0);
    const avg = Math.round(total / data.length);
    footerHTML += \`<td><div class="heatmap-cell \${getHeatmapColorClass(avg)}">\${avg}%</div></td>\`;
  });
  tfoot.innerHTML = footerHTML;
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => renderHeatmap(sampleData));
