# Image Optimization Script for Vedang Portfolio

# Install required tools first:
# npm install -g imagemin-cli imagemin-webp imagemin-mozjpeg

# This script will optimize all wedding images
# Run this in PowerShell from the project root

Write-Host "🖼️  Starting image optimization for wedding gallery..." -ForegroundColor Green

# Create optimized images directory
$optimizedDir = "images/weddings/optimized"
if (-not (Test-Path $optimizedDir)) {
    New-Item -ItemType Directory -Path $optimizedDir -Force
    Write-Host "Created optimized images directory" -ForegroundColor Yellow
}

# Get all wedding images
$weddingImages = Get-ChildItem -Path "images/weddings" -Filter "*.jpg" | Where-Object { $_.Name -notlike "*optimized*" }

Write-Host "Found $($weddingImages.Count) images to optimize" -ForegroundColor Blue

foreach ($image in $weddingImages) {
    $inputPath = $image.FullName
    $outputPath = Join-Path $optimizedDir $image.Name
    
    Write-Host "Optimizing: $($image.Name)..." -ForegroundColor Cyan
    
    # Optimize JPEG (reduce quality to 85%, progressive)
    & imagemin $inputPath --plugin=mozjpeg --plugin.mozjpeg.quality=85 --plugin.mozjpeg.progressive=true > $outputPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Optimized: $($image.Name)" -ForegroundColor Green
        
        # Get file sizes
        $originalSize = [math]::Round((Get-Item $inputPath).Length / 1KB, 2)
        $optimizedSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 2)
        $savings = [math]::Round(($originalSize - $optimizedSize) / $originalSize * 100, 1)
        
        Write-Host "   Original: ${originalSize}KB → Optimized: ${optimizedSize}KB (${savings}% smaller)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Failed to optimize: $($image.Name)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Image optimization complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update HTML to use optimized images from /optimized/ folder" -ForegroundColor White
Write-Host "2. Consider implementing responsive images with different sizes" -ForegroundColor White
Write-Host "3. Add WebP format support for modern browsers" -ForegroundColor White
