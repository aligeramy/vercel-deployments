// Vercel API Configuration
const VERCEL_API_BASE = 'https://api.vercel.com';

// DOM Elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const mainContent = document.getElementById('mainContent');
const apiTokenInput = document.getElementById('apiToken');
const saveTokenBtn = document.getElementById('saveToken');
const cancelSettingsBtn = document.getElementById('cancelSettings');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const deploymentsList = document.getElementById('deploymentsList');
const emptyState = document.getElementById('emptyState');

// State
let isSettingsOpen = false;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadDeployments();
});

// Settings Panel Toggle
settingsBtn.addEventListener('click', () => {
  isSettingsOpen = !isSettingsOpen;
  if (isSettingsOpen) {
    settingsPanel.classList.remove('hidden');
    loadTokenIntoInput();
  } else {
    settingsPanel.classList.add('hidden');
  }
});

cancelSettingsBtn.addEventListener('click', () => {
  isSettingsOpen = false;
  settingsPanel.classList.add('hidden');
});

// Save API Token
saveTokenBtn.addEventListener('click', async () => {
  const token = apiTokenInput.value.trim();
  if (!token) {
    alert('Please enter a Vercel API token');
    return;
  }
  
  await chrome.storage.local.set({ vercelApiToken: token });
  settingsPanel.classList.add('hidden');
  isSettingsOpen = false;
  await loadDeployments();
});

// Retry Button
retryBtn.addEventListener('click', () => {
  loadDeployments();
});

// Load token into input field
async function loadTokenIntoInput() {
  const result = await chrome.storage.local.get(['vercelApiToken']);
  if (result.vercelApiToken) {
    apiTokenInput.value = result.vercelApiToken;
  } else {
    apiTokenInput.value = '';
  }
}

// Load settings
async function loadSettings() {
  const result = await chrome.storage.local.get(['vercelApiToken']);
  if (!result.vercelApiToken) {
    // Show settings panel if no token is set
    settingsPanel.classList.remove('hidden');
    isSettingsOpen = true;
  }
}

// Cache for project domains to avoid repeated API calls
const projectDomainsCache = new Map();

