from flask import Flask
from flask_cors import CORS

from routes.schools import schools_bp
from routes.farmers import farmers_bp
from routes.requests import requests_bp
from routes.offers import offers_bp
from routes.orders import orders_bp
from routes.payments import payments
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)


app.register_blueprint(schools_bp)
app.register_blueprint(farmers_bp)
app.register_blueprint(requests_bp)
app.register_blueprint(offers_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(payments)


@app.route("/")
def home():
    return {
        "message": "School-Farmer Marketplace API is running"
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)
