
const sparklineCharts = {};
function destroyExistingSparkline(id) {
  if (sparklineCharts[id]) {
    sparklineCharts[id].destroy();
    delete sparklineCharts[id];
  }
}
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
  return "heatmap-70";
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

// Add this to your scripts.js file

// Enhanced data with additional information needed for the new sections
const enhancedOccupancyData = [
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
    units: [
      { month: "Jan", total: 120, occupied: 110, vacant: 10 },
      { month: "Feb", total: 120, occupied: 113, vacant: 7 },
      { month: "Mar", total: 120, occupied: 109, vacant: 11 },
      { month: "Apr", total: 120, occupied: 112, vacant: 8 },
      { month: "May", total: 120, occupied: 115, vacant: 5 },
      { month: "Jun", total: 100, occupied: 85, vacant: 15 }
    ],
    unitTypes: {
      studio: { total: 40, occupied: 38 },
      oneBedroom: { total: 50, occupied: 50 },
      twoBedroom: { total: 30, occupied: 30 }
    },
    admissionFunnel: {
      inquiries: 45,
      tours: 32,
      applications: 18,
      moveIns: 12,
      timeToMoveIn: 32 // days
    },
    waitlist: 8,
    avgLengthOfStay: 32, // months
    exitReasons: {
      death: 35,
      higherAcuity: 45,
      dissatisfaction: 10,
      other: 10
    },
    moveInOut: {
      moveIns: [4, 6, 3, 5, 6, 4],
      moveOuts: [2, 3, 7, 2, 3, 2]
    },
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
    units: [
      { month: "Jan", total: 100, occupied: 88, vacant: 12 },
      { month: "Feb", total: 100, occupied: 85, vacant: 15 },
      { month: "Mar", total: 100, occupied: 87, vacant: 13 },
      { month: "Apr", total: 100, occupied: 89, vacant: 11 },
      { month: "May", total: 100, occupied: 91, vacant: 9 },
      { month: "Jun", total: 100, occupied: 93, vacant: 7 }
    ],
    unitTypes: {
      studio: { total: 30, occupied: 28 },
      oneBedroom: { total: 40, occupied: 37 },
      twoBedroom: { total: 30, occupied: 28 }
    },
    admissionFunnel: {
      inquiries: 38,
      tours: 26,
      applications: 14,
      moveIns: 8,
      timeToMoveIn: 28
    },
    waitlist: 5,
    avgLengthOfStay: 28,
    exitReasons: {
      death: 30,
      higherAcuity: 40,
      dissatisfaction: 15,
      other: 15
    },
    moveInOut: {
      moveIns: [3, 2, 4, 5, 4, 5],
      moveOuts: [4, 5, 2, 3, 2, 3]
    },
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
    units: [
      { month: "Jan", total: 150, occupied: 143, vacant: 7 },
      { month: "Feb", total: 150, occupied: 141, vacant: 9 },
      { month: "Mar", total: 150, occupied: 144, vacant: 6 },
      { month: "Apr", total: 150, occupied: 146, vacant: 4 },
      { month: "May", total: 150, occupied: 147, vacant: 3 },
      { month: "Jun", total: 150, occupied: 149, vacant: 1 }
    ],
    unitTypes: {
      studio: { total: 50, occupied: 50 },
      oneBedroom: { total: 60, occupied: 60 },
      twoBedroom: { total: 40, occupied: 39 }
    },
    admissionFunnel: {
      inquiries: 52,
      tours: 38,
      applications: 24,
      moveIns: 15,
      timeToMoveIn: 26
    },
    waitlist: 12,
    avgLengthOfStay: 36,
    exitReasons: {
      death: 40,
      higherAcuity: 35,
      dissatisfaction: 5,
      other: 20
    },
    moveInOut: {
      moveIns: [5, 3, 7, 5, 4, 6],
      moveOuts: [5, 5, 3, 3, 3, 4]
    },
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
    units: [
      { month: "Jan", total: 110, occupied: 98, vacant: 12 },
      { month: "Feb", total: 110, occupied: 96, vacant: 14 },
      { month: "Mar", total: 110, occupied: 92, vacant: 18 },
      { month: "Apr", total: 110, occupied: 90, vacant: 20 },
      { month: "May", total: 110, occupied: 94, vacant: 16 },
      { month: "Jun", total: 110, occupied: 97, vacant: 13 }
    ],
    unitTypes: {
      studio: { total: 35, occupied: 30 },
      oneBedroom: { total: 45, occupied: 40 },
      twoBedroom: { total: 30, occupied: 27 }
    },
    admissionFunnel: {
      inquiries: 40,
      tours: 25,
      applications: 12,
      moveIns: 7,
      timeToMoveIn: 35
    },
    waitlist: 3,
    avgLengthOfStay: 24,
    exitReasons: {
      death: 25,
      higherAcuity: 35,
      dissatisfaction: 25,
      other: 15
    },
    moveInOut: {
      moveIns: [4, 2, 1, 3, 5, 6],
      moveOuts: [2, 4, 4, 5, 2, 3]
    },
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
    units: [
      { month: "Jan", total: 130, occupied: 118, vacant: 12 },
      { month: "Feb", total: 130, occupied: 116, vacant: 14 },
      { month: "Mar", total: 130, occupied: 112, vacant: 18 },
      { month: "Apr", total: 130, occupied: 108, vacant: 22 },
      { month: "May", total: 130, occupied: 105, vacant: 25 },
      { month: "Jun", total: 130, occupied: 103, vacant: 27 }
    ],
    unitTypes: {
      studio: { total: 40, occupied: 30 },
      oneBedroom: { total: 55, occupied: 43 },
      twoBedroom: { total: 35, occupied: 30 }
    },
    admissionFunnel: {
      inquiries: 30,
      tours: 18,
      applications: 8,
      moveIns: 4,
      timeToMoveIn: 40
    },
    waitlist: 1,
    avgLengthOfStay: 18,
    exitReasons: {
      death: 20,
      higherAcuity: 30,
      dissatisfaction: 35,
      other: 15
    },
    moveInOut: {
      moveIns: [2, 1, 0, 2, 1, 2],
      moveOuts: [3, 3, 4, 6, 4, 4]
    },
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
    units: [
      { month: "Jan", total: 140, occupied: 136, vacant: 4 },
      { month: "Feb", total: 140, occupied: 137, vacant: 3 },
      { month: "Mar", total: 140, occupied: 139, vacant: 1 },
      { month: "Apr", total: 140, occupied: 137, vacant: 3 },
      { month: "May", total: 140, occupied: 136, vacant: 4 },
      { month: "Jun", total: 140, occupied: 139, vacant: 1 }
    ],
    unitTypes: {
      studio: { total: 45, occupied: 45 },
      oneBedroom: { total: 60, occupied: 60 },
      twoBedroom: { total: 35, occupied: 34 }
    },
    admissionFunnel: {
      inquiries: 55,
      tours: 42,
      applications: 28,
      moveIns: 18,
      timeToMoveIn: 24
    },
    waitlist: 15,
    avgLengthOfStay: 42,
    exitReasons: {
      death: 45,
      higherAcuity: 40,
      dissatisfaction: 5,
      other: 10
    },
    moveInOut: {
      moveIns: [6, 5, 7, 3, 4, 7],
      moveOuts: [5, 4, 5, 4, 5, 4]
    },
    avg: 98,
    trend: "up"
  }
];