// Fetch project domains from Vercel API
async function fetchProjectDomains(token, projectIdOrName) {
  // Check cache first
  if (projectDomainsCache.has(projectIdOrName)) {
    return projectDomainsCache.get(projectIdOrName);
  }

  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects/${encodeURIComponent(projectIdOrName)}/domains`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If project not found or no domains, return empty array
      if (response.status === 404) {
        projectDomainsCache.set(projectIdOrName, []);
        return [];
      }
      // For other errors, return empty array to not break the flow
      return [];
    }

    const data = await response.json();
    const domains = data.domains || [];
    
    // Cache the result
    projectDomainsCache.set(projectIdOrName, domains);
    return domains;
  } catch (error) {
    // On error, return empty array to not break the flow
    console.error('Error fetching project domains:', error);
    return [];
  }
}

// Fetch deployments from Vercel API
async function fetchDeployments(token) {
  const response = await fetch(`${VERCEL_API_BASE}/v6/deployments?limit=20`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid API token. Please check your token in settings.');
    }
    throw new Error(`Failed to fetch deployments: ${response.statusText}`);
  }

  const data = await response.json();
  return data.deployments || [];
}

// Format deployment status
function getStatusClass(status) {
  const statusMap = {
    'READY': 'status-ready',
    'BUILDING': 'status-building',
    'ERROR': 'status-error',
    'QUEUED': 'status-queued',
    'CANCELED': 'status-canceled'
  };
  return statusMap[status] || 'status-queued';
}

// Format time ago
function formatTimeAgo(timestamp) {
  const now = new Date();
  let time;
  
  // Handle different timestamp formats from Vercel API
  if (typeof timestamp === 'string') {
    // ISO string format
    time = new Date(timestamp);
  } else if (timestamp > 1000000000000) {
    // Already in milliseconds (timestamp > year 2000 in ms)
    time = new Date(timestamp);
  } else {
    // Assume seconds, convert to milliseconds
    time = new Date(timestamp * 1000);
  }
  
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 0) {
    return 'just now';
  } else if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

// Get the best URL for a deployment (custom domain preferred)
function getDeploymentUrl(deployment, customDomains = []) {
  // Filter out vercel.app domains to get only custom domains
  const customDomainsOnly = customDomains.filter(domain => {
    const domainObj = typeof domain === 'string' ? { name: domain } : domain;
    const domainName = domainObj.name || domain;
    return domainName && !domainName.includes('.vercel.app');
  });
  
  // Prioritize custom domain
  if (customDomainsOnly.length > 0) {
    const primaryDomain = customDomainsOnly[0];
    const domainName = typeof primaryDomain === 'string' ? primaryDomain : primaryDomain.name;
    return domainName;
  }
  
  // Fall back to default Vercel URL
  if (deployment.url) {
    return deployment.url;
  }
  
  // Last resort: construct from project name
  return `${deployment.name || 'unknown'}.vercel.app`;
}

// Render deployments
async function renderDeployments(deployments, token) {
  if (deployments.length === 0) {
    emptyState.classList.remove('hidden');
    deploymentsList.innerHTML = '';
    return;
  }

  emptyState.classList.add('hidden');
  
  // Get unique project IDs/names to fetch domains
  const uniqueProjects = [...new Set(deployments.map(d => d.projectId || d.name).filter(Boolean))];
  
  // Fetch domains for all unique projects in parallel
  const domainPromises = uniqueProjects.map(projectIdOrName => 
    fetchProjectDomains(token, projectIdOrName)
  );
  const domainsResults = await Promise.all(domainPromises);
  
  // Create a map of project to domains
  const projectDomainsMap = new Map();
  uniqueProjects.forEach((projectIdOrName, index) => {
    projectDomainsMap.set(projectIdOrName, domainsResults[index]);
  });
  
  // Render deployments with custom domains
  deploymentsList.innerHTML = deployments.map(deployment => {
    const status = deployment.readyState || deployment.state || 'UNKNOWN';
    const statusClass = getStatusClass(status);
    
    // Get project ID or name
    const projectIdOrName = deployment.projectId || deployment.name;
    const customDomains = projectDomainsMap.get(projectIdOrName) || [];
    
    // Get the best URL (custom domain preferred)
    let url = getDeploymentUrl(deployment, customDomains);
    
    // Normalize URL to always include https:// protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    // Vercel API returns createdAt as a number (milliseconds) or ISO string
    const createdAt = deployment.createdAt || Date.now();
    const projectName = deployment.name || 'Unknown Project';

    const isBuilding = status === 'BUILDING';
    const loadingSpinner = isBuilding ? '<div class="deployment-loading-spinner"></div>' : '';
    
    // Escape URL for HTML attribute
    const escapedUrl = escapeHtml(url);
    
    return `
      <div class="deployment-item" data-url="${escapedUrl}">
        <div class="deployment-header">
          <div class="deployment-name-container">
            ${loadingSpinner}
            <div class="deployment-name">${escapeHtml(projectName)}</div>
          </div>
          <span class="deployment-status ${statusClass}">${status.toLowerCase()}</span>
        </div>
        <div class="deployment-info">
          <a href="${escapedUrl}" class="deployment-url" target="_blank" onclick="event.stopPropagation()">${escapedUrl}</a>
          <div class="deployment-time">${formatTimeAgo(createdAt)}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add click event listeners to deployment items
  deploymentsList.querySelectorAll('.deployment-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't open if clicking on the link itself
      if (e.target.tagName === 'A') return;
      const url = item.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank');
      }
    });
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Load and display deployments
async function loadDeployments() {
  // Hide error and empty state
  errorDiv.classList.add('hidden');
  emptyState.classList.add('hidden');
  
  // Show loading
  loadingDiv.classList.remove('hidden');
  deploymentsList.innerHTML = '';

  try {
    const result = await chrome.storage.local.get(['vercelApiToken']);
    const token = result.vercelApiToken;

    if (!token) {
      throw new Error('No API token found. Please configure your Vercel API token in settings.');
    }

    const deployments = await fetchDeployments(token);
    await renderDeployments(deployments, token);
  } catch (error) {
    errorMessage.textContent = error.message;
    errorDiv.classList.remove('hidden');
    deploymentsList.innerHTML = '';
  } finally {
    loadingDiv.classList.add('hidden');
  }
}
