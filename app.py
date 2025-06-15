from flask import Flask, render_template, request, jsonify, json, stream_with_context, Response
import requests

app = Flask(__name__)



@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chats", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = data.get("prompt")
    modelname = "llama3.2"

    def generate():
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={"model": modelname, "prompt": prompt, "stream": True},
                stream=True,
            )
            for line in response.iter_lines():
                if line:
                    obj = json.loads(line.decode("utf-8"))
                    token = obj.get("response", "")
                    yield f"data: {token}\n\n"
        except Exception as e:
            yield f"data: ❌ Error: {str(e)}\n\n"

    return Response(stream_with_context(generate()), content_type="text/event-stream")

if __name__ == "__main__":
    app.run(debug=True)
