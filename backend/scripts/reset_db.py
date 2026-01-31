import sys
import os

# Add the parent directory to sys.path to resolve app imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
# Import Base and models directly to ensure metadata is populated
from app.models import Base, User, Doctor, MedicalProfile, EmergencyContact, EmergencyAccess, ReferenceData

def reset_database():
    # Hardcoded URL to avoid pydantic-settings dependency
    DATABASE_URL = "postgresql://user:password@localhost:5432/crisislink"
    print(f"Resetting database at {DATABASE_URL}...")
    
    try:
        engine = create_engine(DATABASE_URL)
        
        # Drop all tables
        print("Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("All tables dropped.")

        # Create all tables
        print("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        print("All tables created successfully.")
        
    except Exception as e:
        print(f"Error resetting database: {e}")
        # If localhost fails, try 'postgres' host just in case (e.g. if running inside docker)
        if "localhost" in DATABASE_URL:
            try:
                print("Retrying with host 'postgres'...")
                DATABASE_URL = "postgresql://user:password@postgres:5432/crisislink"
                engine = create_engine(DATABASE_URL)
                Base.metadata.drop_all(bind=engine)
                Base.metadata.create_all(bind=engine)
                print("Success with host 'postgres'.")
            except Exception as e2:
                print(f"Retry failed: {e2}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--force":
        reset_database()
    else:
        confirm = input("This will DELETE ALL DATA. Are you sure? (y/n): ")
        if confirm.lower() == 'y':
            reset_database()
        else:
            print("Operation cancelled.")
