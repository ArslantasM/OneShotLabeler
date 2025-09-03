# OneShotLabeler - AI Data Labeling Platform

Fast and efficient visual data labeling and augmentation platform. Create datasets in YOLO, COCO, and Pascal VOC formats.

## 🚀 Features

### 📸 Visual Labeling
- **Canvas-Based Labeling:** Real-time bounding box drawing with HTML5 Canvas API
- **Multiple Image Support:** Load and label multiple images simultaneously
- **Class Management:** Define and manage custom class names
- **Real-Time Preview:** Instant visual feedback during drawing
- **Performance Optimization:** Smooth experience with offscreen canvas
- **Label Visibility Control:** Show/hide labels feature
- **Image Navigation:** Easy navigation with next/previous buttons

### 🔄 Advanced Data Augmentation
- **20+ Different Effects:** Geometric transformations, color effects, noise filters, weather effects
  - **Geometric:** Rotation, Scaling, Translation, Flip (Horizontal/Vertical)
  - **Color:** Brightness, Contrast, Saturation, Hue, Gamma Correction
  - **Noise:** Gaussian Noise, Salt-Pepper Noise, Gaussian Blur, Sharpen
  - **Advanced:** Cutout, Emboss, Sepia
  - **Weather:** Rain, Snow, Fog Effects
- **Smart Parameter Controls:** Optimized slider configurations for each effect
- **Real-Time Preview:** Live preview of effects with interactive slider controls
- **Canvas Optimization:** Performance improvement with willReadFrequently
- **Batch Processing:** Bulk augmentation for all labeled images
- **Progress Tracking:** Effect-based progress tracking and detailed status indicators
- **Blob URL Management:** Advanced memory management and error prevention
- **Category System:** Logical grouping of effects for better organization

### 📦 Advanced Data Export
- **Multiple Format Support:** YOLO, COCO, Pascal VOC
- **Automatic Folder Structure:** Directory organization according to format standards
- **COCO Format Optimization:** Split-specific image dimensions tracking
- **ZIP Archiving:** Fast download with advanced compression algorithms
- **Split Ratios:** Customizable ratios for Train/Validation/Test separation
- **Progress Tracking:** Real-time process status and progress indicators
- **Error Handling:** Specific messages for timeout, network, and file errors
- **Dataset Documentation:** Automatic README and dataset_info.json generation
- **Memory Optimization:** Advanced memory management for large files

### 🌐 Comprehensive Multi-Language Support
- **Turkish and English:** Complete interface translation with 130+ translation keys
- **Dynamic Language Switching:** Change language without page refresh
- **Language Selector:** Easy language switching in header
- **Comprehensive Translation:** All interface texts, error messages, and debug outputs translated
- **TypeScript Support:** Type-safe translation keys
- **Console Messages:** Debug and error messages also support multiple languages

### 🎨 Advanced User Experience
- **Drag & Drop:** Easy file upload with drag and drop
- **Responsive Design:** Mobile and desktop compatible interface
- **Advanced Progress Tracking:** Effect-based progress and status indicators
- **Smart Error Handling:** Detailed error categories and solution suggestions
- **Canvas Management:** Advanced canvas readiness control and timeout mechanisms
- **Memory Management:** Automatic blob URL cleanup and memory optimization
- **Modern UI:** Elegant and modern interface with Tailwind CSS
- **Interactive Preview:** Real-time effect preview with slider controls
- **Debug Tools:** Developer tools for canvas status and process tracking

## 🛠️ Technologies

- **Frontend:** Next.js 13.5.11, React 18.2.0, TypeScript 5.2.2
- **Styling:** Tailwind CSS 3.3.3
- **Canvas API:** HTML5 Canvas for drawing and image processing
- **File Handling:** File API, Blob API, file-saver
- **Archiving:** jszip for ZIP creation
- **Icons:** Lucide React
- **Performance:** Next.js Image optimization, debouncing, offscreen canvas
- **Internationalization:** Custom i18n system for Turkish and English

## 📋 Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. **Clone the project:**
```bash
git clone https://github.com/ArslantasM/OneShotLabeler.git
cd OneShotLabeler
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 📖 Usage Guide

### 1. Image Upload
- Click "Select Files" button on the main page
- Supported formats: JPG, PNG, GIF, WebP
- You can select multiple files
- You can also upload files via drag and drop

### 2. Image Labeling
- Navigate between uploaded images
- Draw bounding boxes with mouse on canvas
- Enter class name (e.g., "car", "person", "dog")
- Control with show/hide labels button
- Navigate between images with next/previous buttons

### 3. Data Augmentation
- Configure augmentation settings for labeled images
- Enable desired effects
- Set min-max values for each effect
- Set the number of data to be generated for each effect
- Test effects using the preview section
- Start the process with "Start Augmentation"

### 4. Data Export
- Select your desired format (YOLO, COCO, Pascal VOC)
- Adjust Train/Validation/Test ratios
- Click "Download Dataset" button
- ZIP file will be downloaded automatically

### 5. Language Switching
- Use the language selector in the header
- Switch between Turkish and English
- Changes are applied instantly

## 📁 Project Structure

```
OneShotLabeler/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── ImageLabeling.tsx  # Labeling component
│   ├── ImageAugmentation.tsx # Augmentation component
│   ├── DatasetExport.tsx  # Export component
│   └── LanguageSwitcher.tsx # Language switcher
├── lib/                   # Helper libraries
│   └── i18n.ts           # Multi-language system
├── public/                # Static files
│   ├── favicon.ico        # Site icon
│   └── manifest.json      # PWA manifest
├── package.json           # Project dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── README.md              # Turkish documentation
├── README_eng.md          # English documentation
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Development

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## 🎯 Technical Details and Optimizations

