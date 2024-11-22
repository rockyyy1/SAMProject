from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import ProcessedImage
import json
from PIL import Image
import io
import base64

def index(request):
    return render(request, 'index.html')

@csrf_exempt
@require_http_methods(["POST"])
def process(request):
    try:
        data = json.loads(request.body)
        image_data = data.get('image')

        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]

        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))

        if image.mode != 'RGBA':
            image = image.convert('RGBA')

        blue_overlay = Image.new('RGBA', image.size, (0, 0, 255, 76))
        blue_tinted = Image.alpha_composite(image, blue_overlay)
        blue_tinted = blue_tinted.convert('RGB')

        buffer = io.BytesIO()
        blue_tinted.save(buffer, format='JPEG')
        processed_image = base64.b64encode(buffer.getvalue()).decode()

        return JsonResponse({
            'success': True,
            'processed_image': f'data:image/jpeg;base64,{processed_image}'
        })

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

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