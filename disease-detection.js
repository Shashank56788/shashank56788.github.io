/**
 * Disease Detection JavaScript
 * Handles image upload, preview, and AI analysis via backend API
 */

document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const imagePreview = document.getElementById('imagePreview');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsSection = document.getElementById('resultsSection');
    const detectionResults = document.getElementById('detectionResults');

    console.log('Disease Detection initialized');
    console.log('Elements found:', {
        fileInput: !!fileInput,
        uploadArea: !!uploadArea,
        previewSection: !!previewSection,
        imagePreview: !!imagePreview
    });

    // Click on upload area to trigger file input
    uploadArea.addEventListener('click', function() {
        console.log('Upload area clicked');
        fileInput.click();
    });

    // Drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'rgba(102, 126, 234, 0.05)';
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.background = '#f9fafb';
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
        uploadArea.style.background = '#f9fafb';
        
        console.log('File dropped');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log('File:', files[0].name, files[0].type);
            handleFileSelect(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        console.log('File input changed');
        if (e.target.files.length > 0) {
            console.log('File selected:', e.target.files[0].name);
            handleFileSelect(e.target.files[0]);
        }
    });

    // Handle file selection
    function handleFileSelect(file) {
        console.log('handleFileSelect called with:', file.name, file.type, file.size);
        
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            console.error('Invalid file type:', file.type);
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('File loaded, data length:', e.target.result.length);
            imagePreview.src = e.target.result;
            uploadArea.style.display = 'none';
            previewSection.style.display = 'block';
            resultsSection.style.display = 'none';
            console.log('Preview displayed');
        };
        
        reader.onerror = function(e) {
            console.error('FileReader error:', e);
            alert('Error reading file');
        };
        
        reader.readAsDataURL(file);
        console.log('Reading file...');
    }

    // Analyze button
    analyzeBtn.addEventListener('click', function() {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span>🔄 Analyzing with AI...</span>';

        // Get image as base64
        const imageBase64 = imagePreview.src;

        // Send to backend API
        fetch('http://localhost:5000/api/disease/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: imageBase64
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.detection) {
                displayResults(data.detection);
            } else if (data.error) {
                alert('Error: ' + data.error);
                console.error('API Error:', data);
            }
            
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span>🔍 Analyze Image</span>';
        })
        .catch(error => {
            console.error('Connection Error:', error);
            
            // Show backend connection error
            alert('⚠️ Backend not connected.\n\nTo use disease detection:\n1. Run: python backend_server.py\n2. Make sure it\'s running on http://localhost:5000\n3. Try uploading the image again');
            
            // Show error in results section
            detectionResults.innerHTML = `
                <div class="result-card" style="background: #fee2e2; border: 2px solid #ef4444;">
                    <div class="result-header">
                        <h3 style="color: #ef4444;">⚠️ Backend Not Connected</h3>
                    </div>
                    <div class="result-description">
                        <p style="color: #991b1b; font-size: 1.0625rem; line-height: 1.8;">
                            The disease detection AI backend is not running. To use this feature:
                        </p>
                        <ol style="color: #991b1b; margin-top: 1rem; line-height: 1.8;">
                            <li>Open a terminal/command prompt</li>
                            <li>Navigate to your project folder</li>
                            <li>Run: <code style="background: white; padding: 0.25rem 0.5rem; border-radius: 4px;">python backend_server.py</code></li>
                            <li>Wait for "System ready!" message</li>
                            <li>Upload your image again</li>
                        </ol>
                        <div style="margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px;">
                            <strong style="color: #0f172a;">Backend URL:</strong> 
                            <code>http://localhost:5000/api/disease/detect</code>
                        </div>
                    </div>
                </div>
            `;
            resultsSection.style.display = 'block';
            
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span>🔍 Analyze Image</span>';
        });
    });
            displayResults(demoDisease);
            
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span>🔍 Analyze Image</span>';
        });
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        uploadArea.style.display = 'block';
        previewSection.style.display = 'none';
        resultsSection.style.display = 'none';
        fileInput.value = '';
    });

    // Display results
    function displayResults(disease) {
        const severityColor = disease.severity === 'High' ? '#ef4444' : 
                             disease.severity === 'Medium' ? '#f59e0b' : '#10b981';
        
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
                        <strong>Crop:</strong> ${disease.crop}
                    </div>
                    <div class="meta-item">
                        <strong>Confidence:</strong> 
                        <span style="color: ${severityColor}; font-weight: bold;">
                            ${confidencePercent}%
                        </span>
                    </div>
                </div>

                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidencePercent}%; background: ${severityColor};"></div>
                </div>

                <div class="result-description">
                    <h4>Description</h4>
                    <p>${disease.description}</p>
                </div>

                <div class="result-symptoms">
                    <h4>🔍 Symptoms</h4>
                    <ul>
                        ${disease.symptoms.map(symptom => `<li>${symptom}</li>`).join('')}
                    </ul>
                </div>

                <div class="result-treatment">
                    <h4>💊 Treatment Recommendations</h4>
                    <ol>
                        ${disease.treatment.map(treatment => `<li>${treatment}</li>`).join('')}
                    </ol>
                </div>

                <div class="result-prevention">
                    <h4>🛡️ Prevention Tips</h4>
                    <ul>
                        ${disease.prevention.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>

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
    }
});

// Share results function
function shareResults(diseaseName) {
    if (navigator.share) {
        navigator.share({
            title: 'Disease Detection Result',
            text: `Detected: ${diseaseName}. Get treatment recommendations on Smart Agriculture AI.`,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        alert('Result: ' + diseaseName + '\n\nSharing is not supported on this browser. Use Print instead.');
    }
}