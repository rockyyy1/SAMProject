# SAMProject

This is a Django-based web application built with JavaScript that runs SAM 2 (Segment Anything Model 2). The app allows users to upload their images and select whether they want the image to be included or excluded from segmentation. The segmentation is powered by the Segment Anything Model (SAM).

More information can be found [here](https://github.com/facebookresearch/sam2)

# Installation

## 1. Clone the SAMProject Repository
Start by cloning the SAMProject repository to your local machine:
in command prompt:

```git clone https://github.com/rockyyy1/SAMProject.git```

```cd SAMProject```

## 2. Clone the SAM2 Repository
Next, clone the SAM2 repository from Facebook Research:

```git clone https://github.com/facebookresearch/sam2.git segment-anything-2```

## 3. Create a Virtual Environment
Ensure you're using Python 3.12 interpreter for this project. You can download Python 3.12 from [here](https://www.python.org/downloads/release/python-3126/).

```python -m venv env```

Then, create a new virtual environment:

### On Linux:

Activate the virtual environment using the following command:

```source ./env/bin/activate```

### On Windows:
Activate the virtual environment using the following command:

```.\env\Scripts\activate```

## 4. Install the Required Python Packages
With the virtual environment activated, install the required dependencies:

```pip install -r requirements.txt```

## 5. Prepare the checkpoints Directory
If the checkpoints directory does not already exist, create it:

```mkdir checkpoints```

## 6. Download the SAM2 Large Model

Download the pre-trained SAM2 models from the following link:

[Download SAM2 model](https://dl.fbaipublicfiles.com/segment_anything_2/092824/sam2.1_hiera_large.pt)

Move the SAM2 model (sam2.1_hiera_large.pt) into this directory.

```SAMProject/checkpoints/```


## 7. Final Setup
After completing the setup, your project directory structure should look like this:

```
SAMProject/
├── checkpoints/
│   └── sam2.1_hiera_large.pt
├── env/
├── SAMapp/
├── SAMProject/
├── segment-anything-2/
├── requirements.txt
└── manage.py
```

## 8. Running the Application
Once everything is set up, you can start the Django application by running in the Root directory \SAMProject\:

```python manage.py runserver```

Visit the app in your browser at http://127.0.0.1:8000/. Upload images and select whether to include or exclude them from segmentation.


# How To Use

1. Upload Images:
- Drag and drop images or click the button to upload an image.

2. Segmenting Objects:

- Include: To include certain objects in segmentation, click the "Include" button and then click on the object you want to isolate.
- Exclude: To exclude certain objects from segmentation, click the "Exclude" button and then click on the objects you want to omit.

3. Save Segmented Image:

- Once you've made your selections, click "Save to database" to save the segmented image.
