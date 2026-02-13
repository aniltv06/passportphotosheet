export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar' | 'hi' | 'pt' | 'ru';

export interface Translations {
  // Header
  appName: string;
  appTagline: string;
  supportButton: string;
  
  // Steps
  step: string;
  step1Title: string;
  step2Title: string;
  
  // Photo Editor
  keyboardShortcuts: string;
  proTips: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  tip5: string;
  uploadPhoto: string;
  choosePhoto: string;
  changePhoto: string;
  fileSize: string;
  download: string;
  reset: string;
  passportSize: string;
  background: string;
  position: string;
  dragToReposition: string;
  centerPhoto: string;
  zoom: string;
  rotation: string;
  brightness: string;
  contrast: string;
  photoPreview: string;
  uploadToStart: string;
  supportedFormats: string;
  nextStep: string;
  
  // Photo Sheet
  paperSize: string;
  gridLayout: string;
  photosPerRow: string;
  numberOfRows: string;
  borderSettings: string;
  borderWidth: string;
  borderColor: string;
  printSummary: string;
  totalPhotos: string;
  photoSize: string;
  paper: string;
  border: string;
  downloadSheet: string;
  sheetPreview: string;
  backToEditor: string;
  printSheet: string;
  
  // Colors
  original: string;
  white: string;
  lightGray: string;
  lightBlue: string;
  cream: string;
  black: string;
  gray: string;
  blue: string;
  
  // Keyboard shortcuts
  zoomIn: string;
  zoomOut: string;
  rotateClockwise: string;
  rotateCounterClockwise: string;
  movePhotoUp: string;
  movePhotoDown: string;
  movePhotoLeft: string;
  movePhotoRight: string;
  resetAdjustments: string;
  showHelp: string;
  
  // Onboarding
  welcomeTitle: string;
  welcomeDescription: string;
  step1OnboardTitle: string;
  step1OnboardDescription: string;
  step2OnboardTitle: string;
  step2OnboardDescription: string;
  allSetTitle: string;
  allSetDescription: string;
  next: string;
  back: string;
  getStarted: string;
  skipTutorial: string;
  
  // Settings
  settings: string;
  language: string;
  exportFormat: string;
  imageQuality: string;
  saveSettings: string;
  restoreDefaults: string;
  
  // Help
  help: string;
  faq: string;
  howToUse: string;
  contactSupport: string;
  
  // Quality
  low: string;
  medium: string;
  high: string;
  dark: string;
  bright: string;
  
  // Misc
  close: string;
  save: string;
  cancel: string;
  apply: string;
  proTip: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Passport Photo Maker',
    appTagline: 'Professional photos in seconds ✨',
    supportButton: 'Buy me a coffee',
    
    step: 'Step',
    step1Title: 'Upload & Adjust',
    step2Title: 'Preview & Print',
    
    keyboardShortcuts: 'Keyboard Shortcuts',
    proTips: 'Pro Tips',
    tip1: 'Face fills 70-80% of frame',
    tip2: 'Look directly at camera',
    tip3: 'Neutral expression',
    tip4: 'Plain background',
    tip5: 'Good lighting',
    uploadPhoto: 'Upload Photo',
    choosePhoto: 'Choose Photo',
    changePhoto: 'Change Photo',
    fileSize: 'JPG, PNG up to 10MB',
    download: 'Download',
    reset: 'Reset',
    passportSize: 'Passport Size',
    background: 'Background',
    position: 'Position',
    dragToReposition: 'Drag to reposition',
    centerPhoto: 'Center Photo',
    zoom: 'Zoom',
    rotation: 'Rotation',
    brightness: 'Brightness',
    contrast: 'Contrast',
    photoPreview: 'Photo Preview',
    uploadToStart: 'Upload a photo to get started',
    supportedFormats: 'Supported: JPG, PNG',
    nextStep: 'Next Step',
    
    paperSize: 'Paper Size',
    gridLayout: 'Grid Layout',
    photosPerRow: 'Photos per row',
    numberOfRows: 'Number of rows',
    borderSettings: 'Border Settings',
    borderWidth: 'Border Width',
    borderColor: 'Border Color',
    printSummary: 'Print Summary',
    totalPhotos: 'Total Photos',
    photoSize: 'Photo Size',
    paper: 'Paper',
    border: 'Border',
    downloadSheet: 'Download Sheet',
    sheetPreview: 'Sheet Preview',
    backToEditor: 'Back to Editor',
    printSheet: 'Print Sheet',
    
    original: 'Original',
    white: 'White',
    lightGray: 'Light Gray',
    lightBlue: 'Light Blue',
    cream: 'Cream',
    black: 'Black',
    gray: 'Gray',
    blue: 'Blue',
    
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    rotateClockwise: 'Rotate clockwise',
    rotateCounterClockwise: 'Rotate counter-clockwise',
    movePhotoUp: 'Move photo up',
    movePhotoDown: 'Move photo down',
    movePhotoLeft: 'Move photo left',
    movePhotoRight: 'Move photo right',
    resetAdjustments: 'Reset all adjustments',
    showHelp: 'Show this help dialog',
    
    welcomeTitle: 'Welcome to Passport Photo Maker!',
    welcomeDescription: 'Create professional passport photos in just 2 easy steps. Let me show you how it works.',
    step1OnboardTitle: 'Step 1: Upload & Adjust',
    step1OnboardDescription: 'Upload your photo and use our tools to zoom, rotate, adjust brightness, and position your photo perfectly. Use keyboard shortcuts for precise control!',
    step2OnboardTitle: 'Step 2: Print Your Sheet',
    step2OnboardDescription: 'Customize your photo sheet with different paper sizes, grid layouts, and borders. Then download or print!',
    allSetTitle: "You're All Set!",
    allSetDescription: 'Press "?" anytime to see keyboard shortcuts. If you find this tool helpful, consider supporting development. Happy photo making!',
    next: 'Next',
    back: 'Back',
    getStarted: 'Get Started',
    skipTutorial: 'Skip tutorial',
    
    settings: 'Settings',
    language: 'Language',
    exportFormat: 'Export Format',
    imageQuality: 'Image Quality',
    saveSettings: 'Save Settings',
    restoreDefaults: 'Restore Defaults',
    