// Initialize view mode
let currentViewMode = 'percentage';

// Initialize section visibility
let isDriversPanelVisible = true;
let isOpportunitiesPanelVisible = false;

// Currently selected community IDs for different panels
let selectedFunnelCommunityId = 'all';
let selectedExitReasonsCommunityId = 'all';
let selectedFinancialOpportunityCommunityId = 'all';

// DOM ready function - initialize the enhanced dashboard
document.addEventListener("DOMContentLoaded", function() {
  // Replace the original occupancyData with our enhanced data
  window.occupancyData = enhancedOccupancyData;
  
  // Initialize the heatmap with our new data
  renderHeatmap();
  updateCommunityCount();
  
  // Add event listeners for view mode toggles
  document.getElementById('percentageView').addEventListener('change', function() {
    if (this.checked) {
      currentViewMode = 'percentage';
      renderHeatmap();
    }
  });
  
  document.getElementById('unitCountView').addEventListener('change', function() {
    if (this.checked) {
      currentViewMode = 'units';
      renderHeatmap();
    }
  });
  
  document.getElementById('vacantView').addEventListener('change', function() {
    if (this.checked) {
      currentViewMode = 'vacant';
      renderHeatmap();
    }
  });
  
  // Add event listeners for community selectors
  document.getElementById('funnelCommunitySelect').addEventListener('change', function() {
    selectedFunnelCommunityId = this.value;
    updateAdmissionFunnel();
  });
  
  document.getElementById('exitReasonsCommunitySelect').addEventListener('change', function() {
    selectedExitReasonsCommunityId = this.value;
    initExitReasonsPieChart();
  });
  
  document.getElementById('financialOpportunityCommunitySelect').addEventListener('change', function() {
    selectedFinancialOpportunityCommunityId = this.value;
    updateFinancialOpportunity();
  });
  
  // Add event listeners for toggleable sections
  document.getElementById('toggleDriversBtn').addEventListener('click', function() {
    const driversPanel = document.getElementById('driversPanel');
    const icon = this.querySelector('i');
    
    if (driversPanel.style.display === 'none') {
      driversPanel.style.display = 'block';
      icon.className = 'bi bi-chevron-up';
      isDriversPanelVisible = true;
    } else {
      driversPanel.style.display = 'none';
      icon.className = 'bi bi-chevron-down';
      isDriversPanelVisible = false;
    }
  });
  
  document.getElementById('toggleOpportunitiesBtn').addEventListener('click', function() {
    const opportunitiesPanel = document.getElementById('opportunitiesPanel');
    const icon = this.querySelector('i');
    
    if (opportunitiesPanel.style.display === 'none') {
      opportunitiesPanel.style.display = 'block';
      icon.className = 'bi bi-chevron-up';
      isOpportunitiesPanelVisible = true;
    } else {
      opportunitiesPanel.style.display = 'none';
      icon.className = 'bi bi-chevron-down';
      isOpportunitiesPanelVisible = false;
    }
  });
  
  // Initialize the new sections
  updateAdmissionFunnel();
  updateExitReasons();
  updateFinancialOpportunity();
  updateKeyMetrics();
  initExitReasonsPieChart();
  
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});

