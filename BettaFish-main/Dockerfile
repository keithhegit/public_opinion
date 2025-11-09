FROM python:3.11-slim

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Prevent Python from writing .pyc files, buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/root/.local/bin:${PATH}" \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Install only essential system dependencies (reduced from full list)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgl1 \
    libglib2.0-0 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Install the latest uv release
RUN curl -LsSf --retry 3 --retry-delay 2 --proto '=https' --proto-redir '=https' --tlsv1.2 https://astral.sh/uv/install.sh | sh

WORKDIR /app

# Install Python dependencies first to leverage Docker layer caching
COPY requirements.txt ./
RUN uv pip install --system -r requirements.txt \
    && rm -rf /root/.cache/pip \
    && rm -rf /root/.cache/uv

# Install only Chromium browser (not all browsers) to save space
RUN python -m playwright install chromium \
    && python -m playwright install-deps chromium \
    && rm -rf /root/.cache/ms-playwright \
    || true

# Copy .env example
COPY .env.example .env

# Copy application source (excluding files in .dockerignore)
COPY . .

# Create runtime directories
RUN mkdir -p logs final_reports insight_engine_streamlit_reports media_engine_streamlit_reports query_engine_streamlit_reports

# Clean up unnecessary files
RUN find . -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null || true \
    && find . -type f -name "*.pyc" -delete \
    && find . -type f -name "*.pyo" -delete \
    && find . -type f -name "*.pyd" -delete \
    && rm -rf .git .gitmodules \
    && rm -rf tests/*.csv tests/*.ipynb \
    && rm -rf SentimentAnalysisModel/*/dataset/*.csv \
    && rm -rf SentimentAnalysisModel/*/model/*.pkl \
    && rm -rf SentimentAnalysisModel/*/model/*.pth \
    || true

EXPOSE 5000 8501 8502 8503

# Default command launches the Flask orchestrator
CMD ["python", "app.py"]
