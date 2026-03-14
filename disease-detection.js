/**
 * Disease Detection JavaScript
 * Handles image upload, preview, and AI analysis
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

    // Sample disease database (in production, this would come from backend AI)
    const diseaseDatabase = [
        {
            name: 'Late Blight',
            crop: 'Tomato',
            severity: 'High',
            confidence: 0.94,
            description: 'Fungal disease causing dark lesions on leaves and stems',
            symptoms: ['Dark brown spots on leaves', 'White fuzzy growth', 'Rapid spreading', 'Affects fruits'],
            treatment: [
                'Remove and destroy infected plants immediately',
                'Apply copper-based fungicide',
                'Improve air circulation',
                'Avoid overhead watering'
            ],
            prevention: [
                'Use disease-resistant varieties',
                'Practice crop rotation',
                'Maintain proper spacing',
                'Water at soil level'
            ]
        },
        {
            name: 'Powdery Mildew',
            crop: 'Grape',
            severity: 'Medium',
            confidence: 0.91,
            description: 'White powdery fungal growth on leaves and fruits',
            symptoms: ['White powdery coating', 'Leaf curling', 'Stunted growth', 'Reduced yield'],
            treatment: [
                'Apply sulfur-based fungicide',
                'Prune affected areas',
                'Increase sunlight exposure',
                'Use neem oil spray'
            ],
            prevention: [
                'Plant in sunny locations',
                'Ensure good air flow',
                'Avoid over-fertilizing',
                'Regular monitoring'
            ]
        },
        {
            name: 'Bacterial Spot',
            crop: 'Pepper',
            severity: 'High',
            confidence: 0.88,
            description: 'Bacterial infection causing dark spots on leaves and fruits',
            symptoms: ['Small dark spots with yellow halo', 'Leaf drop', 'Fruit lesions', 'Defoliation'],
            treatment: [
                'Apply copper-based bactericide',
                'Remove infected plant parts',
                'Disinfect tools between cuts',
                'Avoid working with wet plants'
            ],
            prevention: [
                'Use certified disease-free seeds',
                'Practice 2-3 year crop rotation',
                'Mulch to prevent soil splash',
                'Drip irrigation preferred'
            ]
        }
    ];

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
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // Handle file selection
    function handleFileSelect(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            uploadArea.style.display = 'none';
            previewSection.style.display = 'block';
            resultsSection.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Analyze button
    analyzeBtn.addEventListener('click', function() {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span>🔄 Analyzing...</span>';

        // Simulate AI processing delay
        setTimeout(function() {
            // Randomly select a disease from database (in production, this would be actual AI prediction)
            const randomDisease = diseaseDatabase[Math.floor(Math.random() * diseaseDatabase.length)];
            displayResults(randomDisease);
            
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span>🔍 Analyze Image</span>';
        }, 2000);
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
