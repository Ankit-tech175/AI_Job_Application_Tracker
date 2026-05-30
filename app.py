from flask import Flask

app = Flask(__name__)


@app.route("/")
def home():
    return "AI Job Application Tracker Running Successfully"


if __name__ == "__main__":
    app.run(debug=True)