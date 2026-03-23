"""
Dataset Splitting Tool
======================
Splits PlantVillage dataset into train/val/test sets

Usage:
    python split_dataset.py
"""

import os
import shutil
from sklearn.model_selection import train_test_split
import random

def split_dataset(source_dir, dest_base_dir, train_ratio=0.7, val_ratio=0.15):
    """
    Split dataset into train/val/test sets
    
    Args:
        source_dir: Path to original dataset (e.g., dataset/PlantVillage/original)
        dest_base_dir: Base path for split dataset (e.g., dataset/PlantVillage)
        train_ratio: Percentage for training (0.7 = 70%)
        val_ratio: Percentage for validation (0.15 = 15%)
    """
    
    print("="*70)
    print("DATASET SPLITTING TOOL")
    print("="*70)
    
    # Create destination directories
    train_dir = os.path.join(dest_base_dir, 'train')
    val_dir = os.path.join(dest_base_dir, 'val')
    test_dir = os.path.join(dest_base_dir, 'test')
    
    for directory in [train_dir, val_dir, test_dir]:
        os.makedirs(directory, exist_ok=True)
    
    # Get all class folders
    class_folders = [f for f in os.listdir(source_dir) 
                    if os.path.isdir(os.path.join(source_dir, f))]
    
    print(f"\nFound {len(class_folders)} disease classes")
    print(f"Split ratio: {train_ratio*100}% train, {val_ratio*100}% val, {(1-train_ratio-val_ratio)*100}% test\n")
    
    total_images = 0
    
    for class_name in class_folders:
        class_path = os.path.join(source_dir, class_name)
        
        # Get all images in this class
        images = [f for f in os.listdir(class_path) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        if len(images) == 0:
            print(f"⚠️  {class_name}: No images found, skipping")
            continue
        
        # Shuffle images
        random.shuffle(images)
        
        # Calculate split sizes
        train_size = int(len(images) * train_ratio)
        val_size = int(len(images) * val_ratio)
        
        # Split images
        train_images = images[:train_size]
        val_images = images[train_size:train_size + val_size]
        test_images = images[train_size + val_size:]
        
        # Create class directories in train/val/test
        for split_dir in [train_dir, val_dir, test_dir]:
            class_split_dir = os.path.join(split_dir, class_name)
            os.makedirs(class_split_dir, exist_ok=True)
        
        # Copy images to respective directories
        for img in train_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(train_dir, class_name, img)
            shutil.copy2(src, dst)
        
        for img in val_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(val_dir, class_name, img)
            shutil.copy2(src, dst)
        
        for img in test_images:
            src = os.path.join(class_path, img)
            dst = os.path.join(test_dir, class_name, img)
            shutil.copy2(src, dst)
        
        total_images += len(images)
        
        print(f"✓ {class_name:<40} {len(train_images):>5} train, {len(val_images):>4} val, {len(test_images):>4} test")
    
    print("\n" + "="*70)
    print("SPLIT COMPLETE!")
    print("="*70)
    print(f"\nTotal images: {total_images:,}")
    print(f"\nDataset ready at:")
    print(f"  - Train: {train_dir}")
    print(f"  - Val:   {val_dir}")
    print(f"  - Test:  {test_dir}")
    print("\nYou can now run: python train_disease_model.py")
    print("="*70)

if __name__ == "__main__":
    # Configure paths (change these to match your setup)
    SOURCE = 'dataset/PlantVillage/original'
    DESTINATION = 'dataset/PlantVillage'
    
    # Check if source exists
    if not os.path.exists(SOURCE):
        print(f"❌ Error: Source directory not found: {SOURCE}")
        print(f"\nPlease:")
        print(f"  1. Download PlantVillage dataset from Kaggle")
        print(f"     https://www.kaggle.com/emmarex/plantdisease")
        print(f"  2. Extract the downloaded ZIP file")
        print(f"  3. Move all disease folders to: {SOURCE}")
        print(f"     (Should contain folders like Apple___Apple_scab, etc.)")
        print(f"  4. Run this script again")
        exit(1)
    
    # Run split
    split_dataset(SOURCE, DESTINATION)
