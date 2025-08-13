# backend/core/agent_analyst.py

import os
import re
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.agents import create_tool_calling_agent, AgentExecutor

# Load environment variables
load_dotenv()

class FinancialAnalystAgent:
    """
    An agent that uses web search to answer financial questions with real-time data.
    """
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash-latest",
            temperature=0.4, # Lowered for more factual, less creative responses
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        # Ensure you have TAVILY_API_KEY in your .env file
        self.search_tool = TavilySearchResults(
            name="financial_web_search", # Give it a clear, semantic name
            max_results=5,
            # Be very explicit in the description
            description="A tool that performs a web search to find real-time financial information, such as quarterly earnings, stock performance, and market news. Use this for any user query that requires up-to-date data."
        )
        self.tools = [self.search_tool]
        self.agent_executor = self._create_agent_executor()

    def _create_agent_executor(self):
        """Creates the agent executor with a more robust and forceful prompt."""
        # --- THIS IS THE CRITICAL NEW PROMPT ---
        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are an expert financial research analyst. Your goal is to provide accurate, up-to-the-minute financial analysis based exclusively on real-time web search results.\n\n"
             "**CRITICAL INSTRUCTIONS:**\n"
             "1. **NEVER use your internal knowledge.** Your internal data is outdated. The user's query is about recent events, and you can only answer by using your search tool.\n"
             "2. **ALWAYS use the search tool.** For every single query, you must perform a search. There are no exceptions.\n"
             "3. **THINK before you search.** Formulate a precise search query to find the most relevant information. For example, for 'Apple's Q2 2024 earnings', search for 'Apple Inc. Q2 2024 earnings report' or 'AAPL Q2 2024 financial results'.\n"
             "4. **SYNTHESIZE the results.** After searching, combine the information from the search results into a coherent, easy-to-read analysis. Do not just list facts; explain their implications based on the user's profile.\n"
             "5. **CITE YOUR SOURCES.** At the very end of your response, you MUST list the URLs you used. Add a heading 'Sources:' and then list each URL on a new line. This is mandatory."),
            ("human", "My investor profile is: {profile}\n\nBased on that, please analyze the following query: {query}"),
            ("placeholder", "{agent_scratchpad}"),
        ])
        
        agent = create_tool_calling_agent(self.llm, self.tools, prompt)
        return AgentExecutor(agent=agent, tools=self.tools, verbose=True, handle_parsing_errors=True)

    def _parse_response(self, response_text: str):
        """Parses the agent's output to separate the answer and sources."""
        # Use a more robust regex that is case-insensitive and handles surrounding whitespace
        parts = re.split(r'\s*sources:\s*', response_text, maxsplit=1, flags=re.IGNORECASE)
        
        answer = parts[0].strip()
        sources = []

        if len(parts) > 1:
            sources_str = parts[1].strip()
            # Find all http/https URLs in the sources block
            sources = re.findall(r'https?://\S+', sources_str)
        
        # If the main answer still contains source links, it means the agent didn't format correctly.
        # We can try to clean it up.
        if not sources:
            found_urls = re.findall(r'https?://\S+', answer)
            if found_urls:
                sources = found_urls
                # Remove the found URLs from the answer for a cleaner display
                for url in found_urls:
                    answer = answer.replace(url, '')
                answer = answer.strip()
        
        return {"answer": answer, "sources": sources}

    def run_analysis(self, user_query: str, user_profile: str) -> dict:
        """Runs the agent with both the user's query and their investment profile."""
        print(f"\n--- Running Agent for Query: '{user_query}' ---")
        
        try:
            response = self.agent_executor.invoke({
                "query": user_query,
                "profile": user_profile
            })
            return self._parse_response(response['output'])
        except Exception as e:
            print(f"AGENT ERROR: {e}")
            return {"answer": f"An error occurred during analysis: {e}", "sources": []}