    help: 'Help',
    faq: 'FAQ',
    howToUse: 'How to Use',
    contactSupport: 'Contact Support',
    
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    dark: 'Dark',
    bright: 'Bright',
    
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    apply: 'Apply',
    proTip: 'Pro Tip',
  },
  
  es: {
    appName: 'Creador de Fotos de Pasaporte',
    appTagline: 'Fotos profesionales en segundos ✨',
    supportButton: 'Cómprame un café',
    
    step: 'Paso',
    step1Title: 'Subir y Ajustar',
    step2Title: 'Vista Previa e Imprimir',
    
    keyboardShortcuts: 'Atajos de Teclado',
    proTips: 'Consejos Profesionales',
    tip1: 'La cara llena 70-80% del marco',
    tip2: 'Mira directamente a la cámara',
    tip3: 'Expresión neutral',
    tip4: 'Fondo plano',
    tip5: 'Buena iluminación',
    uploadPhoto: 'Subir Foto',
    choosePhoto: 'Elegir Foto',
    changePhoto: 'Cambiar Foto',
    fileSize: 'JPG, PNG hasta 10MB',
    download: 'Descargar',
    reset: 'Restablecer',
    passportSize: 'Tamaño de Pasaporte',
    background: 'Fondo',
    position: 'Posición',
    dragToReposition: 'Arrastra para reposicionar',
    centerPhoto: 'Centrar Foto',
    zoom: 'Zoom',
    rotation: 'Rotación',
    brightness: 'Brillo',
    contrast: 'Contraste',
    photoPreview: 'Vista Previa',
    uploadToStart: 'Sube una foto para comenzar',
    supportedFormats: 'Compatible: JPG, PNG',
    nextStep: 'Siguiente Paso',
    
    paperSize: 'Tamaño de Papel',
    gridLayout: 'Diseño de Cuadrícula',
    photosPerRow: 'Fotos por fila',
    numberOfRows: 'Número de filas',
    borderSettings: 'Configuración de Bordes',
    borderWidth: 'Ancho del Borde',
    borderColor: 'Color del Borde',
    printSummary: 'Resumen de Impresión',
    totalPhotos: 'Fotos Totales',
    photoSize: 'Tamaño de Foto',
    paper: 'Papel',
    border: 'Borde',
    downloadSheet: 'Descargar Hoja',
    sheetPreview: 'Vista Previa de Hoja',
    backToEditor: 'Volver al Editor',
    printSheet: 'Imprimir Hoja',
    
    original: 'Original',
    white: 'Blanco',
    lightGray: 'Gris Claro',
    lightBlue: 'Azul Claro',
    cream: 'Crema',
    black: 'Negro',
    gray: 'Gris',
    blue: 'Azul',
    
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    rotateClockwise: 'Rotar a la derecha',
    rotateCounterClockwise: 'Rotar a la izquierda',
    movePhotoUp: 'Mover foto arriba',
    movePhotoDown: 'Mover foto abajo',
    movePhotoLeft: 'Mover foto izquierda',
    movePhotoRight: 'Mover foto derecha',
    resetAdjustments: 'Restablecer todos los ajustes',
    showHelp: 'Mostrar esta ayuda',
    
    welcomeTitle: '¡Bienvenido al Creador de Fotos de Pasaporte!',
    welcomeDescription: 'Crea fotos profesionales de pasaporte en solo 2 pasos fáciles. Déjame mostrarte cómo funciona.',
    step1OnboardTitle: 'Paso 1: Subir y Ajustar',
    step1OnboardDescription: '¡Sube tu foto y usa nuestras herramientas para hacer zoom, rotar, ajustar el brillo y posicionar tu foto perfectamente!',
    step2OnboardTitle: 'Paso 2: Imprimir Tu Hoja',
    step2OnboardDescription: 'Personaliza tu hoja de fotos con diferentes tamaños de papel, diseños de cuadrícula y bordes. ¡Luego descarga o imprime!',
    allSetTitle: '¡Todo Listo!',
    allSetDescription: 'Presiona "?" en cualquier momento para ver los atajos de teclado. Si encuentras útil esta herramienta, considera apoyar el desarrollo. ¡Feliz creación de fotos!',
    next: 'Siguiente',
    back: 'Atrás',
    getStarted: 'Comenzar',
    skipTutorial: 'Saltar tutorial',
    
    settings: 'Configuración',
    language: 'Idioma',
    exportFormat: 'Formato de Exportación',
    imageQuality: 'Calidad de Imagen',
    saveSettings: 'Guardar Configuración',
    restoreDefaults: 'Restaurar Predeterminados',
    
    help: 'Ayuda',
    faq: 'Preguntas Frecuentes',
    howToUse: 'Cómo Usar',
    contactSupport: 'Contactar Soporte',
    
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    dark: 'Oscuro',
    bright: 'Brillante',
    
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    apply: 'Aplicar',
    proTip: 'Consejo',
  },
  
  fr: {
    appName: 'Créateur de Photos de Passeport',
    appTagline: 'Photos professionnelles en secondes ✨',
    supportButton: 'Offrez-moi un café',
    
    step: 'Étape',
    step1Title: 'Télécharger et Ajuster',
    step2Title: 'Aperçu et Imprimer',
    
    keyboardShortcuts: 'Raccourcis Clavier',
    proTips: 'Conseils Pro',
    tip1: 'Le visage remplit 70-80% du cadre',
    tip2: 'Regardez directement la caméra',
    tip3: 'Expression neutre',
    tip4: 'Fond uni',
    tip5: 'Bon éclairage',
    uploadPhoto: 'Télécharger Photo',
    choosePhoto: 'Choisir Photo',
    changePhoto: 'Changer Photo',
    fileSize: 'JPG, PNG jusqu\'à 10MB',
    download: 'Télécharger',
    reset: 'Réinitialiser',
    passportSize: 'Taille Passeport',
    background: 'Arrière-plan',
    position: 'Position',
    dragToReposition: 'Faites glisser pour repositionner',
    centerPhoto: 'Centrer Photo',
    zoom: 'Zoom',
    rotation: 'Rotation',
    brightness: 'Luminosité',
    contrast: 'Contraste',
    photoPreview: 'Aperçu Photo',
    uploadToStart: 'Téléchargez une photo pour commencer',
    supportedFormats: 'Supporté: JPG, PNG',
    nextStep: 'Étape Suivante',
    
    paperSize: 'Taille du Papier',
    gridLayout: 'Disposition Grille',
    photosPerRow: 'Photos par ligne',
    numberOfRows: 'Nombre de lignes',
    borderSettings: 'Paramètres de Bordure',
    borderWidth: 'Largeur de Bordure',
    borderColor: 'Couleur de Bordure',
    printSummary: "Résumé d'Impression",
    totalPhotos: 'Photos Totales',
    photoSize: 'Taille Photo',
    paper: 'Papier',
    border: 'Bordure',
    downloadSheet: 'Télécharger Feuille',
    sheetPreview: 'Aperçu Feuille',
    backToEditor: "Retour à l'Éditeur",
    printSheet: 'Imprimer Feuille',
    
    original: 'Original',
    white: 'Blanc',
    lightGray: 'Gris Clair',
    lightBlue: 'Bleu Clair',
    cream: 'Crème',
    black: 'Noir',
    gray: 'Gris',
    blue: 'Bleu',
    
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    rotateClockwise: 'Rotation horaire',
    rotateCounterClockwise: 'Rotation antihoraire',
    movePhotoUp: 'Déplacer photo vers le haut',
    movePhotoDown: 'Déplacer photo vers le bas',
    movePhotoLeft: 'Déplacer photo à gauche',
    movePhotoRight: 'Déplacer photo à droite',
    resetAdjustments: 'Réinitialiser tous les ajustements',
    showHelp: "Afficher cette aide",
    
    welcomeTitle: 'Bienvenue au Créateur de Photos de Passeport!',
    welcomeDescription: 'Créez des photos de passeport professionnelles en seulement 2 étapes faciles. Laissez-moi vous montrer comment ça marche.',
    step1OnboardTitle: 'Étape 1: Télécharger et Ajuster',
    step1OnboardDescription: 'Téléchargez votre photo et utilisez nos outils pour zoomer, pivoter, ajuster la luminosité et positionner votre photo parfaitement!',
    step2OnboardTitle: 'Étape 2: Imprimer Votre Feuille',
    step2OnboardDescription: 'Personnalisez votre feuille de photos avec différentes tailles de papier, dispositions de grille et bordures. Puis téléchargez ou imprimez!',
    allSetTitle: 'Tout Est Prêt!',
    allSetDescription: 'Appuyez sur "?" à tout moment pour voir les raccourcis clavier. Si vous trouvez cet outil utile, envisagez de soutenir le développement. Bonne création de photos!',
    next: 'Suivant',
    back: 'Retour',
    getStarted: 'Commencer',
    skipTutorial: 'Passer le tutoriel',
    
    settings: 'Paramètres',
    language: 'Langue',
    exportFormat: 'Format d\'Export',
    imageQuality: 'Qualité d\'Image',
    saveSettings: 'Sauvegarder Paramètres',
    restoreDefaults: 'Restaurer Défauts',
    
    help: 'Aide',
    faq: 'FAQ',
    howToUse: 'Comment Utiliser',
    contactSupport: 'Contacter Support',
    
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    dark: 'Sombre',
    bright: 'Lumineux',
    
    close: 'Fermer',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    apply: 'Appliquer',
    proTip: 'Astuce',
  },
  
  de: {
    appName: 'Passfoto Ersteller',
    appTagline: 'Professionelle Fotos in Sekunden ✨',
    supportButton: 'Kaufe mir einen Kaffee',
    
    step: 'Schritt',
    step1Title: 'Hochladen & Anpassen',
    step2Title: 'Vorschau & Drucken',
    
    keyboardShortcuts: 'Tastaturkürzel',
    proTips: 'Profi-Tipps',
    tip1: 'Gesicht füllt 70-80% des Rahmens',
    tip2: 'Schauen Sie direkt in die Kamera',
    tip3: 'Neutraler Ausdruck',
    tip4: 'Einfacher Hintergrund',
    tip5: 'Gute Beleuchtung',
    uploadPhoto: 'Foto Hochladen',
    choosePhoto: 'Foto Wählen',
    changePhoto: 'Foto Ändern',
    fileSize: 'JPG, PNG bis 10MB',
    download: 'Herunterladen',
    reset: 'Zurücksetzen',
    passportSize: 'Passfoto-Größe',
    background: 'Hintergrund',
    position: 'Position',
    dragToReposition: 'Ziehen zum Neupositionieren',
    centerPhoto: 'Foto Zentrieren',
    zoom: 'Zoom',
    rotation: 'Drehung',
    brightness: 'Helligkeit',
    contrast: 'Kontrast',
    photoPreview: 'Fotovorschau',
    uploadToStart: 'Laden Sie ein Foto hoch, um zu beginnen',
    supportedFormats: 'Unterstützt: JPG, PNG',
    nextStep: 'Nächster Schritt',
    
    paperSize: 'Papiergröße',
    gridLayout: 'Rasterlayout',
    photosPerRow: 'Fotos pro Zeile',
    numberOfRows: 'Anzahl der Zeilen',
    borderSettings: 'Rahmeneinstellungen',
    borderWidth: 'Rahmenbreite',
    borderColor: 'Rahmenfarbe',
    printSummary: 'Druckzusammenfassung',
    totalPhotos: 'Gesamtfotos',
    photoSize: 'Fotogröße',
    paper: 'Papier',
    border: 'Rahmen',
    downloadSheet: 'Blatt Herunterladen',
    sheetPreview: 'Blattvorschau',
    backToEditor: 'Zurück zum Editor',
    printSheet: 'Blatt Drucken',
    
    original: 'Original',
    white: 'Weiß',
    lightGray: 'Hellgrau',
    lightBlue: 'Hellblau',
    cream: 'Creme',
    black: 'Schwarz',
    gray: 'Grau',
    blue: 'Blau',
    
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    rotateClockwise: 'Im Uhrzeigersinn drehen',
    rotateCounterClockwise: 'Gegen Uhrzeigersinn drehen',
    movePhotoUp: 'Foto nach oben',
    movePhotoDown: 'Foto nach unten',
    movePhotoLeft: 'Foto nach links',
    movePhotoRight: 'Foto nach rechts',
    resetAdjustments: 'Alle Anpassungen zurücksetzen',
    showHelp: 'Diese Hilfe anzeigen',
    
    welcomeTitle: 'Willkommen beim Passfoto Ersteller!',
    welcomeDescription: 'Erstellen Sie professionelle Passfotos in nur 2 einfachen Schritten. Lassen Sie mich Ihnen zeigen, wie es funktioniert.',
    step1OnboardTitle: 'Schritt 1: Hochladen & Anpassen',
    step1OnboardDescription: 'Laden Sie Ihr Foto hoch und verwenden Sie unsere Tools zum Zoomen, Drehen, Anpassen der Helligkeit und perfekten Positionieren Ihres Fotos!',
    step2OnboardTitle: 'Schritt 2: Ihr Blatt Drucken',
    step2OnboardDescription: 'Passen Sie Ihr Fotoblatt mit verschiedenen Papiergrößen, Rasterlayouts und Rahmen an. Dann herunterladen oder drucken!',
    allSetTitle: 'Alles Bereit!',
    allSetDescription: 'Drücken Sie jederzeit "?" um Tastaturkürzel zu sehen. Wenn Sie dieses Tool hilfreich finden, erwägen Sie die Unterstützung der Entwicklung. Viel Spaß beim Foto-Erstellen!',
    next: 'Weiter',
    back: 'Zurück',
    getStarted: 'Loslegen',
    skipTutorial: 'Tutorial überspringen',
    
    settings: 'Einstellungen',
    language: 'Sprache',
    exportFormat: 'Exportformat',
    imageQuality: 'Bildqualität',
    saveSettings: 'Einstellungen Speichern',
    restoreDefaults: 'Standards Wiederherstellen',
    
    help: 'Hilfe',
    faq: 'FAQ',
    howToUse: 'Wie Benutzen',
    contactSupport: 'Support Kontaktieren',
    
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
    dark: 'Dunkel',
    bright: 'Hell',
    
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    apply: 'Anwenden',
    proTip: 'Profi-Tipp',
  },
  
  zh: {
    appName: '护照照片制作器',
    appTagline: '几秒钟内制作专业照片 ✨',
    supportButton: '请我喝咖啡',
    
    step: '步骤',
    step1Title: '上传和调整',
    step2Title: '预览和打印',
    
    keyboardShortcuts: '键盘快捷键',
    proTips: '专业提示',
    tip1: '脸部占据框架的70-80%',
    tip2: '直视相机',
    tip3: '中性表情',
    tip4: '纯色背景',
    tip5: '良好的照明',
    uploadPhoto: '上传照片',
    choosePhoto: '选择照片',
    changePhoto: '更换照片',
    fileSize: 'JPG, PNG 最大10MB',
    download: '下载',
    reset: '重置',
    passportSize: '护照尺寸',
    background: '背景',
    position: '位置',
    dragToReposition: '拖动以重新定位',
    centerPhoto: '居中照片',
    zoom: '缩放',
    rotation: '旋转',
    brightness: '亮度',
    contrast: '对比度',
    photoPreview: '照片预览',
    uploadToStart: '上传照片以开始',
    supportedFormats: '支持：JPG, PNG',
    nextStep: '下一步',
    
    paperSize: '纸张大小',
    gridLayout: '网格布局',
    photosPerRow: '每行照片数',
    numberOfRows: '行数',
    borderSettings: '边框设置',
    borderWidth: '边框宽度',
    borderColor: '边框颜色',
    printSummary: '打印摘要',
    totalPhotos: '照片总数',
    photoSize: '照片尺寸',
    paper: '纸张',
    border: '边框',
    downloadSheet: '下载表格',
    sheetPreview: '表格预览',
    backToEditor: '返回编辑器',
    printSheet: '打印表格',
    
    original: '原始',
    white: '白色',
    lightGray: '浅灰色',
    lightBlue: '浅蓝色',
    cream: '米色',
    black: '黑色',
    gray: '灰色',
    blue: '蓝色',
    
    zoomIn: '放大',
    zoomOut: '缩小',
    rotateClockwise: '顺时针旋转',
    rotateCounterClockwise: '逆时针旋转',
    movePhotoUp: '向上移动照片',
    movePhotoDown: '向下移动照片',
    movePhotoLeft: '向左移动照片',
    movePhotoRight: '向右移动照片',
    resetAdjustments: '重置所有调整',
    showHelp: '显示此帮助',
    
    welcomeTitle: '欢迎使用护照照片制作器！',
    welcomeDescription: '只需2个简单步骤即可创建专业护照照片。让我向您展示它是如何工作的。',
    step1OnboardTitle: '步骤1：上传和调整',
    step1OnboardDescription: '上传您的照片并使用我们的工具进行缩放、旋转、调整亮度并完美定位您的照片！',
    step2OnboardTitle: '步骤2：打印您的表格',
    step2OnboardDescription: '使用不同的纸张大小、网格布局和边框自定义您的照片表格。然后下载或打印！',
    allSetTitle: '准备就绪！',
    allSetDescription: '随时按"?"查看键盘快捷键。如果您觉得此工具有用，请考虑支持开发。祝您制作愉快！',
    next: '下一步',
    back: '返回',
    getStarted: '开始',
    skipTutorial: '跳过教程',
    
    settings: '设置',
    language: '语言',
    exportFormat: '导出格式',
    imageQuality: '图像质量',
    saveSettings: '保存设置',
    restoreDefaults: '恢复默认值',
    
    help: '帮助',
    faq: '常见问题',
    howToUse: '如何使用',
    contactSupport: '联系支持',
    
    low: '低',
    medium: '中',
    high: '高',
    dark: '暗',
    bright: '亮',
    
    close: '关闭',
    save: '保存',
    cancel: '取消',
    apply: '应用',
    proTip: '专业提示',
  },
  
  ja: {
    appName: 'パスポート写真メーカー',
    appTagline: '数秒でプロの写真を ✨',
    supportButton: 'コーヒーをおごる',
    
    step: 'ステップ',
    step1Title: 'アップロードと調整',
    step2Title: 'プレビューと印刷',
    
    keyboardShortcuts: 'キーボードショートカット',
    proTips: 'プロのヒント',
    tip1: '顔がフレームの70-80%を占める',
    tip2: 'カメラを直視する',
    tip3: '中立的な表情',
    tip4: '無地の背景',
    tip5: '良好な照明',
    uploadPhoto: '写真をアップロード',
    choosePhoto: '写真を選択',
    changePhoto: '写真を変更',
    fileSize: 'JPG、PNG 最大10MB',
    download: 'ダウンロード',
    reset: 'リセット',
    passportSize: 'パスポートサイズ',
    background: '背景',
    position: '位置',
    dragToReposition: 'ドラッグして再配置',
    centerPhoto: '写真を中央に配置',
    zoom: 'ズーム',
    rotation: '回転',
    brightness: '明るさ',
    contrast: 'コントラスト',
    photoPreview: '写真プレビュー',
    uploadToStart: '写真をアップロードして開始',
    supportedFormats: 'サポート：JPG、PNG',
    nextStep: '次のステップ',
    
    paperSize: '用紙サイズ',
    gridLayout: 'グリッドレイアウト',
    photosPerRow: '行あたりの写真数',
    numberOfRows: '行数',
    borderSettings: 'ボーダー設定',
    borderWidth: 'ボーダー幅',
    borderColor: 'ボーダー色',
    printSummary: '印刷サマリー',
    totalPhotos: '合計写真数',
    photoSize: '写真サイズ',
    paper: '用紙',
    border: 'ボーダー',
    downloadSheet: 'シートをダウンロード',
    sheetPreview: 'シートプレビュー',
    backToEditor: 'エディタに戻る',
    printSheet: 'シートを印刷',
    
    original: 'オリジナル',
    white: '白',
    lightGray: 'ライトグレー',
    lightBlue: 'ライトブルー',
    cream: 'クリーム',
    black: '黒',
    gray: 'グレー',
    blue: 'ブルー',
    
    zoomIn: 'ズームイン',
    zoomOut: 'ズームアウト',
    rotateClockwise: '時計回りに回転',
    rotateCounterClockwise: '反時計回りに回転',
    movePhotoUp: '写真を上に移動',
    movePhotoDown: '写真を下に移動',
    movePhotoLeft: '写真を左に移動',
    movePhotoRight: '写真を右に移動',
    resetAdjustments: 'すべての調整をリセット',
    showHelp: 'このヘルプを表示',
    
    welcomeTitle: 'パスポート写真メーカーへようこそ！',
    welcomeDescription: 'わずか2つの簡単なステップでプロのパスポート写真を作成します。使い方をご紹介します。',
    step1OnboardTitle: 'ステップ1：アップロードと調整',
    step1OnboardDescription: '写真をアップロードし、ツールを使用してズーム、回転、明るさの調整、完璧な位置調整を行います！',
    step2OnboardTitle: 'ステップ2：シートを印刷',
    step2OnboardDescription: '異なる用紙サイズ、グリッドレイアウト、ボーダーで写真シートをカスタマイズします。その後、ダウンロードまたは印刷！',
    allSetTitle: '準備完了！',
    allSetDescription: 'いつでも"?"を押してキーボードショートカットを確認できます。このツールが役立つ場合は、開発をサポートすることを検討してください。写真作成を楽しんでください！',
    next: '次へ',
    back: '戻る',
    getStarted: '始める',
    skipTutorial: 'チュートリアルをスキップ',
    
    settings: '設定',
    language: '言語',
    exportFormat: 'エクスポート形式',
    imageQuality: '画質',
    saveSettings: '設定を保存',
    restoreDefaults: 'デフォルトに戻す',
    
    help: 'ヘルプ',
    faq: 'よくある質問',
    howToUse: '使い方',
    contactSupport: 'サポートに連絡',
    
    low: '低',
    medium: '中',
    high: '高',
    dark: '暗い',
    bright: '明るい',
    
    close: '閉じる',
    save: '保存',
    cancel: 'キャンセル',
    apply: '適用',
    proTip: 'プロのヒント',
  },
  
  // Add more languages as needed (ar, hi, pt, ru)
  ar: {
    appName: 'صانع صور جواز السفر',
    appTagline: 'صور احترافية في ثوانٍ ✨',
    supportButton: 'اشترِ لي قهوة',
    
    step: 'خطوة',
    step1Title: 'رفع وتعديل',
    step2Title: 'معاينة وطباعة',
    
    keyboardShortcuts: 'اختصارات لوحة المفاتيح',
    proTips: 'نصائح احترافية',
    tip1: 'الوجه يملأ 70-80% من الإطار',
    tip2: 'انظر مباشرة إلى الكاميرا',
    tip3: 'تعبير محايد',
    tip4: 'خلفية بسيطة',
    tip5: 'إضاءة جيدة',
    uploadPhoto: 'رفع الصورة',
    choosePhoto: 'اختر صورة',
    changePhoto: 'تغيير الصورة',
    fileSize: 'JPG، PNG حتى 10 ميجابايت',
    download: 'تحميل',
    reset: 'إعادة تعيين',
    passportSize: 'حجم جواز السفر',
    background: 'الخلفية',
    position: 'الموضع',
    dragToReposition: 'اسحب لإعادة الوضع',
    centerPhoto: 'توسيط الصورة',
    zoom: 'تكبير/تصغير',
    rotation: 'دوران',
    brightness: 'السطوع',
    contrast: 'التباين',
    photoPreview: 'معاينة الصورة',
    uploadToStart: 'قم بتحميل صورة للبدء',
    supportedFormats: 'مدعوم: JPG، PNG',
    nextStep: 'الخطوة التالية',
    
    paperSize: 'حجم الورق',
    gridLayout: 'تخطيط الشبكة',
    photosPerRow: 'الصور لكل صف',
    numberOfRows: 'عدد الصفوف',
    borderSettings: 'إعدادات الحدود',
    borderWidth: 'عرض الحدود',
    borderColor: 'لون الحدود',
    printSummary: 'ملخص الطباعة',
    totalPhotos: 'إجمالي الصور',
    photoSize: 'حجم الصورة',
    paper: 'ورق',
    border: 'حدود',
    downloadSheet: 'تحميل الورقة',
    sheetPreview: 'معاينة الورقة',
    backToEditor: 'العودة إلى المحرر',
    printSheet: 'طباعة الورقة',
    
    original: 'أصلي',
    white: 'أبيض',
    lightGray: 'رمادي فاتح',
    lightBlue: 'أزرق فاتح',
    cream: 'كريمي',
    black: 'أسود',
    gray: 'رمادي',
    blue: 'أزرق',
    
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    rotateClockwise: 'دوران مع عقارب الساعة',
    rotateCounterClockwise: 'دوران عكس عقارب الساعة',
    movePhotoUp: 'تحريك الصورة لأعلى',
    movePhotoDown: 'تحريك الصورة لأسفل',
    movePhotoLeft: 'تحريك الصورة لليسار',
    movePhotoRight: 'تحريك الصورة لليمين',
    resetAdjustments: 'إعادة تعيين جميع التعديلات',
    showHelp: 'إظهار هذه المساعدة',
    
    welcomeTitle: 'مرحبًا بك في صانع صور جواز السفر!',
    welcomeDescription: 'أنشئ صور جواز سفر احترافية في خطوتين سهلتين فقط. دعني أريك كيف يعمل.',
    step1OnboardTitle: 'الخطوة 1: رفع وتعديل',
    step1OnboardDescription: 'قم بتحميل صورتك واستخدم أدواتنا للتكبير والتدوير وضبط السطوع ووضع صورتك بشكل مثالي!',
    step2OnboardTitle: 'الخطوة 2: طباعة ورقتك',
    step2OnboardDescription: 'قم بتخصيص ورقة الصور الخاصة بك بأحجام ورق مختلفة وتخطيطات شبكة وحدود. ثم قم بالتحميل أو الطباعة!',
    allSetTitle: 'كل شيء جاهز!',
    allSetDescription: 'اضغط على "?" في أي وقت لرؤية اختصارات لوحة المفاتيح. إذا وجدت هذه الأداة مفيدة، فكر في دعم التطوير. استمتع بصنع الصور!',
    next: 'التالي',
    back: 'رجوع',
    getStarted: 'ابدأ',
    skipTutorial: 'تخطي البرنامج التعليمي',
    
    settings: 'الإعدادات',
    language: 'اللغة',
    exportFormat: 'تنسيق التصدير',
    imageQuality: 'جودة الصورة',
    saveSettings: 'حفظ الإعدادات',
    restoreDefaults: 'استعادة الافتراضيات',
    
    help: 'مساعدة',
    faq: 'الأسئلة الشائعة',
    howToUse: 'كيفية الاستخدام',
    contactSupport: 'اتصل بالدعم',
    
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    dark: 'داكن',
    bright: 'ساطع',
    
    close: 'إغلاق',
    save: 'حفظ',
    cancel: 'إلغاء',
    apply: 'تطبيق',
    proTip: 'نصيحة',
  },
  
  hi: {
    appName: 'पासपोर्ट फोटो निर्माता',
    appTagline: 'सेकंड में पेशेवर फोटो ✨',
    supportButton: 'मुझे कॉफी खरीदें',
    
    step: 'चरण',
    step1Title: 'अपलोड और समायोजित करें',
    step2Title: 'पूर्वावलोकन और प्रिंट',
    
    keyboardShortcuts: 'कीबोर्ड शॉर्टकट',
    proTips: 'प्रो टिप्स',
    tip1: 'चेहरा फ्रेम का 70-80% भरता है',
    tip2: 'कैमरे को सीधे देखें',
    tip3: 'तटस्थ अभिव्यक्ति',
    tip4: 'सादा पृष्ठभूमि',
    tip5: 'अच्छी रोशनी',
    uploadPhoto: 'फोटो अपलोड करें',
    choosePhoto: 'फोटो चुनें',
    changePhoto: 'फोटो बदलें',
    fileSize: 'JPG, PNG 10MB तक',
    download: 'डाउनलोड',
    reset: 'रीसेट',
    passportSize: 'पासपोर्ट आकार',
    background: 'पृष्ठभूमि',
    position: 'स्थिति',
    dragToReposition: 'पुनः स्थापित करने के लिए खींचें',
    centerPhoto: 'फोटो केंद्रित करें',
    zoom: 'ज़ूम',
    rotation: 'घुमाव',
    brightness: 'चमक',
    contrast: 'कंट्रास्ट',
    photoPreview: 'फोटो पूर्वावलोकन',
    uploadToStart: 'शुरू करने के लिए फोटो अपलोड करें',
    supportedFormats: 'समर्थित: JPG, PNG',
    nextStep: 'अगला कदम',
    
    paperSize: 'कागज का आकार',
    gridLayout: 'ग्रिड लेआउट',
    photosPerRow: 'प्रति पंक्ति फोटो',
    numberOfRows: 'पंक्तियों की संख्या',
    borderSettings: 'बॉर्डर सेटिंग्स',
    borderWidth: 'बॉर्डर चौड़ाई',
    borderColor: 'बॉर्डर रंग',
    printSummary: 'प्रिंट सारांश',
    totalPhotos: 'कुल फोटो',
    photoSize: 'फोटो आकार',
    paper: 'कागज',
    border: 'बॉर्डर',
    downloadSheet: 'शीट डाउनलोड करें',
    sheetPreview: 'शीट पूर्वावलोकन',
    backToEditor: 'संपादक पर वापस जाएं',
    printSheet: 'शीट प्रिंट करें',
    
    original: 'मूल',
    white: 'सफेद',
    lightGray: 'हल्का ग्रे',
    lightBlue: 'हल्का नीला',
    cream: 'क्रीम',
    black: 'काला',
    gray: 'ग्रे',
    blue: 'नीला',
    
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    rotateClockwise: 'घड़ी की दिशा में घुमाएं',
    rotateCounterClockwise: 'घड़ी की विपरीत दिशा में घुमाएं',
    movePhotoUp: 'फोटो ऊपर ले जाएं',
    movePhotoDown: 'फोटो नीचे ले जाएं',
    movePhotoLeft: 'फोटो बाएं ले जाएं',
    movePhotoRight: 'फोटो दाएं ले जाएं',
    resetAdjustments: 'सभी समायोजन रीसेट करें',
    showHelp: 'यह सहायता दिखाएं',
    
    welcomeTitle: 'पासपोर्ट फोटो निर्माता में आपका स्वागत है!',
    welcomeDescription: 'केवल 2 आसान चरणों में पेशेवर पासपोर्ट फोटो बनाएं। मुझे आपको दिखाने दें कि यह कैसे काम करता है।',
    step1OnboardTitle: 'चरण 1: अपलोड और समायोजित करें',
    step1OnboardDescription: 'अपनी फोटो अपलोड करें और ज़ूम, घुमाने, चमक समायोजित करने और अपनी फोटो को पूर्ण रूप से स्थिति देने के लिए हमारे उपकरणों का उपयोग करें!',
    step2OnboardTitle: 'चरण 2: अपनी शीट प्रिंट करें',
    step2OnboardDescription: 'विभिन्न कागज आकार, ग्रिड लेआउट और बॉर्डर के साथ अपनी फोटो शीट को अनुकूलित करें। फिर डाउनलोड या प्रिंट करें!',
    allSetTitle: 'सब तैयार है!',
    allSetDescription: 'कीबोर्ड शॉर्टकट देखने के लिए किसी भी समय "?" दबाएं। यदि आपको यह उपकरण उपयोगी लगता है, तो वि���ास का समर्थन करने पर विचार करें। फोटो बनाने का आनंद लें!',
    next: 'अगला',
    back: 'पीछे',
    getStarted: 'शुरू करें',
    skipTutorial: 'ट्यूटोरियल छोड़ें',
    
    settings: 'सेटिंग्स',
    language: 'भाषा',
    exportFormat: 'निर्यात प्रारूप',
    imageQuality: 'छवि गुणवत्ता',
    saveSettings: 'सेटिंग्स सहेजें',
    restoreDefaults: 'डिफ़ॉल्ट पुनर्स्थापित करें',
    
    help: 'सहायता',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    howToUse: 'उपयोग कैसे करें',
    contactSupport: 'सहायता से संपर्क करें',
    
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    dark: 'अंधेरा',
    bright: 'उज्ज्वल',
    
    close: 'बंद करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    apply: 'लागू करें',
    proTip: 'प्रो टिप',
  },
  
  pt: {
    appName: 'Criador de Fotos de Passaporte',
    appTagline: 'Fotos profissionais em segundos ✨',
    supportButton: 'Me pague um café',
    
    step: 'Passo',
    step1Title: 'Enviar e Ajustar',
    step2Title: 'Visualizar e Imprimir',
    
    keyboardShortcuts: 'Atalhos de Teclado',
    proTips: 'Dicas Profissionais',
    tip1: 'Rosto preenche 70-80% do quadro',
    tip2: 'Olhe diretamente para a câmera',
    tip3: 'Expressão neutra',
    tip4: 'Fundo simples',
    tip5: 'Boa iluminação',
    uploadPhoto: 'Enviar Foto',
    choosePhoto: 'Escolher Foto',
    changePhoto: 'Mudar Foto',
    fileSize: 'JPG, PNG até 10MB',
    download: 'Baixar',
    reset: 'Redefinir',
    passportSize: 'Tamanho do Passaporte',
    background: 'Fundo',
    position: 'Posição',
    dragToReposition: 'Arraste para reposicionar',
    centerPhoto: 'Centralizar Foto',
    zoom: 'Zoom',
    rotation: 'Rotação',
    brightness: 'Brilho',
    contrast: 'Contraste',
    photoPreview: 'Visualização da Foto',
    uploadToStart: 'Envie uma foto para começar',
    supportedFormats: 'Suportado: JPG, PNG',
    nextStep: 'Próximo Passo',
    
    paperSize: 'Tamanho do Papel',
    gridLayout: 'Layout de Grade',
    photosPerRow: 'Fotos por linha',
    numberOfRows: 'Número de linhas',
    borderSettings: 'Configurações de Borda',
    borderWidth: 'Largura da Borda',
    borderColor: 'Cor da Borda',
    printSummary: 'Resumo de Impressão',
    totalPhotos: 'Total de Fotos',
    photoSize: 'Tamanho da Foto',
    paper: 'Papel',
    border: 'Borda',
    downloadSheet: 'Baixar Folha',
    sheetPreview: 'Visualização da Folha',
    backToEditor: 'Voltar ao Editor',
    printSheet: 'Imprimir Folha',
    
    original: 'Original',
    white: 'Branco',
    lightGray: 'Cinza Claro',
    lightBlue: 'Azul Claro',
    cream: 'Creme',
    black: 'Preto',
    gray: 'Cinza',
    blue: 'Azul',
    
    zoomIn: 'Ampliar',
    zoomOut: 'Reduzir',
    rotateClockwise: 'Girar no sentido horário',
    rotateCounterClockwise: 'Girar no sentido anti-horário',
    movePhotoUp: 'Mover foto para cima',
    movePhotoDown: 'Mover foto para baixo',
    movePhotoLeft: 'Mover foto para esquerda',
    movePhotoRight: 'Mover foto para direita',
    resetAdjustments: 'Redefinir todos os ajustes',
    showHelp: 'Mostrar esta ajuda',
    
    welcomeTitle: 'Bem-vindo ao Criador de Fotos de Passaporte!',
    welcomeDescription: 'Crie fotos profissionais de passaporte em apenas 2 passos fáceis. Deixe-me mostrar como funciona.',
    step1OnboardTitle: 'Passo 1: Enviar e Ajustar',
    step1OnboardDescription: 'Envie sua foto e use nossas ferramentas para ampliar, girar, ajustar o brilho e posicionar sua foto perfeitamente!',
    step2OnboardTitle: 'Passo 2: Imprimir Sua Folha',
    step2OnboardDescription: 'Personalize sua folha de fotos com diferentes tamanhos de papel, layouts de grade e bordas. Depois baixe ou imprima!',
    allSetTitle: 'Tudo Pronto!',
    allSetDescription: 'Pressione "?" a qualquer momento para ver os atalhos de teclado. Se você achar esta ferramenta útil, considere apoiar o desenvolvimento. Boa criação de fotos!',
    next: 'Próximo',
    back: 'Voltar',
    getStarted: 'Começar',
    skipTutorial: 'Pular tutorial',
    
    settings: 'Configurações',
    language: 'Idioma',
    exportFormat: 'Formato de Exportação',
    imageQuality: 'Qualidade da Imagem',
    saveSettings: 'Salvar Configurações',
    restoreDefaults: 'Restaurar Padrões',
    
    help: 'Ajuda',
    faq: 'FAQ',
    howToUse: 'Como Usar',
    contactSupport: 'Contatar Suporte',
    
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    dark: 'Escuro',
    bright: 'Brilhante',
    
    close: 'Fechar',
    save: 'Salvar',
    cancel: 'Cancelar',
    apply: 'Aplicar',
    proTip: 'Dica',
  },
  
  ru: {
    appName: 'Создатель Фото на Паспорт',
    appTagline: 'Профессиональные фото за секунды ✨',
    supportButton: 'Купите мне кофе',
    
    step: 'Шаг',
    step1Title: 'Загрузить и Настроить',
    step2Title: 'Просмотр и Печать',
    
    keyboardShortcuts: 'Горячие Клавиши',
    proTips: 'Профессиональные Советы',
    tip1: 'Лицо занимает 70-80% кадра',
    tip2: 'Смотрите прямо в камеру',
    tip3: 'Нейтральное выражение',
    tip4: 'Простой фон',
    tip5: 'Хорошее освещение',
    uploadPhoto: 'Загрузить Фото',
    choosePhoto: 'Выбрать Фото',
    changePhoto: 'Изменить Фото',
    fileSize: 'JPG, PNG до 10MB',
    download: 'Скачать',
    reset: 'Сбросить',
    passportSize: 'Размер Паспорта',
    background: 'Фон',
    position: 'Положение',
    dragToReposition: 'Перетащите для перемещения',
    centerPhoto: 'Центрировать Фото',
    zoom: 'Масштаб',
    rotation: 'Поворот',
    brightness: 'Яркость',
    contrast: 'Контраст',
    photoPreview: 'Предпросмотр Фото',
    uploadToStart: 'Загрузите фото для начала',
    supportedFormats: 'Поддерживается: JPG, PNG',
    nextStep: 'Следующий Шаг',
    
    paperSize: 'Размер Бумаги',
    gridLayout: 'Макет Сетки',
    photosPerRow: 'Фото в ряд',
    numberOfRows: 'Количество рядов',
    borderSettings: 'Настройки Границы',
    borderWidth: 'Ширина Границы',
    borderColor: 'Цвет Границы',
    printSummary: 'Сводка Печати',
    totalPhotos: 'Всего Фото',
    photoSize: 'Размер Фото',
    paper: 'Бумага',
    border: 'Граница',
    downloadSheet: 'Скачать Лист',
    sheetPreview: 'Предпросмотр Листа',
    backToEditor: 'Вернуться к Редактору',
    printSheet: 'Печать Листа',
    
    original: 'Оригинал',
    white: 'Белый',
    lightGray: 'Светло-серый',
    lightBlue: 'Светло-синий',
    cream: 'Кремовый',
    black: 'Черный',
    gray: 'Серый',
    blue: 'Синий',
    
    zoomIn: 'Увеличить',
    zoomOut: 'Уменьшить',
    rotateClockwise: 'Повернуть по часовой стрелке',
    rotateCounterClockwise: 'Повернуть против часовой стрелки',
    movePhotoUp: 'Переместить фото вверх',
    movePhotoDown: 'Переместить фото вниз',
    movePhotoLeft: 'Переместить фото влево',
    movePhotoRight: 'Переместить фото вправо',
    resetAdjustments: 'Сбросить все настройки',
    showHelp: 'Показать эту помощь',
    
    welcomeTitle: 'Добро пожаловать в Создатель Фото на Паспорт!',
    welcomeDescription: 'Создавайте профессиональные фото на паспорт всего за 2 простых шага. Позвольте мне показать, как это работает.',
    step1OnboardTitle: 'Шаг 1: Загрузить и Настроить',
    step1OnboardDescription: 'Загрузите свое фото и используйте наши инструменты для масштабирования, поворота, настройки яркости и идеального позиционирования фото!',
    step2OnboardTitle: 'Шаг 2: Печать Листа',
    step2OnboardDescription: 'Настройте лист с фотографиями с различными размерами бумаги, макетами сетки и границами. Затем скачайте или распечатайте!',
    allSetTitle: 'Все Готово!',
    allSetDescription: 'Нажмите "?" в любое время, чтобы увидеть горячие клавиши. Если вы находите этот инструмент полезным, рассмотрите возможность поддержки разработки. Приятного создания фото!',
    next: 'Далее',
    back: 'Назад',
    getStarted: 'Нача��ь',
    skipTutorial: 'Пропустить обучение',
    
    settings: 'Настройки',
    language: 'Язык',
    exportFormat: 'Формат Экспорта',
    imageQuality: 'Качество Изображения',
    saveSettings: 'Сохранить Настройки',
    restoreDefaults: 'Восстановить По Умолчанию',
    
    help: 'Помощь',
    faq: 'FAQ',
    howToUse: 'Как Использовать',
    contactSupport: 'Связаться с Поддержкой',
    
    low: 'Низкое',
    medium: 'Среднее',
    high: 'Высокое',
    dark: 'Темное',
    bright: 'Яркое',
    
    close: 'Закрыть',
    save: 'Сохранить',
    cancel: 'Отмена',
    apply: 'Применить',
    proTip: 'Совет',
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.en;
}
