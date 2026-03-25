/**
 * Disease Detection JavaScript
 * Handles image upload, preview, and AI analysis via backend API
 * Improved version with better error handling and user feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsSection = document.getElementById('resultsSection');
    const detectionResults = document.getElementById('detectionResults');

    // Configuration
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const BACKEND_URL = 'http://localhost:5000';

    console.log('🌱 Disease Detection System Initialized');
    console.log('Backend URL:', BACKEND_URL);

    // Verify all elements are present
    if (!fileInput || !uploadArea || !previewSection || !imagePreview) {
        console.error('❌ Required DOM elements not found!');
        alert('Error: Page elements missing. Please refresh the page.');
        return;
    }

    console.log('✓ All DOM elements loaded successfully');

    // ========================================================================
    // UPLOAD AREA CLICK HANDLER
    // ========================================================================
    
    uploadArea.addEventListener('click', function(e) {
        console.log('📸 Upload area clicked');
        fileInput.click();
    });

    // ========================================================================
    // DRAG AND DROP HANDLERS
    // ========================================================================
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
        console.log('📂 File dragging over upload area');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
        
        console.log('📥 File dropped');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log(`Dropped file: ${files[0].name} (${files[0].type})`);
            handleFileSelect(files[0]);
        }
    });

    // ========================================================================
    // FILE INPUT CHANGE HANDLER
    // ========================================================================
    
    fileInput.addEventListener('change', function(e) {
        console.log('📁 File input changed');
        
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            console.log(`Selected file: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)`);
            handleFileSelect(file);
        } else {
            console.log('⚠️ No file selected');
        }
    });

    // ========================================================================
    // FILE SELECTION HANDLER
    // ========================================================================
    
    function handleFileSelect(file) {
        console.log('🔍 Processing file:', file.name);

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            console.error('❌ Invalid file type:', file.type);
            showError('Invalid File Type', 
                `Please select an image file (JPG, PNG, GIF, WebP).\nYou selected: ${file.type || 'unknown type'}`);
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            console.error('❌ File too large:', (file.size / 1024 / 1024).toFixed(2), 'MB');
            showError('File Too Large', 
                `Maximum file size is 10MB.\nYour file is ${(file.size / 1024 / 1024).toFixed(2)}MB.\nPlease use a smaller image.`);
            return;
        }

        console.log('✓ File validation passed');
        console.log('📖 Reading file...');

        // Read file
        const reader = new FileReader();
        
        reader.onloadstart = function() {
            console.log('⏳ File reading started...');
        };

        reader.onprogress = function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                console.log(`📊 Reading progress: ${percentComplete.toFixed(0)}%`);
            }
        };

        reader.onload = function(e) {
            console.log('✓ File loaded successfully');
            console.log(`Data URL length: ${e.target.result.length.toLocaleString()} characters`);
            
            displayPreview(e.target.result);
        };

        reader.onerror = function(e) {
            console.error('❌ FileReader error:', e);
            showError('Error Reading File', 
                'Could not read the image file. Please try again with a different image.');
        };

        reader.readAsDataURL(file);
    }

    // ========================================================================
    // DISPLAY PREVIEW
    // ========================================================================
    
    function displayPreview(imageData) {
        console.log('🖼️ Displaying image preview');
        
        imagePreview.src = imageData;
        uploadArea.style.display = 'none';
        previewSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        console.log('✓ Preview displayed - ready for analysis');
    }

    // ========================================================================
    // ANALYZE BUTTON
    // ========================================================================
    
    analyzeBtn.addEventListener('click', function() {
        console.log('🔬 Analyze button clicked');
        
        const imageData = imagePreview.src;
        
        if (!imageData || imageData === '') {
            console.error('❌ No image data available');
            showError('No Image', 'Please upload an image first.');
            return;
        }

        analyzeImage(imageData);
    });

    // ========================================================================
    // ANALYZE IMAGE
    // ========================================================================
    
    function analyzeImage(imageData) {
        console.log('🤖 Starting AI analysis...');
        
        // Disable button and show loading
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span>🔄 Analyzing...</span>';
        
        // Send to backend
        fetch(`${BACKEND_URL}/api/disease/detect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageData
            })
        })
        .then(response => {
            console.log('📡 Response received:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log('✓ Analysis complete:', data);
            
            if (data.status === 'success' && data.detection) {
                displayResults(data.detection);
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('❌ Analysis error:', error);
            showBackendError(error.message);
        })
        .finally(() => {
            // Re-enable button
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span>🔍 Analyze Image</span>';
        });
    }

    // ========================================================================
    // DISPLAY RESULTS
    // ========================================================================
    
    function displayResults(disease) {
        console.log('📊 Displaying results for:', disease.name);
        
        const severityColor = {
            'High': '#ef4444',
            'Medium': '#f59e0b',
            'Low': '#10b981'
        }[disease.severity] || '#6b7280';
        
        const confidencePercent = (disease.confidence * 100).toFixed(1);
        
        detectionResults.innerHTML = `
            <div class="result-card">
                <div class="result-header">
                    <h3 style="color: ${severityColor};">
                        ${disease.name}
                    </h3>
                    <div class="severity-badge" style="background: ${severityColor};">
                        ${disease.severity} Severity
                    </div>
                </div>

                <div class="result-meta">
                    <div class="meta-item">
                        <strong>Crop:</strong> ${disease.crop || 'General'}
                    </div>
                    <div class="meta-item">
                        <strong>Confidence:</strong> 
                        <span style="color: ${severityColor}; font-weight: bold;">
                            ${confidencePercent}%
                        </span>
                    </div>
                </div>

                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidencePercent}%; background: ${severityColor};">
                        ${confidencePercent}%
                    </div>
                </div>

                <div class="result-description">
                    <h4>📋 Description</h4>
                    <p>${disease.description || 'No description available.'}</p>
                </div>

                ${disease.symptoms ? `
                <div class="result-symptoms">
                    <h4>🔍 Symptoms</h4>
                    <ul>
                        ${disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${disease.treatment ? `
                <div class="result-treatment">
                    <h4>💊 Treatment Recommendations</h4>
                    <ol>
                        ${disease.treatment.map(treatment => `<li>${treatment}</li>`).join('')}
                    </ol>
                </div>
                ` : ''}

                ${disease.prevention ? `
                <div class="result-prevention">
                    <h4>🛡️ Prevention Tips</h4>
                    <ul>
                        ${disease.prevention.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="result-actions">
                    <button class="btn btn-primary" onclick="window.print();">
                        📄 Print Report
                    </button>
                    <button class="btn btn-secondary" onclick="shareResults('${disease.name}');">
                        📤 Share Results
                    </button>
                </div>
            </div>
        `;

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        console.log('✓ Results displayed successfully');
    }

    // ========================================================================
    // RESET BUTTON
    // ========================================================================
    
    resetBtn.addEventListener('click', function() {
        console.log('🔄 Resetting form');
        
        imagePreview.src = '';
        fileInput.value = '';
        uploadArea.style.display = 'block';
        previewSection.style.display = 'none';
        resultsSection.style.display = 'none';
        
        console.log('✓ Form reset complete');
    });

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================
    
    function showError(title, message) {
        alert(`${title}\n\n${message}`);
    }

    function showBackendError(message) {
        detectionResults.innerHTML = `
            <div class="result-card" style="background: #fee2e2; border: 2px solid #ef4444;">
                <div class="result-header">
                    <h3 style="color: #ef4444;">⚠️ Backend Not Connected</h3>
                </div>
                <div class="result-description">
                    <p style="color: #991b1b; font-size: 1.0625rem; line-height: 1.8;">
                        Could not connect to the AI backend server.
                    </p>
                    <p style="color: #991b1b; margin-top: 1rem;">
                        <strong>Error:</strong> ${message}
                    </p>
                    <ol style="color: #991b1b; margin-top: 1rem; line-height: 1.8;">
                        <li>Make sure the backend is running: <code style="background: white; padding: 0.25rem 0.5rem;">python backend_server.py</code></li>
                        <li>Check that it's running on: <code style="background: white; padding: 0.25rem 0.5rem;">${BACKEND_URL}</code></li>
                        <li>Refresh this page and try again</li>
                    </ol>
                </div>
            </div>
        `;
        resultsSection.style.display = 'block';
    }
});

// ========================================================================
// GLOBAL FUNCTIONS
// ========================================================================

function shareResults(diseaseName) {
    if (navigator.share) {
        navigator.share({
            title: 'Disease Detection Result',
            text: `Detected: ${diseaseName}. Get treatment recommendations on Smart Agriculture AI.`,
            url: window.location.href
        }).catch(err => console.log('Share cancelled'));
    } else {
        const text = `Disease Detected: ${diseaseName}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('✓ Copied to clipboard!\n\n' + text);
        }).catch(() => {
            alert('Result: ' + diseaseName);
        });
    }
}