from backend import create_app

app = create_app()


@app.route("/")
def home():
    return "AI Job Application Tracker Running Successfully"


if __name__ == "__main__":
    app.run(debug=True)