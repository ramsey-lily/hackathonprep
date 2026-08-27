import base64
import requests
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

CONSUMER_KEY = os.getenv("consumer_key")
CONSUMER_SECRET = os.getenv("consumer_secret")
SHORTCODE = os.getenv("mpesa_shortcode")
PASSKEY = os.getenv("express_passkey")

BASE_URL = "https://sandbox.safaricom.co.ke"

def get_access_token():

    credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"

    encoded_credentials = base64.b64encode(
        credentials.encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {encoded_credentials}"
    }

    url = f"{BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

    print("REQUESTING TOKEN FROM:")
    print(url)

    print("KEY EXISTS:", CONSUMER_KEY is not None)
    print("SECRET EXISTS:", CONSUMER_SECRET is not None)

    response = requests.get(
        url,
        headers=headers
    )

    print("OAUTH STATUS:", response.status_code)
    print("OAUTH RESPONSE:", response.text)

    response.raise_for_status()

    return response.json()["access_token"]

def format_phone(phone):
    phone = phone.strip().replace(" ", "")
    
    if phone.startswith("+254"):
        phone = phone[1:]
    elif phone.startswith("0"):
        phone = "254" + phone[1:]
    elif phone.startswith("7") or phone.startswith("1"):
        phone = "254" + phone
        
    return phone

def initiate_stk_push(phone, amount, order_id):
	phone = format_phone(phone)
	access_token = get_access_token()
	timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
	password_string = f"{SHORTCODE}{PASSKEY}{timestamp}"
	password = base64.b64encode(password_string.encode()).decode()

	headers = {"Authorization": f"Bearer {access_token}",
			"Content-Type": "application/json"
              }

	payload = {
			"BusinessShortCode": SHORTCODE,
			"Password": password,
			"Timestamp": timestamp,
			"TransactionType": "CustomerPayBillOnline",
			"Amount": amount,
			"PartyA": phone,
			"PartyB": SHORTCODE,
			"PhoneNumber": phone,
			"CallBackURL": os.getenv("callback_url"),
			"AccountReference": order_id,
			"TransactionDesc": "FoodLink payment"
             }

	response = requests.post(f"{BASE_URL}/mpesa/stkpush/v1/processrequest",json=payload,headers=headers)
	
	print("STK:", response.status_code, response.text)

	response.raise_for_status()

	return response.json()
	
def handle_mpesa_callback(data):
	callback = data["Body"]["stkCallback"]
	result_code = callback["ResultCode"]
	checkout_request_id = callback["CheckoutRequestID"]

	if result_code == 0:
	# Payment successful
		return {"status": "success","checkout_request_id": checkout_request_id}
	else:
		# Payment failed/cancelled
		return {"status": "failed","checkout_request_id": checkout_request_id}

