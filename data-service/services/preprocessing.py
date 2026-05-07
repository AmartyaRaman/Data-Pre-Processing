import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder


def preprocess_dataframe(df: pd.DataFrame) -> dict:
    """
    Runs a full preprocessing pipeline on the given DataFrame and returns
    a structured report with stats, issues found, and the cleaned data.
    """
    report = {}

    # Basic shape info 
    report["shape"] = {"rows": df.shape[0], "columns": df.shape[1]}
    report["columns"] = list(df.columns)

    # Missing value analysis 
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    report["missing_values"] = {
        col: {"count": int(missing[col]), "percent": float(missing_pct[col])}
        for col in df.columns
        if missing[col] > 0
    }

    # Handle missing values 
    for col in df.columns:
        if df[col].isnull().sum() == 0:
            continue

        if pd.api.types.is_numeric_dtype(df[col]):
            # Fill with median (robust to outliers)
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
        else:
            # Fill with mode (most frequent category)
            mode_val = df[col].mode()
            if not mode_val.empty:
                df[col] = df[col].fillna(mode_val[0])
            else:
                df[col] = df[col].fillna("Unknown")

    report["missing_handling"] = "Numeric columns filled with median; categorical with mode"

    # Duplicate detection & removal 
    duplicates_before = int(df.duplicated().sum())
    df.drop_duplicates(inplace=True)
    report["duplicates"] = {
        "found": duplicates_before,
        "removed": duplicates_before,
        "rows_after": len(df),
    }

    # Column type classification
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
    report["column_types"] = {
        "numeric": numeric_cols,
        "categorical": categorical_cols,
    }

    # Outlier detection (IQR method)
    outlier_report = {}
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        outliers = df[(df[col] < lower) | (df[col] > upper)]
        if len(outliers) > 0:
            outlier_report[col] = {
                "count": len(outliers),
                "lower_bound": round(float(lower), 4),
                "upper_bound": round(float(upper), 4),
            }
    report["outliers"] = outlier_report

    # Label encoding for categorical columns
    encoded_mappings = {}
    le = LabelEncoder()
    df_encoded = df.copy()
    for col in categorical_cols:
        df_encoded[col] = le.fit_transform(df_encoded[col].astype(str))
        encoded_mappings[col] = {
            str(cls): int(idx) for idx, cls in enumerate(le.classes_)
        }
    report["encoding_mappings"] = encoded_mappings

    # Summary statistics (on cleaned numeric data) 
    stats = df[numeric_cols].describe().round(4).to_dict() if numeric_cols else {}
    report["statistics"] = stats

    # Return preview of cleaned data (first 10 rows) 
    report["preview"] = df_encoded.head(10).to_dict(orient="records")
    report["cleaned_data"] = df_encoded.to_dict(orient="records")

    return report
