from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chats", methods=["POST"])
def chat():
    data = request.get_json()
    print("Received data:", data) # checking
    prompt = data.get("prompt")

    modelname = "llama3.2" # can change and even make it a chpice 

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": modelname,
                "prompt": prompt,
                "stream": True
            }
        )
        result = response.json()
        
        return result.get("response", "⚠️ No response")

    except Exception as e:
        print("❌ Error occurred:", e)
        return f"❌ Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(debug=True)
