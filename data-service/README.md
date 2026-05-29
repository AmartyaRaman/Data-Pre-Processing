# 🐍 Data Service Microservice

This is the Python-based data processing microservice for the Data Pre-Processor project. It is built with **FastAPI**, **Pandas**, **NumPy**, and **Scikit-Learn** to handle the heavy lifting of cleaning, encoding, and analyzing uploaded CSV datasets.

## 🚀 Quick Start

### 1. Prerequisites
- Python >= 3.13
- A package manager like `uv` (recommended) or standard `pip` + `venv`.

### 2. Install Dependencies
Using `uv`:
```bash
uv sync
```

Using virtualenv and pip:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Run the Service
```bash
# Using uv (defined in main.py)
uv run main.py

# Or directly running uvicorn
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
The microservice will be available at http://localhost:8000.

## 📊 Endpoints & Pipeline

- **`POST /data-service/process`**: Receives a CSV file and processes it.
  - Imputes missing values (median for numeric, mode/Unknown for categorical).
  - Removes duplicate rows.
  - Generates outlier reports using the Interquartile Range (IQR) method.
  - Performs Label Encoding for categorical columns and returns mapping dictionaries.
  - Computes descriptive statistics for cleaned numeric attributes.
  - Returns a preview (first 10 rows) and the full cleaned data payload in JSON format.

---

For full details on the system architecture, authentication gateway, database setup, and end-to-end integration, please refer to the **[Root Project README](../README.md)**.
