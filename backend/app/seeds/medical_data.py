from sqlalchemy.orm import Session
from app.models import ReferenceData, Base, User, MedicalProfile
from app.database import engine, SessionLocal
from app.routes.auth import hash_password
import uuid

# Init DB
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Clear existing data to avoid duplicates
    existing_count = db.query(ReferenceData).count()
    if existing_count == 0:
    
    data = [
        # Allergies - Medications
        {"category": "Allergies", "subcategory": "Medications", "name": "Penicillin"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Amoxicillin"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Aspirin"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Ibuprofen"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Sulfa Drugs"},
        
        # Allergies - Foods
        {"category": "Allergies", "subcategory": "Foods", "name": "Peanuts"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Tree Nuts"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Shellfish"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Fish"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Milk"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Eggs"},
        
        # Allergies - Environmental
        {"category": "Allergies", "subcategory": "Environmental", "name": "Pollen"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Dust Mites"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Mold"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Pet Dander"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Bee Stings"},
        
        # Medications
        {"category": "Medications", "name": "Aspirin"},
        {"category": "Medications", "name": "Ibuprofen"},
        {"category": "Medications", "name": "Acetaminophen"},
        {"category": "Medications", "name": "Metformin"},
        {"category": "Medications", "name": "Lisinopril"},
        {"category": "Medications", "name": "Amlodipine"},
        {"category": "Medications", "name": "Metoprolol"},
        {"category": "Medications", "name": "Omeprazole"},
        {"category": "Medications", "name": "Simvastatin"},
        {"category": "Medications", "name": "Levothyroxine"},

        # Conditions
        {"category": "Conditions", "name": "Diabetes"},
        {"category": "Conditions", "name": "Hypertension"},
        {"category": "Conditions", "name": "Asthma"},
        {"category": "Conditions", "name": "COPD"},
        {"category": "Conditions", "name": "Heart Disease"},
        {"category": "Conditions", "name": "Arthritis"},
        {"category": "Conditions", "name": "Depression"},
        {"category": "Conditions", "name": "Anxiety"},
        {"category": "Conditions", "name": "Epilepsy"},
        {"category": "Conditions", "name": "Cancer"},
    ]

        for item in data:
            db.add(ReferenceData(**item))
        print(f"Seeded {len(data)} reference items.")
    else:
        print(f"Reference data already exists ({existing_count} items).")
    demo_user = db.query(User).filter(User.email == "demo@crisislink.cv").first()
    if not demo_user:
        demo_user = User(
            id=str(uuid.uuid4()),
            username="demo",
            email="demo@crisislink.cv",
            hashed_password=hash_password("demo123"),
            user_type="patient"
        )
        db.add(demo_user)
        db.commit()
        print("Created demo user: demo@crisislink.cv / demo123")
    
    db.commit()
    print(f"Seeded {len(data)} reference items.")
    db.close()

if __name__ == "__main__":
    seed_data()