### Canvas Performance Improvements
- **willReadFrequently Optimization:** Performance boost for frequently accessed canvas contexts
- **Canvas Readiness Control:** Reliable canvas access with multiple timeout controls
- **Blob URL Management:** Fresh blob URL creation and cleanup for each operation
- **Offscreen Canvas:** Background operations to prevent UI blocking
- **Debouncing:** Optimize canvas redraws

### Augmentation Engine Improvements
- **Effect-Based Progress:** Separate progress tracking for each effect
- **Error Tolerance:** Continue processing by skipping failed effects
- **Memory Optimization:** Smart memory management for large images
- **Flip Effect:** 0=horizontal, 1=vertical values with scale transformation
- **Rotation Support:** Full rotation support from -180° to +180°

### Export System Enhancements
- **COCO Format:** Split-specific image dimensions tracking implementation
- **Timeout Management:** Smart timeout mechanisms for image loading
- **Error Categories:** Specific messages for timeout, network, file not found
- **Progress Optimization:** Real-time progress updates
- **Compression:** Medium-level compression for speed-size balance

### Security
- **Next.js Security Headers:** X-Frame-Options, X-Content-Type-Options
- **Input Validation:** All user inputs are validated
- **File Type Checking:** Only safe file types are accepted

### PWA Support
- **Manifest.json:** Application metadata
- **Service Worker:** Offline support (future)
- **Responsive Design:** Compatible with all devices

### Multi-Language System
- **Custom i18n:** Simple and effective translation system
- **TypeScript Support:** Type-safe translation keys
- **Dynamic Language Switching:** Real-time language change

## 🌐 Multi-Language Support

The application supports both Turkish and English:

### Turkish (Default)
- Complete Turkish interface
- Turkish error messages
- Turkish documentation

### English
- Complete English interface
- English error messages
- English documentation

## 🐛 Resolved Issues and Improvements

### Canvas and Image Processing
- ✅ **Canvas Readiness Control:** Infinite loop issues resolved
- ✅ **Blob URL Management:** ERR_FILE_NOT_FOUND errors fixed
- ✅ **willReadFrequently:** Canvas performance warnings resolved
- ✅ **Flip and Rotation Effects:** Flip and rotation operations fixed

### Augmentation System
- ✅ **Progress Bar:** Effect-based progress tracking implementation
- ✅ **Error Tolerance:** Continue processing by skipping failed images
- ✅ **Memory Leaks:** Comprehensive blob URL cleanup
- ✅ **Infinite Loop:** useEffect dependency optimizations

### Export System
- ✅ **COCO Format:** Split-specific dimensions tracking
- ✅ **Empty ZIP Folders:** COCO format export fixes
- ✅ **Timeout Handling:** Advanced timeout management for large files
- ✅ **Error Messages:** Detailed error categories and solution suggestions

### Multi-Language System
- ✅ **Comprehensive Translation:** Full coverage with 130+ translation keys
- ✅ **Console Messages:** Debug outputs also translated
- ✅ **TypeScript Support:** Type-safe translation system

## 🚧 Future Features

### Short Term (v2.0)
- [ ] Keyboard shortcuts (Ctrl+Z undo, arrow keys navigation)
- [ ] Dark mode support
- [ ] More augmentation effects (Mosaic, CutMix, MixUp)
- [ ] Advanced filtering and search
- [ ] Batch import/export improvements

### Medium Term (v3.0)
- [ ] AI-powered automatic labeling
- [ ] Cloud storage integration (AWS S3, Google Cloud)
- [ ] API support and RESTful endpoints
- [ ] Real-time collaboration and team features
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting

### Long Term (v4.0+)
- [ ] More language support (German, French, Spanish, Chinese)
- [ ] Video annotation support
- [ ] 3D object detection
- [ ] Custom model training integration
- [ ] Enterprise features (SSO, audit logs)
- [ ] Plugin system and extensibility

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Developer:** Mustafa Barış Arslantaş
- **Design:** Modern UI/UX principles
- **Testing:** Community feedback

## 📞 Contact

- **GitHub:** [OneShotLabeler Repository](https://github.com/ArslantasM/OneShotLabeler)
- **Email:** contact@oneshotlabeler.com
- **Website:** [oneshotlabeler.com](https://oneshotlabeler.com)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS team for the excellent CSS framework
- Lucide team for the beautiful icons
- All open source contributors
- Everyone contributing to machine learning and data labeling field

---

**OneShotLabeler v1.5** - Accelerate your machine learning projects with advanced AI-powered data labeling platform! 🚀

> **Latest Update:** Completely redesigned with comprehensive augmentation system, advanced canvas management, multi-language support, and performance optimizations.

**Featured Improvements:**
- 🎨 20+ augmentation effects
- ⚡ Canvas performance optimizations
- 🌐 Full multi-language support with 130+ translation keys
- 🔧 Advanced error handling and debug tools
- 📊 Effect-based progress tracking
- 💾 Smart memory management 