// Enhanced renderHeatmap function that supports different view modes
function renderHeatmap() {
  const tableBody = document.querySelector("#occupancyHeatmap tbody");
  const tableFoot = document.querySelector("#occupancyHeatmap tfoot tr");
  
  if (!tableBody || !tableFoot) return;
  
  // Clear existing content
  tableBody.innerHTML = "";
  
  // Prepare data
  const heatmapData = processDataForHeatmap(enhancedOccupancyData);
  
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
  
  // Calculate monthly averages based on view mode
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
      let value, displayValue;
      
      if (currentViewMode === 'percentage') {
        value = community[month] || 0;
        displayValue = `${value}%`;
      } else if (currentViewMode === 'units') {
        const monthIndex = months.indexOf(month);
        value = community.units[monthIndex].occupied;
        displayValue = `${value}`;
      } else if (currentViewMode === 'vacant') {
        const monthIndex = months.indexOf(month);
        value = community.units[monthIndex].vacant;
        displayValue = `${value}`;
      }
      
      const colorClass = currentViewMode === 'vacant' ? 
                        getVacantHeatmapColorClass(value, community.units[months.indexOf(month)].total) : 
                        getHeatmapColorClass(currentViewMode === 'percentage' ? value : 
                                          (value / community.units[months.indexOf(month)].total * 100));
      
      const tooltipTitle = currentViewMode === 'percentage' ? 
                         `${community.community} - ${month.charAt(0).toUpperCase() + month.slice(1)}: ${value}% occupancy` :
                         currentViewMode === 'units' ? 
                         `${community.community} - ${month.charAt(0).toUpperCase() + month.slice(1)}: ${value} occupied units` :
                         `${community.community} - ${month.charAt(0).toUpperCase() + month.slice(1)}: ${value} vacant units`;
      
      const cell = document.createElement("td");
      cell.className = "p-1";
      cell.innerHTML = `
        <div class="heatmap-cell ${colorClass}" 
             title="${tooltipTitle}">
          ${displayValue}
        </div>
      `;
      row.appendChild(cell);
    });
    
    // Move In/Out cell
// Move In/Out cell with Sparkline
const moveInOutCell = document.createElement("td");
moveInOutCell.className = "p-1";
const canvasId = `sparkline-${community.id}`;
moveInOutCell.innerHTML = `
  <canvas id="${canvasId}" width="120" height="36"></canvas>
`;
row.appendChild(moveInOutCell);

