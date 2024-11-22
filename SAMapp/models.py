
from django.db import models

class ProcessedImage(models.Model):
    title = models.CharField(max_length=200)
    image = models.TextField()  # Store base64 encoded image
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

