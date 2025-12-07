from fastapi import FastAPI, HTTPException, Request, status, Depends, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, List, Literal, Any
import os
from google import genai
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta
from jose import JWTError, jwt
from collections import defaultdict

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Paisa Ko Sahayogi API", version="1.0.0")

# CORS configuration - allows all origins by default for easy deployment
# To restrict in production, set ALLOWED_ORIGINS environment variable (comma-separated)
cors_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if cors_origins_env == "*":
    cors_origins = ["*"]
else:
    cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Provide clearer error messages for validation errors"""
    errors = exc.errors()
    error_details = []
    
    for error in errors:
        error_info = {
            "field": ".".join(str(loc) for loc in error.get("loc", [])),
            "message": error.get("msg", "Validation error"),
            "type": error.get("type", "unknown")
        }
        
        # Add context if available
        if "ctx" in error:
            error_info["context"] = error["ctx"]
        
        # Special handling for JSON decode errors
        if error.get("type") == "json_invalid":
            error_info["message"] = "Invalid JSON in request body. Please check your JSON format."
            if "ctx" in error and "error" in error["ctx"]:
                ctx_error = error["ctx"]["error"]
                error_info["message"] += f" Error: {ctx_error}"
                
                # Provide specific guidance for common errors
                if "Extra data" in str(ctx_error):
                    error_info["message"] += " This usually means there's extra content after a valid JSON object. Make sure you're sending only one JSON object and no trailing characters."
                elif "Expecting" in str(ctx_error):
                    error_info["message"] += " The JSON structure is invalid. Please check for missing commas, brackets, or quotes."
        
        error_details.append(error_info)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": error_details,
            "message": "Request validation failed. Please check your request body format."
        }
    )

# Get Gemini API key from environment
gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()
if not gemini_api_key:
    raise ValueError(
        "GEMINI_API_KEY environment variable is not set. "
        "Please set it before running the application."
    )

# Initialize Gemini client (will use GEMINI_API_KEY from environment)
client = genai.Client(api_key=gemini_api_key)

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
if SECRET_KEY == "your-secret-key-change-in-production":
    import warnings
    warnings.warn(
        "WARNING: Using default JWT_SECRET_KEY. Set JWT_SECRET_KEY environment variable for production!",
        UserWarning
    )
ALGORITHM = "HS256"
security = HTTPBearer()

CategoryType = Literal["buy", "loan", "tax", "big-goal", "festival", "reduce-expense", "invest", "side-income"]
ResponseMode = Literal["simple", "indepth"]

class AdviceRequest(BaseModel):
    category: CategoryType
    message: str
    monthly_income_npr: float
    monthly_expenses_npr: Dict[str, float] = Field(
        ...,
        description="Monthly expenses breakdown as a dictionary. Example: {'food': 15000, 'rent': 10000, 'transport': 5000}",
        examples=[{"food": 15000, "rent": 10000, "transport": 5000}]
    )
    current_savings_npr: float = 0.0
    location: str = "kathmandu"
    extra_profile: Optional[Dict[str, Any]] = None
    # Premium features
    mode: ResponseMode = "simple"
    is_premium: bool = False
    user_id: Optional[str] = None
    
    @field_validator('monthly_expenses_npr')
    @classmethod
    def validate_monthly_expenses_npr(cls, v):
        """Validate monthly_expenses_npr is not empty"""
        if not isinstance(v, dict):
            raise ValueError("monthly_expenses_npr must be a dictionary/object")
        if len(v) == 0:
            raise ValueError("monthly_expenses_npr cannot be empty. Provide at least one expense category like {'food': 15000}")
        return v

class Alternative(BaseModel):
    name: str
    price_npr: int
    months_needed: int

class InvestmentSimulation(BaseModel):
    month: int
    total_value: float
    fd_value: float
    shares_value: float
    mutual_funds_value: float
    gold_value: float
    company_investment_value: Optional[float] = None
    startup_value: Optional[float] = None

class FeedbackRequest(BaseModel):
    user_id: str
    month: str  # Format: "YYYY-MM"
    expenses: Dict[str, float]

class RightWrongItem(BaseModel):
    title: str
    amount: float
    description: str
    solution: Optional[str] = None  # Blurred for free users

class FeedbackResponse(BaseModel):
    month: str
    total_expenses: float
    rights: List[RightWrongItem]
    wrongs: List[RightWrongItem]
    suggestions: List[str]
    is_premium: bool

class VisualizationInfo(BaseModel):
    chart_type: str  # "bar", "pie", "line"
    description: str
    data: Dict[str, Any]

class AdviceResponse(BaseModel):
    response_np: str
    response_en: str
    months_needed: int
    target_amount_npr: int
    realistic_monthly_savings_npr: int
    progress_percent: int
    tips: List[str]
    alternatives: List[Alternative]
    # Premium features
    visualization: Optional[VisualizationInfo] = None
    simulation: Optional[List[InvestmentSimulation]] = None
    is_premium: bool = False

# Helper functions
def get_user_from_token(token: str) -> Optional[Dict]:
    """Decode JWT token and return user info"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict]:
    """Get current user from JWT token"""
    token = credentials.credentials
    return get_user_from_token(token)

