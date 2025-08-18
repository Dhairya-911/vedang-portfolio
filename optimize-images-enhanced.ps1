# Enhanced Image Optimization Script for Vedang Portfolio
# This script optimizes images for better web performance

param(
    [string]$Quality = "85",
    [string]$MaxWidth = "1920",
    [string]$MaxHeight = "1080"
)

Write-Host "🖼️  Enhanced Image Optimization Starting..." -ForegroundColor Green
Write-Host "Quality: $Quality% | Max Dimensions: ${MaxWidth}x${MaxHeight}" -ForegroundColor Cyan

# Define image directories
$imageDirectories = @(
    "images\weddings",
    "images\events", 
    "images\concerts",
    "images\food",
    "images\Pride Walk"
)

# Image optimization function
function Optimize-Images {
    param($Directory)
    
    Write-Host "📁 Processing: $Directory" -ForegroundColor Yellow
    
    if (!(Test-Path $Directory)) {
        Write-Host "❌ Directory not found: $Directory" -ForegroundColor Red
        return
    }
    
    $images = Get-ChildItem -Path $Directory -Include "*.jpg", "*.jpeg", "*.png" -Recurse
    $totalImages = $images.Count
    $processed = 0
    
    Write-Host "Found $totalImages images to process" -ForegroundColor Cyan
    
    foreach ($image in $images) {
        $processed++
        $originalSize = [math]::Round((Get-Item $image.FullName).Length / 1MB, 2)
        
        Write-Progress -Activity "Optimizing Images" -Status "Processing $($image.Name)" -PercentComplete (($processed / $totalImages) * 100)
        
        try {
            # Create backup directory
            $backupDir = Join-Path $Directory "original_backup"
            if (!(Test-Path $backupDir)) {
                New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
            }
            
            # Backup original if not already backed up
            $backupPath = Join-Path $backupDir $image.Name
            if (!(Test-Path $backupPath)) {
                Copy-Item $image.FullName $backupPath -Force
            }
            
            # Check if magick is available
            $hasMagick = Get-Command "magick" -ErrorAction SilentlyContinue
            
            if ($hasMagick) {
                # Use ImageMagick for optimization
                $tempPath = $image.FullName + ".tmp"
                
                & magick $image.FullName -resize "${MaxWidth}x${MaxHeight}>" -quality $Quality -strip $tempPath
                
                if (Test-Path $tempPath) {
                    $newSize = [math]::Round((Get-Item $tempPath).Length / 1MB, 2)
                    $savings = [math]::Round((($originalSize - $newSize) / $originalSize) * 100, 1)
                    
                    Move-Item $tempPath $image.FullName -Force
                    Write-Host "✅ $($image.Name): ${originalSize}MB → ${newSize}MB (${savings}% saved)" -ForegroundColor Green
                } else {
                    Write-Host "⚠️  Failed to optimize: $($image.Name)" -ForegroundColor Yellow
                }
            } else {
                Write-Host "⚠️  ImageMagick not found. Install from: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
                Write-Host "🔄 Renaming for web optimization instead..." -ForegroundColor Cyan
                
                # Basic web optimization (filename sanitization)
                $newName = $image.Name -replace '\s+', '_' -replace '[^\w\-_\.]', ''
                $newPath = Join-Path $image.Directory $newName
                
                if ($newName -ne $image.Name -and !(Test-Path $newPath)) {
                    Rename-Item $image.FullName $newName
                    Write-Host "✅ Renamed: $($image.Name) → $newName" -ForegroundColor Green
                }
            }
        }
        catch {
            Write-Host "❌ Error processing $($image.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Progress -Activity "Optimizing Images" -Completed
}

# Check for ImageMagick
Write-Host "🔍 Checking for ImageMagick..." -ForegroundColor Cyan
$magickInstalled = Get-Command "magick" -ErrorAction SilentlyContinue

if ($magickInstalled) {
    Write-Host "✅ ImageMagick found!" -ForegroundColor Green
} else {
    Write-Host "⚠️  ImageMagick not installed. Limited optimization available." -ForegroundColor Yellow
    Write-Host "💡 To enable full optimization, install ImageMagick from:" -ForegroundColor Cyan
    Write-Host "   https://imagemagick.org/script/download.php#windows" -ForegroundColor Cyan
}

# Process each directory
foreach ($dir in $imageDirectories) {
    if (Test-Path $dir) {
        Optimize-Images -Directory $dir
        Write-Host ""
    }
}

# Generate WebP versions if supported
Write-Host "🚀 Generating WebP versions..." -ForegroundColor Green

if ($magickInstalled) {
    foreach ($dir in $imageDirectories) {
        if (Test-Path $dir) {
            $images = Get-ChildItem -Path $dir -Include "*.jpg", "*.jpeg" -Recurse
            
            foreach ($image in $images) {
                $webpPath = $image.FullName -replace '\.(jpg|jpeg)$', '.webp'
                
                if (!(Test-Path $webpPath)) {
                    try {
                        & magick $image.FullName -quality $Quality $webpPath
                        
                        if (Test-Path $webpPath) {
                            $originalSize = [math]::Round((Get-Item $image.FullName).Length / 1KB, 0)
                            $webpSize = [math]::Round((Get-Item $webpPath).Length / 1KB, 0)
                            $savings = [math]::Round((($originalSize - $webpSize) / $originalSize) * 100, 1)
                            
                            Write-Host "📄 WebP: $($image.BaseName): ${originalSize}KB → ${webpSize}KB (${savings}% saved)" -ForegroundColor Cyan
                        }
                    }
                    catch {
                        Write-Host "❌ WebP conversion failed for: $($image.Name)" -ForegroundColor Red
                    }
                }
            }
        }
    }
} else {
    Write-Host "⚠️  Skipping WebP generation (ImageMagick required)" -ForegroundColor Yellow
}

# Generate optimization report
Write-Host ""
Write-Host "📊 OPTIMIZATION REPORT" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green

$totalOriginalSize = 0
$totalOptimizedSize = 0
$totalImages = 0

foreach ($dir in $imageDirectories) {
    if (Test-Path $dir) {
        $images = Get-ChildItem -Path $dir -Include "*.jpg", "*.jpeg", "*.png" -Recurse
        $dirSize = ($images | Measure-Object -Property Length -Sum).Sum
        $totalOptimizedSize += $dirSize
        $totalImages += $images.Count
        
        Write-Host "$dir`: $($images.Count) images, $([math]::Round($dirSize / 1MB, 2)) MB" -ForegroundColor Cyan
        
        # Check for backups to calculate original size
        $backupDir = Join-Path $dir "original_backup"
        if (Test-Path $backupDir) {
            $backupImages = Get-ChildItem -Path $backupDir -Include "*.jpg", "*.jpeg", "*.png" -Recurse
            $backupSize = ($backupImages | Measure-Object -Property Length -Sum).Sum
            $totalOriginalSize += $backupSize
        }
    }
}

if ($totalOriginalSize -gt 0) {
    $totalSavings = [math]::Round((($totalOriginalSize - $totalOptimizedSize) / $totalOriginalSize) * 100, 1)
    Write-Host ""
    Write-Host "📈 Total Savings: $totalSavings%" -ForegroundColor Green
    Write-Host "📦 Original Size: $([math]::Round($totalOriginalSize / 1MB, 2)) MB" -ForegroundColor Yellow
    Write-Host "📦 Optimized Size: $([math]::Round($totalOptimizedSize / 1MB, 2)) MB" -ForegroundColor Green
    Write-Host "💾 Space Saved: $([math]::Round(($totalOriginalSize - $totalOptimizedSize) / 1MB, 2)) MB" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "✅ Image optimization completed!" -ForegroundColor Green
Write-Host "🌐 Your website images are now optimized for better performance!" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Test your website loading speed" -ForegroundColor White
Write-Host "   2. Check mobile performance" -ForegroundColor White
Write-Host "   3. Run lighthouse audit" -ForegroundColor White
