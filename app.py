from flask import Flask, render_template, request, jsonify, json
import requests

app = Flask(__name__)



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chats", methods=["POST"])
def chat():
    data = request.get_json()
    print("Received data:", data)
    prompt = data.get("prompt")

    modelname = "llama3.2"

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": modelname,
                "prompt": prompt,
                "stream": True
            },
            stream=True
        )

        # Aggregate the 'response' fields from each streamed JSON line
        full_response = ""
        for line in response.iter_lines():
            if line:
                obj = json.loads(line.decode("utf-8"))
                full_response += obj.get("response", "")

        return full_response or "⚠️ No response"

    except Exception as e:
        print("❌ Error occurred:", e)
        return f"❌ Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(debug=True)









