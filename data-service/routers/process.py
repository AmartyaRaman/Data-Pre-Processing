from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

from services.preprocessing import preprocess_dataframe

router = APIRouter()


@router.post("/process")
async def process_file(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse CSV: {str(e)}")

    result = preprocess_dataframe(df)
    return result