// Draw Chart.js sparkline
setTimeout(() => {
  const ctx = document.getElementById(canvasId);
  if (ctx) {
    destroyExistingSparkline(canvasId);
    sparklineCharts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
        datasets: [
          {
            label: 'Move-Ins',
            data: community.moveInOut.moveIns,
            borderColor: '#a0b878',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: 'Move-Outs',
            data: community.moveInOut.moveOuts,
            borderColor: '#f79a80',
            backgroundColor: 'transparent',
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: '#fff',
            titleColor: '#000',
            bodyColor: '#000',
            borderColor: '#ccc',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      }
    });
  }
}, 10); // ensure DOM is ready

    // Waitlist cell
    const waitlistCell = document.createElement("td");
    waitlistCell.className = "p-2 text-center";
    
    if (community.waitlist > 0) {
      waitlistCell.innerHTML = `<span class="waitlist-badge">${community.waitlist}</span>`;
    } else {
      waitlistCell.innerHTML = `<span class="text-muted small">-</span>`;
    }
    
    row.appendChild(waitlistCell);
    
    // Average cell
    const avgValue = currentViewMode === 'percentage' ? 
                   community.avg : 
                   currentViewMode === 'units' ? 
                   community.units[5].occupied : 
                   community.units[5].vacant;
    
    const avgDisplayValue = currentViewMode === 'percentage' ? `${avgValue}%` : `${avgValue}`;
    
    const avgCell = document.createElement("td");
    avgCell.className = "p-1";
    avgCell.innerHTML = `
      <div class="heatmap-cell avg-cell">
        ${avgDisplayValue}
      </div>
    `;
    row.appendChild(avgCell);
    
    tableBody.appendChild(row);
  });
  
  // Update footer with averages
  let footerHTML = `<td class="px-3 py-3 fw-medium">Average</td>`;
  
  months.forEach(month => {
    let avgValue = monthlyAverages[month];
    const displayValue = currentViewMode === 'percentage' ? `${avgValue}%` : `${avgValue}`;
    const colorClass = currentViewMode === 'vacant' ? 
                     getVacantHeatmapColorClass(avgValue, 100) : 
                     getHeatmapColorClass(avgValue);
    
    footerHTML += `
      <td class="p-1">
        <div class="heatmap-cell ${colorClass}">
          ${displayValue}
        </div>
      </td>
    `;
  });
  
  // Move In/Out footer cell
  footerHTML += `
    <td class="p-1">
      <div class="heatmap-cell text-center text-muted small">
        -
      </div>
    </td>
  `;
  
  // Waitlist footer cell
  const totalWaitlist = enhancedOccupancyData.reduce((sum, community) => sum + community.waitlist, 0);
  footerHTML += `
    <td class="p-2 text-center">
      <span class="waitlist-badge">${totalWaitlist}</span>
    </td>
  `;
  
  // Overall average
  footerHTML += `
    <td class="p-1">
      <div class="heatmap-cell avg-cell">
        ${currentViewMode === 'percentage' ? `${overallAverage}%` : `${overallAverage}`}
      </div>
    </td>
  `;
  
  tableFoot.innerHTML = footerHTML;
  
  // Update community count and metrics
  updateCommunityCount();
}

// Update helper function for vacant units color scale
function getVacantHeatmapColorClass(value, total) {
  const percentage = (value / total) * 100;
  
  if (percentage <= 1) return "bg-green-100 text-gray-800";
  if (percentage <= 5) return "bg-green-300 text-gray-800";
  if (percentage <= 10) return "bg-amber-300 text-gray-800";
  if (percentage <= 15) return "bg-amber-500 text-white";
  return "bg-red-500 text-white";
}

// Process data for heatmap with support for different view modes
function processDataForHeatmap(data) {
  return data.map(community => {
    // Extract values by month and calculate average
    const monthValues = {};
    const unitValues = {};
    const vacantValues = {};
    let sum = 0;
    
    community.occupancy.forEach((month, index) => {
      const monthKey = month.month.toLowerCase();
      monthValues[monthKey] = month.value;
      unitValues[monthKey] = community.units[index].occupied;
      vacantValues[monthKey] = community.units[index].vacant;
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
      units: community.units,
      moveInOut: community.moveInOut,
      waitlist: community.waitlist,
      avg
    };
  });
}

// Update the admission funnel section
let exitReasonsChart = null;

function initExitReasonsPieChart() {
  const canvas = document.getElementById('exitReasonsPie');
  if (!canvas) {
    console.warn("exitReasonsPie canvas not found");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn("Canvas context could not be initialized");
    return;
  }

  // Get the selected community’s data
  const selected = selectedExitReasonsCommunityId;
  const data = selected === 'all'
    ? aggregateExitReasons(enhancedOccupancyData)
    : enhancedOccupancyData.find(c => c.id.toString() === selected)?.exitReasons;

  if (!data) {
    console.warn("No exit reason data found");
    return;
  }

  // Destroy the old chart if it exists
  if (exitReasonsChart) {
    exitReasonsChart.destroy();
  }

  // Create a new chart
  exitReasonsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Death', 'Higher Acuity', 'Dissatisfaction', 'Other'],
      datasets: [{
        data: [data.death, data.higherAcuity, data.dissatisfaction, data.other],
        backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#6b7280'],
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed} exits`;
            }
          }
        }
      }
    }
  });
}


// Add this too if using "All Communities" to sum up
function aggregateExitReasons(data) {
  return data.reduce((acc, community) => {
    acc.death += community.exitReasons.death;
    acc.higherAcuity += community.exitReasons.higherAcuity;
    acc.dissatisfaction += community.exitReasons.dissatisfaction;
    acc.other += community.exitReasons.other;
    return acc;
  }, { death: 0, higherAcuity: 0, dissatisfaction: 0, other: 0 });
}


function updateAdmissionFunnel() {
  console.warn("updateAdmissionFunnel() is not implemented yet.");
}