# Premium and user tracking features removed (previously required Supabase)
# All users now have unlimited access to all features

SYSTEM_PROMPTS = {
    "buy": """You are "Paisa Ko Sahayogi" - Nepal's smartest personal finance advisor for buying decisions (bikes, phones, gold, laptops, gadgets, etc.).

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You have live web search to get current Nepal prices.

When user wants to buy something:
1. Calculate realistic monthly savings = (income - total_expenses) × 0.85 (15% Nepal buffer for inflation/festivals/emergencies)
2. Search current 2025 Nepal market prices for the item
3. Calculate months_needed = target_price / realistic_monthly_savings
4. Calculate progress_percent = (current_savings / target_price) × 100
5. Give 3-5 practical tips for saving faster (specific to Nepal context)
6. Suggest 2-3 alternatives with different price points

Always respond ONLY with valid JSON using this exact structure. All responses must be in English:
{
  "response_np": "English answer explaining the buying plan, timeline, and advice",
  "response_en": "English answer with the same content",
  "months_needed": calculated integer,
  "target_amount_npr": item price in NPR,
  "realistic_monthly_savings_npr": calculated amount,
  "progress_percent": calculated percentage,
  "tips": ["tip 1 specific to Nepal", "tip 2", "tip 3"],
  "alternatives": [{"name": "alternative item name", "price_npr": price, "months_needed": calculated}]
}

Be encouraging, realistic, and specific to Nepal's economy and culture.""",

    "loan": """You are "Paisa Ko Sahayogi" - Nepal's smartest personal finance advisor for loan and EMI management.

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help with home loans, personal loans, vehicle loans, EMI optimization.

When user asks about loans:
1. Calculate realistic monthly savings = (income - total_expenses) × 0.85
2. Analyze their EMI capacity (typically 40-50% of monthly savings)
3. Search current Nepal bank interest rates (2025)
4. Calculate total interest, EMI amounts, loan tenure options
5. Give practical tips for faster repayment or better loan terms
6. Suggest alternatives (different banks, loan amounts, tenures)

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English loan advice",
  "response_en": "English loan guidance",
  "months_needed": loan tenure in months,
  "target_amount_npr": loan amount,
  "realistic_monthly_savings_npr": available for EMI,
  "progress_percent": down-payment progress if applicable,
  "tips": ["Nepal-specific loan tips"],
  "alternatives": [{"name": "bank/option name", "price_npr": EMI amount, "months_needed": tenure}]
}""",

    "tax": """You are "Paisa Ko Sahayogi" - Nepal's smartest tax saving advisor.

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help save tax through SSF, CIT, 1% SST, education deductions, green deductions.

When user asks about tax:
1. Calculate realistic monthly savings = (income - total_expenses) × 0.85
2. Analyze their tax bracket based on Nepal's 2025 tax slabs
3. Calculate potential tax savings from SSF (up to NPR 500,000), CIT, 1% SST
4. Recommend optimal investment mix for tax benefits
5. Calculate how much to invest monthly for maximum tax benefit
6. Give tips on education, health insurance, green investment deductions

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English tax advice",
  "response_en": "English tax guidance",
  "months_needed": 12 (annual planning),
  "target_amount_npr": total tax-saving investment recommended,
  "realistic_monthly_savings_npr": amount available,
  "progress_percent": current progress toward tax-saving goal,
  "tips": ["Nepal tax tips for 2025"],
  "alternatives": [{"name": "SSF/CIT/other option", "price_npr": investment amount, "months_needed": 12}]
}""",

    "big-goal": """You are "Paisa Ko Sahayogi" - Nepal's smartest advisor for big life goals (house down-payment, foreign study/work, wedding).

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help plan major financial milestones.

When user has a big goal:
1. Calculate realistic monthly savings = (income - total_expenses) × 0.85
2. Search current 2025 costs in Nepal (e.g., USA study visa, Australia PR, average wedding, house down-payment in their location)
3. Calculate timeline to reach goal
4. Break down goal into smaller milestones
5. Suggest investment strategies (FD, mutual funds, shares) to grow money faster
6. Give motivation and practical tips

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English big goal planning",
  "response_en": "English goal guidance",
  "months_needed": timeline to achieve,
  "target_amount_npr": total goal amount,
  "realistic_monthly_savings_npr": monthly saving capacity,
  "progress_percent": current progress,
  "tips": ["Nepal-specific tips for this goal"],
  "alternatives": [{"name": "alternative approach/destination", "price_npr": cost, "months_needed": timeline}]
}""",

    "festival": """You are "Paisa Ko Sahayogi" - Nepal's smartest advisor for festival and emergency budgeting.

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help plan for Dashain, Tihar, medical emergencies, family events.

When user needs festival/emergency budget:
1. Calculate realistic monthly savings = (income - total_expenses) × 0.85
2. Estimate typical costs for upcoming festivals in Nepal (Dashain expenses, Tihar, weddings, medical buffer)
3. Create savings timeline before next major festival
4. Build emergency fund (3-6 months expenses recommended)
5. Give tips on smart festival spending without debt
6. Suggest where to cut costs

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English festival/emergency budget advice",
  "response_en": "English guidance",
  "months_needed": months until festival/goal,
  "target_amount_npr": festival/emergency fund target,
  "realistic_monthly_savings_npr": monthly saving capacity,
  "progress_percent": current fund progress,
  "tips": ["Nepal festival budgeting tips"],
  "alternatives": [{"name": "different budget approach", "price_npr": amount, "months_needed": timeline}]
}""",

    "reduce-expense": """You are "Paisa Ko Sahayogi" - Nepal's smartest expense reduction advisor.

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help cut monthly costs and optimize spending.

When user wants to reduce expenses:
1. Analyze their monthly_expenses_npr breakdown
2. Identify top 3 areas to cut (food, transport, entertainment, subscriptions)
3. Calculate potential savings per category
4. Give Nepal-specific tips (public transport vs taxi, local vs imported, home cooking, etc.)
5. Show monthly savings increase and annual impact
6. Suggest free/cheap alternatives for entertainment, food, transport

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English expense reduction advice",
  "response_en": "English cost-cutting guidance",
  "months_needed": 3 (habit building period),
  "target_amount_npr": total potential annual savings,
  "realistic_monthly_savings_npr": new monthly savings after cuts,
  "progress_percent": 0 (starting point),
  "tips": ["Nepal-specific expense reduction tips"],
  "alternatives": [{"name": "expense category to reduce", "price_npr": potential monthly saving, "months_needed": 12}]
}""",

    "invest": """You are "Paisa Ko Sahayogi" - Nepal's smartest investment advisor.

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help grow money through FD, shares (NEPSE), gold, mutual funds, crypto.

Current Nepal Market Rates (December 2025):
- NEPSE Index: ~2631
- Gold (24k): ~NPR 1,540,000 per tola
- FD Rates: 5-7% per annum
- Mutual Funds (SPI): ~9% annual return
- Company Investment: ~10% annual return
- Startup Investment: ~15% annual return (high risk)

When user wants to invest:
1. Calculate realistic monthly savings = (income - total_expenses) × 0.85
2. Recommend portfolio mix based on risk tolerance and timeline
3. Calculate expected returns for different investment options
4. Give Nepal-specific investment tips (NEPSE trends, best banks, gold buying timing)
5. Warn about risks and diversification
6. If user provides salary, insurance cost, share holdings, create a 12-month investment simulation with monthly projections

For investment simulation (premium feature):
- Calculate monthly contributions to each asset class
- Project growth using compound interest: A = P(1 + r/n)^(nt)
- FD: 6% annual (0.5% monthly)
- Shares (NEPSE): 12% annual (1% monthly, with volatility)
- Mutual Funds: 9% annual (0.75% monthly)
- Gold: 8% annual (0.67% monthly)
- Company Investment: 10% annual (0.83% monthly)
- Startup: 15% annual (1.25% monthly, high risk)

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English investment advice",
  "response_en": "English investment guidance",
  "months_needed": investment timeline (12-60 months typical),
  "target_amount_npr": investment goal,
  "realistic_monthly_savings_npr": monthly investment capacity,
  "progress_percent": current portfolio progress,
  "tips": ["Nepal investment tips for 2025"],
  "alternatives": [{"name": "FD/shares/gold/mutual fund option", "price_npr": monthly investment, "months_needed": timeline}],
  "simulation": [{"month": 1, "total_value": amount, "fd_value": amount, "shares_value": amount, "mutual_funds_value": amount, "gold_value": amount, "company_investment_value": amount, "startup_value": amount}, ...] (12 months if simulation requested)
}""",

    "side-income": """You are "Paisa Ko Sahayogi" - Nepal's smartest side income advisor.

IMPORTANT: All your responses must be in English only. Do not use Nepali language, Nepali words, or Nepali greetings (like "Namaste" or "Jay Hos"). Use only English throughout.

Today is December 2025. You help find extra cash through freelancing, part-time work, passive income.

When user wants side income:
1. Analyze their skills, time availability, location
2. Suggest Nepal-realistic side income ideas (online freelancing, tutoring, small business, rental income, YouTube, social media, part-time jobs)
3. Calculate potential monthly earnings for each option
4. Give practical steps to start
5. Mention required investment (if any) and timeline to first income
6. Provide tips on managing side income with main job

Respond ONLY with valid JSON. All responses must be in English:
{
  "response_np": "English side income advice",
  "response_en": "English extra cash guidance",
  "months_needed": time to establish income stream,
  "target_amount_npr": monthly side income goal,
  "realistic_monthly_savings_npr": current savings capacity,
  "progress_percent": 0 (starting point),
  "tips": ["Nepal-specific side income tips"],
  "alternatives": [{"name": "side income idea", "price_npr": potential monthly earnings, "months_needed": timeline to start}]
}"""
}

