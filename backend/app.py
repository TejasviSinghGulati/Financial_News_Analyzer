# backend/app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from core.agent_analyst import FinancialAnalystAgent

# Initialize Flask App and CORS
app = Flask(__name__)
CORS(app) # Allows your React frontend to communicate with this server

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

# Pre-initialize the agent so it's ready for requests
try:
    financial_agent = FinancialAnalystAgent()
    print("✅ Financial Analyst Agent initialized successfully.")
except Exception as e:
    print(f"🔥 Failed to initialize Financial Analyst Agent: {e}")
    financial_agent = None

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    API endpoint to receive a financial query and return a web-powered analysis.
    """
    if not financial_agent:
        return jsonify({"error": "Financial agent is not available. Check server logs."}), 500

    # Get the JSON data from the request
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Invalid request: 'query' field is required."}), 400

    user_query = data.get('query')
    # The 'profile' is now used to provide context to the agent
    user_profile = data.get('profile', 'a retail investor') # Default profile if not provided

    print(f"\n🚀 Received query: '{user_query}' with profile: '{user_profile}'")

    try:
        # Run the agent with both the query and the profile context
        result = financial_agent.run_analysis(user_query, user_profile)
        return jsonify(result)
    except Exception as e:
        print(f"🔥 Error during analysis: {e}")
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500

if __name__ == '__main__':
    # Makes the app accessible on your local network
    app.run(host='0.0.0.0', port=5000, debug=True)