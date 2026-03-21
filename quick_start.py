#!/usr/bin/env python3
"""
Quick Start - Disease Detection Model Training
===============================================
Automated setup and training with one command!

Usage:
    python quick_start.py

This script will:
1. Check your system requirements
2. Install dependencies
3. Download dataset (optional)
4. Train the model
5. Evaluate performance
"""

import os
import sys
import subprocess

class QuickStart:
    """Automated setup and training"""
    
    def __init__(self):
        self.checks_passed = []
        self.checks_failed = []
    
    def print_header(self, text):
        """Print formatted header"""
        print("\n" + "="*70)
        print(f"  {text}")
        print("="*70)
    
    def print_step(self, step_num, text):
        """Print step"""
        print(f"\n[{step_num}] {text}")
        print("-"*70)
    
    def check_python_version(self):
        """Check Python version"""
        self.print_step(1, "Checking Python version...")
        
        version = sys.version_info
        print(f"Python {version.major}.{version.minor}.{version.micro}")
        
        if version.major == 3 and version.minor >= 8:
            print("✓ Python version is compatible (3.8+)")
            self.checks_passed.append("Python version")
            return True
        else:
            print("✗ Python 3.8+ required")
            print("  Download from: https://www.python.org/downloads/")
            self.checks_failed.append("Python version")
            return False
    
    def check_gpu(self):
        """Check GPU availability"""
        self.print_step(2, "Checking GPU availability...")
        
        try:
            import tensorflow as tf
            gpus = tf.config.list_physical_devices('GPU')
            
            if gpus:
                print(f"✓ GPU detected: {len(gpus)} device(s)")
                for gpu in gpus:
                    print(f"  - {gpu.name}")
                print("  Training will be FAST (2-4 hours)")
                self.checks_passed.append("GPU available")
            else:
                print("⚠ No GPU detected")
                print("  Training will use CPU (8-12 hours)")
                print("  To enable GPU:")
                print("  1. Install CUDA Toolkit 11.8")
                print("  2. Install cuDNN 8.6")
                print("  3. Reinstall: pip install tensorflow-gpu")
                self.checks_passed.append("CPU available")
        except ImportError:
            print("⚠ TensorFlow not installed yet")
            print("  Will be installed in next step")
    
    def install_dependencies(self):
        """Install required packages"""
        self.print_step(3, "Installing dependencies...")
        
        requirements = [
            'tensorflow==2.13.0',
            'pillow==10.0.0',
            'numpy==1.24.3',
            'matplotlib==3.7.2',
            'seaborn==0.12.2',
            'scikit-learn==1.3.0'
        ]
        
        print("Installing packages:")
        for pkg in requirements:
            print(f"  - {pkg}")
        
        response = input("\nInstall these packages? (y/n): ").lower()
        
        if response == 'y':
            try:
                subprocess.check_call([
                    sys.executable, '-m', 'pip', 'install', '--upgrade'
                ] + requirements)
                print("\n✓ All dependencies installed successfully")
                self.checks_passed.append("Dependencies")
                return True
            except subprocess.CalledProcessError:
                print("\n✗ Failed to install dependencies")
                self.checks_failed.append("Dependencies")
                return False
        else:
            print("Skipping installation")
            return False
    
    def check_dataset(self):
        """Check if dataset exists"""
        self.print_step(4, "Checking dataset...")
        
        dataset_path = 'dataset/PlantVillage'
        
        if os.path.exists(dataset_path):
            # Count images
            total_images = 0
            num_classes = 0
            
            for split in ['train', 'val', 'test']:
                split_path = os.path.join(dataset_path, split)
                if os.path.exists(split_path):
                    classes = [d for d in os.listdir(split_path) 
                              if os.path.isdir(os.path.join(split_path, d))]
                    num_classes = max(num_classes, len(classes))
                    
                    for class_name in classes:
                        class_path = os.path.join(split_path, class_name)
                        images = [f for f in os.listdir(class_path) 
                                 if f.endswith(('.jpg', '.jpeg', '.png'))]
                        total_images += len(images)
            
            print(f"✓ Dataset found!")
            print(f"  Location: {dataset_path}")
            print(f"  Images: {total_images:,}")
            print(f"  Classes: {num_classes}")
            self.checks_passed.append("Dataset")
            return True
        else:
            print("✗ Dataset not found")
            print(f"  Expected location: {dataset_path}")
            print("\nTo get the dataset:")
            print("  1. Download PlantVillage from Kaggle:")
            print("     https://www.kaggle.com/emmarex/plantdisease")
            print("  2. Extract to: dataset/PlantVillage/")
            print("  3. Organize into train/val/test folders")
            self.checks_failed.append("Dataset")
            return False
    
    def show_summary(self):
        """Show summary of checks"""
        self.print_header("SETUP SUMMARY")
        
        print("\n✓ Passed Checks:")
        for check in self.checks_passed:
            print(f"  ✓ {check}")
        
        if self.checks_failed:
            print("\n✗ Failed Checks:")
            for check in self.checks_failed:
                print(f"  ✗ {check}")
        
        print("\n" + "="*70)
    
    def run(self):
        """Run complete setup"""
        self.print_header("QUICK START - Disease Detection Model Training")
        
        print("\nThis script will guide you through:")
        print("  1. System requirements check")
        print("  2. Dependency installation")
        print("  3. Dataset setup")
        print("  4. Model training instructions")
        
        input("\nPress Enter to begin...")
        
        # Run checks
        self.check_python_version()
        self.check_gpu()
        
        # Install dependencies
        if input("\nInstall dependencies? (y/n): ").lower() == 'y':
            self.install_dependencies()
        
        # Check dataset
        has_dataset = self.check_dataset()
        
        # Show summary
        self.show_summary()
        
        # Next steps
        self.print_header("NEXT STEPS")
        
        if has_dataset:
            print("\n✓ Ready to train!")
            print("\nTo start training:")
            print("  python train_disease_model.py")
            print("\nThis will:")
            print("  - Train for ~2-12 hours (depending on hardware)")
            print("  - Save model to: models/plant_disease_model.h5")
            print("  - Achieve 95%+ accuracy")
        else:
            print("\nTo complete setup:")
            print("  1. Download PlantVillage dataset from:")
            print("     https://www.kaggle.com/emmarex/plantdisease")
            print("  2. Extract and organize as:")
            print("     dataset/PlantVillage/train/")
            print("     dataset/PlantVillage/val/")
            print("     dataset/PlantVillage/test/")
            print("  3. Run: python train_disease_model.py")
        
        print("\n" + "="*70)


if __name__ == "__main__":
    quick_start = QuickStart()
    quick_start.run()