@app.get("/")
def read_root():
    return {"message": "Paisa Ko Sahayogi API - Nepal's Smartest Finance Advisor", "version": "1.0.0"}

@app.post("/api/v1/advice", response_model=AdviceResponse)
async def get_advice(request: AdviceRequest):
    try:
        # Validate request was parsed correctly
        if not request:
            raise HTTPException(status_code=422, detail="Invalid request body")
        
        # Premium status - all users have full access
        is_premium = True  # All features available to all users
        
        system_prompt = SYSTEM_PROMPTS.get(request.category)
        if not system_prompt:
            raise HTTPException(status_code=400, detail="Invalid category")
        
        total_expenses = sum(request.monthly_expenses_npr.values())
        realistic_savings = (request.monthly_income_npr - total_expenses) * 0.85
        
        # Past data feature removed (previously required Supabase)
        past_data = {}
        
        # Determine response length based on mode
        word_limit = 100 if request.mode == "simple" else 300
        
        # Build personalized context
        past_context = ""
        if past_data.get("last_month_expenses"):
            expenses = past_data["last_month_expenses"]
            if isinstance(expenses, list) and len(expenses) > 0:
                expenses_dict = expenses[0].get("expenses", {})
                if expenses_dict:
                    total_past = sum(expenses_dict.values())
                    past_context = f"\nPast Month Data:\n- Last month total expenses: NPR {total_past:,.2f}\n"
                    # Add specific savings highlights
                    if "food" in expenses_dict:
                        past_context += f"- Last month food expenses: NPR {expenses_dict.get('food', 0):,.2f}\n"
        
        user_context = f"""
User Profile:
- Category: {request.category}
- Monthly Income: NPR {request.monthly_income_npr:,.2f}
- Monthly Expenses: NPR {total_expenses:,.2f}
  Breakdown: {json.dumps(request.monthly_expenses_npr, indent=2)}
- Current Savings: NPR {request.current_savings_npr:,.2f}
- Location: {request.location}
- Realistic Monthly Savings (after 15% Nepal buffer): NPR {realistic_savings:,.2f}
{past_context}
User Message: {request.message}

{f"Additional Profile: {json.dumps(request.extra_profile)}" if request.extra_profile else ""}

Response Requirements:
- Mode: {request.mode} ({word_limit} words maximum for simple, 300 words for in-depth)
- Premium User: {is_premium}

Provide complete financial advice in valid JSON format only. No markdown, no extra text.

CRITICAL: All text must be in English only. Do not use any Nepali words, greetings, or phrases. Use English throughout.
"""
        
        full_prompt = f"{system_prompt}\n\n{user_context}"
        
        # Use Gemini API to generate content
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        
        content = response.text
        
        # Extract JSON from markdown code blocks if present
        if "```json" in content:
            start = content.find("```json") + 7
            end = content.find("```", start)
            content = content[start:end].strip()
        elif "```" in content:
            start = content.find("```") + 3
            end = content.find("```", start)
            content = content[start:end].strip()
        
        # Extract JSON object if surrounded by other text
        if '{' in content and '}' in content:
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            content = content[start_idx:end_idx]
        
        advice_data = json.loads(content)
        
        # Ensure integer fields are integers (handle float values from AI)
        if "progress_percent" in advice_data:
            advice_data["progress_percent"] = int(round(advice_data["progress_percent"]))
        if "months_needed" in advice_data:
            advice_data["months_needed"] = int(round(advice_data["months_needed"]))
        if "target_amount_npr" in advice_data:
            advice_data["target_amount_npr"] = int(round(advice_data["target_amount_npr"]))
        if "realistic_monthly_savings_npr" in advice_data:
            advice_data["realistic_monthly_savings_npr"] = int(round(advice_data["realistic_monthly_savings_npr"]))
        
        # Ensure alternatives have integer fields
        if "alternatives" in advice_data:
            for alt in advice_data["alternatives"]:
                if "price_npr" in alt:
                    alt["price_npr"] = int(round(alt["price_npr"]))
                if "months_needed" in alt:
                    alt["months_needed"] = int(round(alt["months_needed"]))
        
        # Add visualization for simple mode
        visualization = None
        if request.mode == "simple":
            chart_data = {
                "progress": advice_data.get("progress_percent", 0),
                "target": advice_data.get("target_amount_npr", 0),
                "current": request.current_savings_npr,
                "monthly_savings": advice_data.get("realistic_monthly_savings_npr", 0)
            }
            visualization = {
                "chart_type": "bar",
                "description": f"Progress: {advice_data.get('progress_percent', 0)}% towards goal of NPR {advice_data.get('target_amount_npr', 0):,}",
                "data": chart_data
            }
        
        # Handle premium blurring for tips
        if not is_premium and len(advice_data.get("tips", [])) > 3:
            # Keep only first 3 tips, blur the rest
            advice_data["tips"] = advice_data["tips"][:3]
            advice_data["tips"].append("🔒 Upgrade to premium to see more tips and solutions!")
        
        # Handle simulation for invest category
        simulation = None
        if request.category == "invest" and is_premium and "simulation" in advice_data:
            simulation = advice_data["simulation"]
        elif request.category == "invest" and not is_premium:
            # Add blurred simulation teaser
            advice_data["tips"].append("🔒 Upgrade to premium to see 12-month investment simulation!")
        
        # Add premium flag
        advice_data["is_premium"] = is_premium
        if visualization:
            advice_data["visualization"] = visualization
        if simulation:
            advice_data["simulation"] = simulation
        
        return AdviceResponse(**advice_data)
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Response content: {content if 'content' in locals() else 'No content'}")
        raise HTTPException(status_code=500, detail=f"Invalid JSON response from AI: {str(e)}")
    except Exception as e:
        error_msg = str(e)
        print(f"General Error: {e}")
        import traceback
        traceback.print_exc()
        
        # Check for API key related errors
        if "API key" in error_msg or "authentication" in error_msg.lower() or "unauthorized" in error_msg.lower():
            raise HTTPException(
                status_code=500, 
                detail="GEMINI_API_KEY environment variable is not set or is invalid. Please set it before making requests."
            )
        
        raise HTTPException(status_code=500, detail=f"Error generating advice: {error_msg}")

