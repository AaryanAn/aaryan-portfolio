# Image Assets Guide for Your Portfolio

This directory contains all the images for your stunning dark mode portfolio. Replace the placeholder paths with your actual images.

## Directory Structure

### `/profile/`
**Main profile photo for About section**
- `aaryan-profile.jpg` (300x300px or larger, square preferred)
  - Professional headshot or casual photo
  - Will be displayed with rounded corners and hover effects
  - Current path in code: `src="assets/profile.jpg"`

### `/projects/`
**Project showcase images (for your 3 main projects)**

#### 1. Plant Phenotyping ML Pipeline
- `plant-phenotyping.jpg` (800x500px or 16:10 ratio)
  - Screenshot of ML pipeline, data visualization, or research setup
  - Could show hyperspectral images, charts, or lab equipment

#### 2. VR Swarm Robotics Interface  
- `vr-swarm-robotics.jpg` (800x500px or 16:10 ratio)
  - VR headset in use, Unity interface, or swarm simulation
  - Meta Quest Pro setup or VR interaction screenshot

#### 3. Spotify Playlist Mood Classification
- `spotify-mood-classification.jpg` (800x500px or 16:10 ratio)
  - Web interface screenshot, data visualization, or mood analysis charts
  - Flask app interface or Spotify API integration demo

### `/experience/`
**Work experience images**

#### Amazon AWS - Annapurna Labs
- `aws-annapurna.jpg` (800x500px or 16:10 ratio)
  - AWS office, data center, or dashboard screenshots
  - Could be system monitoring interface or alarming system UI

#### SharkNinja R&D
- `sharkninja-rnd.jpg` (800x500px or 16:10 ratio)
  - Ninja Luxe Café product, R&D lab, or control system interface
  - Product photo or engineering workspace

### `/icons/` (Optional)
**Small icons for skills or technologies**
- Technology icons (32x32px or SVG)
- Custom icons for skills sections

### `/backgrounds/` (Optional)
**Background textures or patterns**
- Subtle tech patterns
- Gradient overlays
- Abstract backgrounds

## How to Update Images

1. **Add your images** to the appropriate directories
2. **Update the HTML file** (`src/index.html`) to point to your images:

```html
<!-- Profile Image -->
<img src="assets/images/profile/aaryan-profile.jpg" alt="Profile Image" />

<!-- Project Images -->
<img src="assets/images/projects/plant-phenotyping.jpg" alt="Plant Phenotyping ML Pipeline" />
<img src="assets/images/projects/vr-swarm-robotics.jpg" alt="VR Swarm Robotics Interface" />
<img src="assets/images/projects/spotify-mood-classification.jpg" alt="Spotify Mood Classification" />

<!-- Experience Images -->
<img src="assets/images/experience/aws-annapurna.jpg" alt="Amazon AWS Systems Engineering" />
<img src="assets/images/experience/sharkninja-rnd.jpg" alt="SharkNinja Software Engineering" />
```

## Image Tips

- **Format**: JPG for photos, PNG for graphics with transparency
- **Size**: Optimize for web (under 500KB per image)
- **Quality**: High resolution but compressed for fast loading
- **Aspect Ratio**: 16:10 or 16:9 for project/experience images
- **Consistency**: Similar lighting and style across images

## Current Placeholder

All images currently point to `assets/project.jpg` - replace this generic placeholder with your specific images following the structure above.

---

Your dark mode portfolio will look absolutely stunning with your real images! 