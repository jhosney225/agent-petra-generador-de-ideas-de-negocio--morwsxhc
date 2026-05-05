```javascript
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Configuración de readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Base de datos de palabras clave por categoría
const businessKeywords = {
  tecnologia: ['app', 'software', 'ia', 'blockchain', 'iot', 'cloud', 'análisis de datos', 'ciberseguridad'],
  agricultura: ['cultivos', 'orgánico', 'riego', 'drones', 'sustentabilidad', 'invernadero', 'fertilizantes'],
  ecommerce: ['tienda online', 'marketplace', 'dropshipping', 'suscripción', 'afiliación', 'product bundles'],
  servicios: ['consultoría', 'coaching', 'capacitación', 'asesoría', 'outsourcing', 'gestoría'],
  salud: ['fitness', 'nutrición', 'telemedicina', 'bienestar', 'mental health', 'farmacia online']
};

// Validadores
const validators = {
  isValidCategory: (category) => {
    return Object.keys(businessKeywords).includes(category.toLowerCase());
  },
  
  isValidBudget: (budget) => {
    const num = parseFloat(budget);
    return !isNaN(num) && num >= 500 && num <= 1000000;
  },
  
  isValidTarget: (target) => {
    return target.length >= 3 && target.length <= 100;
  },
  
  isValidIdeaName: (name) => {
    return name.length >= 5 && name.length <= 80 && /^[a-záéíóúñ0-9\s]+$/i.test(name);
  }
};

// Generador de ideas
const ideaGenerator = {
  generate: (category, targetAudience, budget) => {
    if (!validators.isValidCategory(category)) {
      throw new Error(`Categoría inválida. Disponibles: ${Object.keys(businessKeywords).join(', ')}`);
    }
    
    if (!validators.isValidTarget(targetAudience)) {
      throw new Error('Audiencia objetivo debe tener entre 3 y 100 caracteres');
    }
    
    if (!validators.isValidBudget(budget)) {
      throw new Error('Presupuesto debe estar entre $500 y $1,000,000');
    }
    
    const categoryLower = category.toLowerCase();
    const keywords = businessKeywords[categoryLower];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    const adjectives = ['innovador', 'inteligente', 'sostenible', 'accesible', 'personalizado', 'premium'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const verbs = ['facilita', 'conecta', 'transforma', 'optimiza', 'revoluciona'];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    
    const ideaName = `${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${randomKeyword}`;
    const description = `${verb.charAt(0).toUpperCase() + verb.slice(1)} la experiencia de ${targetAudience} mediante ${randomKeyword}`;
    
    return {
      id: Date.now(),
      name: ideaName,
      category: categoryLower,
      description: description,
      targetAudience: targetAudience,
      budget: parseFloat(budget),
      viability: calculateViability(budget, categoryLower),
      timestamp: new Date().toISOString()
    };
  },
  
  generateMultiple: (category, targetAudience, budget, count = 5) => {
    const ideas = [];
    for (let i = 0; i < count; i++) {
      ideas.push(ideaGenerator.generate(category, targetAudience, budget));
    }
    return ideas;
  }
};

// Calculador de viabilidad
function calculateViability(budget, category) {
  let baseScore = 50;
  
  if (budget < 5000) baseScore -= 15;
  if (budget >= 5000 && budget < 20000) baseScore += 10;
  if (budget >= 20000 && budget < 100000) baseScore += 20;
  if (budget >= 100000) baseScore += 25;
  
  const categoryMultiplier = {
    tecnologia: 1.2,
    agricultura: 1.1,
    ecommerce: 1.15,
    servicios: 0.95,
    salud: 1.1
  };
  
  baseScore = baseScore * (categoryMultiplier[category] || 1);
  return Math.min(Math.round(baseScore), 100);
}

// Sistema de almacenamiento
const storage = {
  dataFile: path.join(__dirname, 'ideas.json'),
  
  save: (ideas) => {
    try {
      const data = Array.isArray(ideas) ? ideas : [ideas];
      let existing = [];
      
      if (fs.existsSync(storage.dataFile)) {
        const content = fs.readFileSync(storage.dataFile, 'utf8');
        existing = JSON.parse(content || '[]');
      }
      
      const merged = [...existing, ...data];
      fs.writeFileSync(storage.dataFile, JSON.stringify(merged, null, 2));
      return true;
    } catch (error) {
      console.error('Error guardando ideas:', error.message);
      return false;
    }
  },
  
  load: () => {
    try {
      if (!fs.existsSync(storage.