import os

# if using Apple MPS, fall back to CPU for unsupported ops
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"
import numpy as np
import torch
from PIL import Image
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

# select the device for computation
if torch.cuda.is_available():
    device = torch.device("cuda")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")
print(f"using device: {device}")

if device.type == "cuda":
    # use bfloat16 for the entire notebook
    torch.autocast("cuda", dtype=torch.bfloat16).__enter__()
    # turn on tfloat32 for Ampere GPUs (https://pytorch.org/docs/stable/notes/cuda.html#tensorfloat-32-tf32-on-ampere-devices)
    if torch.cuda.get_device_properties(0).major >= 8:
        torch.backends.cuda.matmul.allow_tf32 = True
        torch.backends.cudnn.allow_tf32 = True
elif device.type == "mps":
    print(
        "\nSupport for MPS devices is preliminary. SAM 2 is trained with CUDA and might "
        "give numerically different outputs and sometimes degraded performance on MPS. "
        "See e.g. https://github.com/pytorch/pytorch/issues/84936 for a discussion.")

sam2_checkpoint = "./checkpoints/sam2.1_hiera_large.pt"
model_cfg = "configs/sam2.1/sam2.1_hiera_l.yaml"

sam2_model = build_sam2(model_cfg, sam2_checkpoint, device=device)

predictor = SAM2ImagePredictor(sam2_model)


def process_image_with_sam(image: Image, coordinates: []):
    global predictor
    coord_list = []
    input_labels = []

    # Get the image dimensions
    image = np.array(image.convert("RGB"))
    image_height, image_width, _ = image.shape
    # print('the total width and height is: ', image_width, image_height)

    # Access x, y, and state from the dictionary
    for coord in coordinates:
        x, y = int(coord['x'] / 100 * image_width), int(coord['y'] / 100 * image_height)
        # print(f"Converted coordinates: ({coord['x']}, {coord['y']}) to absolute: ({x}, {y})")
        coord_list.append([x, y])

        input_labels.append(coord['state'])

    predictor.set_image(image)

    input_point = np.array(coord_list)
    input_label = np.array(input_labels)

    masks, scores, logits = predictor.predict(
        point_coords=input_point,
        point_labels=input_label,
        multimask_output=True,
    )
    sorted_ind = np.argsort(scores)[::-1]
    masks = masks[sorted_ind]

    # Grab the best scored mask
    mask = masks[0]

    return create_new_image_with_sam_mask(image, mask)


def create_new_image_with_sam_mask(image_array: np.ndarray, mask: np.ndarray):
    mask_color = (168, 20, 20)
    # Grab array and convert to image
    image = Image.fromarray(image_array)

    mask = mask.astype(np.uint8)

    # mask colours
    mask_colored = np.zeros_like(image_array)
    mask_colored[mask == 1] = mask_color

    # Convert the colored mask to an image
    mask_image = Image.fromarray(mask_colored)

    # Blend the original image and the mask image
    return Image.blend(image, mask_image, 0.5)
