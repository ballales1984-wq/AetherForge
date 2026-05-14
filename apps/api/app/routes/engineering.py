from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import math

router = APIRouter(prefix="/api/engineering", tags=["engineering"])

# Aerodynamics Models
class AeroInputs(BaseModel):
    velocity: float  # m/s
    air_density: float = 1.225  # kg/m^3 at sea level
    frontal_area: float  # m^2
    drag_coefficient: float  # Cd
    lift_coefficient: float  # Cl (negative for downforce)

class AeroOutputs(BaseModel):
    drag_force: float  # Newtons
    lift_force: float  # Newtons (negative = downforce)
    power_required: float  # Watts
    efficiency_ratio: float  # L/D ratio

# Weight Distribution Models
class WeightInputs(BaseModel):
    total_mass: float  # kg
    wheelbase: float  # m
    front_weight_percent: float  # % of total weight on front axle
    height_cog: float  # m (center of gravity height)

class WeightOutputs(BaseModel):
    front_weight: float  # kg
    rear_weight: float  # kg
    front_axle_load: float  # N
    rear_axle_load: float  # N
    weight_transfer: float  # kg (under 1g acceleration)

# Material Database (simplified)
class Material(BaseModel):
    name: str
    density: float  # kg/m^3
    young_modulus: float  # GPa
    yield_strength: float  # MPa
    cost_per_kg: float  # USD

# Predefined materials database
MATERIALS_DB = [
    Material(name="Aluminum 6061", density=2700, young_modulus=69, yield_strength=276, cost_per_kg=3.5),
    Material(name="Titanium Grade 5", density=4430, young_modulus=114, yield_strength=880, cost_per_kg=45.0),
    Material(name="Carbon Fiber", density=1600, young_modulus=230, yield_strength=600, cost_per_kg=25.0),
    Material(name="Steel 4130", density=7850, young_modulus=205, yield_strength=670, cost_per_kg=1.2),
    Material(name="Fiberglass", density=1800, young_modulus=25, yield_strength=150, cost_per_kg=2.0),
]

@router.post("/aerodynamics/calculate", response_model=AeroOutputs)
def calculate_aerodynamics(inputs: AeroInputs):
    """
    Calculate aerodynamic forces and power requirements
    Based on: F = 0.5 * ρ * v^2 * A * Cd/Cl
    Power = F * v
    """
    if inputs.velocity < 0:
        raise HTTPException(status_code=400, detail="Velocity cannot be negative")
    if inputs.frontal_area <= 0:
        raise HTTPException(status_code=400, detail="Frontal area must be positive")
    if inputs.air_density <= 0:
        raise HTTPException(status_code=400, detail="Air density must be positive")
    
    # Calculate forces
    dynamic_pressure = 0.5 * inputs.air_density * (inputs.velocity ** 2)
    drag_force = dynamic_pressure * inputs.frontal_area * inputs.drag_coefficient
    lift_force = dynamic_pressure * inputs.frontal_area * inputs.lift_coefficient
    
    # Power required to overcome drag
    power_required = drag_force * inputs.velocity
    
    # Lift-to-drag ratio (negative for downforce scenarios)
    efficiency_ratio = abs(inputs.lift_coefficient / inputs.drag_coefficient) if inputs.drag_coefficient != 0 else float('inf')
    
    return AeroOutputs(
        drag_force=drag_force,
        lift_force=lift_force,
        power_required=power_required,
        efficiency_ratio=efficiency_ratio
    )

@router.post("/weight/distribution", response_model=WeightOutputs)
def calculate_weight_distribution(inputs: WeightInputs):
    """
    Calculate weight distribution and load transfer
    """
    if inputs.total_mass <= 0:
        raise HTTPException(status_code=400, detail="Total mass must be positive")
    if inputs.wheelbase <= 0:
        raise HTTPException(status_code=400, detail="Wheelbase must be positive")
    if not 0 <= inputs.front_weight_percent <= 100:
        raise HTTPException(status_code=400, detail="Front weight percent must be between 0-100")
    if inputs.height_cog < 0:
        raise HTTPException(status_code=400, detail="CG height cannot be negative")
    
    # Static weight distribution
    front_weight = inputs.total_mass * (inputs.front_weight_percent / 100)
    rear_weight = inputs.total_mass - front_weight
    
    # Axle loads (force = mass * gravity)
    GRAVITY = 9.81
    front_axle_load = front_weight * GRAVITY
    rear_axle_load = rear_weight * GRAVITY
    
    # Weight transfer under 1g longitudinal acceleration
    # Transfer = (mass * height_cog * acceleration) / wheelbase
    weight_transfer = (inputs.total_mass * inputs.height_cog * 1.0) / inputs.wheelbase
    
    return WeightOutputs(
        front_weight=front_weight,
        rear_weight=rear_weight,
        front_axle_load=front_axle_load,
        rear_axle_load=rear_axle_load,
        weight_transfer=weight_transfer
    )

@router.get("/materials/", response_model=List[Material])
def get_materials():
    """Get all materials in the database"""
    return MATERIALS_DB

@router.get("/materials/{material_name}", response_model=Material)
def get_material(material_name: str):
    """Get a specific material by name"""
    for material in MATERIALS_DB:
        if material.name.lower() == material_name.lower():
            return material
    raise HTTPException(status_code=404, detail=f"Material '{material_name}' not found")

@router.post("/materials/compare")
def compare_materials(material_names: list[str]):
    """Compare multiple materials side by side"""
    results = []
    for name in material_names:
        material = next((m for m in MATERIALS_DB if m.name.lower() == name.lower()), None)
        if material:
            results.append(material)
        else:
            raise HTTPException(status_code=404, detail=f"Material '{name}' not found")
    return results