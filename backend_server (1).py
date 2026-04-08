from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

# import your model file
import smart_agriculture_ai_models as model

app = Flask(__name__)
CORS(app)

@app.route('/api/disease/detect', methods=['POST'])
def detect():
    data = request.get_json()
    image = data.get("image")

    # 👉 Call your model here
    # result = model.predict(image)

    # TEMP dummy result
    result = {
        "status": "success",
        "detection": {
            "name": "Leaf Blight",
            "confidence": 0.91,
            "severity": "High",
            "crop": "Tomato"
        }
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)