````markdown
# Financial Analyst AI Chatbot 📈

A sophisticated, full-stack web application featuring an AI-powered financial analyst. This tool leverages large language models and real-time web search to provide insightful, data-driven answers to your financial questions.

The backend is built with **Flask** and **LangChain**, using **Google's Gemini Pro** for reasoning and the **Tavily API** for up-to-date web searches. The frontend is a sleek, responsive chat interface built with **React** and **Vite**.

![Financial Analyst AI Chatbot](https://placehold.co/800x400/212121/e3e3e3?text=Financial+Analyst+AI)

---

## ✨ Features

* **🤖 Conversational AI:** Ask complex financial questions in natural language.
* **🌐 Web-Powered Analysis:** The AI agent performs real-time web searches to gather the latest information, ensuring your analysis is current.
* **🔗 Source Citation:** Every response includes a list of the web sources used for the analysis, promoting transparency and allowing for verification.
* **💻 Modern UI/UX:** A clean, dark-themed, and fully responsive chat interface designed for a seamless user experience.
* **🚀 Full-Stack Architecture:** A clear and robust separation between the Python/Flask backend API and the React/Vite frontend.

---

## 🛠️ Tech Stack

| Category    | Technology                                                                                                                                                                                               |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend** | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-008664?style=for-the-badge)       |
| **Frontend**| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) |
| **AI & Data** | ![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E77F0?style=for-the-badge) ![Tavily AI](https://img.shields.io/badge/Tavily_AI-E0462E?style=for-the-badge)                                     |

---

## ⚙️ Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

* **Python 3.8+**
* **Node.js v18.0+** and **npm**

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/financial-analyst-ai.git](https://github.com/your-username/financial-analyst-ai.git)
cd financial-analyst-ai
````

### 2\. Backend Setup

First, set up and run the Flask server.

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
.\venv\Scripts\activate

# Install the required Python packages
pip install -r requirements.txt
```

#### Environment Variables

The backend requires API keys for Google Gemini and Tavily Search.

1.  Create a new file named `.env` inside the `backend` directory.
2.  Obtain your API keys:
      * **Google Gemini:** Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
      * **Tavily Search:** Get your key from the [Tavily AI dashboard](https://app.tavily.com/).
3.  Replace the placeholder values in the `.env` file with your actual keys.

***File: `backend/.env`***

```
# .env

# Get your key from Google AI Studio: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"

# Get your key from Tavily AI: [https://app.tavily.com/](https://app.tavily.com/)
TAVILY_API_KEY="YOUR_TAVILY_API_KEY"
```

### 3\. Frontend Setup

In a **new terminal window**, set up and run the React client.

```bash
# Navigate to the frontend directory from the project root
cd frontend

# Install the required npm packages
npm install
```

### 4\. Run the Application

You need to have both the backend and frontend servers running simultaneously.

1.  **Start the Backend Server:**
    In your first terminal (in the `backend` directory with the virtual environment activated):

    ```bash
    python app.py
    ```

    The Flask server will start on `http://localhost:5000`.

2.  **Start the Frontend Server:**
    In your second terminal (in the `frontend` directory):

    ```bash
    npm run dev
    ```

    The Vite development server will start, typically on `http://localhost:5173`.

3.  **Access the Application:**
    Open your web browser and navigate to the address provided by the Vite server (e.g., `http://localhost:5173`). You can now start chatting with the AI\!

-----

## 📝 API Endpoint

The application uses a single API endpoint to handle analysis requests.

  * **Endpoint:** `POST /api/analyze`

  * **Description:** Receives a user's query and profile, processes it with the LangChain agent, and returns a structured analysis.

  * **Request Body (JSON):**

    ```json
    {
      "query": "What are the key takeaways from NVIDIA's latest earnings call?",
      "profile": "a venture capitalist focused on AI hardware"
    }
    ```

  * **Success Response (JSON):**

    ```json
    {
      "answer": "NVIDIA's latest earnings call highlighted strong demand for its data center GPUs... [full analysis here]",
      "sources": [
        "[https://nvidianews.nvidia.com/news/](https://nvidianews.nvidia.com/news/)...",
        "[https://www.reuters.com/technology/](https://www.reuters.com/technology/)..."
      ]
    }
    ```

<!-- end list -->

```
```