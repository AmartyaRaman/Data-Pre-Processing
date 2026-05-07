from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.process import router as process_router

app = FastAPI()

origins = [
  "*",
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Route for data processing
app.include_router(process_router, prefix="/data-service")

@app.get("/")
async def main():
  return {"message": "Welcome 8000 backend"}