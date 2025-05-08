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