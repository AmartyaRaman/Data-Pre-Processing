import uvicorn

def main():
    # Run the app using uvicorn correctly
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    main()
