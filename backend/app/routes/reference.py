from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import ReferenceData
from app.schemas import UserResponse

router = APIRouter(
    prefix="/api/reference",
    tags=["reference"]
)

@router.get("/", response_model=Dict[str, Any])
def get_all_reference_data(db: Session = Depends(get_db)):
    """
    Get all reference data grouped by category.
    Returns: { "Allergies": [...], "Medications": [...], "Conditions": [...] }
    """
    references = db.query(ReferenceData).all()
    
    result = {
        "Allergies": [],
        "Medications": [],
        "Conditions": []
    }
    
    # Initialize structured allergens with subcategories if needed, 
    # but frontend expects flat list or categoriezed list.
    # Let's return a structure flexible for frontend.
    
    for ref in references:
        item = ref.to_dict()
        if ref.category == "Allergies":
            result["Allergies"].append(item)
        elif ref.category == "Medications":
            result["Medications"].append(item)
        elif ref.category == "Conditions":
            result["Conditions"].append(item)
            
    return result

@router.get("/search", response_model=Dict[str, List[Dict[str, Any]]])
def search_references(
    q: str = "",
    category: str = None,
    db: Session = Depends(get_db)
):
    """
    Search reference data.
    q: Search query (matches name or subcategory)
    category: Optional filter (Allergies, Medications, Conditions)
    """
    # Base query
    query = db.query(ReferenceData)
    
    # Filter by category if provided
    if category:
        query = query.filter(ReferenceData.category == category)
        
    # Filter by search string (name or subcategory) if query provided
    if q.strip():
        search_term = f"%{q}%"
        query = query.filter(
            (ReferenceData.name.ilike(search_term)) | 
            (ReferenceData.subcategory.ilike(search_term))
        )
    
    # Limit results
    results = query.limit(20).all()
    
    # Group results
    grouped = {}
    
    for item in results:
        group_key = item.subcategory if item.subcategory else item.category
        if not group_key:
            group_key = "General"
            
        if group_key not in grouped:
            grouped[group_key] = []
            
        grouped[group_key].append(item.to_dict())
        
    return grouped

def populate_reference_data(db: Session):
    """
    Core seeding logic that can be called from endpoint or startup.
    """
    if db.query(ReferenceData).first():
        return {"message": "Reference data already seeded"}
        
    initial_data = [
        # Allergies - Medications
        {"category": "Allergies", "subcategory": "Medications", "name": "Penicillin"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Amoxicillin"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Aspirin"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Ibuprofen"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Naproxen"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Sulfa Drugs"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Codeine"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Morphine"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Latex"},
        {"category": "Allergies", "subcategory": "Medications", "name": "Contrast Dye"},
        
        # Allergies - Foods
        {"category": "Allergies", "subcategory": "Foods", "name": "Peanuts"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Tree Nuts"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Shellfish"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Fish"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Milk"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Eggs"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Soy"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Wheat"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Sesame"},
        {"category": "Allergies", "subcategory": "Foods", "name": "Corn"},
        
        # Allergies - Environmental
        {"category": "Allergies", "subcategory": "Environmental", "name": "Pollen"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Dust Mites"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Mold"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Pet Dander"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Bee Stings"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Wasp Stings"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Cockroaches"},
        {"category": "Allergies", "subcategory": "Environmental", "name": "Grass"},
        
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
        {"category": "Medications", "name": "Albuterol"},
        {"category": "Medications", "name": "Gabapentin"},
        {"category": "Medications", "name": "Hydrochlorothiazide"},
        {"category": "Medications", "name": "Losartan"},
        {"category": "Medications", "name": "Atorvastatin"},
        
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
        {"category": "Conditions", "name": "Kidney Disease"},
        {"category": "Conditions", "name": "Liver Disease"},
        {"category": "Conditions", "name": "Stroke"},
        {"category": "Conditions", "name": "Heart Attack History"},
    ]
    
    for item in initial_data:
        db_item = ReferenceData(**item)
        db.add(db_item)
    
    db.commit()
    return {"message": "Reference data seeded successfully", "count": len(initial_data)}

@router.post("/seed", status_code=status.HTTP_201_CREATED)
def seed_reference_data(db: Session = Depends(get_db)):
    """
    Seed initial reference data.
    """
    return populate_reference_data(db)
