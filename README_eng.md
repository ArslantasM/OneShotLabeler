# OneShotLabeler - Data Labeling Platform

Fast and efficient visual data labeling and augmentation platform. Create datasets in YOLO, COCO, and Pascal VOC formats.

##  Features

###  Visual Labeling
- **Canvas-Based Labeling:** Real-time bounding box drawing with HTML5 Canvas API
- **Multiple Image Support:** Load and label multiple images simultaneously
- **Class Management:** Define and manage custom class names
- **Real-Time Preview:** Instant visual feedback during drawing
- **Performance Optimization:** Smooth experience with offscreen canvas
- **Label Visibility Control:** Show/hide labels feature
- **Image Navigation:** Easy navigation with next/previous buttons

###  Data Augmentation
- **12 Different Effects:** Blur, Brightness, Contrast, Rotation, Noise, Flip, Saturation, Hue, Gamma, Sharpen, Emboss, Sepia
- **Min-Max Control:** Customizable value ranges for each effect
- **Count Management:** Specify the number of augmented data for each effect
- **Real-Time Preview:** Preview effects on small sample images
- **Batch Processing:** Bulk augmentation for all labeled images
- **Preview Sidebar:** Real-time preview of active effects

###  Data Export
- **Multiple Format Support:** YOLO, COCO, Pascal VOC
- **Automatic Folder Structure:** Directory organization according to format standards
- **ZIP Archiving:** Download all data in a single file
- **Split Ratios:** Customizable ratios for Train/Validation/Test separation
- **Progress Tracking:** Process status and progress indicators

###  Multi-Language Support
- **Turkish and English:** Complete interface translation
- **Dynamic Language Switching:** Change language without page refresh
- **Language Selector:** Easy language switching in header
- **Comprehensive Translation:** All interface texts translated

###  User Experience
- **Drag & Drop:** Easy file upload with drag and drop
- **Responsive Design:** Mobile and desktop compatible interface
- **Progress Tracking:** Process status and progress indicators
- **Error Handling:** User-friendly error messages
- **Memory Management:** Automatic memory cleanup and optimization
- **Modern UI:** Elegant and modern interface with Tailwind CSS

##  Technologies

- **Frontend:** Next.js 13.5.11, React 18.2.0, TypeScript 5.2.2
- **Styling:** Tailwind CSS 3.3.3
- **Canvas API:** HTML5 Canvas for drawing and image processing
- **File Handling:** File API, Blob API, file-saver
- **Archiving:** jszip for ZIP creation
- **Icons:** Lucide React
- **Performance:** Next.js Image optimization, debouncing, offscreen canvas
- **Internationalization:** Custom i18n system for Turkish and English

##  Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

##  Installation

1. **Clone the project:**
```bash
git clone https://github.com/your-username/OneShotLabeler.git
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

##  Usage Guide

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

##  Project Structure

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

##  Development

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

##  Technical Details

### Performance Optimizations
- **Next.js Image Component:** Automatic image optimization
- **Offscreen Canvas:** Prevent UI blocking
- **Debouncing:** Optimize canvas redraws
- **Memory Management:** Memory cleanup with URL.revokeObjectURL
- **Bundle Splitting:** Webpack optimizations

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

##  Multi-Language Support

The application supports both Turkish and English:

### Turkish (Default)
- Complete Turkish interface
- Turkish error messages
- Turkish documentation

### English
- Complete English interface
- English error messages
- English documentation

##  Known Issues

- Large files (>10MB) may load slowly
- Performance may decrease when using too many augmentation effects simultaneously
- Canvas API support may be limited in some older browsers

##  Future Features

- [ ] AI-powered automatic labeling
- [ ] More augmentation effects
- [ ] Cloud storage integration
- [ ] Team collaboration features
- [ ] API support
- [ ] Mobile app
- [ ] Queue system for batch processing
- [ ] Advanced filtering and search
- [ ] Expand export formats
- [ ] Real-time collaboration
- [ ] More language support (German, French, Spanish)
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Undo/Redo features

##  License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

##  Contributors

- **Developer:** OneShotLabeler Team
- **Design:** Modern UI/UX principles
- **Testing:** Community feedback

##  Contact

- **GitHub:** [OneShotLabeler Repository](https://github.com/your-username/OneShotLabeler)
- **Email:** support@oneshotlabeler.com
- **Discord:** [OneShotLabeler Community](https://discord.gg/oneshotlabeler)

##  Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS team for the excellent CSS framework
- Lucide team for the beautiful icons
- All open source contributors

---

**OneShotLabeler** - Accelerate your machine learning projects with data labeling platform! 