@app.post("/api/v1/feedback", response_model=FeedbackResponse)
async def get_feedback(request: FeedbackRequest):
    """Monthly feedback on past expenditures"""
    try:
        # All users have access to feedback feature
        is_premium = True
        
        total_expenses = sum(request.expenses.values())
        
        # Analyze expenses using AI
        expense_analysis_prompt = f"""You are "Paisa Ko Sahayogi" - Nepal's smartest expense analyzer.

Analyze the following monthly expenses for {request.month}:
{json.dumps(request.expenses, indent=2)}
Total: NPR {total_expenses:,.2f}

Provide feedback in JSON format:
{{
  "rights": [
    {{"title": "What they did right", "amount": saved_amount, "description": "explanation", "solution": "how to continue"}},
    ... (3-5 items)
  ],
  "wrongs": [
    {{"title": "What they did wrong", "amount": wasted_amount, "description": "explanation", "solution": "how to fix"}},
    ... (3-5 items)
  ],
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}}

Focus on Nepal-specific context. Be encouraging but honest. All text in English only."""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=expense_analysis_prompt
        )
        
        content = response.text
        
        # Extract JSON
        if "```json" in content:
            start = content.find("```json") + 7
            end = content.find("```", start)
            content = content[start:end].strip()
        elif "```" in content:
            start = content.find("```") + 3
            end = content.find("```", start)
            content = content[start:end].strip()
        
        if '{' in content and '}' in content:
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            content = content[start_idx:end_idx]
        
        analysis_data = json.loads(content)
        
        # Handle premium blurring
        rights = analysis_data.get("rights", [])[:3] if not is_premium else analysis_data.get("rights", [])
        wrongs = analysis_data.get("wrongs", [])[:3] if not is_premium else analysis_data.get("wrongs", [])
        
        # Blur solutions for free users
        if not is_premium:
            for item in rights + wrongs:
                if "solution" in item:
                    item["solution"] = "🔒 Upgrade to premium to see solutions!"
        
        # Add premium teaser if free user
        if not is_premium and len(analysis_data.get("rights", [])) > 3:
            wrongs.append({
                "title": "More insights available",
                "amount": 0,
                "description": "🔒 Upgrade to premium to see all 5 rights and wrongs with detailed solutions!",
                "solution": None
            })
        
        return FeedbackResponse(
            month=request.month,
            total_expenses=total_expenses,
            rights=rights,
            wrongs=wrongs,
            suggestions=analysis_data.get("suggestions", [])[:3] if not is_premium else analysis_data.get("suggestions", []),
            is_premium=is_premium
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Feedback Error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating feedback: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
