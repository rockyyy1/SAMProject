from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import ProcessedImage
import json
from PIL import Image
import io
import base64
from SAMapp import sammy_2_segmentor

def index(request):
    return render(request, 'index.html')

@csrf_exempt
@require_http_methods(["POST"])
def process(request):
    data = json.loads(request.body)
    image_data = data.get('image')

    if 'base64,' in image_data:
        image_data = image_data.split('base64,')[1]

    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))

    if image.mode != 'RGBA':
        image = image.convert('RGBA')

    coordinates = data.get('points', [])

    for coordinate in coordinates:
        x = coordinate['x']
        y = coordinate['y']
        state = coordinate['state']  # 1 for include, 0 for exclude

        # You can now use `x`, `y`, and `state` to perform any logic, such as saving to a model or processing
        print(f"Point: ({x}, {y}), State: {state}")

    image = sammy_2_segmentor.process_image_with_sam(image, coordinates)

    buffer = io.BytesIO()
    image.save(buffer, format='JPEG')
    processed_image = base64.b64encode(buffer.getvalue()).decode()

    return JsonResponse({
        'success': True,
        'processed_image': f'data:image/jpeg;base64,{processed_image}'
    })

@csrf_exempt
@require_http_methods(["POST"])
def add_image(request):
    try:
        data = json.loads(request.body)
        title = data.get('title')
        image_data = data.get('image')

        new_image = ProcessedImage(title=title, image=image_data)
        new_image.save()

        return JsonResponse({'success': True, 'id': new_image.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["PUT"])
def update_image(request, image_id):
    try:
        data = json.loads(request.body)
        title = data.get('title')

        image = ProcessedImage.objects.get(id=image_id)
        image.title = title
        image.save()

        return JsonResponse({'success': True})
    except ProcessedImage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Image not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_image(request, image_id):
    try:
        image = ProcessedImage.objects.get(id=image_id)
        image.delete()
        return JsonResponse({'success': True})
    except ProcessedImage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Image not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["GET"])
def get_images(request):
    try:
        images = ProcessedImage.objects.all().order_by('-created_at')
        image_list = [{'id': img.id, 'title': img.title, 'image': img.image} for img in images]
        return JsonResponse({'success': True, 'images': image_list})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)