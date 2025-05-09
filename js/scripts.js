/*!
* Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

// Occupancy Table JavaScript

// Sample data - replace with your actual data
const occupancyData = [
  {
    id: 1,
    community: "Lakeview",
    region: "West",
    occupancy: [
      { month: "Jan", value: 92, change: 2 },
      { month: "Feb", value: 94, change: 2 },
      { month: "Mar", value: 91, change: -3 },
      { month: "Apr", value: 93, change: 2 },
      { month: "May", value: 96, change: 3 },
      { month: "Jun", value: 98, change: 2 }
    ],
    avg: 94,
    trend: "up"
  },
  {
    id: 2,
    community: "Willow Ridge",
    region: "East",
    occupancy: [
      { month: "Jan", value: 88, change: -1 },
      { month: "Feb", value: 85, change: -3 },
      { month: "Mar", value: 87, change: 2 },
      { month: "Apr", value: 89, change: 2 },
      { month: "May", value: 91, change: 2 },
      { month: "Jun", value: 93, change: 2 }
    ],
    avg: 89,
    trend: "up"
  },
  {
    id: 3,
    community: "Maple Grove",
    region: "Northwest",
    occupancy: [
      { month: "Jan", value: 95, change: 0 },
      { month: "Feb", value: 94, change: -1 },
      { month: "Mar", value: 96, change: 2 },
      { month: "Apr", value: 97, change: 1 },
      { month: "May", value: 98, change: 1 },
      { month: "Jun", value: 99, change: 1 }
    ],
    avg: 97,
    trend: "up"
  },
  {
    id: 4,
    community: "Harbor View",
    region: "South",
    occupancy: [
      { month: "Jan", value: 89, change: 2 },
      { month: "Feb", value: 87, change: -2 },
      { month: "Mar", value: 84, change: -3 },
      { month: "Apr", value: 82, change: -2 },
      { month: "May", value: 85, change: 3 },
      { month: "Jun", value: 88, change: 3 }
    ],
    avg: 86,
    trend: "flat"
  },
  {
    id: 5,
    community: "Mountain View",
    region: "West",
    occupancy: [
      { month: "Jan", value: 91, change: -1 },
      { month: "Feb", value: 89, change: -2 },
      { month: "Mar", value: 86, change: -3 },
      { month: "Apr", value: 83, change: -3 },
      { month: "May", value: 81, change: -2 },
      { month: "Jun", value: 79, change: -2 }
    ],
    avg: 85,
    trend: "down"
  },
  {
    id: 6,
    community: "Serenity Gardens",
    region: "Central",
    occupancy: [
      { month: "Jan", value: 97, change: 1 },
      { month: "Feb", value: 98, change: 1 },
      { month: "Mar", value: 99, change: 1 },
      { month: "Apr", value: 98, change: -1 },
      { month: "May", value: 97, change: -1 },
      { month: "Jun", value: 99, change: 2 }
    ],
    avg: 98,
    trend: "up"
  }
];

// Initialize variables
let sortField = "community";
let sortDirection = "asc";
let expandedCommunity = null;

// DOM ready function - initialize the table
document.addEventListener("DOMContentLoaded", function() {
  // Initialize the table
  renderTable();
  updateCommunityCount();
  
  // Add event listeners for sorting
  document.querySelectorAll(".sortable").forEach(header => {
    header.addEventListener("click", function() {
      const field = this.getAttribute("data-sort");
      handleSort(field);
    });
  });
});

// Render the table with current data and sorting
function renderTable() {
  const tableBody = document.querySelector("#occupancyTable tbody");
  tableBody.innerHTML = "";
  
  // Sort the data
  const sortedData = [...occupancyData].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === "community") {
      comparison = a.community.localeCompare(b.community);
    } else if (sortField === "region") {
      comparison = a.region.localeCompare(b.region);
    } else if (sortField === "occupancy") {
      comparison = a.avg - b.avg;
    } else if (sortField === "trend") {
      const trendValue = { up: 3, flat: 2, down: 1 };
      comparison = trendValue[a.trend] - trendValue[b.trend];
    }
    
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  // Update sort indicators in the header
  document.querySelectorAll(".sortable").forEach(header => {
    const field = header.getAttribute("data-sort");
    const icon = header.querySelector(".sort-icon");
    
    header.classList.toggle("sorted", field === sortField);
    if (field === sortField) {
      icon.className = `sort-icon ms-1 bi ${sortDirection === "asc" ? "bi-chevron-up" : "bi-chevron-down"}`;
    } else {
      icon.className = "sort-icon ms-1 bi bi-chevron-down";
    }
  });
  
  // Add rows to the table
  sortedData.forEach(community => {
    // Create the main row
    const row = document.createElement("tr");
    row.className = `community-row ${expandedCommunity === community.id ? "expanded" : ""}`;
    row.setAttribute("data-id", community.id);
    row.innerHTML = `
      <td class="px-3 py-3">
        <div class="d-flex align-items-center">
          <i class="expand-icon bi ${expandedCommunity === community.id ? "bi-chevron-right" : "bi-chevron-right"} me-2"></i>
          <span class="fw-medium">${community.community}</span>
        </div>
      </td>
      <td class="px-3 py-3 text-muted">${community.region}</td>
      <td class="px-3 py-3">
        <div class="d-flex align-items-center">
          <div class="occupancy-circle ${getOccupancyColorClass(community.avg)} me-2">
            <span>${community.avg}%</span>
          </div>
          <div class="progress flex-grow-1" style="height: 6px; width: 120px;">
            <div class="progress-bar ${getOccupancyColorClass(community.avg)}" role="progressbar" 
                 style="width: ${community.avg}%" aria-valuenow="${community.avg}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      </td>
      <td class="px-3 py-3">
        <div class="trend-indicator ${getTrendColorClass(community.trend)}">
          <i class="bi ${getTrendIconClass(community.trend)} me-1"></i>
          <span>${getTrendText(community.trend)}</span>
        </div>
      </td>
    `;
    
    // Add click event to the row
    row.addEventListener("click", function() {
      toggleExpand(community.id);
    });
    
    tableBody.appendChild(row);
    
    // Add details row if expanded
    if (expandedCommunity === community.id) {
      // Clone the details template
      const detailsTemplate = document.getElementById("monthlyDetailsTemplate");
      const detailsRow = detailsTemplate.content.cloneNode(true);
      const detailsContainer = detailsRow.querySelector(".row");
      
      // Add monthly cards
      community.occupancy.forEach(month => {
        const cardTemplate = document.getElementById("monthCardTemplate");
        const card = cardTemplate.content.cloneNode(true);
        
        // Update card content
        card.querySelector(".month-name").textContent = month.month;
        card.querySelector(".occupancy-value").textContent = `${month.value}%`;
        card.querySelector(".occupancy-circle").className = `occupancy-circle ${getOccupancyColorClass(month.value)}`;
        
        // Update progress bar
        const progressBar = card.querySelector(".progress-bar");
        progressBar.className = `progress-bar ${getOccupancyColorClass(month.value)}`;
        progressBar.style.width = `${month.value}%`;
        
        // Update change indicator
        const changeIcon = card.querySelector(".change-icon");
        const changeValue = card.querySelector(".change-value");
        
        if (month.change > 0) {
          changeIcon.className = "change-icon bi bi-arrow-up-right";
          changeValue.className = "change-value small positive";
          changeValue.textContent = `+${month.change}%`;
        } else if (month.change < 0) {
          changeIcon.className = "change-icon bi bi-arrow-down-right";
          changeValue.className = "change-value small negative";
          changeValue.textContent = `${month.change}%`;
        } else {
          changeIcon.className = "change-icon bi bi-arrow-right";
          changeValue.className = "change-value small neutral";
          changeValue.textContent = "0%";
        }
        
        detailsContainer.appendChild(card);
      });
      
      detailsRow.querySelector("tr").classList.add("show");
      tableBody.appendChild(detailsRow);
    }
  });
}

// Handle sorting
function handleSort(field) {
  if (sortField === field) {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortField = field;
    sortDirection = "asc";
  }
  
  renderTable();
}

// Toggle expand/collapse for a community
function toggleExpand(id) {
  expandedCommunity = expandedCommunity === id ? null : id;
  renderTable();
}

// Update the community count in the footer
function updateCommunityCount() {
  const countElement = document.getElementById("communityCount");
  if (countElement) {
    countElement.textContent = occupancyData.length;
  }
}

// Helper functions for styling
function getOccupancyColorClass(value) {
  if (value >= 95) return "occupancy-level-high";
  if (value >= 90) return "occupancy-level-good";
  if (value >= 85) return "occupancy-level-medium";
  if (value >= 80) return "occupancy-level-low";
  return "occupancy-level-critical";
}

function getTrendColorClass(trend) {
  if (trend === "up") return "trend-up";
  if (trend === "down") return "trend-down";
  return "trend-flat";
}

function getTrendIconClass(trend) {
  if (trend === "up") return "bi-arrow-up-right";
  if (trend === "down") return "bi-arrow-down-right";
  return "bi-arrow-right";
}

function getTrendText(trend) {
  if (trend === "up") return "Rising";
  if (trend === "down") return "Declining";
  return "Stable";
}

// Add this to your script before the DOMContentLoaded event
// This will reset the sidebar state to ensure it's visible on page load
// (You can remove this after fixing the issue)

// Reset the localStorage value for debugging


document.addEventListener('DOMContentLoaded', function() {
  // Get the sidebar and main content elements
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('main');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  
  // Add console logging to help debug
  console.log("Sidebar element:", sidebar);
  console.log("Main content element:", mainContent);
  console.log("Sidebar toggle button:", sidebarToggle);
  
  // Only proceed if all elements are found
  if (!sidebar || !mainContent || !sidebarToggle) {
    console.error("Missing required elements for sidebar toggle functionality!");
    return;
  }
  
  // Function to toggle sidebar
function toggleSidebar() {
  sidebar.classList.toggle('collapsed');
  mainContent.classList.toggle('expanded');

  const isCollapsed = sidebar.classList.contains('collapsed');
  
  // Toggle between hamburger and filter/close icon
  sidebarToggle.innerHTML = isCollapsed ?
    '<i class="bi bi-list fs-4"></i>' : // Filter icon when sidebar is hidden
    '<i class="bi bi-chevron-right fs-4"></i>';    // Hamburger icon when sidebar is visible
  
  sidebarToggle.setAttribute('title', 
    isCollapsed ? 'Show Filters' : 'Hide Filters');

  console.log("Sidebar toggled - collapsed:", isCollapsed);
}
// to toggle button
  sidebarToggle.addEventListener('click', toggleSidebar);
  
  // Force sidebar to be visible initially (for debugging)
  sidebar.classList.remove('collapsed');
  
  sidebarToggle.innerHTML = '<i class="bi bi-chevron-left"></i>';
  sidebarToggle.setAttribute('title', 'Collapse Sidebar');
  
  console.log("Sidebar initialization complete");
});

// Add this to your scripts.js file (or in a separate file that you include)

// Initialize variables for heatmap
let heatmapSortField = "community";
let heatmapSortDirection = "asc";

// Process data to create heatmap data structure
function processDataForHeatmap(data) {
  return data.map(community => {
    // Extract values by month and calculate average
    const monthValues = {};
    let sum = 0;
    
    community.occupancy.forEach(month => {
      const monthKey = month.month.toLowerCase();
      monthValues[monthKey] = month.value;
      sum += month.value;
    });
    
    // Calculate average if not provided
    const avg = community.avg || Math.round(sum / community.occupancy.length);
    
    return {
      id: community.id,
      community: community.community,
      region: community.region,
      trend: community.trend,
      ...monthValues,
      avg
    };
  });
}

// Generate the heatmap
function renderHeatmap() {
  const tableBody = document.querySelector("#occupancyHeatmap tbody");
  const tableFoot = document.querySelector("#occupancyHeatmap tfoot tr");
  
  if (!tableBody || !tableFoot) return;
  
  // Clear existing content
  tableBody.innerHTML = "";
  
  // Prepare data
  const heatmapData = processDataForHeatmap(occupancyData);
  
  // Sort the data
  const sortedData = [...heatmapData].sort((a, b) => {
    const aValue = a[heatmapSortField];
    const bValue = b[heatmapSortField];
    
    // Handle string or number sorting
    let comparison;
    if (typeof aValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else {
      comparison = aValue - bValue;
    }
    
    return heatmapSortDirection === "asc" ? comparison : -comparison;
  });
  
  // Update sort indicators in the header
  document.querySelectorAll("#occupancyHeatmap th.sortable").forEach(header => {
    const field = header.getAttribute("data-sort");
    const icon = header.querySelector(".sort-icon");
    
    header.classList.toggle("sorted", field === heatmapSortField);
    if (field === heatmapSortField) {
      icon.className = `sort-icon ms-1 bi ${heatmapSortDirection === "asc" ? "bi-chevron-up" : "bi-chevron-down"}`;
    } else {
      icon.className = "sort-icon ms-1 bi bi-chevron-down";
    }
  });
  
  // Calculate monthly averages
  const months = ["jan", "feb", "mar", "apr", "may", "jun"];
  const monthlyAverages = {};
  let totalSum = 0;
  let totalCount = 0;
  
  months.forEach(month => {
    let sum = 0;
    let count = 0;
    
    sortedData.forEach(community => {
      if (community[month]) {
        sum += community[month];
        count++;
      }
    });
    
    monthlyAverages[month] = count > 0 ? Math.round(sum / count) : 0;
    totalSum += sum;
    totalCount += count;
  });
  
  const overallAverage = totalCount > 0 ? Math.round(totalSum / totalCount) : 0;
  
  // Add rows to the table
  sortedData.forEach(community => {
    const row = document.createElement("tr");
    
    // Community name cell
    row.innerHTML = `<td class="px-3 py-3">${community.community}</td>`;
    
    // Month cells
    months.forEach(month => {
      const value = community[month] || 0;
      const colorClass = getHeatmapColorClass(value);
      
      const cell = document.createElement("td");
      cell.className = "p-1";
      cell.innerHTML = `
        <div class="heatmap-cell ${colorClass}" 
             title="${community.community} - ${month.charAt(0).toUpperCase() + month.slice(1)}: ${value}% occupancy">
          ${value}%
        </div>
      `;
      row.appendChild(cell);
    });
    
    // Average cell
    const avgCell = document.createElement("td");
    avgCell.className = "p-1";
    avgCell.innerHTML = `
      <div class="heatmap-cell avg-cell">
        ${community.avg}%
      </div>
    `;
    row.appendChild(avgCell);
    
    tableBody.appendChild(row);
  });
  
  // Update footer with averages
  let footerHTML = `<td class="px-3 py-3 fw-medium">Average</td>`;
  
  months.forEach(month => {
    const avgValue = monthlyAverages[month];
    const colorClass = getHeatmapColorClass(avgValue);
    
    footerHTML += `
      <td class="p-1">
        <div class="heatmap-cell ${colorClass}">
          ${avgValue}%
        </div>
      </td>
    `;
  });
  
  // Overall average
  footerHTML += `
    <td class="p-1">
      <div class="heatmap-cell avg-cell">
        ${overallAverage}%
      </div>
    </td>
  `;
  
  tableFoot.innerHTML = footerHTML;
  
  // Update community count and metrics
  updateCommunityCount();
  updateKeyMetrics(sortedData);
}

// Helper function to get color class based on value
function getHeatmapColorClass(value) {
  if (value >= 95) return "heatmap-95";
  if (value >= 90) return "heatmap-90";
  if (value >= 85) return "heatmap-85";
  if (value >= 80) return "heatmap-80";
  if (value >= 75) return "heatmap-75";
  return "heatmap-75";
}

// Handle sorting for heatmap
function handleHeatmapSort(field) {
  if (heatmapSortField === field) {
    heatmapSortDirection = heatmapSortDirection === "asc" ? "desc" : "asc";
  } else {
    heatmapSortField = field;
    heatmapSortDirection = "asc";
  }
  
  renderHeatmap();
  
  // Add a highlight effect to the sorted column
  const columnIndex = getColumnIndexByFieldName(field);
  if (columnIndex !== -1) {
    highlightColumn(columnIndex);
  }
}

// Helper to get column index by field name
function getColumnIndexByFieldName(field) {
  const headers = document.querySelectorAll("#occupancyHeatmap th");
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].getAttribute("data-sort") === field) {
      return i;
    }
  }
  return -1;
}

// Add highlighting effect to sorted column
function highlightColumn(columnIndex) {
  const table = document.getElementById("occupancyHeatmap");
  const rows = table.querySelectorAll("tr");
  
  rows.forEach(row => {
    const cells = row.querySelectorAll("th, td");
    if (cells.length > columnIndex) {
      cells[columnIndex].classList.add("column-highlight");
      
      // Remove the class after animation completes
      setTimeout(() => {
        cells[columnIndex].classList.remove("column-highlight");
      }, 1000);
    }
  });
}

// Update key metrics
function updateKeyMetrics(data) {
  // Find highest occupancy
  let highest = { value: 0, community: "", month: "" };
  let lowest = { value: 100, community: "", month: "" };
  let bestCommunity = { name: "", avg: 0 };
  
  const months = ["jan", "feb", "mar", "apr", "may", "jun"];
  
  data.forEach(community => {
    // Check for best community by average
    if (community.avg > bestCommunity.avg) {
      bestCommunity = { name: community.community, avg: community.avg };
    }
    
    // Check each month for highest/lowest
    months.forEach(month => {
      if (community[month]) {
        // Check highest
        if (community[month] > highest.value) {
          highest = { 
            value: community[month], 
            community: community.community, 
            month: month.charAt(0).toUpperCase() + month.slice(1)
          };
        }
        
        // Check lowest
        if (community[month] < lowest.value) {
          lowest = { 
            value: community[month], 
            community: community.community, 
            month: month.charAt(0).toUpperCase() + month.slice(1)
          };
        }
      }
    });
  });
  
  // Calculate overall average
  let totalSum = 0;
  let totalCount = 0;
  
  data.forEach(community => {
    totalSum += community.avg;
    totalCount++;
  });
  
  const overallAverage = totalCount > 0 ? Math.round(totalSum / totalCount) : 0;
  
  // Update UI elements
  document.getElementById("highestOccupancy").textContent = `${highest.value}%`;
  document.getElementById("highestOccupancyDetail").textContent = `${highest.community} (${highest.month})`;
  
  document.getElementById("lowestOccupancy").textContent = `${lowest.value}%`;
  document.getElementById("lowestOccupancyDetail").textContent = `${lowest.community} (${lowest.month})`;
  
  document.getElementById("bestPerforming").textContent = `${bestCommunity.avg}%`;
  document.getElementById("bestPerformingCommunity").textContent = bestCommunity.name;
  
  document.getElementById("avgOccupancy").textContent = `${overallAverage}%`;
}

// Initialize heatmap when document is ready
document.addEventListener("DOMContentLoaded", function() {
  // Only initialize if the heatmap table exists
  if (document.getElementById("occupancyHeatmap")) {
    // Set up sorting event listeners
    document.querySelectorAll("#occupancyHeatmap th.sortable").forEach(header => {
      header.addEventListener("click", function() {
        const field = this.getAttribute("data-sort");
        handleHeatmapSort(field);
      });
    });
    
    // Render initial heatmap
    renderHeatmap();
  }
});